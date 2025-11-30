# Astound Webmail Contact Form

Complete contact form solution with Supabase database integration, Telegram notifications, and admin dashboard.

## Features

### 🎯 Contact Form Integration
- Real-time form validation with user-friendly error messages
- Email format validation and required field checks
- Smooth animations and visual feedback
- Integration with existing Gravity Forms structure

### 🗄️ Database Storage
- All submissions stored in Supabase PostgreSQL database
- Secure Row Level Security (RLS) policies
- Automatic timestamps and IP tracking
- Fields: name, email, phone, message, source, processed status

### 🔔 Telegram Notifications
- Instant notifications for new submissions
- Formatted messages with all contact details
- Optional field handling

### 🛡️ Security Features
- Rate limiting: 5 submissions per hour per IP
- CORS headers properly configured
- Security headers (X-Frame-Options, CSO, XSS Protection)
- Input sanitization and validation

### 📊 Admin Dashboard
- Beautiful real-time dashboard at `/admin`
- View all submissions with filtering (All/Pending/Processed)
- Statistics: Total, Today, This Week, Pending
- Mark submissions as processed
- Auto-refresh every 30 seconds
- Responsive design for mobile and desktop

## Setup

### 1. Environment Variables
Already configured in `.env`:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_SUPABASE_ANON_KEY` - Supabase anon key
- `BOT_TOKEN` - Telegram bot token (optional)
- `CHAT_ID` - Telegram chat ID (optional)

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Schema
The database table `contact_submissions` is already created with:
- Automatic ID generation
- Timestamps
- Processing status tracking
- Proper indexes for performance

### 4. Deploy to Netlify
```bash
# The site is ready to deploy
# Just push to your git repository connected to Netlify
```

## File Structure

```
/
├── index.html                    # Main page with contact form
├── admin.html                    # Admin dashboard
├── netlify.toml                  # Netlify configuration
├── package.json                  # Dependencies
├── .env                          # Environment variables
├── functions/
│   ├── submit-contact.js         # Contact form handler
│   └── notify.js                 # Telegram notification
├── js/
│   └── contact-handler.js        # Frontend form logic
├── css/                          # Styles
├── images/                       # Assets
└── fonts/                        # Custom fonts
```

## API Endpoints

### POST `/.netlify/functions/submit-contact`
Submit a contact form.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "comments": "Optional message",
  "address": "Optional",
  "city": "Optional",
  "state": "Optional",
  "siteId": "Optional"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Rate Limits:**
- 5 submissions per hour per IP address
- 429 error returned when limit exceeded

## Admin Dashboard

Access the admin dashboard at: `https://your-domain.com/admin`

Features:
- View all submissions in real-time
- Filter by status (All/Pending/Processed)
- Statistics overview
- Mark submissions as processed
- Auto-refresh every 30 seconds

## Development

The form automatically:
1. Validates all required fields
2. Checks email format
3. Shows loading state during submission
4. Displays success/error messages
5. Resets form on success
6. Tracks analytics events (if GTM is configured)

## Security Notes

- Rate limiting prevents spam
- CORS properly configured
- Security headers set
- Input validation on both client and server
- RLS policies protect database
- No sensitive data in client code

## Support

For issues or questions, check the Netlify function logs or Supabase dashboard.
