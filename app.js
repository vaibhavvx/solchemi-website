/**
 * SOLCHEMI (सोल्केमी) - CAFÉ & RESTAURANT
 * Shahpur Jat, New Delhi
 * Interactive JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initSignatureDishesCarousel();
  initMenuFilter();
  initGalleryLightbox();
  initReservationForm();
  initMenuDriveModal();
  initAmbientSound();
});

/* --------------------------------------------------------------------------
   1. Sticky Header & Active Link Highlights
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link, .mobile-nav-link');

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Tracking
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !mobileNav.classList.contains('open');
    menuToggle.classList.toggle('is-active', shouldOpen);
    mobileNav.classList.toggle('open', shouldOpen);
    mobileBackdrop.classList.toggle('open', shouldOpen);
    menuToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  menuToggle.addEventListener('click', () => toggleMenu());
  mobileBackdrop.addEventListener('click', () => toggleMenu(false));

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   3. Signature Dishes Carousel (Drag & Touch Swipe + Arrow Controls)
   -------------------------------------------------------------------------- */
function initSignatureDishesCarousel() {
  const wrapper = document.getElementById('dishesTrackWrapper');
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');

  if (!wrapper) return;

  const scrollAmount = 370;

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // Mouse Drag to Scroll
  let isDown = false;
  let startX;
  let scrollLeft;

  wrapper.addEventListener('mousedown', (e) => {
    isDown = true;
    wrapper.classList.add('is-dragging');
    startX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
  });

  wrapper.addEventListener('mouseleave', () => {
    isDown = false;
    wrapper.classList.remove('is-dragging');
  });

  wrapper.addEventListener('mouseup', () => {
    isDown = false;
    wrapper.classList.remove('is-dragging');
  });

  wrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - startX) * 1.5;
    wrapper.scrollLeft = scrollLeft - walk;
  });
}

/* --------------------------------------------------------------------------
   4. Menu Filter Categories
   -------------------------------------------------------------------------- */
function initMenuFilter() {
  const tabBtns = document.querySelectorAll('.menu-tab-btn');
  const items = document.querySelectorAll('.menu-item-card');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const targetCategory = btn.getAttribute('data-category');

      items.forEach((item) => {
        const itemCat = item.getAttribute('data-cat');
        if (targetCategory === 'all' || itemCat === targetCategory) {
          item.style.display = 'flex';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease';
            item.style.opacity = '1';
          }, 20);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Instagram-Style Gallery & Lightbox Modal
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const items = document.querySelectorAll('.masonry-item');
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');

  let activeIndex = 0;
  let visibleItems = Array.from(items);

  // Gallery Filter
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      visibleItems = [];

      items.forEach((item) => {
        const group = item.getAttribute('data-group');
        if (filter === 'all' || group === filter) {
          item.style.display = 'block';
          visibleItems.push(item);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Open
  const openLightbox = (index) => {
    if (visibleItems.length === 0) return;
    activeIndex = (index + visibleItems.length) % visibleItems.length;
    const currentItem = visibleItems[activeIndex];
    const img = currentItem.querySelector('img');
    const caption = currentItem.getAttribute('data-caption') || img.alt;

    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalCaption.textContent = caption;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const idx = visibleItems.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => openLightbox(activeIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => openLightbox(activeIndex + 1));

  // Close on backdrop click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(activeIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(activeIndex + 1);
  });
}

/* --------------------------------------------------------------------------
   6. Table Reservation Form
   -------------------------------------------------------------------------- */
function initReservationForm() {
  const form = document.getElementById('reservationForm');
  const dateInput = document.getElementById('resDate');
  const feedback = document.getElementById('reservationFeedback');
  const phoneSpan = document.getElementById('feedbackPhone');
  const refSpan = document.getElementById('feedbackRef');

  if (dateInput) {
    // Set min date to today's date in YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('resName').value.trim();
    const phone = document.getElementById('resPhone').value.trim();
    const date = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;
    const guests = document.getElementById('resGuests').value;

    if (!name || !phone || !date || !time || !guests) {
      showToast('Please complete all required reservation fields.');
      return;
    }

    // Generate reference ID: e.g. SOL-4921
    const randomRef = 'SOL-' + Math.floor(1000 + Math.random() * 9000);

    phoneSpan.textContent = phone;
    refSpan.textContent = randomRef;

    // Display feedback notice
    feedback.style.display = 'block';
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    showToast('Reservation request received. Our team will contact you to confirm.');

    // Reset fields except date
    form.reset();
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
  });
}

/* --------------------------------------------------------------------------
   7. Full Menu Google Drive Modal
   -------------------------------------------------------------------------- */
function initMenuDriveModal() {
  const modal = document.getElementById('menuDriveModal');
  const openBtn = document.getElementById('openMenuDriveBtn');
  const closeBtn = document.getElementById('closeMenuDriveModalBtn');
  const dismissBtn = document.getElementById('dismissMenuDriveBtn');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   8. Ambient Soundscape (Synthesized using Web Audio API)
   -------------------------------------------------------------------------- */
function initAmbientSound() {
  const soundBtn = document.getElementById('ambientSoundBtn');
  if (!soundBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let noiseNode = null;
  let filterNode = null;
  let gainNode = null;
  let timerInterval = null;

  const startSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Synthesize soft vinyl crackle / cafe room murmur
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // Pink / brown filtered noise
        output[i] = (Math.random() * 2 - 1) * 0.04;
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      // Lowpass filter for warm, cozy café hum
      filterNode = audioCtx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(320, audioCtx.currentTime);

      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);

      noiseNode.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      noiseNode.start(0);

      // Subtle warm musical chime every 6-8 seconds
      const playWarmNote = () => {
        if (!isPlaying || !audioCtx) return;
        const notes = [261.63, 293.66, 329.63, 392.00, 440.00]; // Pentatonic C
        const freq = notes[Math.floor(Math.random() * notes.length)];

        const osc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        noteGain.gain.setValueAtTime(0, audioCtx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 1.2);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 4.5);

        osc.connect(noteGain);
        noteGain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 4.6);
      };

      timerInterval = setInterval(playWarmNote, 6000);

      isPlaying = true;
      soundBtn.classList.add('playing');
      soundBtn.setAttribute('title', 'Pause gentle café ambiance');
      showToast('Playing gentle café acoustics (vinyl crackle & warm tones)');
    } catch (err) {
      console.warn('Web Audio error:', err);
    }
  };

  const stopSound = () => {
    if (audioCtx) {
      audioCtx.close();
      audioCtx = null;
    }
    if (timerInterval) clearInterval(timerInterval);
    isPlaying = false;
    soundBtn.classList.remove('playing');
    soundBtn.setAttribute('title', 'Play gentle café ambiance');
    showToast('Café ambiance paused');
  };

  soundBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startSound();
    } else {
      stopSound();
    }
  });
}

/* --------------------------------------------------------------------------
   Toast Utility
   -------------------------------------------------------------------------- */
function showToast(message) {
  const toast = document.getElementById('toastNotice');
  const msgEl = document.getElementById('toastMessage');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
