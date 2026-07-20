(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Navigation
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Scroll progress
  const progress = document.querySelector('[data-progress]');
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Reveal-on-view, with immediate fallback
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px' });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('is-visible'));
  }

  // Cursor-reactive neon borders adapted from the supplied Glowing Effect concept.
  const glowCards = document.querySelectorAll('[data-glow-card]');
  glowCards.forEach((card) => {
    let frame = 0;
    card.addEventListener('pointermove', (event) => {
      if (reduceMotion.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const angle = Math.atan2(y - cy, x - cx) * 180 / Math.PI + 90;
        card.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
        card.style.setProperty('--glow-angle', `${angle}deg`);
        card.style.setProperty('--glow-opacity', '.92');
      });
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--glow-opacity', '.13');
    });
  });

  // Local contact form fallback. Netlify handles deployed HTML submissions.
  const form = document.querySelector('[data-contact-form]');
  if (form && (location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname))) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent(`Portfolio inquiry from ${data.get('name') || 'visitor'}`);
      const body = encodeURIComponent(
        `Name: ${data.get('name') || ''}\nEmail: ${data.get('email') || ''}\nCompany: ${data.get('company') || ''}\n\nRole or project:\n${data.get('message') || ''}`
      );
      location.href = `mailto:garzadanny0101@gmail.com?subject=${subject}&body=${body}`;
    });
  }
})();
