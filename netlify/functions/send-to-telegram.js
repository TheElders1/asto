// netlify/functions/send-to-telegram.js   (or .ts if you use TypeScript)

exports.handler = async (event) => {
  // 1. Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  // 2. Grab env vars (set these in Netlify dashboard → Site Settings → Build & Deploy → Environment)
  const BOT_TOKEN = process.env.BOT_TOKEN
  const CHAT_ID = process.env.CHAT_ID

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Missing BOT_TOKEN or CHAT_ID in environment variables')
    return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfigured' }) }
  }

  let payload
  try {
    payload = JSON.parse(event.body)
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const { message } = payload
  if (!message || typeof message !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ error: 'Message is required' }) }
  }

  // Optional: basic size limit (Telegram max ~4096 chars)
  if (message.length > 4000) {
    console.warn('Message too long, truncating...')
  }

  const text = message.slice(0, 4000)

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

  try {
    const telegramResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML',               // optional: allows <b>bold</b>, <code>tags</code> etc.
        disable_web_page_preview: true
      })
    })

    const result = await telegramResponse.json()

    if (!telegramResponse.ok) {
      console.error('Telegram API error:', result)
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Failed to deliver to Telegram', details: result })
      }
    }

    console.log('Successfully sent to Telegram:', result)
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    }
  } catch (err) {
    console.error('Unexpected error in function:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}
