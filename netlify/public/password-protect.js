// This is a secure, server-side Netlify Function that checks the password.

exports.handler = async (event, context) => {
  // Handle CORS for admin dashboard
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, x-password',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  // Get the password from the request headers.
  const password = event.headers['x-password'];

  // Your secure password.
  // IMPORTANT: For even better security, store this in your Netlify Environment Variables
  // just like you did with the BOT_TOKEN and CHAT_ID.
  const CORRECT_PASSWORD = 'samdanbas1234';

  // If the password is wrong, deny access.
  if (password !== CORRECT_PASSWORD) {
    return {
      statusCode: 401, // Unauthorized
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/html'
      },
      body: 'Incorrect password',
    };
  }

  // If the password is correct, serve the admin page
  const fs = require('fs');
  const path = require('path');
  
  try {
    const htmlPath = path.join(process.cwd(), 'ELD.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      },
      body: htmlContent
    };
  } catch (error) {
    console.error('Error reading ELD.html:', error);
    return {
      statusCode: 500,
      body: 'Error loading admin page'
    };
  }
  return {
    statusCode: 200,
  };
};
