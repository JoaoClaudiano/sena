/* ===== TRANSIÇÕES DE PÁGINA ===== */
(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Skip JS fallback entirely when the browser supports the native
   * View Transitions API — in that case the CSS @view-transition rule
   * handles cross-document animations automatically, and intercepting
   * navigation here would cause "AbortError: Transition was skipped". */
  var hasNativeTransitions = 'startViewTransition' in document;

  /* Helper shared by both pageswap and pagereveal handlers. */
  function suppressAbort(err) {
    if (err instanceof DOMException && err.name === 'AbortError') return;
    throw err;
  }

  /* ─── Outgoing-page handler (fires on the OLD document, before unload) ───
   * pageswap fires just before navigation, while transitions.js is already
   * loaded.  Attaching .catch() here prevents the ViewTransition promises
   * from the outgoing side from becoming unhandled rejections. */
  window.addEventListener('pageswap', function (e) {
    if (!e.viewTransition) return;
    e.viewTransition.ready.catch(suppressAbort);
    e.viewTransition.finished.catch(suppressAbort);
  });

  /* ─── Incoming-page handler (fires on the NEW document, before first paint) ───
   * pagereveal gives us the ViewTransition for the destination page.
   * Attaching .catch() here is the canonical way to suppress
   * "AbortError: Transition was skipped" on the incoming side.
   *
   * TIMING: Chrome fires pagereveal during the "reveal" step, which is
   * scheduled BEFORE deferred scripts execute.  This handler may therefore
   * miss the very first pagereveal event on each page.  For that reason
   * every HTML page also contains an early inline <script> that registers
   * identical unhandledrejection and pagereveal handlers synchronously
   * during HTML parsing.  This deferred copy provides redundant coverage
   * for any subsequent pagereveal (BFCache restore) and for pages that
   * might not yet have the inline script (e.g., future pages added by hand). */
  window.addEventListener('pagereveal', function (e) {
    if (!e.viewTransition) return;
    /* Mark the document so CSS can disable the body animation that would
     * otherwise compete with ::view-transition-new(root). */
    document.documentElement.classList.add('vt-active');
    e.viewTransition.ready.catch(suppressAbort);
    e.viewTransition.finished.catch(suppressAbort);
  });

  /* Safety-net: suppress any AbortError that surfaces as an unhandled
   * rejection on the incoming page (covers rapid navigation and any timing
   * edge where pagereveal fires before this deferred script runs). */
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
     * This JS fallback runs only on browsers without the native
     * View Transitions API (startViewTransition unavailable),
     * such as older Firefox and Safari releases. */
    document.body.classList.add('page-exit');
    setTimeout(function () {
      window.location.href = href;
    }, 260);
  });
})();
