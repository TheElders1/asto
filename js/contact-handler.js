(function() {
  function initContactForm() {
    const form = document.querySelector('#gform_22');

    if (!form) {
      console.warn('Contact form #gform_22 not found');
      return;
    }

    const submitButton = form.querySelector('#gform_submit_button_22');

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (submitButton.disabled) return;

      const originalText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = '<span>Sending...</span>';

      const formData = {
        firstName: form.querySelector('#input_22_1')?.value || '',
        lastName: form.querySelector('#input_22_2')?.value || '',
        email: form.querySelector('#input_22_8')?.value || '',
        phone: form.querySelector('#input_22_9')?.value || '',
        comments: form.querySelector('#input_22_25')?.value || '',
        address: form.querySelector('#input_22_23')?.value || '',
        city: form.querySelector('#input_22_26')?.value || '',
        state: form.querySelector('#input_22_24')?.value || '',
        siteId: form.querySelector('#input_22_18')?.value || ''
      };

      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        showMessage('Please fill in all required fields (First Name, Last Name, Email, Phone)', 'error', form);
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showMessage('Please enter a valid email address', 'error', form);
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
        return;
      }

      try {
        const response = await fetch('/.netlify/functions/submit-contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          form.reset();
          showMessage('Thank you! Your message has been sent successfully. We will contact you soon.', 'success', form);

          if (window.dataLayer) {
            window.dataLayer.push({
              'event': 'formSubmission',
              'formName': 'webmail_contact',
              'formLocation': 'rcn-webmail'
            });
          }
        } else {
          showMessage(result.error || 'Something went wrong. Please try again.', 'error', form);
        }
      } catch (error) {
        console.error('Submit error:', error);
        showMessage('Network error. Please check your connection and try again.', 'error', form);
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    });
  }

  function showMessage(message, type, formElement) {
    const existingMessage = document.querySelector('.astound-form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'astound-form-message astound-form-message-' + type;
    messageDiv.textContent = message;
    messageDiv.style.cssText = 'padding: 20px; margin: 20px 0; border-radius: 8px; font-weight: 500; font-size: 16px; line-height: 1.5; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: slideIn 0.3s ease-out;' +
      (type === 'success'
        ? 'background-color: #d4edda; color: #155724; border-left: 4px solid #28a745;'
        : 'background-color: #f8d7da; color: #721c24; border-left: 4px solid #dc3545;');

    formElement.parentNode.insertBefore(messageDiv, formElement);

    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(function() {
      if (messageDiv.parentNode) {
        messageDiv.style.opacity = '0';
        messageDiv.style.transition = 'opacity 0.5s ease-out';
        setTimeout(function() {
          if (messageDiv.parentNode) {
            messageDiv.remove();
          }
        }, 500);
      }
    }, 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }

  const style = document.createElement('style');
  style.textContent = '@keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); }}';
  document.head.appendChild(style);
})();
