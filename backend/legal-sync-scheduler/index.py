"""
Business: Планировщик ежедневного обновления законодательства из государственных источников
Args: event (может быть пустым для cron), context с request_id
Returns: HTTP response с результатом запуска синхронизации
"""

import json
import os
from typing import Dict, Any
import urllib.request
import urllib.error

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    sync_function_url = os.environ.get('LEGAL_SYNC_URL', 'https://functions.poehali.dev/f1c69854-1969-4039-8091-7ea77b37bdec')
    
    try:
        req = urllib.request.Request(
            sync_function_url,
            data=json.dumps({}).encode('utf-8'),
            headers={
                'Content-Type': 'application/json'
            },
            method='POST'
        )
        
        with urllib.request.urlopen(req, timeout=30) as response:
            response_data = json.loads(response.read().decode('utf-8'))
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message': 'Автообновление законодательства запущено успешно',
                    'sync_result': response_data,
                    'request_id': context.request_id
                })
            }
    
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': False,
                'error': f'HTTP {e.code}: {error_body}',
                'request_id': context.request_id
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': False,
                'error': str(e),
                'request_id': context.request_id
            })
        }
