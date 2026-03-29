/* ===== UI — ANIMAÇÕES, PROGRESSO, FONTE, VOLTAR AO TOPO, FUNDO ===== */
(function () {
  'use strict';

  /* ─── BARRA DE PROGRESSO DE LEITURA ─── */
  var progressBar = document.getElementById('readingProgress');
  if (progressBar) {
    function updateProgress() {
      var docEl   = document.documentElement;
      var scrolled = window.scrollY || docEl.scrollTop;
      var total    = docEl.scrollHeight - docEl.clientHeight;
      progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ─── CONTROLES DE TAMANHO DE FONTE ─── */
  var increaseBtn = document.getElementById('fontIncrease');
  var decreaseBtn = document.getElementById('fontDecrease');
  var resetBtn    = document.getElementById('fontReset');
  var content     = document.querySelector('.book-content');

  if (content) {
    var MIN_SIZE     = 0.8;
    var MAX_SIZE     = 1.8;
    var DEFAULT_SIZE = 1.1;
    var STEP         = 0.1;

    var currentSize = parseFloat(localStorage.getItem('fontSize')) || DEFAULT_SIZE;
    content.style.fontSize = currentSize + 'rem';

    function setSize(size) {
      currentSize = Math.round(size * 10) / 10;
      content.style.fontSize = currentSize + 'rem';
      localStorage.setItem('fontSize', currentSize);
    }

    if (increaseBtn) increaseBtn.addEventListener('click', function () { if (currentSize < MAX_SIZE) setSize(currentSize + STEP); });
    if (decreaseBtn) decreaseBtn.addEventListener('click', function () { if (currentSize > MIN_SIZE) setSize(currentSize - STEP); });
    if (resetBtn)    resetBtn.addEventListener('click',    function () { setSize(DEFAULT_SIZE); });
  }

  /* ─── ANIMAÇÕES AO ROLAR (FADE-IN) ─── */
  var animEls = document.querySelectorAll('[data-animate]');
  if (animEls.length) {
    if (!('IntersectionObserver' in window)) {
      animEls.forEach(function (el) { el.classList.add('animated'); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      animEls.forEach(function (el) { observer.observe(el); });
    }
  }

  /* ─── FUNDO DA PÁGINA — PARALLAX COM GRAIN ─── */
  var bg1   = document.querySelector('.page-bg-img.bg-1');
  var bg2   = document.querySelector('.page-bg-img.bg-2');
  var grain = document.getElementById('page-grain');

  if (bg1 && bg2) {
    var currentBg    = 1;
    var transitioning = false;

    function switchToBg(n) {
      if (transitioning || n === currentBg) return;
      transitioning = true;
      if (grain) grain.classList.add('active');
      setTimeout(function () {
        if (n === 2) { bg1.classList.remove('active'); bg2.classList.add('active'); }
        else         { bg2.classList.remove('active'); bg1.classList.add('active'); }
        currentBg = n;
      }, 180);
      setTimeout(function () {
        if (grain) grain.classList.remove('active');
        transitioning = false;
      }, 420);
    }

    window.addEventListener('scroll', function () {
      var scrolled    = window.scrollY || document.documentElement.scrollTop;
      var totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      switchToBg(scrolled / totalHeight > 0.45 ? 2 : 1);
    }, { passive: true });
  }

  /* ─── BOTÃO VOLTAR AO TOPO ─── */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
