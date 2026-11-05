const toggle = document.getElementById('hero-details-toggle');
const details = document.getElementById('hero-details');

toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  toggle.textContent = expanded ? 'Show details' : 'Hide details';
  details.hidden = expanded;
});
