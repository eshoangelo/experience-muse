/* ============================================
   Lightbox: Fullscreen Image Viewer
   ============================================ */

const Lightbox = {
  overlay: null,
  imageEl: null,
  closeBtn: null,
  prevBtn: null,
  nextBtn: null,
  counterEl: null,
  images: [],
  currentIndex: 0,
  touchStartX: 0,
  touchEndX: 0,

  init() {
    this.images = Array.from(document.querySelectorAll('.gallery-item img'));
    if (!this.images.length) return;

    this.buildDOM();
    this.bindEvents();
  },

  buildDOM() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'lightbox';
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-label', 'Image lightbox');

    // Image
    this.imageEl = document.createElement('img');
    this.imageEl.className = 'lightbox__image';
    this.imageEl.alt = '';

    // Close button
    this.closeBtn = document.createElement('button');
    this.closeBtn.className = 'lightbox__close';
    this.closeBtn.setAttribute('aria-label', 'Close lightbox');
    this.closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    // Previous button
    this.prevBtn = document.createElement('button');
    this.prevBtn.className = 'lightbox__prev';
    this.prevBtn.setAttribute('aria-label', 'Previous image');
    this.prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>';

    // Next button
    this.nextBtn = document.createElement('button');
    this.nextBtn.className = 'lightbox__next';
    this.nextBtn.setAttribute('aria-label', 'Next image');
    this.nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';

    // Counter
    this.counterEl = document.createElement('div');
    this.counterEl.className = 'lightbox__counter';

    // Assemble
    this.overlay.appendChild(this.imageEl);
    this.overlay.appendChild(this.closeBtn);
    this.overlay.appendChild(this.prevBtn);
    this.overlay.appendChild(this.nextBtn);
    this.overlay.appendChild(this.counterEl);

    document.body.appendChild(this.overlay);
  },

  bindEvents() {
    // Open on gallery item click
    this.images.forEach((img, index) => {
      const item = img.closest('.gallery-item');
      if (item) {
        item.addEventListener('click', () => this.open(index));
      }
    });

    // Close
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    // Navigate
    this.prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prev();
    });
    this.nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.next();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!this.overlay.classList.contains('active')) return;

      switch (e.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowLeft':
          this.prev();
          break;
        case 'ArrowRight':
          this.next();
          break;
      }
    });

    // Touch swipe
    this.overlay.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.overlay.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
  },

  open(index) {
    this.currentIndex = index;
    this.updateImage();
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.preloadAdjacent();
  },

  close() {
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  },

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
    this.preloadAdjacent();
  },

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImage();
    this.preloadAdjacent();
  },

  updateImage() {
    const img = this.images[this.currentIndex];

    // Fade out, swap, fade in
    this.imageEl.style.opacity = '0';
    this.imageEl.style.transform = 'scale(0.95)';

    setTimeout(() => {
      // Use a higher resolution version
      const src = img.src.replace('w=600', 'w=1200');
      this.imageEl.src = src;
      this.imageEl.alt = img.alt || '';

      this.imageEl.style.opacity = '1';
      this.imageEl.style.transform = 'scale(1)';
    }, 150);

    this.counterEl.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
  },

  preloadAdjacent() {
    const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    const nextIndex = (this.currentIndex + 1) % this.images.length;

    [prevIndex, nextIndex].forEach((idx) => {
      const preloadImg = new Image();
      preloadImg.src = this.images[idx].src.replace('w=600', 'w=1200');
    });
  },

  handleSwipe() {
    const threshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) < threshold) return;

    if (diff > 0) {
      // Swiped left - go next
      this.next();
    } else {
      // Swiped right - go prev
      this.prev();
    }
  }
};

// Lightbox is available globally
