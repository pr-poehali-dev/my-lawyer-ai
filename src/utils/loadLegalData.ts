const PARSER_URL = 'https://functions.poehali.dev/fe807173-efe8-497d-a271-8a31d7ea7265';

export async function loadLegalCode(code: string): Promise<{ success: boolean; articles_loaded?: number; error?: string }> {
  try {
    const response = await fetch(PARSER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error loading ${code}:`, error);
    return { success: false, error: String(error) };
  }
}

export async function loadAllLegalCodes(): Promise<void> {
  const codes = ['GK', 'TK', 'UK', 'KoAP', 'SK', 'ZPP'];
  
  console.log('Starting to load legal codes...');
  
  for (const code of codes) {
    console.log(`Loading ${code}...`);
    const result = await loadLegalCode(code);
    
    if (result.success) {
      console.log(`✅ ${code}: loaded ${result.articles_loaded} articles`);
    } else {
      console.error(`❌ ${code}: ${result.error}`);
    }
  }
  
  console.log('All legal codes loaded!');
}

export async function getLegalStats(): Promise<any> {
  try {
    const response = await fetch(PARSER_URL, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting stats:', error);
    return { stats: [] };
  }
}
