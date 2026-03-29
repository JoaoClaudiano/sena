/* ===== LEITOR EPUB — OBRAS DE SANTA CATARINA ===== */
(function () {
  'use strict';

  var params  = new URLSearchParams(window.location.search);
  var bookUrl = params.get('book');

  var titleEl      = document.getElementById('bookTitle');
  var breadcrumbEl = document.getElementById('breadcrumbTitle');
  var loadingEl    = document.getElementById('epubLoading');
  var prevBtn      = document.getElementById('epubPrev');
  var nextBtn      = document.getElementById('epubNext');
  var pageInfoEl   = document.getElementById('epubPageInfo');
  var tocBtn       = document.getElementById('epubToc');
  var tocPanel     = document.getElementById('epubTocPanel');
  var tocList      = document.getElementById('epubTocList');
  var downloadBtn  = document.getElementById('downloadEpubBtn');

  /* Deriva um título legível a partir da URL */
  function titleFromUrl(url) {
    try {
      var name = decodeURIComponent(url).split('/').pop();
      name = name.replace(/\.epub$/i, '').replace(/\.$/, '');
      name = name.replace(/\s*\(Santa Catarina de Sena\)\s*/gi, '');
      return name.trim() || 'Livro';
    } catch (e) {
      return 'Livro';
    }
  }

  if (!bookUrl) {
    loadingEl.innerHTML = '<p class="epub-error">Nenhum livro especificado. <a href="obras.html">← Voltar para obras</a></p>';
    return;
  }

  /* Remapeia caminhos legados para os nomes atuais */
  var legacyPaths = {
    'conteudo/Cartas Completas (Santa Catarina de Sena).epub': 'conteudo/cartas-completas.epub',
    'conteudo/As orações (Santa Catarina de Sena).epub':       'conteudo/oracoes.epub'
  };
  if (Object.prototype.hasOwnProperty.call(legacyPaths, bookUrl)) {
    bookUrl = legacyPaths[bookUrl];
    history.replaceState(null, '', location.pathname + '?book=' + encodeURIComponent(bookUrl));
  }

  var cleanTitle = titleFromUrl(bookUrl);

  if (titleEl)      titleEl.textContent = cleanTitle;
  if (breadcrumbEl) breadcrumbEl.textContent = cleanTitle;
  document.title = cleanTitle + ' — Santa Catarina de Sena';

  /* Link de download */
  if (downloadBtn) {
    downloadBtn.href = bookUrl;
    downloadBtn.setAttribute('download', cleanTitle + '.epub');
  }

  /* ── Renderização do EPUB ── */
  var book = ePub(bookUrl);

  /* Timeout de segurança — 20 s → sugere baixar o arquivo */
  var loadTimeout = setTimeout(function () {
    if (loadingEl && loadingEl.style.display !== 'none') {
      loadingEl.innerHTML =
        '<p class="epub-error">O livro demorou muito para carregar. ' +
        '<a href="' + bookUrl + '" download>Baixar EPUB</a> ou ' +
        '<a href="obras.html">← Voltar para obras</a>.</p>';
    }
  }, 20000);

  book.on('openFailed', function (err) {
    console.error('Erro ao abrir EPUB:', err);
    clearTimeout(loadTimeout);
    if (loadingEl) loadingEl.innerHTML =
      '<p class="epub-error">Não foi possível carregar o livro. ' +
      '<a href="' + bookUrl + '" download>Baixar EPUB</a> · ' +
      '<a href="obras.html">← Voltar</a></p>';
  });

  var rendition = book.renderTo('epub-viewer', {
    width:  '100%',
    height: '100%',
    spread: 'none'
  });

  /* Chave de posição salva — única por URL do livro */
  var posKey = 'epub-pos:' + bookUrl;

  /* Restaura posição salva ou começa do início */
  var startCfi = null;
  try { startCfi = localStorage.getItem(posKey); } catch (e) {}

  function onDisplayReady() {
    clearTimeout(loadTimeout);
    if (loadingEl) loadingEl.style.display = 'none';
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    updatePageInfo();
  }

  function onDisplayError(err) {
    clearTimeout(loadTimeout);
    console.error('Erro ao renderizar EPUB:', err);
    if (loadingEl) loadingEl.innerHTML =
      '<p class="epub-error">Não foi possível carregar o EPUB. ' +
      '<a href="' + bookUrl + '" download>Baixar EPUB</a> · ' +
      '<a href="obras.html">← Voltar</a></p>';
  }

  rendition.display(startCfi || undefined).then(onDisplayReady).catch(function (err) {
    if (startCfi) {
      /* CFI salvo inválido — limpa e tenta novamente do início */
      try { localStorage.removeItem(posKey); } catch (e) {}
      startCfi = null;
      rendition.display(undefined).then(onDisplayReady).catch(onDisplayError);
      return;
    }
    onDisplayError(err);
  });

  /* Salva posição a cada mudança de página */
  rendition.on('relocated', function (location) {
    if (location && location.start && location.start.cfi) {
      try { localStorage.setItem(posKey, location.start.cfi); } catch (e) {}
    }
    updatePageInfo();
  });

  /* Navegação */
  prevBtn.addEventListener('click', function () {
    rendition.prev().catch(function () {});
  });
  nextBtn.addEventListener('click', function () {
    rendition.next().catch(function () {});
  });

  /* Navegação por teclado */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  rendition.prev().catch(function () {});
    if (e.key === 'ArrowRight') rendition.next().catch(function () {});
  });

  function updatePageInfo() {
    var loc = rendition.currentLocation();
    if (loc && loc.start && loc.start.displayed) {
      var d = loc.start.displayed;
      pageInfoEl.textContent = d.page + ' / ' + d.total;
    } else {
      pageInfoEl.textContent = '—';
    }
  }

  /* Sumário (TOC) */
  tocBtn.addEventListener('click', function () {
    tocPanel.classList.toggle('open');
  });

  book.loaded.navigation.then(function (nav) {
    if (!nav || !nav.toc || !nav.toc.length) return;
    nav.toc.forEach(function (item) {
      var li = document.createElement('li');
      var a  = document.createElement('a');
      a.href = '#';
      a.textContent = item.label;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        rendition.display(item.href).then(updatePageInfo);
        tocPanel.classList.remove('open');
      });
      li.appendChild(a);
      tocList.appendChild(li);
    });
  });

  /* Fecha TOC ao clicar fora */
  document.addEventListener('click', function (e) {
    if (!tocPanel.contains(e.target) && e.target !== tocBtn) {
      tocPanel.classList.remove('open');
    }
  });
})();
