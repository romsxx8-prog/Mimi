/**
 * Mimi - Send Photo to Telegram
 * Password gate (925) then upload/camera → Telegram
 */
(function () {
  'use strict';

  // Client-side gate only (same as private room)
  const CORRECT_PASS = '925';

  // ====================== CONFIGURATION ======================
  // توکن ربات را از @BotFather بگیر و اینجا بگذار
  const BOT_TOKEN = '8956009751:AAFsvGC8vPUKFjROPSXegj71xvRSfdJUAUs';
  // آیدی عددی چت (مثلاً 123456789)
  const CHAT_ID = '7777812891';
  // ===========================================================

  const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

  // Gate elements
  const gate = document.getElementById('spGate');
  const gateCard = document.getElementById('spGateCard');
  const passwordInput = document.getElementById('spPassword');
  const togglePassBtn = document.getElementById('spTogglePass');
  const enterBtn = document.getElementById('spEnterBtn');
  const errorMsg = document.getElementById('spError');
  const content = document.getElementById('spContent');

  // Upload elements
  const uploadBtn = document.getElementById('uploadBtn');
  const cameraBtn = document.getElementById('cameraBtn');
  const fileInput = document.getElementById('fileInput');
  const cameraInput = document.getElementById('cameraInput');
  const statusEl = document.getElementById('status');
  const spinner = document.getElementById('spinner');

  let isSending = false;

  const faNum = (n) => n.toLocaleString('fa-IR');
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // ----- Password Gate -----
  function showError(msg) {
    if (errorMsg) {
      errorMsg.textContent = msg;
      errorMsg.classList.add('show');
    }
    if (gateCard) {
      gateCard.classList.remove('shake');
      void gateCard.offsetWidth;
      gateCard.classList.add('shake');
    }
    passwordInput?.focus();
    passwordInput?.select();
  }

  function unlockContent() {
    if (gate) gate.hidden = true;
    if (content) {
      content.hidden = false;
      content.classList.add('sp-content-enter');
    }
  }

  function tryEnter() {
    const val = (passwordInput?.value || '').trim();
    if (!val) {
      showError('رمز رو بنویس اول 👀');
      return;
    }
    if (val === CORRECT_PASS) {
      if (enterBtn) {
        enterBtn.disabled = true;
        enterBtn.textContent = 'داره باز می‌شه...';
      }
      setTimeout(unlockContent, 320);
    } else {
      showError('نههه 😭 این یکی نبود، دوباره امتحان کن');
    }
  }

  enterBtn?.addEventListener('click', tryEnter);

  passwordInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryEnter();
  });

  togglePassBtn?.addEventListener('click', () => {
    if (!passwordInput) return;
    const isPass = passwordInput.type === 'password';
    passwordInput.type = isPass ? 'text' : 'password';
    togglePassBtn.setAttribute('aria-label', isPass ? 'مخفی کردن رمز' : 'نمایش رمز');
  });

  // Focus password on load
  setTimeout(() => passwordInput?.focus(), 200);

  // ----- Send logic -----
  function setStatus(text, type = '') {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.className = 'sp-status' + (type ? ' ' + type : '');
  }

  function setButtonsDisabled(disabled) {
    [uploadBtn, cameraBtn].forEach((btn) => {
      if (btn) btn.classList.toggle('disabled', disabled);
    });
  }

  function showSpinner(show) {
    if (spinner) spinner.hidden = !show;
  }

  async function sendPhoto(file) {
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', file);

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Telegram API error: ${response.status} ${errorText}`);
    }
  }

  async function handleFiles(fileList) {
    if (isSending) return;

    const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      setStatus('عکسی انتخاب نشد.', 'error');
      return;
    }

    if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' || CHAT_ID === 'YOUR_CHAT_ID_HERE') {
      setStatus('لطفاً BOT_TOKEN و CHAT_ID را در کد تنظیم کن.', 'error');
      return;
    }

    isSending = true;
    setButtonsDisabled(true);
    showSpinner(true);

    try {
      for (let i = 0; i < files.length; i++) {
        setStatus(`در حال ارسال ${faNum(i + 1)} از ${faNum(files.length)}...`);
        await sendPhoto(files[i]);
        if (i < files.length - 1) {
          await delay(800);
        }
      }
      setStatus('✅ عکس‌ها با موفقیت ارسال شدند!', 'success');
    } catch (err) {
      console.error(err);
      setStatus('❌ خطا در ارسال. دوباره امتحان کن.', 'error');
    } finally {
      isSending = false;
      setButtonsDisabled(false);
      showSpinner(false);
    }
  }

  uploadBtn?.addEventListener('click', () => fileInput?.click());
  cameraBtn?.addEventListener('click', () => cameraInput?.click());

  fileInput?.addEventListener('change', (e) => {
    handleFiles(e.target.files);
    e.target.value = '';
  });

  cameraInput?.addEventListener('change', (e) => {
    handleFiles(e.target.files);
    e.target.value = '';
  });

  // Soft floating particles (very few)
  function createSoftParticles() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const emojis = ['💖', '😍', '😝'];
    for (let i = 0; i < 8; i++) {
      const span = document.createElement('span');
      span.className = 'sp-float';
      span.textContent = emojis[i % emojis.length];
      span.style.left = Math.random() * 100 + 'vw';
      span.style.fontSize = 12 + Math.random() * 10 + 'px';
      span.style.animationDuration = 10 + Math.random() * 10 + 's';
      span.style.animationDelay = Math.random() * 8 + 's';
      document.body.appendChild(span);
    }
  }

  createSoftParticles();
})();
