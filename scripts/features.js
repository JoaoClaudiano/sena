/* ===== SVG ICONS ===== */
var ICONS = {
  moon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  sun:  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
};

/* ===== MODO NOTURNO ===== */
(function () {
  var toggle = document.getElementById('darkToggle');
  var root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (toggle) {
        toggle.setAttribute('aria-pressed', 'true');
        toggle.innerHTML = ICONS.sun;
      }
    } else {
      root.removeAttribute('data-theme');
      if (toggle) {
        toggle.setAttribute('aria-pressed', 'false');
        toggle.innerHTML = ICONS.moon;
      }
    }
  }

  var saved = localStorage.getItem('theme') ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(saved);

  if (toggle) {
    toggle.addEventListener('click', function () {
      var isDark = root.getAttribute('data-theme') === 'dark';
      var next = isDark ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  }
})();

/* ===== BARRA DE PROGRESSO DE LEITURA ===== */
(function () {
  var bar = document.getElementById('readingProgress');
  if (!bar) return;

  function updateProgress() {
    var docEl = document.documentElement;
    var scrolled = window.scrollY || docEl.scrollTop;
    var total = docEl.scrollHeight - docEl.clientHeight;
    var pct = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

/* ===== CONTROLES DE TAMANHO DE FONTE ===== */
(function () {
  var increaseBtn = document.getElementById('fontIncrease');
  var decreaseBtn = document.getElementById('fontDecrease');
  var resetBtn    = document.getElementById('fontReset');
  var content     = document.querySelector('.book-content');

  if (!content) return;

  var MIN_SIZE = 0.8;
  var MAX_SIZE = 1.8;
  var DEFAULT_SIZE = 1.1;
  var STEP = 0.1;

  var currentSize = parseFloat(localStorage.getItem('fontSize')) || DEFAULT_SIZE;
  content.style.fontSize = currentSize + 'rem';

  function setSize(size) {
    currentSize = Math.round(size * 10) / 10;
    content.style.fontSize = currentSize + 'rem';
    localStorage.setItem('fontSize', currentSize);
  }

  if (increaseBtn) {
    increaseBtn.addEventListener('click', function () {
      if (currentSize < MAX_SIZE) setSize(currentSize + STEP);
    });
  }

  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', function () {
      if (currentSize > MIN_SIZE) setSize(currentSize - STEP);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      setSize(DEFAULT_SIZE);
    });
  }
})();

