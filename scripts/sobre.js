/* ===== SOBRE — STATUS DO SISTEMA DA PÁGINA SOBRE ===== */
(function () {
  'use strict';

  var LAUNCH = new Date('2025-04-29T00:00:00');
  var now    = new Date();

  /* Dias no ar */
  var days      = Math.floor((now - LAUNCH) / (1000 * 60 * 60 * 24));
  var diasEl    = document.getElementById('diasNoAr');
  if (diasEl) diasEl.textContent = days.toLocaleString('pt-BR');

  /* Tempo humanizado */
  var months    = Math.floor(days / 30);
  var remaining = days % 30;
  var tempoEl   = document.getElementById('tempoNoArSobre');
  if (tempoEl) {
    if (months > 0) {
      tempoEl.textContent = months + (months > 1 ? ' meses' : ' mês') + ' e ' + remaining + ' dia' + (remaining !== 1 ? 's' : '');
    } else {
      tempoEl.textContent = days + ' dia' + (days !== 1 ? 's' : '');
    }
  }

  /* Visitas neste dispositivo */
  var visitEl = document.getElementById('visitasSobre');
  if (visitEl) {
    var count = parseInt(localStorage.getItem('visitCount') || '0', 10);
    visitEl.textContent = count.toLocaleString('pt-BR');
  }

  /* Horário da última verificação */
  var pad     = function (v) { return String(v).padStart(2, '0'); };
  var verifEl = document.getElementById('ultimaVerif');
  if (verifEl) {
    verifEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
  }

  /* Ano no rodapé — handled globally by content.js, but set here too as fallback */
  var anoEl = document.getElementById('anoAtual');
  if (anoEl && !anoEl.dataset.set) anoEl.textContent = now.getFullYear();

  /* Status da API Supabase (via contagem de velas) */
  var apiDot  = document.getElementById('apiDot');
  var apiText = document.getElementById('apiStatusText');
  var velasEl = document.getElementById('totalVelasSobre');

  function setApiOnline(total) {
    if (apiDot)  { apiDot.classList.add('online'); apiDot.classList.remove('offline'); }
    if (apiText) apiText.textContent = 'conectado';
    if (velasEl) velasEl.textContent = total != null ? total.toLocaleString('pt-BR') : '—';
  }

  function setApiOffline() {
    if (apiDot)  { apiDot.classList.add('offline'); apiDot.classList.remove('online'); }
    if (apiText) apiText.textContent = 'indisponível';
    if (velasEl) velasEl.textContent = '—';
  }

  /* Aguarda o SupabaseSena estar disponível */
  function tentarStatus() {
    var sena = window.SupabaseSena;
    if (!sena) { setApiOffline(); return; }
    sena.contarVelas().then(function (total) {
      setApiOnline(total);
    }).catch(function () {
      setApiOffline();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tentarStatus);
  } else {
    tentarStatus();
  }
})();
