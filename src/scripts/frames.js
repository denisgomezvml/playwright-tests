import '../styles/frames.css';

class FeedbackCard extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        :host { display: block; }
        .card { padding: 1rem; border: 1px solid var(--border, #444); border-radius: 8px; background: var(--surface-2, #333); color: var(--text, #fff); }
        label { display: block; margin-bottom: 0.4rem; }
        input { width: 100%; box-sizing: border-box; margin-bottom: 0.75rem; padding: 0.5rem; }
        button { padding: 0.6rem 1.2rem; border: 0; border-radius: 4px; background: #4a4eb0; color: #fff; font: inherit; cursor: pointer; }
        .message { min-height: 1.5em; margin: 0.75rem 0 0; color: var(--success, #6bd49b); font-weight: 600; }
      </style>
      <div class="card">
        <label for="feedback-input">Your feedback</label>
        <input id="feedback-input" type="text">
        <button id="feedback-send" type="button">Send feedback</button>
        <p class="message" role="status" aria-live="polite"></p>
      </div>`;
    const input = root.getElementById('feedback-input');
    const message = root.querySelector('.message');
    root.getElementById('feedback-send').addEventListener('click', () => {
      message.textContent = input.value.trim()
        ? `Thanks for your feedback: ${input.value.trim()}`
        : 'Please write some feedback first.';
    });
  }
}

customElements.define('feedback-card', FeedbackCard);
