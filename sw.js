/* ===================================================
   Service Worker — Santa Catarina de Sena
   Estratégias:
   • Cache First    → CSS, JS, fontes, ícones, manifesto
   • Stale-While-Revalidate → imagens de arte, páginas HTML
   =================================================== */

var CACHE_NAME   = 'catarina-v6';
var CACHE_STATIC = 'catarina-static-v6';

/* Base da URL do site (ex.: "/sena" no GitHub Pages) */
var BASE = self.registration.scope.replace(/\/$/, '');

/* Recursos pré-cacheados no install */
var PRE_CACHE = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/sobre.html',
  BASE + '/404.html',
  BASE + '/estilo/style.css',
  BASE + '/estilo/modules/_variables.css',
  BASE + '/estilo/modules/_base.css',
  BASE + '/estilo/modules/_layout.css',
  BASE + '/estilo/modules/_components.css',
  BASE + '/estilo/modules/_hero.css',
  BASE + '/estilo/modules/_mural.css',
  BASE + '/estilo/modules/_gallery.css',
  BASE + '/estilo/modules/_network.css',
  BASE + '/estilo/modules/_footer.css',
  BASE + '/estilo/modules/_oratorio.css',
  BASE + '/estilo/modules/_status.css',
  BASE + '/estilo/modules/_pages.css',
  BASE + '/estilo/modules/_animations.css',
  BASE + '/estilo/modules/_book.css',
  BASE + '/estilo/modules/_responsive.css',
  BASE + '/scripts/menu.js',
  BASE + '/scripts/transitions.js',
  BASE + '/scripts/theme.js',
  BASE + '/scripts/ui.js',
  BASE + '/scripts/content.js',
  BASE + '/scripts/slideshows.js',
  BASE + '/scripts/lightbox.js',
  BASE + '/scripts/sobre.js',
  BASE + '/scripts/dialogo.js',
  BASE + '/scripts/leitor.js',
  BASE + '/scripts/mapa-biografia.js',
  BASE + '/scripts/mapa-siena.js',
  BASE + '/scripts/mapa-do-site.js',
  BASE + '/scripts/supabase.js',
  BASE + '/site.webmanifest',
  BASE + '/icons/favicon.ico',
  BASE + '/icons/icon_48x48.png',
  BASE + '/icons/icon_128x128.png',
  BASE + '/icons/icon_512x512.png'
];

/* ── Install: pré-cache de recursos estáticos ── */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(function (cache) {
      return cache.addAll(PRE_CACHE);
    })
  );
  self.skipWaiting();
});

/* ── Activate: limpa caches antigos ── */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key !== CACHE_NAME && key !== CACHE_STATIC;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

/* ── Fetch: aplica a estratégia adequada ── */
self.addEventListener('fetch', function (event) {
  var url = new URL(event.request.url);

  /* Ignora requisições externas (CDNs, Supabase, Fonts) */
  if (url.origin !== self.location.origin) return;

  /* Ignora métodos não-GET */
  if (event.request.method !== 'GET') return;

  var pathname = url.pathname;

  /* ── Cache First: CSS, JS, fontes, ícones, manifesto ── */
  if (
    /\.(css|js|woff2?|ttf|otf|eot)$/i.test(pathname) ||
    /\/icons\//i.test(pathname) ||
    pathname.endsWith('site.webmanifest')
  ) {
    event.respondWith(cacheFirst(event.request, CACHE_STATIC));
    return;
  }

  /* ── Stale-While-Revalidate: imagens de arte e páginas HTML ── */
  if (
    /\.(jpe?g|png|gif|webp|svg|avif)$/i.test(pathname) ||
    /\.html?$/i.test(pathname) ||
    pathname === '/' ||
    pathname.endsWith('/')
  ) {
    event.respondWith(staleWhileRevalidate(event.request, CACHE_NAME));
    return;
  }

  /* ── Cache First para EPUB/PDF (conteúdo estático) ── */
  if (/\.(epub|pdf)$/i.test(pathname)) {
    event.respondWith(cacheFirst(event.request, CACHE_NAME));
    return;
  }

  /* Demais: Network First com fallback ao cache */
  event.respondWith(networkFirst(event.request, CACHE_NAME));
});

/* ────────────────────────────────────────────
   Estratégia: Cache First
   Retorna do cache se disponível; caso contrário
   busca na rede e armazena no cache.
   ──────────────────────────────────────────── */
function cacheFirst(request, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (cached) {
      if (cached) return cached;
      return fetch(request).then(function (response) {
        if (response && response.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      }).catch(function () {
        return cached || new Response('Recurso indisponível offline.', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    });
  });
}

/* ────────────────────────────────────────────
   Estratégia: Stale-While-Revalidate
   Retorna do cache imediatamente (se existir) e
   atualiza o cache em segundo plano com a rede.
   ──────────────────────────────────────────── */
function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (cached) {
      var networkFetch = fetch(request).then(function (response) {
        if (response && response.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      }).catch(function () {
        return null;
      });

      return cached || networkFetch;
    });
  });
}

/* ────────────────────────────────────────────
   Estratégia: Network First
   Tenta a rede; em caso de falha usa o cache.
   ──────────────────────────────────────────── */
function networkFirst(request, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return fetch(request).then(function (response) {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    }).catch(function () {
      return cache.match(request).then(function (cached) {
        return cached || new Response('Recurso indisponível offline.', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    });
  });
}
