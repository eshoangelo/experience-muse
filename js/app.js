/* ============================================
   App: Initialize All Modules
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Core modules (every page)
  Navigation.init();
  ScrollAnimations.init();

  // Page-specific modules
  const page = document.body.dataset.page;

  if (page === 'home' && typeof Testimonials !== 'undefined') {
    Testimonials.init();
  }

  if (page === 'menu' && typeof MenuFilter !== 'undefined') {
    MenuFilter.init();
  }

  if (page === 'gallery' && typeof Lightbox !== 'undefined') {
    Lightbox.init();
  }

  if (page === 'contact' && typeof FormValidation !== 'undefined') {
    FormValidation.init();
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Inject current year
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
