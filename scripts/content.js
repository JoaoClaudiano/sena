/* ===== CONTENT — PÍLULAS, FOOTER, FAQ, ABAS, VELA, PARTILHA ===== */
(function () {
  'use strict';

  /* ─── STATUS DO FOOTER ─── */
  var anoEl   = document.getElementById('anoAtual');
  var tempoEl = document.getElementById('tempoNoAr');
  var visitEl = document.getElementById('contadorVisitantes');

  if (anoEl) anoEl.textContent = new Date().getFullYear();

  if (tempoEl) {
    var launch = new Date('2025-04-29T00:00:00');
    var now    = new Date();
    var diff   = now - launch;
    var days   = Math.floor(diff / (1000 * 60 * 60 * 24));
    var months = Math.floor(days / 30);
    var rem    = days % 30;
    var plural = function (n, s) { return n + ' ' + s + (n !== 1 ? 's' : ''); };
    tempoEl.textContent = months > 0
      ? months + (months > 1 ? ' meses' : ' mês') + ' e ' + plural(rem, 'dia')
      : plural(days, 'dia');
  }

  if (visitEl) {
    var count = parseInt(localStorage.getItem('visitCount') || '0', 10) + 1;
    localStorage.setItem('visitCount', count);
    visitEl.textContent = count.toLocaleString('pt-BR') + ' (neste dispositivo)';
  }

  /* ─── PÍLULAS DE SABEDORIA ─── */
  var pilulaContainer = document.getElementById('pilulaContent');
  var pilulaDia       = document.getElementById('pilulaDia');

  if (pilulaContainer) {
    var pilulas = [
      { titulo: 'Sobre o Amor',         texto: 'Nada de grande se faz no mundo sem amor. É o amor que move a vontade, ilumina a inteligência e fortalece o coração para suportar qualquer tribulação com alegria.', ref: 'Cartas de Santa Catarina' },
      { titulo: 'Sobre o Conhecimento', texto: 'A alma que se conhece a si mesma, encontra Deus. No profundo abismo do conhecimento próprio, a humildade floresce — e com ela, toda a virtude.', ref: 'O Diálogo, cap. I' },
      { titulo: 'Sobre a Oração',       texto: 'Orar é falar com Deus como um amigo fala com seu amigo — com o coração aberto, sem disfarces, em verdade e amor.', ref: 'Cartas de Santa Catarina' },
      { titulo: 'Sobre a Coragem',      texto: 'Sede quem sois, e sereis santos. Deus não pede o impossível: pede que você seja fiel ao que Ele plantou em você.', ref: 'Carta 368' },
      { titulo: 'Sobre a Providência',  texto: 'Deus é como o mar: quanto mais você nele mergulha, mais sente que é imenso e que jamais poderá esgotá-lo. Confie — Ele sabe o que faz.', ref: 'O Diálogo, cap. IV' },
      { titulo: 'Sobre o Sofrimento',   texto: 'A cruz não é castigo: é o lugar onde Deus nos encontra mais de perto. No sofrimento unido ao de Cristo, há uma graça que o prazer jamais oferece.', ref: 'Cartas de Santa Catarina' },
      { titulo: 'Sobre a Igreja',       texto: 'A Igreja é a mãe que nos gerou na fé. Amá-la com todas as suas feridas é sinal de fé madura — assim como se ama uma mãe doente com mais ternura.', ref: 'Carta ao Papa Gregório XI' },
      { titulo: 'Sobre o Fogo',         texto: 'Se fores o que deves ser, porás fogo no mundo inteiro. Não é necessário fazer grandes coisas — basta ser completamente quem Deus te chamou a ser.', ref: 'Carta 368' },
      { titulo: 'Sobre a Humildade',    texto: 'O orgulho é a raiz de todos os males; a humildade, a mãe de todas as virtudes. Humilhar-se não é rebaixar-se — é reconhecer a verdade sobre si mesmo.', ref: 'O Diálogo' },
      { titulo: 'Sobre o Serviço',      texto: 'O que fazes ao menor dos meus irmãos, a mim o fazes. Servir os pobres, os doentes, os desprezados — este é o sacramento do próximo, onde Cristo se esconde.', ref: 'Vida por Bl. Raimundo de Cápua' },
      { titulo: 'Sobre o Tempo',        texto: 'O tempo que temos é precioso — não porque seja longo, mas porque é o único que temos. Use-o bem, em obras de amor, e não lamentará na hora da morte.', ref: 'Cartas de Santa Catarina' },
      { titulo: 'Sobre a Paz',          texto: 'A paz verdadeira não vem das circunstâncias externas, mas da conformidade com a vontade de Deus. Quem aceita tudo de Sua mão, encontra paz mesmo na tormenta.', ref: 'O Diálogo' },
      { titulo: 'Sobre a Misericórdia', texto: 'Deus é todo misericórdia: Ele não olha para a grandeza do pecado, mas para a profundidade do arrependimento. Nunca desesperes — Ele sempre recebe o que volta.', ref: 'O Diálogo, cap. VI' },
      { titulo: 'Sobre a Verdade',      texto: 'A verdade liberta — mesmo quando dói. Falar com clareza, com amor e sem medo é um ato de misericórdia maior do que o silêncio conveniente.', ref: 'Cartas de Santa Catarina' }
    ];

    var today     = new Date();
    var dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    var pilula    = pilulas[dayOfYear % pilulas.length];

    var dayNames   = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
    var monthNames = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

    if (pilulaDia) {
      pilulaDia.textContent = dayNames[today.getDay()] + ', ' + today.getDate() + ' de ' + monthNames[today.getMonth()];
    }

    pilulaContainer.innerHTML = '';
    var h3   = document.createElement('h3');  h3.textContent = pilula.titulo;
    var pTxt = document.createElement('p');   pTxt.textContent = pilula.texto;
    var pRef = document.createElement('p');   pRef.className = 'pilula-ref'; pRef.textContent = '— ' + pilula.ref;
    pilulaContainer.appendChild(h3);
    pilulaContainer.appendChild(pTxt);
    pilulaContainer.appendChild(pRef);
  }

  /* ─── FAQ ACCORDION ─── */
  document.querySelectorAll('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      var answer = q.nextElementSibling;
      var isOpen = answer && answer.classList.contains('open');
      document.querySelectorAll('.faq-answer').forEach(function (a) { a.classList.remove('open'); });
      document.querySelectorAll('.faq-toggle').forEach(function (t) { t.textContent = '+'; });
      if (!isOpen && answer) {
        answer.classList.add('open');
        var toggle = q.querySelector('.faq-toggle');
        if (toggle) toggle.textContent = '−';
      }
    });
  });

  /* ─── PRAYER TABS ─── */
  var prayerTabs = document.querySelectorAll('.prayer-tab');
  if (prayerTabs.length) {
    prayerTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        prayerTabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.prayer-content').forEach(function (c) { c.classList.remove('active'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        var target  = tab.getAttribute('data-target');
        var content = target ? document.getElementById(target) : null;
        if (content) content.classList.add('active');
      });
    });
  }

  /* ─── ORATÓRIO — VELA ─── */
  var candleBtn      = document.getElementById('candleBtn');
  var candleFlame    = document.getElementById('candleFlame');
  var candleGlow     = document.getElementById('candleGlow');
  var countEl        = document.getElementById('candleCount');
  var statusEl       = document.getElementById('candleStatus');
  var prayerReveal   = document.getElementById('prayerReveal');

  if (candleBtn) {
    var CANDLE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px;margin-right:6px"><path d="M12 3C12 3 8 7 8 12a4 4 0 0 0 8 0c0-5-4-9-4-9z"/><line x1="12" y1="16" x2="12" y2="21"/></svg>';
    var lit   = false;
    var count = parseInt(localStorage.getItem('candleCount') || '0', 10);

    function updateCandleCount() {
      if (!countEl) return;
      var s = count !== 1 ? 's' : '';
      countEl.textContent = count.toLocaleString('pt-BR') + ' vela' + s + ' acesa' + s + ' neste dispositivo';
    }
    updateCandleCount();

    candleBtn.addEventListener('click', function () {
      lit = !lit;
      if (candleFlame) candleFlame.classList.toggle('lit', lit);
      if (candleGlow)  candleGlow.classList.toggle('lit', lit);

      if (lit) {
        candleBtn.innerHTML = CANDLE_SVG + 'Vela acesa — Rezar agora';
        if (statusEl) { statusEl.textContent = 'Sua vela está acesa. Santa Catarina intercede por você.'; statusEl.style.color = '#f0a020'; }
        count++;
        localStorage.setItem('candleCount', count);
        updateCandleCount();
        if (prayerReveal) { prayerReveal.style.display = 'block'; prayerReveal.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      } else {
        candleBtn.innerHTML = CANDLE_SVG + 'Acender uma vela';
        if (statusEl) statusEl.textContent = '';
        if (prayerReveal) prayerReveal.style.display = 'none';
      }
    });
  }

  /* ─── COMPARTILHAR (Web Share API) ─── */
  var shareSection = document.querySelector('.social-share');
  if (shareSection && navigator.share) {
    var nativeBtn = document.createElement('button');
    nativeBtn.className = 'share-btn btn';
    nativeBtn.setAttribute('aria-label', 'Compartilhar esta página');
    nativeBtn.textContent = '↗ Compartilhar';
    nativeBtn.style.cssText = 'background:var(--c-primary);color:#fff;border:none;cursor:pointer;';

    nativeBtn.addEventListener('click', function () {
      navigator.share({
        title: document.title,
        url:   window.location.href
      }).catch(function () { /* user cancelled — ignore */ });
    });

    /* Insert before the static links */
    shareSection.insertBefore(nativeBtn, shareSection.querySelector('.share-btn'));
  }
})();
