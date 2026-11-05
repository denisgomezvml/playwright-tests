import '../styles/dnd.css';

const list = document.getElementById('task-list');
const status = document.getElementById('order-status');
const tasks = ['Write tests', 'Review code', 'Deploy site', 'Update docs'];

function names() {
  return [...list.children].map((li) => li.dataset.name);
}

function announce() {
  status.textContent = `Order: ${names().join(', ')}`;
}

function createItem(name) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.draggable = true;
  li.dataset.name = name;
  li.innerHTML = '<span class="task-name"></span><span class="task-actions"></span>';
  li.querySelector('.task-name').textContent = name;
  const actions = li.querySelector('.task-actions');
  [['Move up', -1], ['Move down', 1]].forEach(([label, step]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-label', `${label} ${name}`);
    button.addEventListener('click', () => {
      const sibling = step < 0 ? li.previousElementSibling : li.nextElementSibling;
      if (!sibling) return;
      if (step < 0) list.insertBefore(li, sibling);
      else list.insertBefore(sibling, li);
      announce();
      button.focus();
    });
    actions.append(button);
  });
  li.addEventListener('dragstart', (event) => {
    li.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', name);
  });
  li.addEventListener('dragend', () => li.classList.remove('dragging'));
  return li;
}

tasks.forEach((name) => list.append(createItem(name)));
announce();

list.addEventListener('dragover', (event) => event.preventDefault());
list.addEventListener('drop', (event) => {
  event.preventDefault();
  const dragged = list.querySelector('.dragging');
  const target = event.target.closest('.task-item');
  if (!dragged || !target || dragged === target) return;
  const after = dragged.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING;
  list.insertBefore(dragged, after ? target.nextElementSibling : target);
  announce();
});

const menu = document.getElementById('hover-menu');
const toggle = document.getElementById('menu-toggle');
const items = document.getElementById('menu-items');

function setOpen(open) {
  toggle.setAttribute('aria-expanded', String(open));
  items.hidden = !open;
}

let openedByHover = false;

menu.addEventListener('pointerenter', (event) => {
  if (event.pointerType !== 'mouse') return;
  openedByHover = items.hidden;
  setOpen(true);
});
menu.addEventListener('pointerleave', (event) => {
  if (event.pointerType === 'mouse') setOpen(false);
});
toggle.addEventListener('click', () => {
  if (openedByHover) {
    openedByHover = false;
    return;
  }
  setOpen(items.hidden);
});
menu.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setOpen(false);
    toggle.focus();
  }
});
