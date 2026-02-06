/* ============================================
   Menu Filter Module
   ============================================ */

const MenuFilter = {
  // DOM references
  buttons: null,
  items: null,
  categories: null,
  activeFilter: 'all',

  init() {
    this.buttons = document.querySelectorAll('.filter-btn');
    this.items = document.querySelectorAll('.menu-item');
    this.categories = document.querySelectorAll('.menu-category');

    if (!this.buttons.length || !this.items.length) return;

    this.bindEvents();
    this.checkHash();
  },

  bindEvents() {
    // Filter button clicks
    this.buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        this.setActiveButton(btn);
        this.filterItems(filter);
        this.updateHash(filter);
      });
    });

    // Listen for hash changes (browser back/forward)
    window.addEventListener('hashchange', () => {
      this.checkHash();
    });
  },

  /**
   * Check the URL hash on load and activate that filter
   */
  checkHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const matchingBtn = document.querySelector(`.filter-btn[data-filter="${hash}"]`);
      if (matchingBtn) {
        this.setActiveButton(matchingBtn);
        this.filterItems(hash);
        return;
      }
    }
    // Default: show all
    this.filterItems('all');
  },

  /**
   * Update the active button styling
   */
  setActiveButton(activeBtn) {
    this.buttons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-selected', 'true');
  },

  /**
   * Filter menu items by category with animated transitions
   */
  filterItems(filter) {
    this.activeFilter = filter;
    const isAll = filter === 'all';

    // Phase 1: Mark items as hiding
    this.items.forEach(item => {
      const category = item.dataset.category;
      const shouldShow = isAll || category === filter;

      if (!shouldShow) {
        item.classList.add('hiding');
        item.classList.remove('showing');
      }
    });

    // Phase 2: After transition, hide items and show matching ones
    const transitionDuration = 300;

    setTimeout(() => {
      this.items.forEach(item => {
        const category = item.dataset.category;
        const shouldShow = isAll || category === filter;

        if (shouldShow) {
          item.classList.remove('hiding', 'hidden');
          item.classList.add('showing');
        } else {
          item.classList.add('hidden');
          item.classList.remove('hiding', 'showing');
        }
      });

      // Show/hide category sections based on visible items
      this.categories.forEach(cat => {
        const visibleItems = cat.querySelectorAll('.menu-item:not(.hidden)');
        if (visibleItems.length === 0) {
          cat.classList.add('hiding');
          setTimeout(() => {
            cat.classList.add('hidden');
            cat.classList.remove('hiding');
          }, transitionDuration);
        } else {
          cat.classList.remove('hidden', 'hiding');
        }
      });

      // Remove showing class after animation completes
      setTimeout(() => {
        this.items.forEach(item => {
          item.classList.remove('showing');
        });
      }, 500);
    }, transitionDuration);
  },

  /**
   * Update the URL hash without triggering a scroll
   */
  updateHash(filter) {
    if (filter === 'all') {
      // Remove hash for "all"
      history.replaceState(null, '', window.location.pathname);
    } else {
      history.replaceState(null, '', `#${filter}`);
    }
  }
};

// MenuFilter is available globally
