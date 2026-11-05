import '../styles/async.css';

const DELAY_MS = 2000;
const FLAKY_DELAY_MS = 500;

const delayedButton = document.getElementById('load-delayed');
const delayedStatus = document.getElementById('delayed-status');
const flakyButton = document.getElementById('load-flaky');
const flakyError = document.getElementById('flaky-error');
const flakyStatus = document.getElementById('flaky-status');

delayedButton.addEventListener('click', () => {
  delayedButton.disabled = true;
  delayedStatus.setAttribute('aria-busy', 'true');
  delayedStatus.textContent = 'Loading...';
  setTimeout(() => {
    delayedStatus.removeAttribute('aria-busy');
    delayedStatus.textContent = 'Result loaded after 2 seconds';
    delayedButton.disabled = false;
  }, DELAY_MS);
});

let attempts = 0;

flakyButton.addEventListener('click', () => {
  attempts += 1;
  const attempt = attempts;
  flakyButton.disabled = true;
  flakyError.textContent = '';
  flakyStatus.setAttribute('aria-busy', 'true');
  flakyStatus.textContent = 'Loading...';
  setTimeout(() => {
    flakyStatus.removeAttribute('aria-busy');
    if (attempt % 2 === 1) {
      flakyStatus.textContent = '';
      flakyError.textContent = 'Request failed. Please try again.';
    } else {
      flakyStatus.textContent = `Flaky data loaded on attempt ${attempt}`;
    }
    flakyButton.disabled = false;
  }, FLAKY_DELAY_MS);
});
