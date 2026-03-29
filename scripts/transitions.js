/* ===== TRANSIÇÕES DE PÁGINA ===== */
(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Skip JS fallback entirely when the browser supports the native
   * View Transitions API — in that case the CSS @view-transition rule
   * handles cross-document animations automatically, and intercepting
   * navigation here would cause "AbortError: Transition was skipped". */
  var hasNativeTransitions = 'startViewTransition' in document;

  /* ─── Outgoing-page handler (fires on the OLD document, before unload) ───
   * The pageswap event fires just before the page is navigated away from.
   * At this point transitions.js is already loaded, so we can safely attach
   * .catch() handlers to the ViewTransition promises and prevent any
   * "AbortError: Transition was skipped" from becoming an unhandled rejection
   * in the console when a cross-document transition is interrupted.
   * pageswap is available in Chrome 124+ (all browsers that support the
   * @view-transition { navigation: auto } MPA API, i.e. Chrome 126+). */
  window.addEventListener('pageswap', function (e) {
    if (!e.viewTransition) return;
    var vt = e.viewTransition;
    function suppressAbort(err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      throw err;
    }
    vt.ready.catch(suppressAbort);
    vt.finished.catch(suppressAbort);
  });

  /* Safety-net: also suppress any AbortError that surfaces as an unhandled
   * rejection on the incoming page (e.g., rapid back-navigation before the
   * deferred script on the previous page had a chance to register pageswap). */
  if (hasNativeTransitions) {
    window.addEventListener('unhandledrejection', function (e) {
      if (e.reason instanceof DOMException && e.reason.name === 'AbortError') {
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
