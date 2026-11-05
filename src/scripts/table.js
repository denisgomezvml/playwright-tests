import '../styles/table.css';

const PAGE_SIZE = 5;
const employees = [
  ['Alice Johnson', 'Engineer', 'Austin', 29],
  ['Bob Smith', 'Designer', 'Boston', 34],
  ['Carla Gomez', 'Manager', 'Chicago', 41],
  ['David Lee', 'Engineer', 'Denver', 27],
  ['Emma Brown', 'Analyst', 'Austin', 31],
  ['Frank Miller', 'Designer', 'Seattle', 38],
  ['Grace Kim', 'Engineer', 'Boston', 26],
  ['Henry Davis', 'Manager', 'Denver', 45],
  ['Isabel Torres', 'Analyst', 'Chicago', 33],
  ['Jack Wilson', 'Engineer', 'Seattle', 30],
  ['Karen White', 'Designer', 'Austin', 36],
  ['Liam Clark', 'Analyst', 'Boston', 28],
  ['Mia Lopez', 'Manager', 'Seattle', 39],
  ['Noah Hall', 'Engineer', 'Chicago', 32],
  ['Olivia Young', 'Designer', 'Denver', 25],
  ['Paul King', 'Analyst', 'Austin', 42],
  ['Quinn Scott', 'Engineer', 'Boston', 35],
  ['Rita Adams', 'Manager', 'Chicago', 47],
  ['Sam Baker', 'Designer', 'Seattle', 24],
  ['Tina Nelson', 'Analyst', 'Denver', 37],
  ['Uma Patel', 'Engineer', 'Austin', 40],
  ['Victor Reed', 'Manager', 'Boston', 44],
  ['Wendy Cruz', 'Designer', 'Chicago', 23],
].map(([name, role, city, age]) => ({ name, role, city, age }));

const state = { filter: '', sortKey: null, sortDir: 'ascending', page: 1 };

const body = document.querySelector('#employees-table tbody');
const filterInput = document.getElementById('table-filter');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const pageStatus = document.getElementById('page-status');
const rowCount = document.getElementById('row-count');
const emptyMessage = document.getElementById('table-empty');
const headers = document.querySelectorAll('#employees-table th');

function getRows() {
  const term = state.filter.trim().toLowerCase();
  const rows = employees.filter((row) =>
    Object.values(row).some((value) => String(value).toLowerCase().includes(term)),
  );
  if (state.sortKey) {
    const direction = state.sortDir === 'ascending' ? 1 : -1;
    rows.sort((a, b) => {
      const x = a[state.sortKey];
      const y = b[state.sortKey];
      return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y))) * direction;
    });
  }
  return rows;
}

function render() {
  const rows = getRows();
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  state.page = Math.min(state.page, pageCount);
  const start = (state.page - 1) * PAGE_SIZE;
  const visible = rows.slice(start, start + PAGE_SIZE);

  body.replaceChildren(
    ...visible.map((row) => {
      const tr = document.createElement('tr');
      for (const value of [row.name, row.role, row.city, row.age]) {
        const td = document.createElement('td');
        td.textContent = value;
        tr.append(td);
      }
      return tr;
    }),
  );

  emptyMessage.hidden = rows.length > 0;
  pageStatus.textContent = `Page ${state.page} of ${pageCount}`;
  rowCount.textContent = rows.length
    ? `Showing ${start + 1}-${start + visible.length} of ${rows.length} rows`
    : 'Showing 0 rows';
  prevButton.disabled = state.page <= 1;
  nextButton.disabled = state.page >= pageCount;

  for (const th of headers) {
    const key = th.querySelector('button').dataset.key;
    th.setAttribute('aria-sort', key === state.sortKey ? state.sortDir : 'none');
  }
}

filterInput.addEventListener('input', () => {
  state.filter = filterInput.value;
  state.page = 1;
  render();
});

for (const th of headers) {
  th.querySelector('button').addEventListener('click', (event) => {
    const { key } = event.currentTarget.dataset;
    state.sortDir = state.sortKey === key && state.sortDir === 'ascending' ? 'descending' : 'ascending';
    state.sortKey = key;
    state.page = 1;
    render();
  });
}

prevButton.addEventListener('click', () => {
  state.page -= 1;
  render();
});
nextButton.addEventListener('click', () => {
  state.page += 1;
  render();
});

render();
