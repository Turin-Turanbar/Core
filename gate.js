/* ============================================================
   gate.js — Password protection
   ============================================================ */
(function () {
  const KEY = 'core_auth';
  const PASS = 'ardados2026@!#';

  if (sessionStorage.getItem(KEY) === '1') return;

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #gate-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: #09090b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    #gate-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      width: 100%;
      max-width: 360px;
      padding: 0 24px;
    }
    #gate-logo {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: #fafafa;
    }
    #gate-label {
      font-size: 13px;
      color: #71717a;
      text-align: center;
    }
    #gate-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }
    #gate-input {
      width: 100%;
      padding: 10px 14px;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 8px;
      color: #fafafa;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      box-sizing: border-box;
      transition: border-color 120ms;
    }
    #gate-input:focus {
      border-color: #52525b;
    }
    #gate-input.error {
      border-color: #ef4444;
    }
    #gate-submit {
      width: 100%;
      padding: 10px 14px;
      background: #fafafa;
      color: #09090b;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: background 120ms;
    }
    #gate-submit:hover {
      background: #e4e4e7;
    }
    #gate-error {
      font-size: 12px;
      color: #ef4444;
      text-align: center;
      min-height: 16px;
    }
  `;
  document.head.appendChild(style);

  // Build overlay
  const overlay = document.createElement('div');
  overlay.id = 'gate-overlay';
  overlay.innerHTML = `
    <div id="gate-box">
      <div id="gate-logo">CORE</div>
      <div id="gate-label">This site is private. Enter the password to continue.</div>
      <form id="gate-form">
        <input id="gate-input" type="password" placeholder="Password" autocomplete="current-password" autofocus />
        <button id="gate-submit" type="submit">Continue</button>
        <div id="gate-error"></div>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('gate-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const input = document.getElementById('gate-input');
    const err = document.getElementById('gate-error');

    if (input.value === PASS) {
      sessionStorage.setItem(KEY, '1');
      overlay.remove();
      style.remove();
    } else {
      input.classList.add('error');
      err.textContent = 'Incorrect password.';
      input.value = '';
      setTimeout(() => {
        input.classList.remove('error');
        err.textContent = '';
      }, 2000);
    }
  });
})();
