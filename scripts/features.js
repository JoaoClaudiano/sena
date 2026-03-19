/* ===== MODO NOTURNO ===== */
(function () {
  var toggle = document.getElementById('darkToggle');
  var root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (toggle) toggle.setAttribute('aria-pressed', 'true');
      if (toggle) toggle.textContent = '☀️';
    } else {
      root.removeAttribute('data-theme');
      if (toggle) toggle.setAttribute('aria-pressed', 'false');
      if (toggle) toggle.textContent = '🌙';
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

/* ===== SCROLL-TO-TOP ===== */
(function () {
  var btn = document.getElementById('scrollTop');
  if (!btn) return;

  function toggleVisibility() {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ===== HERO SLIDESHOW ===== */
(function () {
  var slides = document.querySelectorAll('.hero-slideshow .slide');
  var dots = document.querySelectorAll('.hero-slideshow .dot');
  if (!slides.length) return;

  var current = 0;
  var interval;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function startAutoplay() {
    interval = setInterval(function () {
      goTo(current + 1);
    }, 5000);
  }

  function resetAutoplay() {
    clearInterval(interval);
    startAutoplay();
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goTo(i);
      resetAutoplay();
    });
  });

  startAutoplay();
})();

/* ===== UPTIME CALCULATOR ===== */
(function () {
  var el = document.getElementById('uptime');
  if (!el) return;

  function updateUptime() {
    var launch = new Date('2026-01-01T00:00:00');
    var now = new Date();
    var diff = now - launch;
    if (diff < 0) {
      el.textContent = 'em breve';
      return;
    }
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    el.textContent = days + ' dias, ' + hours + ' horas';
  }

  updateUptime();
  setInterval(updateUptime, 60000);
})();

/* ===== VISITOR COUNTER ===== */
(function () {
  var el = document.getElementById('visitorCount');
  if (!el) return;

  var count = parseInt(localStorage.getItem('visitCount') || '0', 10);
  var lastVisit = localStorage.getItem('lastVisitDate');
  var today = new Date().toDateString();

  if (lastVisit !== today) {
    count += 1;
    localStorage.setItem('visitCount', count);
    localStorage.setItem('lastVisitDate', today);
  }

  el.textContent = count;
})();

/* ===== DAY-BASED WISDOM QUOTE ===== */
(function () {
  var el = document.getElementById('todayWisdom');
  if (!el) return;

  var quotes = [
    "Se fores o que deves ser, porás fogo no mundo inteiro.",
    "Sê quem Deus quis que fosses e aterrarás o mundo.",
    "A alma está em Deus e Deus na alma, como o peixe no mar e o mar no peixe.",
    "Não há nada de perfeito sem sacrifício.",
    "Amai a Deus sobre todas as coisas e ao próximo como a vós mesmos.",
    "O amor pela Igreja é o amor por Cristo.",
    "Fala a verdade com gentileza, paciência e compaixão.",
    "Torna-te quem és. Descobre quem és.",
    "A humildade é a raiz de toda caridade.",
    "Nunca recuas, nunca te cansas, nunca desesperas.",
    "A beleza da alma brilha para fora.",
    "Deus é amor e nada mais.",
    "Toda a via da perfeição está no amor.",
    "Sede que nunca se apaga, amor que nunca esfria.",
    "As lágrimas lavam a alma.",
    "Paz não se compra com trégua, mas com virtude.",
    "A caridade começa em casa.",
    "Coragem! Nada é impossível ao que crê.",
    "A oração é a chave do coração de Deus.",
    "Quando a alma se humilha, Deus se eleva.",
    "Não sejas tíbia: ou quente ou fria.",
    "O sofrimento aceito com amor é a mais pura oração.",
    "Deus não pede mais do que você pode dar.",
    "A gratidão abre as portas do céu.",
    "Serve a Deus com alegria, não por medo.",
    "A paz interior vem de quem rendeu a vontade a Deus.",
    "O coração que ama não conhece fronteiras.",
    "Não importa quem você era; importa quem você é.",
    "A misericórdia de Deus é maior que todos os nossos pecados.",
    "Sobe sempre mais alto no amor.",
    "O tempo é precioso; não o desperdiceis.",
    "Em Deus encontramos tudo que buscamos."
  ];

  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start;
  var dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  var index = dayOfYear % quotes.length;
  var quote = quotes[index];

  el.innerHTML = '<p class="pill-quote">\u201c' + quote + '\u201d</p><p class="pill-author">\u2014 Santa Catarina de Sena</p>';
})();

/* ===== CANDLE LIGHTING (oratorio.html) ===== */
(function () {
  var btn = document.getElementById('candleBtn');
  var candle = document.querySelector('.oratory-candle');
  var countEl = document.getElementById('candleCount');
  var prayerSection = document.getElementById('prayerMode');
  if (!btn || !candle) return;

  var count = parseInt(localStorage.getItem('candleCount') || '0', 10);
  var isLit = false;

  if (countEl) countEl.textContent = count;

  btn.addEventListener('click', function () {
    if (!isLit) {
      isLit = true;
      candle.classList.add('candle-lit');
      btn.textContent = '🕯️ Vela acesa';
      btn.disabled = true;
      count += 1;
      localStorage.setItem('candleCount', count);
      if (countEl) countEl.textContent = count;
      if (prayerSection) {
        prayerSection.style.display = 'block';
        prayerSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
})();

/* ===== INTENTIONS (oratorio.html) ===== */
(function () {
  var form = document.getElementById('intentionForm');
  var list = document.getElementById('intentionsList');
  if (!form || !list) return;

  function loadIntentions() {
    var intentions = JSON.parse(localStorage.getItem('intentions') || '[]');
    list.innerHTML = '';
    if (!intentions.length) {
      list.innerHTML = '<li class="no-intentions">Nenhuma intenção ainda. Seja o primeiro a pedir!</li>';
      return;
    }
    intentions.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'intention-item';
      var strong = document.createElement('strong');
      strong.textContent = item.name || 'Anônimo';
      li.appendChild(strong);
      li.appendChild(document.createTextNode(': ' + item.text));
      list.appendChild(li);
    });
  }

  loadIntentions();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nameInput = form.querySelector('[name="intentionName"]');
    var textInput = form.querySelector('[name="intentionText"]');
    if (!textInput || !textInput.value.trim()) return;

    var intentions = JSON.parse(localStorage.getItem('intentions') || '[]');
    intentions.unshift({
      name: nameInput ? nameInput.value.trim() || 'Anônimo' : 'Anônimo',
      text: textInput.value.trim()
    });
    if (intentions.length > 50) intentions = intentions.slice(0, 50);
    localStorage.setItem('intentions', JSON.stringify(intentions));
    form.reset();
    loadIntentions();
  });
})();

/* ===== NEXT SUNDAY CALCULATOR ===== */
(function () {
  var dayEl = document.getElementById('nextSundayDay');
  var monthEl = document.getElementById('nextSundayMonth');
  if (!dayEl || !monthEl) return;

  var months = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
  var now = new Date();
  // Find first Sunday of next month
  var nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  var firstSundayOffset = (7 - nextMonth.getDay()) % 7;
  var firstSunday = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1 + firstSundayOffset);

  dayEl.textContent = firstSunday.getDate();
  monthEl.textContent = months[firstSunday.getMonth()];
})();
