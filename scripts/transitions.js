/* ===== TRANSIÇÕES DE PÁGINA ===== */
(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Skip JS fallback entirely when the browser supports the native
   * View Transitions API — in that case the CSS @view-transition rule
   * handles cross-document animations automatically, and intercepting
   * navigation here would cause "AbortError: Transition was skipped". */
  var hasNativeTransitions = 'startViewTransition' in document;

  /* Suppress the unhandled-rejection noise that Chrome emits when a
   * cross-document view transition (triggered by @view-transition
   * { navigation: auto }) is interrupted by rapid navigation.
   * Only needed in browsers that support the native View Transitions API,
   * since older browsers never trigger this error. */
  if (hasNativeTransitions) {
    window.addEventListener('unhandledrejection', function (e) {
      if (
        e.reason instanceof DOMException &&
        e.reason.name === 'AbortError' &&
        e.reason.message === 'Transition was skipped'
      ) {
        e.preventDefault();
      }
    });
  }

  /* ─── Intercept internal link clicks ─── */
  document.addEventListener('click', function (e) {
    if (reduced) return;
    if (hasNativeTransitions) return;

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
     * This JS fallback runs only on browsers that do not support the
     * native View Transitions API (startViewTransition unavailable),
     * such as older Firefox and Safari releases. */
    document.body.classList.add('page-exit');
    setTimeout(function () {
      window.location.href = href;
    }, 260);
  });
})();
