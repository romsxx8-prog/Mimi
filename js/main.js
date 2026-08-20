/**
 * Mimi - Public page logic
 * Password gate → private.html  یا  send-photo.html
 */
(function () {
  'use strict';

  // Client-side gate only (not real security)
  const CORRECT_PASS = '925';

  const lockBtn = document.getElementById('lockBtn');
  const sendPhotoBtn = document.getElementById('sendPhotoBtn');
  const modalOverlay = document.getElementById('passwordModal');
  const modal = modalOverlay?.querySelector('.modal');
  const closeBtns = document.querySelectorAll('[data-close-modal]');
  const passwordInput = document.getElementById('passwordInput');
  const togglePassBtn = document.getElementById('togglePass');
  const enterBtn = document.getElementById('enterBtn');
  const errorMsg = document.getElementById('errorMsg');

  if (!lockBtn || !modalOverlay) return;

  let currentAction = null; // 'private' | 'send-photo'

  function openModal(action) {
    currentAction = action || 'private';
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      passwordInput?.focus();
    }, 280);
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    currentAction = null;
    if (passwordInput) {
      passwordInput.value = '';
      passwordInput.type = 'password';
    }
    if (errorMsg) {
      errorMsg.classList.remove('show');
      errorMsg.textContent = '';
    }
    if (modal) modal.classList.remove('shake');
    if (enterBtn) {
      enterBtn.disabled = false;
      enterBtn.textContent = 'ورود';
    }
  }

  function showError(msg) {
    if (errorMsg) {
      errorMsg.textContent = msg;
      errorMsg.classList.add('show');
    }
    if (modal) {
      modal.classList.remove('shake');
      void modal.offsetWidth;
      modal.classList.add('shake');
    }
    passwordInput?.focus();
    passwordInput?.select();
  }

  function tryEnter() {
    const val = (passwordInput?.value || '').trim();
    if (!val) {
      showError('رمز رو بنویس اول 😁👀');
      return;
    }
    if (val === CORRECT_PASS) {
      if (lockBtn) lockBtn.classList.add('unlocking');
      if (enterBtn) {
        enterBtn.disabled = true;
        enterBtn.textContent = 'داره باز میشه...';
      }
      setTimeout(() => {
        if (currentAction === 'send-photo') {
          window.location.href = './send-photo.html';
        } else {
          window.location.href = './private.html';
        }
      }, 420);
    } else {
      showError('نههه 😭 این یکی نبود، دوباره امتحان کن');
    }
  }

  // Events
  lockBtn.addEventListener('click', () => openModal('private'));

  if (sendPhotoBtn) {
    sendPhotoBtn.addEventListener('click', () => openModal('send-photo'));
  }

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
    if (e.key === 'Enter' && modalOverlay.classList.contains('active')) {
      tryEnter();
    }
  });

  enterBtn?.addEventListener('click', tryEnter);

  togglePassBtn?.addEventListener('click', () => {
    if (!passwordInput) return;
    const isPass = passwordInput.type === 'password';
    passwordInput.type = isPass ? 'text' : 'password';
    togglePassBtn.setAttribute('aria-label', isPass ? 'مخفی کردن رمز' : 'نمایش رمز');
  });

  // Soft CTA (decorative / future)
  const ctaBtn = document.getElementById('ctaBtn');
  ctaBtn?.addEventListener('click', () => {
    ctaBtn.style.transform = 'scale(0.96)';
    setTimeout(() => {
      ctaBtn.style.transform = '';
    }, 180);
  });
})();