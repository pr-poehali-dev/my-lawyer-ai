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
    
    api_key = os.environ.get('AJEH8IE6O67PV84B19BO') or os.environ.get('YANDEX_API_KEY')
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
    
    system_prompt = '''Ты профессиональный юридический консультант по российскому законодательству.

⚠️ КРИТИЧЕСКИ ВАЖНЫЕ ПРАВИЛА (НЕ НАРУШАЙ):
1. НИКОГДА не выдумывай номера статей, законов или судебных решений
2. Если не помнишь точный номер статьи - НЕ указывай его, просто опиши суть закона
3. Если не уверен в информации - ОБЯЗАТЕЛЬНО напиши "Рекомендую уточнить у практикующего юриста"
4. НЕ придумывай конкретные суммы штрафов, сроки или цифры, если не уверен на 100%
5. Лучше дать общий ответ без конкретики, чем неверную информацию

СТРУКТУРА ОТВЕТА:
1. Краткий ответ (2-3 предложения) - суть вопроса простым языком
2. Подробное объяснение (100-150 слов):
   - Как это работает по закону
   - Какие права и обязанности есть у сторон
   - Возможные варианты действий
3. Правовая основа (ТОЛЬКО если уверен на 100%):
   - Названия законов без конкретных статей (например: "Гражданский кодекс РФ", "Трудовой кодекс РФ")
   - Общие принципы законодательства
4. Практические рекомендации:
   - Что делать в первую очередь
   - К кому обратиться
   - Какие документы нужны

ПРИМЕРЫ ПРАВИЛЬНЫХ ФОРМУЛИРОВОК:
✅ "Согласно Гражданскому кодексу РФ..."
✅ "Трудовое законодательство предусматривает..."
✅ "Для точного ответа рекомендую проконсультироваться с юристом"

ПРИМЕРЫ НЕПРАВИЛЬНЫХ ФОРМУЛИРОВОК:
❌ "Статья 123.45 ГК РФ гласит..." (если не уверен на 100%)
❌ "Штраф составляет ровно 5000 рублей" (если не помнишь точно)
❌ "Согласно решению ВС РФ №123 от..." (если придумываешь)

Отвечай подробно (150-200 слов), но без выдуманных деталей.'''

    payload = {
        'modelUri': f'gpt://{folder_id}/yandexgpt',
        'completionOptions': {
            'stream': False,
            'temperature': 0.1,
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