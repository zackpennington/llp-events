// Newsletter Form Submission Handler
import { Analytics } from './analytics.js';

(function() {
  const form = document.getElementById('resend-subscribe-form');
  const emailInput = document.getElementById('subscriber-email');
  const submitBtn = document.getElementById('submit-btn');
  const formBody = document.getElementById('resend-form-body');
  const successBody = document.getElementById('resend-success-body');
  const formMessage = document.getElementById('form-message');

  if (!form) return;

  // Email validation
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Show message
  function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 5000);
  }

  // Set loading state
  function setLoading(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Subscribing...';
      submitBtn.classList.add('loading');
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = 'SUBSCRIBE';
      submitBtn.classList.remove('loading');
    }
  }

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    // Track submission attempt
    Analytics.newsletterSignup(email);

    // Validate email
    if (!email) {
      showMessage('Please enter your email address', 'error');
      emailInput.focus();
      return;
    }

    if (!isValidEmail(email)) {
      showMessage('Please enter a valid email address', 'error');
      emailInput.focus();
      return;
    }

    // Set loading state
    setLoading(true);
    formMessage.style.display = 'none';

    try {
      // Send to serverless function
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Track successful signup
        Analytics.newsletterSuccess();

        // Show success state
        formBody.style.display = 'none';
        successBody.style.display = 'block';

        // Reset form
        form.reset();
      } else {
        // Show error message
        showMessage(data.error || 'Something went wrong. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      showMessage('Network error. Please check your connection and try again.', 'error');
    } finally {
      setLoading(false);
    }
  });

  // Real-time email validation feedback
  emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    if (email && !isValidEmail(email)) {
      emailInput.style.borderColor = 'rgba(212, 45, 58, 0.5)';
    }
  });

  emailInput.addEventListener('input', () => {
    emailInput.style.borderColor = '';
    formMessage.style.display = 'none';
  });
})();
