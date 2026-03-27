/* ===== TRANSIÇÕES DE PÁGINA ===== */
(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Intercept internal link clicks ─── */
  document.addEventListener('click', function (e) {
    if (reduced) return;

    var link = e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href) return;

    /* Skip: anchors, external, special protocols, target="_blank", download */
    if (
      href.charAt(0) === '#' ||
      href.indexOf('://') !== -1 ||
      href.indexOf('mailto:') === 0 ||
      href.indexOf('tel:') === 0 ||
      link.target === '_blank' ||
      link.hasAttribute('download') ||
      e.ctrlKey || e.metaKey || e.shiftKey || e.altKey
    ) return;

    e.preventDefault();

    /* Fade-out via CSS class → short delay → navigate.
     * Browsers that support @view-transition (Chrome 126+) handle the full
     * cross-page animation natively via CSS. This JS fallback ensures a smooth
     * exit animation on all other browsers. */
    document.body.classList.add('page-exit');
    setTimeout(function () {
      window.location.href = href;
    }, 260);
  });
})();
