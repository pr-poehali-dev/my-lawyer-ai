import json
import os
import requests
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any, List

def search_legal_articles(question: str, db_url: str, limit: int = 5) -> List[Dict[str, Any]]:
    '''
    Search for relevant legal articles using PostgreSQL full-text search
    '''
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    query = '''
        SELECT 
            code_name,
            full_name,
            article_number,
            article_title,
            article_text,
            source_url,
            ts_rank(to_tsvector('russian', article_text || ' ' || COALESCE(article_title, '')), plainto_tsquery('russian', %s)) as relevance
        FROM legal_documents
        WHERE to_tsvector('russian', article_text || ' ' || COALESCE(article_title, '')) @@ plainto_tsquery('russian', %s)
        ORDER BY relevance DESC
        LIMIT %s
    '''
    
    cursor.execute(query, (question, question, limit))
    results = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return [dict(row) for row in results]

def format_legal_context(articles: List[Dict[str, Any]]) -> str:
    '''
    Format found articles into context for AI
    '''
    if not articles:
        return "По данному вопросу не найдено релевантных статей в базе законодательства."
    
    context = "НАЙДЕННЫЕ СТАТЬИ ЗАКОНОДАТЕЛЬСТВА:\n\n"
    for i, article in enumerate(articles, 1):
        context += f"{i}. {article['code_name']} Статья {article['article_number']}"
        if article.get('article_title'):
            context += f". {article['article_title']}"
        context += f"\n{article['article_text']}\n"
        context += f"Источник: {article['source_url']}\n\n"
    
    return context

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Legal AI assistant with RAG (Retrieval-Augmented Generation) using real Russian laws
    Args: event with httpMethod, body containing question
          context with request_id attribute
    Returns: HTTP response with legal consultation based on real law articles
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
    db_url = os.environ.get('DATABASE_URL')
    
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
    
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'База данных не настроена'}),
            'isBase64Encoded': False
        }
    
    legal_articles = search_legal_articles(question, db_url, limit=5)
    legal_context = format_legal_context(legal_articles)
    
    url = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'
    headers = {
        'Authorization': f'Api-Key {api_key}',
        'Content-Type': 'application/json'
    }
    
    system_prompt = f'''Ты профессиональный юридический консультант по российскому законодательству.

⚠️ КРИТИЧЕСКИ ВАЖНЫЕ ПРАВИЛА:
1. Используй ТОЛЬКО статьи из раздела "НАЙДЕННЫЕ СТАТЬИ ЗАКОНОДАТЕЛЬСТВА" ниже
2. ВСЕГДА указывай конкретные номера статей и кодексов из найденных материалов
3. НИКОГДА не выдумывай статьи, которых нет в найденных материалах
4. Если в найденных статьях нет полного ответа - честно скажи об этом и порекомендуй обратиться к юристу
5. Цитируй точные формулировки из статей, а не перефразируй

ФОРМАТ ОТВЕТА:

📋 **Краткий ответ:**
[2-3 предложения с указанием конкретных статей]

📖 **Правовая основа:**
[Процитируй релевантные части найденных статей с указанием: "Статья X КОДЕКС: текст"]

💡 **Практические рекомендации:**
[Что делать в данной ситуации, основываясь на приведенных статьях]

⚠️ **Важно:**
[Если найденной информации недостаточно - укажи это и порекомендуй консультацию юриста]

{legal_context}'''

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
        'body': json.dumps({
            'answer': answer,
            'sources': [
                {
                    'code': article['code_name'],
                    'article': article['article_number'],
                    'title': article.get('article_title'),
                    'url': article['source_url']
                }
                for article in legal_articles
            ]
        }, ensure_ascii=False),
        'isBase64Encoded': False
    }
