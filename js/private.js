/**
 * Mimi - Private room logic
 * Tabs, galleries, players, lightbox, text reader
 */
(function () {
  'use strict';

  // ----- Elements -----
  const sections = {
    home: document.getElementById('section-home'),
    videos: document.getElementById('section-videos'),
    photos: document.getElementById('section-photos'),
    voices: document.getElementById('section-voices'),
    texts: document.getElementById('section-texts')
  };

  const navItems = document.querySelectorAll('.nav-item');
  const catCards = document.querySelectorAll('.cat-card');
  const backBtn = document.getElementById('backBtn');

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  // Video modal
  const videoModal = document.getElementById('videoModal');
  const videoPlayer = document.getElementById('videoPlayer');
  const videoModalTitle = document.getElementById('videoModalTitle');
  const videoModalClose = document.getElementById('videoModalClose');

  // Text modal
  const textModal = document.getElementById('textModal');
  const textModalTitle = document.getElementById('textModalTitle');
  const textModalDate = document.getElementById('textModalDate');
  const textModalBody = document.getElementById('textModalBody');
  const textModalClose = document.getElementById('textModalClose');

  let currentPhotoIndex = 0;
  let photosList = [];
  let currentAudio = null;
  let currentVoiceId = null;

  // ----- Navigation -----
  function showSection(name) {
    Object.keys(sections).forEach(key => {
      const el = sections[key];
      if (!el) return;
      if (key === name) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === name);
    });

    if (typeof MimiStorage !== 'undefined') {
      MimiStorage.setLastSection(name);
    }

    // Stop audio when leaving voices
    if (name !== 'voices' && currentAudio) {
      currentAudio.pause();
      updateVoiceUI(null);
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const sec = item.dataset.section;
      if (sec) showSection(sec);
    });
  });

  catCards.forEach(card => {
    card.addEventListener('click', () => {
      const sec = card.dataset.section;
      if (sec) showSection(sec);
    });
  });

  backBtn?.addEventListener('click', () => {
    window.location.href = './index.html';
  });

  // ----- Render helpers -----
  function createEmptyState(title, desc) {
    return `
      <div class="empty-state">
        <div class="empty-icon">🥹</div>
        <div class="empty-title">${title}</div>
        <div class="empty-desc">${desc}</div>
      </div>
    `;
  }

  function placeholderImg(w = 400, h = 300) {
    // Soft gradient SVG placeholder
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3d2a5c"/>
          <stop offset="100%" style="stop-color:#1a1229"/>
        </linearGradient>
      </defs>
      <rect fill="url(#g)" width="${w}" height="${h}"/>
      <text x="50%" y="50%" fill="#b8a0b0" font-size="14" text-anchor="middle" dy=".3em" font-family="sans-serif">Mimi</text>
    </svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  // ----- Videos -----
  function renderVideos() {
    const container = document.getElementById('videoGrid');
    const countEl = document.getElementById('videoCount');
    if (!container) return;

    const list = MediaData.getVideos();
    if (countEl) countEl.textContent = list.length + ' ویدیو';

    if (!list.length) {
      container.innerHTML = createEmptyState(
        'هنوز اینجا ویدیویی نذاشتی 🥹',
        'بعداً میتونی اولین خاطره رو اضافه کنی.'
      );
      return;
    }

    container.innerHTML = list.map((v, i) => `
      <article class="video-card" data-id="${v.id}" data-index="${i}" role="button" tabindex="0" aria-label="پخش ${v.title}">
        <div class="video-thumb">
          <img src="${v.thumb}" alt="" loading="lazy" onerror="this.src='${placeholderImg(320,200)}'">
          <div class="play-overlay">
            <div class="play-circle">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
          <span class="video-duration">${v.duration}</span>
        </div>
        <div class="video-info">
          <div class="video-name">${v.title}</div>
          <div class="video-date">${v.date}</div>
        </div>
      </article>
    `).join('');

    container.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.index, 10);
        openVideo(list[idx]);
      });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const idx = parseInt(card.dataset.index, 10);
          openVideo(list[idx]);
        }
      });
    });
  }

  function openVideo(item) {
    if (!videoModal || !videoPlayer) return;
    videoPlayer.src = item.src;
    if (videoModalTitle) videoModalTitle.textContent = item.title;
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    videoPlayer.play().catch(() => {
      // autoplay blocked or missing file – still show player
    });
  }

  function closeVideoModal() {
    if (!videoModal || !videoPlayer) return;
    videoPlayer.pause();
    videoPlayer.removeAttribute('src');
    videoPlayer.load();
    videoModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  videoModalClose?.addEventListener('click', closeVideoModal);
  videoModal?.addEventListener('click', e => {
    if (e.target === videoModal) closeVideoModal();
  });

  // ----- Photos -----
  function renderPhotos() {
    const container = document.getElementById('photoGrid');
    const countEl = document.getElementById('photoCount');
    if (!container) return;

    photosList = MediaData.getPhotos();
    if (countEl) countEl.textContent = photosList.length + ' عکس';

    if (!photosList.length) {
      container.innerHTML = createEmptyState(
        'هنوز عکسی اینجا نیست 🥹',
        'اولین عکست رو بعداً اضافه کن.'
      );
      return;
    }

    container.innerHTML = photosList.map((p, i) => `
      <article class="photo-card" data-index="${i}" role="button" tabindex="0" aria-label="${p.title}">
        <img src="${p.src}" alt="${p.title}" loading="lazy" onerror="this.src='${placeholderImg(400,400)}'">
      </article>
    `).join('');

    container.querySelectorAll('.photo-card').forEach(card => {
      card.addEventListener('click', () => {
        openLightbox(parseInt(card.dataset.index, 10));
      });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(parseInt(card.dataset.index, 10));
        }
      });
    });
  }

  function openLightbox(index) {
    if (!lightbox || !photosList.length) return;
    currentPhotoIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function updateLightbox() {
    const p = photosList[currentPhotoIndex];
    if (!p || !lightboxImg) return;
    lightboxImg.src = p.src;
    lightboxImg.alt = p.title;
    if (lightboxCaption) {
      lightboxCaption.textContent = p.caption ? `${p.title} · ${p.date}` : `${p.title} · ${p.date}`;
    }
  }

  function closeLightbox() {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navLightbox(dir) {
    if (!photosList.length) return;
    currentPhotoIndex = (currentPhotoIndex + dir + photosList.length) % photosList.length;
    updateLightbox();
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => navLightbox(-1));
  lightboxNext?.addEventListener('click', () => navLightbox(1));
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // ----- Voices -----
  function renderVoices() {
    const container = document.getElementById('voiceList');
    const countEl = document.getElementById('voiceCount');
    if (!container) return;

    const list = MediaData.getVoices();
    if (countEl) countEl.textContent = list.length + ' فایل صوتی';

    if (!list.length) {
      container.innerHTML = createEmptyState(
        'هنوز ویسی اینجا نیست 🥹',
        'اولین صدات رو بعداً ضبط کن.'
      );
      return;
    }

    container.innerHTML = list.map(v => `
      <article class="voice-card" data-id="${v.id}" id="voice-${v.id}">
        <div class="voice-top">
          <button class="voice-play-btn" data-id="${v.id}" data-src="${v.src}" aria-label="پخش ${v.title}">
            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          </button>
          <div class="voice-meta">
            <div class="voice-title">${v.title}</div>
            <div class="voice-date">${v.date}</div>
          </div>
          <span class="voice-duration">${v.duration}</span>
        </div>
        <div class="voice-progress-wrap">
          <div class="voice-progress" data-id="${v.id}">
            <div class="voice-progress-bar" id="bar-${v.id}"></div>
          </div>
        </div>
      </article>
    `).join('');

    container.querySelectorAll('.voice-play-btn').forEach(btn => {
      btn.addEventListener('click', () => toggleVoice(btn));
    });

    container.querySelectorAll('.voice-progress').forEach(bar => {
      bar.addEventListener('click', e => {
        if (!currentAudio || currentVoiceId !== bar.dataset.id) return;
        const rect = bar.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        // RTL: invert
        const rtlRatio = 1 - ratio;
        currentAudio.currentTime = rtlRatio * currentAudio.duration;
      });
    });
  }

  function toggleVoice(btn) {
    const id = btn.dataset.id;
    const src = btn.dataset.src;

    if (currentVoiceId === id && currentAudio) {
      if (currentAudio.paused) {
        currentAudio.play().catch(() => {});
        updateVoiceUI(id, true);
      } else {
        currentAudio.pause();
        updateVoiceUI(id, false);
      }
      return;
    }

    // Stop previous
    if (currentAudio) {
      currentAudio.pause();
      updateVoiceUI(null);
    }

    currentAudio = new Audio(src);
    currentVoiceId = id;

    currentAudio.addEventListener('timeupdate', () => {
      if (!currentAudio || currentVoiceId !== id) return;
      const pct = (currentAudio.currentTime / (currentAudio.duration || 1)) * 100;
      const bar = document.getElementById('bar-' + id);
      if (bar) bar.style.width = pct + '%';
    });

    currentAudio.addEventListener('ended', () => {
      updateVoiceUI(null);
      currentAudio = null;
      currentVoiceId = null;
    });

    currentAudio.addEventListener('error', () => {
      updateVoiceUI(null);
      currentAudio = null;
      currentVoiceId = null;
      // soft fail – no crash
    });

    currentAudio.play().catch(() => {
      // missing file or autoplay policy
      updateVoiceUI(null);
    });
    updateVoiceUI(id, true);
  }

  function updateVoiceUI(activeId, isPlaying = false) {
    document.querySelectorAll('.voice-card').forEach(card => {
      const id = card.dataset.id;
      const playIcon = card.querySelector('.icon-play');
      const pauseIcon = card.querySelector('.icon-pause');
      const isActive = id === activeId && isPlaying;

      card.classList.toggle('playing', isActive);
      if (playIcon) playIcon.style.display = isActive ? 'none' : 'block';
      if (pauseIcon) pauseIcon.style.display = isActive ? 'block' : 'none';

      if (!isActive && id !== activeId) {
        const bar = document.getElementById('bar-' + id);
        if (bar) bar.style.width = '0%';
      }
    });
  }

  // ----- Texts -----
  function renderTexts() {
    const container = document.getElementById('textList');
    const countEl = document.getElementById('textCount');
    if (!container) return;

    const list = MediaData.getTexts();
    if (countEl) countEl.textContent = list.length + ' نوشته';

    if (!list.length) {
      container.innerHTML = createEmptyState(
        'هنوز نوشته‌ای اینجا نیست 🥹',
        'اولین حرفت رو بعداً بنویس.'
      );
      return;
    }

    container.innerHTML = list.map((t, i) => `
      <article class="text-card" data-index="${i}" role="button" tabindex="0" aria-label="${t.title}">
        <div class="text-card-title">${t.title}</div>
        <div class="text-card-preview">${t.body.slice(0, 90)}${t.body.length > 90 ? '...' : ''}</div>
        <div class="text-card-date">${t.date}</div>
      </article>
    `).join('');

    container.querySelectorAll('.text-card').forEach(card => {
      card.addEventListener('click', () => {
        openText(list[parseInt(card.dataset.index, 10)]);
      });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openText(list[parseInt(card.dataset.index, 10)]);
        }
      });
    });
  }

  function openText(item) {
    if (!textModal) return;
    if (textModalTitle) textModalTitle.textContent = item.title;
    if (textModalDate) textModalDate.textContent = item.date;
    if (textModalBody) textModalBody.textContent = item.body;
    textModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeTextModal() {
    textModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  textModalClose?.addEventListener('click', closeTextModal);
  textModal?.addEventListener('click', e => {
    if (e.target === textModal) closeTextModal();
  });

  // ----- Global keyboard -----
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (lightbox?.classList.contains('active')) closeLightbox();
      else if (videoModal?.classList.contains('active')) closeVideoModal();
      else if (textModal?.classList.contains('active')) closeTextModal();
    }
    if (lightbox?.classList.contains('active')) {
      if (e.key === 'ArrowRight') navLightbox(-1); // RTL: right = prev
      if (e.key === 'ArrowLeft') navLightbox(1);
    }
  });

  // ----- Counts on home -----
  function updateHomeCounts() {
    const counts = MediaData.getCounts();
    const map = {
      videos: counts.videos + ' ویدیو',
      photos: counts.photos + ' عکس',
      voices: counts.voices + ' فایل صوتی',
      texts: counts.texts + ' نوشته'
    };
    document.querySelectorAll('.cat-count').forEach(el => {
      const sec = el.closest('.cat-card')?.dataset.section;
      if (sec && map[sec]) el.textContent = map[sec];
    });
  }

  // ----- Init -----
  function init() {
    updateHomeCounts();
    renderVideos();
    renderPhotos();
    renderVoices();
    renderTexts();

    // Restore last section or start at home
    const last = (typeof MimiStorage !== 'undefined' && MimiStorage.getLastSection()) || 'home';
    // Always land on home for the "entered a new room" feeling, unless user prefers last
    showSection('home');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
