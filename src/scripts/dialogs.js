import '../styles/dialogs.css';

const result = document.getElementById('dialog-result');
const modal = document.getElementById('modal');
const modalResult = document.getElementById('modal-result');
const openModal = document.getElementById('open-modal');

document.getElementById('alert-btn').addEventListener('click', () => {
  window.alert('Hello from alert');
  result.textContent = 'Alert dismissed';
});

document.getElementById('confirm-btn').addEventListener('click', () => {
  const accepted = window.confirm('Are you sure?');
  result.textContent = accepted ? 'Confirmed: yes' : 'Confirmed: no';
});

document.getElementById('prompt-btn').addEventListener('click', () => {
  const name = window.prompt('What is your name?', 'Guest');
  result.textContent = name === null ? 'Prompt cancelled' : `Hello, ${name}`;
});

openModal.addEventListener('click', () => {
  modal.showModal();
  modalResult.textContent = 'Modal open.';
});

modal.addEventListener('close', () => {
  if (modal.returnValue !== 'accepted') modalResult.textContent = 'Modal closed.';
  modal.returnValue = '';
  openModal.focus();
});

document.getElementById('modal-accept').addEventListener('click', () => {
  modalResult.textContent = 'Subscribed to the newsletter.';
  modal.close('accepted');
});

document.getElementById('modal-close').addEventListener('click', () => modal.close());
