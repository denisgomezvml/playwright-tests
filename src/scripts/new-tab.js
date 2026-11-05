const from = new URLSearchParams(window.location.search).get('from') || 'unknown';
document.getElementById('origin').textContent = `Opened from: ${from}`;
