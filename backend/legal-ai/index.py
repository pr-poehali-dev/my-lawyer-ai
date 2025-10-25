import json
import os
import requests
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Legal AI assistant using fine-tuned YandexGPT model
    Args: event with httpMethod, body containing question
          context with request_id attribute
    Returns: HTTP response with legal consultation answer
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    body_str = event.get('body', '{}')
    body_data = json.loads(body_str)
    question = body_data.get('question', '').strip()
    
    if not question:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Вопрос не может быть пустым'}),
            'isBase64Encoded': False
        }
    
    api_key = os.environ.get('YANDEX_API_KEY')
    folder_id = os.environ.get('YANDEX_FOLDER_ID')
    
    if not api_key or not folder_id:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'API ключи не настроены'}),
            'isBase64Encoded': False
        }
    
    url = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'
    headers = {
        'Authorization': f'Api-Key {api_key}',
        'Content-Type': 'application/json'
    }
    
    system_prompt = '''Ты профессиональный юридический консультант с глубокими знаниями российского законодательства.

ПРАВИЛА ОТВЕТОВ:
1. Давай РАЗВЕРНУТЫЕ и ПОДРОБНЫЕ ответы (минимум 150-200 слов)
2. Структурируй ответ:
   - Краткий ответ на вопрос
   - Подробное объяснение с примерами
   - Ссылки на конкретные статьи законов (ГК РФ, ТК РФ, УК РФ и т.д.)
   - Практические рекомендации
3. Используй ТОЛЬКО достоверные факты из российского законодательства
4. Если не уверен в информации - честно скажи об этом и порекомендуй обратиться к практикующему юристу
5. НЕ придумывай несуществующие статьи законов
6. Если закон изменился - указывай актуальную редакцию
7. Приводи примеры из судебной практики, если уместно
8. Объясняй юридические термины простым языком

Формат ответа:
📋 **Краткий ответ:** [суть в 1-2 предложениях]

📖 **Подробное объяснение:**
[развернутое объяснение с деталями]

⚖️ **Правовая база:**
[ссылки на статьи законов]

💡 **Практические рекомендации:**
[что делать в такой ситуации]'''

    payload = {
        'modelUri': f'gpt://{folder_id}/yandexgpt',
        'completionOptions': {
            'stream': False,
            'temperature': 0.2,
            'maxTokens': 3000
        },
        'messages': [
            {
                'role': 'system',
                'text': system_prompt
            },
            {
                'role': 'user',
                'text': question
            }
        ]
    }
    
    response = requests.post(url, headers=headers, json=payload, timeout=30)
    
    if response.status_code != 200:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': f'Ошибка при обращении к YandexGPT: {response.status_code} {response.text}'
            }),
            'isBase64Encoded': False
        }
    
    result = response.json()
    answer = result.get('result', {}).get('alternatives', [{}])[0].get('message', {}).get('text', 'Не удалось получить ответ')
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'answer': answer}, ensure_ascii=False),
        'isBase64Encoded': False
    }