/* ===== ANIMAÇÕES AO ROLAR (FADE-IN) ===== */
(function () {
  var elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('animated'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(function (el) { observer.observe(el); });
})();

/* ===== FUNDO DA PÁGINA — PARALLAX COM GRAIN ===== */
(function () {
  var bg1 = document.querySelector('.page-bg-img.bg-1');
  var bg2 = document.querySelector('.page-bg-img.bg-2');
  var pageGrain = document.getElementById('page-grain');
  if (!bg1 || !bg2) return;

  /* Array de imagens — substitua as URLs pelos seus arquivos */
  var images = [
    'imagens/Saint_Catherine_by_Andrea_Vanni,_San_Domenico,_Siena.jpg',
    'imagens/Domenico_Beccafumi_-_Stigmatization_of_St_Catherine_of_Siena_-_WGA01536.jpg',
    'imagens/Giovanni_Battista_Tiepolo_Santa_Catarina_de_Sena.jpg'
  ];

  /* Posições de scroll (em px) que disparam cada imagem */
  var scrollBreakpoints = [0, 600, 1200];

  /* Pré‑carregamento das imagens */
  images.forEach(function (src) {
    var img = new Image();
    img.src = src;
  });

  /* Canvas de grão animado — criado dinamicamente */
  var grainCanvas = document.createElement('canvas');
  grainCanvas.id = 'page-parallax-grain';
  grainCanvas.setAttribute('aria-hidden', 'true');
  var pageBg = document.getElementById('page-bg');
  if (pageBg) pageBg.appendChild(grainCanvas);

  var ctx = grainCanvas.getContext('2d');
  var grainRaf = null;

  function resizeGrain() {
    grainCanvas.width = window.innerWidth;
    grainCanvas.height = window.innerHeight;
  }
  resizeGrain();
  window.addEventListener('resize', resizeGrain, { passive: true });

  function drawGrain() {
    var w = grainCanvas.width;
    var h = grainCanvas.height;
    var imageData = ctx.createImageData(w, h);
    var d = imageData.data;
    for (var i = 0; i < d.length; i += 4) {
      var v = (Math.random() * 180) | 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 45;
    }
    ctx.putImageData(imageData, 0, 0);
    grainRaf = requestAnimationFrame(drawGrain);
  }

  function startGrain() {
    grainCanvas.classList.add('active');
    if (pageGrain) pageGrain.classList.add('active');
    if (!grainRaf) drawGrain();
  }

  function stopGrain() {
    grainCanvas.classList.remove('active');
    if (pageGrain) pageGrain.classList.remove('active');
    if (grainRaf) { cancelAnimationFrame(grainRaf); grainRaf = null; }
  }

  /* Estado atual */
  var currentIdx = 0;
  var activeBg = bg1;
  var inactiveBg = bg2;
  var transitioning = false;

  /* Determina o índice correto para a posição de scroll atual */
  function getIdxForScroll() {
    var scrolled = window.scrollY || document.documentElement.scrollTop;
    var idx = 0;
    for (var i = scrollBreakpoints.length - 1; i >= 0; i--) {
      if (scrolled >= scrollBreakpoints[i]) {
        idx = Math.min(i, images.length - 1);
        break;
      }
    }
    return idx;
  }

  function switchToImage(newIdx) {
    if (transitioning || newIdx === currentIdx) return;
    transitioning = true;

    /* Prepara a camada inativa com a nova imagem */
    inactiveBg.style.backgroundImage = 'url("' + images[newIdx] + '")';

    /* Fase 1 (0 ms): efeito de queima + grain na camada ativa */
    activeBg.classList.add('burning');
    startGrain();

    setTimeout(function () {
      /* Fase 2 (300 ms): troca de camadas */
      activeBg.classList.remove('active');
      inactiveBg.classList.add('active');
      var tmp = activeBg;
      activeBg = inactiveBg;
      inactiveBg = tmp;
      currentIdx = newIdx;
    }, 300);

    setTimeout(function () {
      /* Fase 3 (900 ms): remove filtro e grain */
      inactiveBg.classList.remove('burning');
      stopGrain();
      transitioning = false;

      /* Verifica se a posição de scroll exige outra troca */
      var expected = getIdxForScroll();
      if (expected !== currentIdx) switchToImage(expected);
    }, 900);
  }

  window.addEventListener('scroll', function () {
    switchToImage(getIdxForScroll());
  }, { passive: true });
})();

/* ===== BOTÃO VOLTAR AO TOPO ===== */
(function () {
  var btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ===== STATUS DO SISTEMA NO FOOTER ===== */
(function () {
  var anoEl = document.getElementById('anoAtual');
  var tempoEl = document.getElementById('tempoNoAr');
  var visitEl = document.getElementById('contadorVisitantes');

  if (anoEl) anoEl.textContent = new Date().getFullYear();

  if (tempoEl) {
    var launch = new Date('2025-04-29T00:00:00');
    var now = new Date();
    var diff = now - launch;
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var months = Math.floor(days / 30);
    var remaining = days % 30;
    var plural = function (n, s) { return n + ' ' + s + (n !== 1 ? 's' : ''); };
    if (months > 0) {
      var mesStr = months + (months > 1 ? ' meses' : ' mês');
      tempoEl.textContent = mesStr + ' e ' + plural(remaining, 'dia');
    } else {
      tempoEl.textContent = plural(days, 'dia');
    }
  }

  if (visitEl) {
    var count = parseInt(localStorage.getItem('visitCount') || '0', 10) + 1;
    localStorage.setItem('visitCount', count);
    visitEl.textContent = count.toLocaleString('pt-BR') + ' (neste dispositivo)';
  }
})();

/* ===== PÍLULAS DE SABEDORIA ===== */
(function () {
  var container = document.getElementById('pilulaContent');
  var dateEl = document.getElementById('pilulaDia');
  if (!container) return;

  var pilulas = [
    { titulo: 'Sobre o Amor', texto: 'Nada de grande se faz no mundo sem amor. É o amor que move a vontade, ilumina a inteligência e fortalece o coração para suportar qualquer tribulação com alegria.', ref: 'Cartas de Santa Catarina' },
    { titulo: 'Sobre o Conhecimento', texto: 'A alma que se conhece a si mesma, encontra Deus. No profundo abismo do conhecimento próprio, a humildade floresce — e com ela, toda a virtude.', ref: 'O Diálogo, cap. I' },
    { titulo: 'Sobre a Oração', texto: 'Orar é falar com Deus como um amigo fala com seu amigo — com o coração aberto, sem disfarces, em verdade e amor.', ref: 'Cartas de Santa Catarina' },
    { titulo: 'Sobre a Coragem', texto: 'Sede quem sois, e sereis santos. Deus não pede o impossível: pede que você seja fiel ao que Ele plantou em você.', ref: 'Carta 368' },
    { titulo: 'Sobre a Providência', texto: 'Deus é como o mar: quanto mais você nele mergulha, mais sente que é imenso e que jamais poderá esgotá-lo. Confie — Ele sabe o que faz.', ref: 'O Diálogo, cap. IV' },
    { titulo: 'Sobre o Sofrimento', texto: 'A cruz não é castigo: é o lugar onde Deus nos encontra mais de perto. No sofrimento unido ao de Cristo, há uma graça que o prazer jamais oferece.', ref: 'Cartas de Santa Catarina' },
    { titulo: 'Sobre a Igreja', texto: 'A Igreja é a mãe que nos gerou na fé. Amá-la com todas as suas feridas é sinal de fé madura — assim como se ama uma mãe doente com mais ternura.', ref: 'Carta ao Papa Gregório XI' },
    { titulo: 'Sobre o Fogo', texto: 'Se fores o que deves ser, porás fogo no mundo inteiro. Não é necessário fazer grandes coisas — basta ser completamente quem Deus te chamou a ser.', ref: 'Carta 368' },
    { titulo: 'Sobre a Humildade', texto: 'O orgulho é a raiz de todos os males; a humildade, a mãe de todas as virtudes. Humilhar-se não é rebaixar-se — é reconhecer a verdade sobre si mesmo.', ref: 'O Diálogo' },
    { titulo: 'Sobre o Serviço', texto: 'O que fazes ao menor dos meus irmãos, a mim o fazes. Servir os pobres, os doentes, os desprezados — este é o sacramento do próximo, onde Cristo se esconde.', ref: 'Vida por Bl. Raimundo de Cápua' },
    { titulo: 'Sobre o Tempo', texto: 'O tempo que temos é precioso — não porque seja longo, mas porque é o único que temos. Use-o bem, em obras de amor, e não lamentará na hora da morte.', ref: 'Cartas de Santa Catarina' },
    { titulo: 'Sobre a Paz', texto: 'A paz verdadeira não vem das circunstâncias externas, mas da conformidade com a vontade de Deus. Quem aceita tudo de Sua mão, encontra paz mesmo na tormenta.', ref: 'O Diálogo' },
    { titulo: 'Sobre a Misericórdia', texto: 'Deus é todo misericórdia: Ele não olha para a grandeza do pecado, mas para a profundidade do arrependimento. Nunca desesperes — Ele sempre recebe o que volta.', ref: 'O Diálogo, cap. VI' },
    { titulo: 'Sobre a Verdade', texto: 'A verdade liberta — mesmo quando dói. Falar com clareza, com amor e sem medo é um ato de misericórdia maior do que o silêncio conveniente.', ref: 'Cartas de Santa Catarina' }
  ];

  var today = new Date();
  var dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  var index = dayOfYear % pilulas.length;
  var pilula = pilulas[index];

  var dayNames = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
  var monthNames = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  if (dateEl) {
    dateEl.textContent = dayNames[today.getDay()] + ', ' + today.getDate() + ' de ' + monthNames[today.getMonth()];
  }

  container.innerHTML = '<h3>' + pilula.titulo + '</h3><p>' + pilula.texto + '</p><p class="pilula-ref">— ' + pilula.ref + '</p>';
})();

/* ===== MURAL SLIDESHOW ===== */
(function () {
  var slides = document.querySelectorAll('.mural-slide');
  if (!slides.length) return;
  var current = 0;

  function showSlide(n) {
    slides[current].classList.remove('mural-active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('mural-active');
  }

  window.muralNext = function () { showSlide(current + 1); };
  window.muralPrev = function () { showSlide(current - 1); };

  setInterval(function () { showSlide(current + 1); }, 6000);
})();

/* ===== HERO SLIDESHOW com GRAIN TRANSITION ===== */
(function () {
  var slides = document.querySelectorAll('.hero-section .slide');
  var dots = document.querySelectorAll('.slide-dot');
  var grain = document.getElementById('heroGrain');
  if (!slides.length) return;
  var current = 0;
  var transitioning = false;

  function showSlide(n) {
    if (transitioning) return;
    transitioning = true;

    var next = (n + slides.length) % slides.length;
    if (next === current) { transitioning = false; return; }

    /* Fase 1: aparece o grain */
    if (grain) grain.classList.add('active');

    setTimeout(function () {
      /* Fase 2: troca de slide */
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = next;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }, 180);

    setTimeout(function () {
      /* Fase 3: some o grain */
      if (grain) grain.classList.remove('active');
      transitioning = false;
    }, 420);
  }

  window.goToSlide = function (n) { showSlide(n); };

  setInterval(function () { showSlide(current + 1); }, 5500);
})();

/* ===== FAQ ACCORDION ===== */
(function () {
  var questions = document.querySelectorAll('.faq-question');
  questions.forEach(function (q) {
    q.addEventListener('click', function () {
      var answer = q.nextElementSibling;
      var isOpen = answer.classList.contains('open');
      document.querySelectorAll('.faq-answer').forEach(function (a) { a.classList.remove('open'); });
      document.querySelectorAll('.faq-question .faq-toggle').forEach(function (t) { t.textContent = '+'; });
      if (!isOpen) {
        answer.classList.add('open');
        var toggle = q.querySelector('.faq-toggle');
        if (toggle) toggle.textContent = '−';
      }
    });
  });
})();

/* ===== PRAYER TABS ===== */
(function () {
  var tabs = document.querySelectorAll('.prayer-tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      document.querySelectorAll('.prayer-content').forEach(function (c) { c.classList.remove('active'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      var target = tab.getAttribute('data-target');
      var content = document.getElementById(target);
      if (content) content.classList.add('active');
    });
  });
})();

/* ===== ORATORIO CANDLE ===== */
(function () {
  var btn = document.getElementById('candleBtn');
  var flame = document.getElementById('candleFlame');
  var glow = document.getElementById('candleGlow');
  var countEl = document.getElementById('candleCount');
  var statusEl = document.getElementById('candleStatus');
  var prayerSection = document.getElementById('prayerReveal');

  if (!btn) return;

  var CANDLE_SVG_BTN = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px;margin-right:6px"><path d="M12 3C12 3 8 7 8 12a4 4 0 0 0 8 0c0-5-4-9-4-9z"/><line x1="12" y1="16" x2="12" y2="21"/></svg>';

  var lit = false;
  var count = parseInt(localStorage.getItem('candleCount') || '0', 10);

  function updateCount() {
    if (!countEl) return;
    var suffix = count !== 1 ? 's' : '';
    countEl.textContent = count.toLocaleString('pt-BR') + ' vela' + suffix + ' acesa' + suffix + ' neste dispositivo';
  }
  updateCount();

  btn.addEventListener('click', function () {
    if (!lit) {
      lit = true;
      if (flame) flame.classList.add('lit');
      if (glow) glow.classList.add('lit');
      btn.innerHTML = CANDLE_SVG_BTN + 'Vela acesa — Rezar agora';
      if (statusEl) {
        statusEl.textContent = 'Sua vela está acesa. Santa Catarina intercede por você.';
        statusEl.style.color = '#f0a020';
      }
      count++;
      localStorage.setItem('candleCount', count);
      updateCount();
      if (prayerSection) {
        prayerSection.style.display = 'block';
        prayerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      lit = false;
      if (flame) flame.classList.remove('lit');
      if (glow) glow.classList.remove('lit');
      btn.innerHTML = CANDLE_SVG_BTN + 'Acender uma vela';
      if (statusEl) statusEl.textContent = '';
      if (prayerSection) prayerSection.style.display = 'none';
    }
  });
})();
