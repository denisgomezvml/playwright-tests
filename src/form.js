const form = document.getElementById('registration-form');
const result = document.getElementById('registration-result');
const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function setError(fieldId, message) {
  const field = document.getElementById(fieldId);
  document.getElementById(`${fieldId}-error`).textContent = message;
  if (message) {
    field.setAttribute('aria-invalid', 'true');
  } else {
    field.removeAttribute('aria-invalid');
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  result.textContent = '';

  const fullName = document.getElementById('full-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const country = document.getElementById('country').value;
  const terms = document.getElementById('terms').checked;

  let emailError = '';
  if (!email) emailError = 'Email is required.';
  else if (!emailPattern.test(email)) emailError = 'Please enter a valid email address.';

  setError('full-name', fullName ? '' : 'Full name is required.');
  setError('reg-email', emailError);
  setError('country', country ? '' : 'Please select a country.');
  setError('terms', terms ? '' : 'You must accept the terms.');

  if (form.querySelector('[aria-invalid="true"]')) {
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  result.textContent = `Registration complete for ${fullName}!`;
});
