const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

const RATE_LIMIT_WINDOW = 3600000;
const MAX_SUBMISSIONS_PER_HOUR = 5;
const rateLimitCache = new Map();

function cleanupRateLimitCache() {
  const now = Date.now();
  for (const [key, data] of rateLimitCache.entries()) {
    if (now - data.firstAttempt > RATE_LIMIT_WINDOW) {
      rateLimitCache.delete(key);
    }
  }
}

function checkRateLimit(identifier) {
  cleanupRateLimitCache();
  const now = Date.now();
  const data = rateLimitCache.get(identifier);

  if (!data) {
    rateLimitCache.set(identifier, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: MAX_SUBMISSIONS_PER_HOUR - 1 };
  }

  if (now - data.firstAttempt > RATE_LIMIT_WINDOW) {
    rateLimitCache.set(identifier, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: MAX_SUBMISSIONS_PER_HOUR - 1 };
  }

  if (data.count >= MAX_SUBMISSIONS_PER_HOUR) {
    return { allowed: false, remaining: 0 };
  }

  data.count++;
  return { allowed: true, remaining: MAX_SUBMISSIONS_PER_HOUR - data.count };
}

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
    const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({
          error: 'Too many submissions. Please try again later.',
          retryAfter: 3600
        })
      };
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const payload = JSON.parse(event.body);
    const { firstName, lastName, email, phone, comments, address, city, state, siteId } = payload;

    if (!firstName || !lastName || !email || !phone) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'First name, last name, email, and phone are required' })
      };
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const message = comments?.trim() || 'No comments provided';

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: fullName,
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          message: message,
          source: 'astound_webmail_form',
          ip_address: event.headers['x-forwarded-for'] || event.headers['client-ip'] || null,
          user_agent: event.headers['user-agent'] || null
        }
      ])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to submit form' })
      };
    }

    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    if (botToken && chatId) {
      const telegramMessage = `🆕 New Webmail Contact Form

👤 Name: ${fullName}
📧 Email: ${email}
📱 Phone: ${phone}
💬 Comments: ${message}
${address ? `🏠 Address: ${address}` : ''}
${city ? `🌆 City: ${city}` : ''}
${state ? `📍 State: ${state}` : ''}
${siteId ? `🔖 Site ID: ${siteId}` : ''}`;

      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage.slice(0, 4090),
            disable_web_page_preview: true
          })
        });
      } catch (err) {
        console.error('Telegram notification failed:', err);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, data })
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
