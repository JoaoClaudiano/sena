/* ===== SLIDESHOWS — MURAL E HERO ===== */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── MURAL SLIDESHOW ─── */
  var muralSlides  = document.querySelectorAll('.mural-slide');
  var muralTimer   = null;
  var muralPaused  = reducedMotion;
  var muralCurrent = 0;

  function muralShowSlide(n) {
    muralSlides[muralCurrent].classList.remove('mural-active');
    muralCurrent = (n + muralSlides.length) % muralSlides.length;
    muralSlides[muralCurrent].classList.add('mural-active');
  }

  function muralStartAuto() {
    clearInterval(muralTimer);
    muralTimer = setInterval(function () {
      if (!muralPaused) muralShowSlide(muralCurrent + 1);
    }, 6000);
  }

  if (muralSlides.length) {
    var prevBtn  = document.getElementById('muralPrevBtn');
    var nextBtn  = document.getElementById('muralNextBtn');
    var pauseBtn = document.getElementById('muralPauseBtn');

    if (prevBtn) prevBtn.addEventListener('click', function () { muralShowSlide(muralCurrent - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { muralShowSlide(muralCurrent + 1); });

    if (pauseBtn) {
      if (reducedMotion) {
        pauseBtn.setAttribute('aria-pressed', 'true');
        pauseBtn.setAttribute('aria-label', 'Retomar slideshow');
        pauseBtn.textContent = '▶';
      }
      pauseBtn.addEventListener('click', function () {
        muralPaused = !muralPaused;
        pauseBtn.setAttribute('aria-pressed', muralPaused ? 'true' : 'false');
        pauseBtn.setAttribute('aria-label', muralPaused ? 'Retomar slideshow' : 'Pausar slideshow');
        pauseBtn.textContent = muralPaused ? '▶' : '⏸';
      });
    }

    muralStartAuto();
  }

  /* ─── HERO SLIDESHOW ─── */
  var heroSlides       = document.querySelectorAll('.hero-section .slide');
  var heroDots         = document.querySelectorAll('.slide-dot');
  var heroGrain        = document.getElementById('heroGrain');
  var heroTimer        = null;
  var heroPaused       = reducedMotion;
  var heroCurrent      = 0;
  var heroTransitioning = false;

  function heroShowSlide(n) {
    if (heroTransitioning) return;
    var next = (n + heroSlides.length) % heroSlides.length;
    if (next === heroCurrent) return;

    heroTransitioning = true;
    if (heroGrain) heroGrain.classList.add('active');

    setTimeout(function () {
      heroSlides[heroCurrent].classList.remove('active');
      if (heroDots[heroCurrent]) heroDots[heroCurrent].classList.remove('active');
      heroCurrent = next;
      heroSlides[heroCurrent].classList.add('active');
      if (heroDots[heroCurrent]) heroDots[heroCurrent].classList.add('active');
    }, 180);

    setTimeout(function () {
      if (heroGrain) heroGrain.classList.remove('active');
      heroTransitioning = false;
    }, 420);
  }

  function heroStartAuto() {
    clearInterval(heroTimer);
    heroTimer = setInterval(function () {
      if (!heroPaused) heroShowSlide(heroCurrent + 1);
    }, 5500);
  }

  if (heroSlides.length) {
    heroDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { heroShowSlide(i); });
    });

    /* Pause on hover / focus */
    var heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', function () { heroPaused = true; });
      heroSection.addEventListener('mouseleave', function () { if (!reducedMotion) heroPaused = false; });
      heroSection.addEventListener('focusin',    function () { heroPaused = true; });
      heroSection.addEventListener('focusout',   function () { if (!reducedMotion) heroPaused = false; });
    }

    heroStartAuto();
  }

  /* ─── PAUSAR QUANDO A ABA PERDE VISIBILIDADE ─── */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (muralTimer) { clearInterval(muralTimer); muralTimer = null; }
      if (heroTimer)  { clearInterval(heroTimer);  heroTimer  = null; }
    } else {
      if (muralSlides.length) muralStartAuto();
      if (heroSlides.length)  heroStartAuto();
    }
  });
})();
