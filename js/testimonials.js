/* ============================================
   Testimonials Carousel
   ============================================ */

const Testimonials = {
  init() {
    this.carousel = document.querySelector('.testimonials__carousel');
    if (!this.carousel) return;

    this.slides = this.carousel.querySelectorAll('.testimonial');
    this.dots = document.querySelectorAll('.testimonials__dot');
    this.prevBtn = document.querySelector('.testimonials__prev');
    this.nextBtn = document.querySelector('.testimonials__next');
    this.currentIndex = 0;
    this.autoplayInterval = null;
    this.autoplayDelay = 5000;

    this.setupControls();
    this.startAutoplay();
    this.showSlide(0);
  },

  setupControls() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        this.restartAutoplay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        this.restartAutoplay();
      });
    }

    this.dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        this.showSlide(i);
        this.restartAutoplay();
      });
    });

    // Pause on hover
    this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
    this.carousel.addEventListener('mouseleave', () => this.startAutoplay());

    // Touch support
    let touchStartX = 0;
    this.carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      this.stopAutoplay();
    }, { passive: true });

    this.carousel.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.next() : this.prev();
      }
      this.startAutoplay();
    }, { passive: true });
  },

  showSlide(index) {
    this.slides.forEach((slide, i) => {
      slide.classList.remove('testimonial--active');
      if (this.dots[i]) this.dots[i].classList.remove('active');
    });

    this.currentIndex = index;
    this.slides[index].classList.add('testimonial--active');
    if (this.dots[index]) this.dots[index].classList.add('active');
  },

  next() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.showSlide(nextIndex);
  },

  prev() {
    const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.showSlide(prevIndex);
  },

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
  },

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  },

  restartAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
};

// Testimonials is available globally
