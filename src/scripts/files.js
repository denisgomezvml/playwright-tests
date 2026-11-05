import '../styles/files.css';

const ALLOWED = ['.csv', '.txt'];
const input = document.getElementById('file-input');
const error = document.getElementById('upload-error');
const result = document.getElementById('upload-result');

input.addEventListener('change', () => {
  const file = input.files[0];
  error.textContent = '';
  if (!file) {
    result.textContent = 'No file selected.';
    return;
  }
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED.includes(extension)) {
    result.textContent = '';
    error.textContent = 'Only .csv and .txt files are allowed.';
    return;
  }
  result.textContent = `Uploaded ${file.name} (${file.size} bytes)`;
});

const csv = 'id,name,city\n1,Alice,Austin\n2,Bob,Boston\n3,Carol,Chicago\n';
document.getElementById('download-link').href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
