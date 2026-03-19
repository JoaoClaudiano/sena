/* ===== MODO NOTURNO ===== */
(function () {
  var toggle = document.getElementById('darkToggle');
  var root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (toggle) toggle.setAttribute('aria-pressed', 'true');
      if (toggle) toggle.textContent = '☀️';
    } else {
      root.removeAttribute('data-theme');
      if (toggle) toggle.setAttribute('aria-pressed', 'false');
      if (toggle) toggle.textContent = '🌙';
    }
  }

  var saved = localStorage.getItem('theme') ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(saved);

  if (toggle) {
    toggle.addEventListener('click', function () {
      var isDark = root.getAttribute('data-theme') === 'dark';
      var next = isDark ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  }
})();

/* ===== BARRA DE PROGRESSO DE LEITURA ===== */
(function () {
  var bar = document.getElementById('readingProgress');
  if (!bar) return;

  function updateProgress() {
    var docEl = document.documentElement;
    var scrolled = window.scrollY || docEl.scrollTop;
    var total = docEl.scrollHeight - docEl.clientHeight;
    var pct = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

/* ===== CONTROLES DE TAMANHO DE FONTE ===== */
(function () {
  var increaseBtn = document.getElementById('fontIncrease');
  var decreaseBtn = document.getElementById('fontDecrease');
  var resetBtn    = document.getElementById('fontReset');
  var content     = document.querySelector('.book-content');

  if (!content) return;

  var MIN_SIZE = 0.8;
  var MAX_SIZE = 1.8;
  var DEFAULT_SIZE = 1.1;
  var STEP = 0.1;

  var currentSize = parseFloat(localStorage.getItem('fontSize')) || DEFAULT_SIZE;
  content.style.fontSize = currentSize + 'rem';

  function setSize(size) {
    currentSize = Math.round(size * 10) / 10;
    content.style.fontSize = currentSize + 'rem';
    localStorage.setItem('fontSize', currentSize);
  }

  if (increaseBtn) {
    increaseBtn.addEventListener('click', function () {
      if (currentSize < MAX_SIZE) setSize(currentSize + STEP);
    });
  }

  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', function () {
      if (currentSize > MIN_SIZE) setSize(currentSize - STEP);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      setSize(DEFAULT_SIZE);
    });
  }
})();

/* ===== ANIMAÇÕES AO ROLAR (FADE-IN) ===== */
(function () {
  var elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('animated'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(function (el) { observer.observe(el); });
})();
