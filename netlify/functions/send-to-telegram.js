// netlify/functions/send-to-telegram.js
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  let payload;
  try { payload = JSON.parse(event.body); } catch { return { statusCode: 400, body: "Bad JSON" }; }

  const text = (payload.message || "").slice(0, 4090);

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      disable_web_page_preview: true
    })
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Telegram error:", err);
    return { statusCode: 502, body: JSON.stringify(err) };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
