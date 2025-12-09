import json
import os
import requests
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any, List

def search_land_law_articles(question: str, db_url: str, limit: int = 5) -> List[Dict[str, Any]]:
    '''
    Поиск релевантных статей Земельного и Гражданского кодексов РФ
    '''
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    safe_question = question.replace("'", "''")
    
    query = f"""
        SELECT 
            code_type,
            article_number,
            title,
            content,
            keywords,
            chapter,
            url,
            ts_rank(
                to_tsvector('russian', content || ' ' || title || ' ' || COALESCE(array_to_string(keywords, ' '), '')),
                plainto_tsquery('russian', '{safe_question}')
            ) as relevance
        FROM law_articles
        WHERE to_tsvector('russian', content || ' ' || title || ' ' || COALESCE(array_to_string(keywords, ' '), ''))
              @@ plainto_tsquery('russian', '{safe_question}')
        ORDER BY relevance DESC
        LIMIT {limit}
    """
    
    cursor.execute(query)
    results = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return [dict(row) for row in results]

def format_legal_context(articles: List[Dict[str, Any]]) -> str:
    '''
    Форматирование найденных статей для контекста ИИ
    '''
    if not articles:
        return "По данному вопросу не найдено релевантных статей в базе земельного законодательства."
    
    context = "НАЙДЕННЫЕ СТАТЬИ ЗЕМЕЛЬНОГО И ГРАЖДАНСКОГО ЗАКОНОДАТЕЛЬСТВА:\n\n"
    for i, article in enumerate(articles, 1):
        code_name = "Земельный кодекс РФ" if article['code_type'] == 'ZK_RF' else "Гражданский кодекс РФ"
        context += f"{i}. {code_name}, Статья {article['article_number']}: {article['title']}\n"
        context += f"{article['content']}\n"
        if article.get('chapter'):
            context += f"({article['chapter']})\n"
        context += f"Источник: {article['url']}\n\n"
    
    return context

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Юридический ИИ-ассистент по земельному праву с RAG на основе Земельного и Гражданского кодексов РФ
    '''
    try:
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
        
        api_key = os.environ.get('API_KEY') or os.environ.get('APIKEY')
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
        
        legal_articles = search_land_law_articles(question, db_url, limit=5)
        legal_context = format_legal_context(legal_articles)
    
        url = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'
        headers = {
            'Authorization': f'Api-Key {api_key}',
            'Content-Type': 'application/json'
        }
        
        system_prompt = f'''Ты профессиональный юрист-консультант по земельному праву РФ.

⚠️ КРИТИЧЕСКИ ВАЖНЫЕ ПРАВИЛА:
1. Используй ТОЛЬКО статьи из раздела "НАЙДЕННЫЕ СТАТЬИ" ниже
2. ВСЕГДА указывай конкретные номера статей и кодексов (ЗК РФ, ГК РФ)
3. НИКОГДА не выдумывай статьи, которых нет в найденных материалах
4. Если в найденных статьях нет полного ответа - честно скажи и порекомендуй обратиться к земельному юристу
5. Цитируй точные формулировки из статей, используй юридический язык

ФОРМАТ ОТВЕТА:

📋 **Краткий ответ:**
[2-3 предложения с указанием конкретных статей ЗК РФ или ГК РФ]

📖 **Правовая основа:**
[Процитируй релевантные части найденных статей с указанием: "Статья X ЗК РФ (или ГК РФ): ключевые положения"]

💡 **Практические рекомендации:**
[Пошаговые действия в данной ситуации на основе приведенных статей]

⚠️ **Важно:**
[Укажи риски, ограничения или необходимость консультации практикующего земельного юриста]

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
                    'error': f'Ошибка YandexGPT: {response.status_code}'
                }),
                'isBase64Encoded': False
            }
        
        result = response.json()
        answer = result.get('result', {}).get('alternatives', [{}])[0].get('message', {}).get('text', 'Не удалось получить ответ')
        
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        safe_question_db = question.replace("'", "''")
        safe_answer_db = answer.replace("'", "''")
        sources_json = json.dumps([
            {
                'code': 'ЗК РФ' if article['code_type'] == 'ZK_RF' else 'ГК РФ',
                'article': f"Статья {article['article_number']}: {article['title']}",
                'url': article['url']
            }
            for article in legal_articles
        ], ensure_ascii=False).replace("'", "''")
        
        insert_query = f"""
            INSERT INTO land_consultations (question, answer, sources)
            VALUES ('{safe_question_db}', '{safe_answer_db}', '{sources_json}'::jsonb)
        """
        cursor.execute(insert_query)
        conn.commit()
        cursor.close()
        conn.close()
        
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
                        'code': 'ЗК РФ' if article['code_type'] == 'ZK_RF' else 'ГК РФ',
                        'article': f"Статья {article['article_number']}: {article['title']}",
                        'url': article['url']
                    }
                    for article in legal_articles
                ]
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Внутренняя ошибка: {str(e)}'}, ensure_ascii=False),
            'isBase64Encoded': False
        }
