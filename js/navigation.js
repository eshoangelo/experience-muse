/* ============================================
   Navigation: Sticky Nav, Hamburger, Active Page
   ============================================ */

const Navigation = {
  init() {
    this.nav = document.getElementById('nav');
    this.hamburger = document.getElementById('hamburger');
    this.mobileMenu = document.getElementById('mobileMenu');
    this.body = document.body;

    if (!this.nav) return;

    this.setupStickyNav();
    this.setupHamburger();
    this.setActivePage();
  },

  setupStickyNav() {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 50) {
        this.nav.classList.add('nav--scrolled');
      } else {
        this.nav.classList.remove('nav--scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  },

  setupHamburger() {
    if (!this.hamburger || !this.mobileMenu) return;

    this.hamburger.addEventListener('click', () => this.toggleMenu());

    // Close on link click
    this.mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileMenu.classList.contains('active')) {
        this.closeMenu();
      }
    });

    // Close on overlay click (clicking the menu background itself)
    this.mobileMenu.addEventListener('click', (e) => {
      if (e.target === this.mobileMenu) {
        this.closeMenu();
      }
    });
  },

  toggleMenu() {
    const isOpen = this.mobileMenu.classList.contains('active');
    if (isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  },

  openMenu() {
    this.hamburger.classList.add('active');
    this.hamburger.setAttribute('aria-expanded', 'true');
    this.mobileMenu.classList.add('active');
    this.body.style.overflow = 'hidden';
  },

  closeMenu() {
    this.hamburger.classList.remove('active');
    this.hamburger.setAttribute('aria-expanded', 'false');
    this.mobileMenu.classList.remove('active');
    this.body.style.overflow = '';
  },

  setActivePage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === page || (page === '' && href === 'index.html') || (page === '/' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
};

// Navigation is available globally
