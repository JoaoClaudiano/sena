/* ===== VISUALIZADOR PDF — O DIÁLOGO DA DIVINA PROVIDÊNCIA ===== */
(function () {
  'use strict';

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  var PDF_PATH   = 'conteudo/dialogo.pdf';
  var SCALE_STEP = 0.25;
  var MIN_SCALE  = 0.5;
  var MAX_SCALE  = 3.0;

  var pdfDoc       = null;
  var currentPage  = 1;
  var currentScale = 1.5;
  var renderTask   = null;

  var canvas        = document.getElementById('pdfCanvas');
  var ctx           = canvas.getContext('2d');
  var loadingEl     = document.getElementById('pdfLoading');
  var currentPageEl = document.getElementById('pdfCurrentPage');
  var totalPagesEl  = document.getElementById('pdfTotalPages');
  var zoomLevelEl   = document.getElementById('pdfZoomLevel');
  var prevBtn       = document.getElementById('pdfPrevPage');
  var nextBtn       = document.getElementById('pdfNextPage');
  var zoomInBtn     = document.getElementById('pdfZoomIn');
  var zoomOutBtn    = document.getElementById('pdfZoomOut');

  function updateNavButtons() {
    prevBtn.disabled    = currentPage <= 1;
    nextBtn.disabled    = currentPage >= pdfDoc.numPages;
    zoomInBtn.disabled  = currentScale >= MAX_SCALE;
    zoomOutBtn.disabled = currentScale <= MIN_SCALE;
  }

  function renderPage(pageNum) {
    var renderingPage = pageNum;
    var prevTask = renderTask;
    renderTask = null;

    var ready = prevTask
      ? (prevTask.cancel(), prevTask.promise.catch(function () {}))
      : Promise.resolve();

    ready.then(function () {
      return pdfDoc.getPage(renderingPage);
    }).then(function (page) {
      var viewport = page.getViewport({ scale: currentScale });
      canvas.width  = viewport.width;
      canvas.height = viewport.height;

      var task = page.render({ canvasContext: ctx, viewport: viewport });
      renderTask = task;
      return task.promise;
    }).then(function () {
      renderTask = null;
      currentPageEl.textContent = renderingPage;
      zoomLevelEl.textContent   = Math.round(currentScale * 100) + '%';
      updateNavButtons();
    }).catch(function (err) {
      if (err && err.name !== 'RenderingCancelledException') {
        console.error('Erro ao renderizar página:', err);
      }
    });
  }

  pdfjsLib.getDocument(PDF_PATH).promise.then(function (doc) {
    pdfDoc = doc;
    totalPagesEl.textContent = doc.numPages;
    loadingEl.style.display  = 'none';
    canvas.style.display     = 'block';
    renderPage(currentPage);
  }).catch(function (err) {
    console.error('Erro ao carregar PDF:', err);
    var msg = 'Não foi possível carregar o PDF.';
    if (err && err.message) { msg += ' (' + err.message + ')'; }
    msg += ' Por favor, tente o botão "Baixar PDF".';
    loadingEl.textContent = msg;
  });

  prevBtn.addEventListener('click', function () {
    if (currentPage <= 1) return;
    currentPage--;
    renderPage(currentPage);
  });

  nextBtn.addEventListener('click', function () {
    if (currentPage >= pdfDoc.numPages) return;
    currentPage++;
    renderPage(currentPage);
  });

  zoomInBtn.addEventListener('click', function () {
    if (currentScale >= MAX_SCALE) return;
    currentScale = Math.min(MAX_SCALE, currentScale + SCALE_STEP);
    renderPage(currentPage);
  });

  zoomOutBtn.addEventListener('click', function () {
    if (currentScale <= MIN_SCALE) return;
    currentScale = Math.max(MIN_SCALE, currentScale - SCALE_STEP);
    renderPage(currentPage);
  });
})();
