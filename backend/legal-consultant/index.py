import json
import os
import requests
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: AI-консультант по российскому законодательству на базе YandexGPT
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name, function_version
    Returns: HTTP response dict with AI answer
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    question: str = body_data.get('question', '').strip()
    
    if not question:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Вопрос не может быть пустым'}),
            'isBase64Encoded': False
        }
    
    api_key = os.environ.get('YANDEX_API_KEY')
    folder_id = os.environ.get('YANDEX_FOLDER_ID')
    
    if not api_key or not folder_id:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Не настроены ключи YandexGPT'}),
            'isBase64Encoded': False
        }
    
    system_prompt = """Ты — профессиональный юридический консультант, специализирующийся на российском законодательстве.

Твоя задача:
1. Давать точные консультации по российскому праву (ГК РФ, УК РФ, СК РФ, ТК РФ, КоАП РФ и другим кодексам)
2. Ссылаться на конкретные статьи законов, когда это возможно
3. Объяснять сложные юридические термины простым языком
4. Предупреждать о возможных рисках и последствиях
5. Рекомендовать обращение к юристу в сложных случаях

Важно:
- Отвечай профессионально, но понятно для обычного человека
- Всегда указывай, что это первичная консультация
- Для точного решения рекомендуй личную консультацию с юристом
- Если не уверен в ответе, честно признавай это
- Используй только актуальное российское законодательство"""

    try:
        url = f"https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Api-Key {api_key}"
        }
        
        payload = {
            "modelUri": f"gpt://{folder_id}/yandexgpt-lite",
            "completionOptions": {
                "stream": False,
                "temperature": 0.3,
                "maxTokens": 2000
            },
            "messages": [
                {
                    "role": "system",
                    "text": system_prompt
                },
                {
                    "role": "user",
                    "text": question
                }
            ]
        }
        
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        answer = result.get('result', {}).get('alternatives', [{}])[0].get('message', {}).get('text', '')
        
        if not answer:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Не удалось получить ответ от YandexGPT'}),
                'isBase64Encoded': False
            }
        
        db_url = os.environ.get('DATABASE_URL')
        if db_url:
            try:
                conn = psycopg2.connect(db_url)
                cur = conn.cursor()
                user_ip = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')
                cur.execute(
                    "INSERT INTO consultations (question, answer, user_ip, request_id) VALUES (%s, %s, %s, %s)",
                    (question, answer, user_ip, context.request_id)
                )
                conn.commit()
                cur.close()
                conn.close()
            except Exception:
                pass
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'answer': answer,
                'question': question,
                'request_id': context.request_id
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
        
    except requests.exceptions.Timeout:
        return {
            'statusCode': 504,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Превышено время ожидания ответа от YandexGPT'}),
            'isBase64Encoded': False
        }
    except requests.exceptions.RequestException as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка при обращении к YandexGPT: {str(e)}'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Внутренняя ошибка: {str(e)}'}),
            'isBase64Encoded': False
        }