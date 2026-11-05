document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const error = document.getElementById('error');
  const result = document.getElementById('result');
  error.textContent = '';
  result.textContent = '';
  if (!name || !email) {
    error.textContent = 'Name and email are required.';
    return;
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    error.textContent = 'Please enter a valid email address.';
    return;
  }
  result.textContent = 'Form submitted successfully!';
});
