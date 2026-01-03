/* =========================
   SHARED UI EFFECTS
   - Aurora
   - Stars
   - Theme Toggle
   - Lazy Load Images
========================= */

/* =========================
   SAFE DOM HELPER
========================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* =========================
   AURORA
========================= */
function initAurora() {
  const aurora = $('.aurora');
  if (!aurora) return;

  aurora.innerHTML = '';
  ['rgba(0,255,200,0.4)', 'rgba(0,150,255,0.3)'].forEach((c, i) => {
    const span = document.createElement('span');
    span.style.background = `radial-gradient(circle, ${c}, transparent 70%)`;
    span.style.animationDuration = `${12 + i * 6}s`;
    aurora.appendChild(span);
  });
}

/* =========================
   STARS
========================= */
function initStars(count = 80) {
  const starsContainer = $('.stars');
  if (!starsContainer) return;

  starsContainer.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * window.innerWidth + 'px';
    star.style.top = Math.random() * window.innerHeight + 'px';
    starsContainer.appendChild(star);
  }
}

/* =========================
   THEME TOGGLE
========================= */
function initThemeToggle() {
  const toggle = $('#modeToggle');

  // restore theme
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    if (toggle) toggle.checked = true;
  }

  if (!toggle) return;

  toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark', toggle.checked);
    localStorage.setItem('theme', toggle.checked ? 'dark' : 'light');
  });
}

/* =========================
   LAZY LOAD IMAGES
========================= */
function initLazyLoad() {
  const lazyImages = $$("img.lazy-img");

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          obs.unobserve(img);
        }
      });
    }, {
      rootMargin: "100px"
    });

    lazyImages.forEach(img => observer.observe(img));
  } else {
    // fallback: load all images immediately
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    });
  }
}

/* =========================
   INIT SHARED
========================= */
document.addEventListener('DOMContentLoaded', () => {
  initAurora();
  initStars();
  initThemeToggle();
  initLazyLoad();
});