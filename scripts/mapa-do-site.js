/* ===== PESQUISA NO MAPA DO SITE ===== */
(function () {
  'use strict';

  var input    = document.getElementById('sitemapSearch');
  var clearBtn = document.getElementById('sitemapSearchClear');
  var noResults = document.getElementById('sitemapNoResults');
  var querySpan = document.getElementById('sitemapQuery');
  var cards    = document.querySelectorAll('.destaques-grid .destaque-card');

  if (!input || !cards.length) return;

  function normalize(str) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function filterCards(query) {
    var q       = normalize(query.trim());
    var visible = 0;

    cards.forEach(function (card) {
      var text  = normalize(card.textContent || '');
      var match = !q || text.indexOf(q) !== -1;
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    if (noResults) {
      noResults.hidden = visible > 0 || !q;
      if (querySpan) querySpan.textContent = query.trim();
    }
    if (clearBtn) clearBtn.hidden = !q;
  }

  input.addEventListener('input', function () {
    filterCards(input.value);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      input.value = '';
      filterCards('');
      input.focus();
    });
  }
})();
