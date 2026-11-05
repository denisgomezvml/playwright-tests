import '../styles/frames.css';

const form = document.getElementById('newsletter-form');
if (form) {
  const email = document.getElementById('newsletter-email');
  const error = document.getElementById('newsletter-error');
  const result = document.getElementById('newsletter-result');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    result.textContent = '';
    if (!email.validity.valid) {
      error.textContent = email.validity.valueMissing ? 'Email is required.' : 'Enter a valid email address.';
      return;
    }
    error.textContent = '';
    result.textContent = `Subscribed ${email.value}`;
  });
}
