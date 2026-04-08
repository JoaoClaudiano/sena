/* ===== LEITOR EPUB — foliate-js (Range Request streaming) ===== */
import './foliate/view.js' // registers <foliate-view> custom element

(function () {
  'use strict'

  var params  = new URLSearchParams(window.location.search)
  var bookUrl = params.get('book')

  var titleEl      = document.getElementById('bookTitle')
  var breadcrumbEl = document.getElementById('breadcrumbTitle')
  var loadingEl    = document.getElementById('epubLoading')
  var prevBtn      = document.getElementById('epubPrev')
  var nextBtn      = document.getElementById('epubNext')
  var pageInfoEl   = document.getElementById('epubPageInfo')
  var tocBtn       = document.getElementById('epubToc')
  var tocPanel     = document.getElementById('epubTocPanel')
  var tocList      = document.getElementById('epubTocList')
  var downloadBtn  = document.getElementById('downloadEpubBtn')

  function titleFromUrl(url) {
    try {
      var name = decodeURIComponent(url).split('/').pop()
      name = name.replace(/\.epub$/i, '').replace(/\.$/, '')
      name = name.replace(/\s*\(Santa Catarina de Sena\)\s*/gi, '')
      return name.trim() || 'Livro'
    } catch (_) { return 'Livro' }
  }

  /* Show a static HTML error string (no user-supplied values) */
  function showError(html) {
    if (!loadingEl) return
    var p = document.createElement('p')
    p.className = 'epub-error'
    p.innerHTML = html
    loadingEl.textContent = ''
    loadingEl.appendChild(p)
  }

  /* Show an error that includes a download link built via DOM — never uses bookUrl in innerHTML */
  function showBookError(msg) {
    if (!loadingEl) return
    var p = document.createElement('p')
    p.className = 'epub-error'
    p.appendChild(document.createTextNode(msg + ' '))
    var dl = document.createElement('a')
    dl.href    = safeBookUrl
    dl.download = cleanTitle + '.epub'
    dl.textContent = 'Baixar EPUB'
    p.appendChild(dl)
    p.appendChild(document.createTextNode(' · '))
    var back = document.createElement('a')
    back.href = 'obras.html'
    back.textContent = '← Voltar'
    p.appendChild(back)
    loadingEl.textContent = ''
    loadingEl.appendChild(p)
  }

  if (!bookUrl) {
    showError('Nenhum livro especificado. <a href="obras.html">← Voltar para obras</a>')
    return
  }

  /* Reject absolute URLs — only same-origin relative paths are allowed */
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(bookUrl)) {
    showError('URL de livro inválida. <a href="obras.html">← Voltar para obras</a>')
    return
  }

  /* Remap legacy paths */
  var legacyPaths = {
    'conteudo/Cartas Completas (Santa Catarina de Sena).epub': 'conteudo/cartas-completas.epub',
    'conteudo/As orações (Santa Catarina de Sena).epub':       'conteudo/oracoes.epub'
  }
  if (Object.prototype.hasOwnProperty.call(legacyPaths, bookUrl)) {
    bookUrl = legacyPaths[bookUrl]
    history.replaceState(null, '', location.pathname + '?book=' + encodeURIComponent(bookUrl))
  }

  /* Resolve and verify the book URL stays on the same origin */
  var safeBookUrl
  try {
    var resolved = new URL(bookUrl, window.location.href)
    if (resolved.origin !== window.location.origin) {
      showError('URL de livro inválida. <a href="obras.html">← Voltar para obras</a>')
      return
    }
    safeBookUrl = resolved.href
  } catch (_) {
    showError('URL de livro inválida. <a href="obras.html">← Voltar para obras</a>')
    return
  }

  var cleanTitle = titleFromUrl(bookUrl)
  if (titleEl)      titleEl.textContent = cleanTitle
  if (breadcrumbEl) breadcrumbEl.textContent = cleanTitle
  document.title   = cleanTitle + ' — Santa Catarina de Sena'

  if (downloadBtn) {
    downloadBtn.href = safeBookUrl
    downloadBtn.setAttribute('download', cleanTitle + '.epub')
  }

  var posKey = 'foliate-pos:' + bookUrl
  var view   = document.getElementById('epub-viewer')

  /* Safety timeout — 30 s */
  var loadTimeout = setTimeout(function () {
    if (loadingEl && loadingEl.style.display !== 'none') {
      showBookError('O livro demorou muito para carregar.')
    }
  }, 30000)

  /* Inject theme styles into each rendered chapter */
  view.addEventListener('load', function (e) {
    var doc = e.detail && e.detail.doc
    if (!doc) return
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    if (isDark) {
      var style = doc.createElement('style')
      style.textContent =
        'html,body{background:#1a1a1a!important;color:#d4af37!important}' +
        'a{color:#c9a227!important}' +
        'h1,h2,h3,h4,h5,h6{color:#d4af37!important}'
      doc.head.appendChild(style)
    }
  })

  /* Main init */
  async function init() {
    try {
      await view.open(safeBookUrl)

      /* Title from metadata */
      var metaTitle = view.book && view.book.metadata && view.book.metadata.title
      if (metaTitle) {
        var displayTitle = typeof metaTitle === 'string'
          ? metaTitle
          : (metaTitle['pt'] || metaTitle['pt-BR'] || Object.values(metaTitle)[0] || cleanTitle)
        if (displayTitle) {
          if (titleEl)      titleEl.textContent = displayTitle
          if (breadcrumbEl) breadcrumbEl.textContent = displayTitle
          document.title   = displayTitle + ' — Santa Catarina de Sena'
        }
      }

      /* Build table of contents */
      if (view.book && view.book.toc) buildToc(view.book.toc, tocList)

      /* Restore saved position */
      var lastLocation = null
      try {
        lastLocation = localStorage.getItem(posKey) || null
      } catch (_) {}

      await view.init({ lastLocation: lastLocation, showTextStart: !lastLocation })

      clearTimeout(loadTimeout)
      if (loadingEl) loadingEl.style.display = 'none'
      if (prevBtn)   prevBtn.disabled = false
      if (nextBtn)   nextBtn.disabled = false

    } catch (err) {
      clearTimeout(loadTimeout)
      console.error('Erro ao abrir EPUB:', err)
      showBookError('Não foi possível carregar o livro.')
    }
  }

  /* Save position and update page info on every relocation */
  view.addEventListener('relocate', function (e) {
    var detail = (e && e.detail) || {}
    if (detail.cfi) {
      try { localStorage.setItem(posKey, detail.cfi) } catch (_) {}
    }
    if (pageInfoEl) {
      var frac = detail.fraction
      pageInfoEl.textContent = (typeof frac === 'number')
        ? Math.round(frac * 100) + '%'
        : '—'
    }
  })

  /* Navigation */
  if (prevBtn) prevBtn.addEventListener('click', function () { view.prev() })
  if (nextBtn) nextBtn.addEventListener('click', function () { view.next() })

  document.addEventListener('keydown', function (e) {
    var tag = e.target && e.target.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return
    if (e.key === 'ArrowLeft')  view.prev()
    if (e.key === 'ArrowRight') view.next()
  })

  /* TOC panel */
  if (tocBtn) tocBtn.addEventListener('click', function () {
    if (tocPanel) tocPanel.classList.toggle('open')
  })

  document.addEventListener('click', function (e) {
    if (!tocPanel) return
    if (!tocPanel.contains(e.target) && e.target !== tocBtn)
      tocPanel.classList.remove('open')
  })

  /* Recursively build TOC list */
  function buildToc(items, container) {
    if (!items || !items.length || !container) return
    for (var i = 0; i < items.length; i++) {
      var item = items[i]
      var li = document.createElement('li')
      var a  = document.createElement('a')
      a.href = '#'
      a.textContent = item.label || '(sem título)'
      ;(function (href) {
        a.addEventListener('click', function (e) {
          e.preventDefault()
          view.goTo(href)
          if (tocPanel) tocPanel.classList.remove('open')
        })
      })(item.href)
      li.appendChild(a)
      if (item.subitems && item.subitems.length) {
        var sub = document.createElement('ul')
        sub.style.paddingLeft = '1rem'
        buildToc(item.subitems, sub)
        li.appendChild(sub)
      }
      container.appendChild(li)
    }
  }

  init()
})()
