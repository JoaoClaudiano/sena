/* ===== REDE DE VIRTUDES — NETWORK GRAPH ===== */
(function () {
  'use strict';

  var PROXIMITY_THRESHOLD = 220;

  var nodesData = [
    {
      id: 'v1',
      type: 'virtude',
      title: 'Humildade',
      description: 'A base de todas as virtudes.',
      fullText: 'A alma que conhece a si mesma, humilha-se; e na humildade encontra Deus. Catarina ensinava que o verdadeiro autoconhecimento é a porta de entrada para toda vida espiritual.',
      emoji: '🌿'
    },
    {
      id: 'v2',
      type: 'virtude',
      title: 'Coragem',
      description: 'A força que move montanhas.',
      fullText: 'Catarina não conhecia o medo quando se tratava de defender a Igreja. Escreveu cartas audaciosas a papas e reis, e viajou pessoalmente a Avignon para convencer o Papa Gregório XI a retornar a Roma.',
      emoji: '🔥'
    },
    {
      id: 'v3',
      type: 'virtude',
      title: 'Amor',
      description: 'O caminho mais curto até Deus.',
      fullText: 'O amor era o centro de toda a espiritualidade de Catarina. Para ela, o amor de Deus e o amor ao próximo eram inseparáveis: "Nada de grande se faz no mundo sem amor."',
      emoji: '❤️'
    },
    {
      id: 'v4',
      type: 'virtude',
      title: 'Fé',
      description: 'A certeza das coisas que se esperam.',
      fullText: 'A fé de Catarina era concreta e ativa. Ela acreditava que a fé verdadeira se manifesta em ações corajosas: "Sede quem sois, e sereis santos" — este chamado pressupõe uma fé profunda na vocação de cada alma.',
      emoji: '✨'
    },
    {
      id: 'v5',
      type: 'virtude',
      title: 'Paciência',
      description: 'A virtude que sustenta tudo.',
      fullText: 'Para Catarina, a paciência não é passividade, mas perseverança ativa diante das tribulações. Ela sofreu incompreensões e perseguições, mas nunca abandonou sua missão.',
      emoji: '🕊️'
    },
    {
      id: 'c1',
      type: 'citacao',
      title: 'Sede quem sois',
      description: 'Chamado à santidade.',
      fullText: '"Sede quem sois, e sereis santos." — Uma das frases mais conhecidas de Santa Catarina. Ela acreditava que a santidade não é algo externo, mas o pleno florescimento do que cada alma já é em Deus.',
      emoji: '💬'
    },
    {
      id: 'c2',
      type: 'citacao',
      title: 'Fogo no mundo',
      description: 'A missão de cada cristão.',
      fullText: '"Se fores o que deves ser, porás fogo no mundo inteiro." — Carta 368. Catarina dirigiu estas palavras a quem estava acomodado na mediocridade espiritual. Uma convocação a ser plenamente quem Deus criou.',
      emoji: '🕯️'
    },
    {
      id: 'c3',
      type: 'citacao',
      title: 'Nada sem amor',
      description: 'O poder transformador do amor.',
      fullText: '"Nada de grande se faz no mundo sem amor." — Catarina via o amor como a força motriz de toda transformação genuína, tanto pessoal quanto social e eclesial.',
      emoji: '💫'
    },
    {
      id: 'c4',
      type: 'citacao',
      title: 'Deus é fogo',
      description: 'A natureza ardente de Deus.',
      fullText: '"Deus é fogo, e não faz frio quem se aproxima dele." — Uma imagem mística que Catarina usava para descrever a experiência de Deus: quem O conhece de verdade não pode permanecer frio ou indiferente.',
      emoji: '🔆'
    },
    {
      id: 'e1',
      type: 'episodio',
      title: 'Avignon',
      description: 'O papa retorna a Roma.',
      fullText: 'Em 1376, com apenas 29 anos, Catarina viajou a Avignon e convenceu o Papa Gregório XI a abandonar o exílio de 70 anos e retornar a Roma. Sua coragem e persuasão mudaram o curso da história da Igreja.',
      emoji: '🏛️'
    },
    {
      id: 'e2',
      type: 'episodio',
      title: 'Estigmatização',
      description: 'O dom dos estigmas invisíveis.',
      fullText: 'Em 1375, em Pisa, Catarina recebeu os estigmas de Cristo — as chagas nas mãos, pés e costado. A pedido dela, Deus tornou os estigmas invisíveis durante sua vida, para que não atraíssem atenção para si mesma.',
      emoji: '✝️'
    },
    {
      id: 'e3',
      type: 'episodio',
      title: 'Troca do Coração',
      description: 'Visão mística do amor divino.',
      fullText: 'Numa visão mística, Cristo apareceu a Catarina e lhe ofereceu Seu próprio coração em troca do seu. Este episódio tornou-se símbolo do amor total que ela nutria por Deus e que a impulsionava a servir os outros.',
      emoji: '💕'
    }
  ];

  var connectionsData = [
    { from: 'v1', to: 'c1' },
    { from: 'v1', to: 'e2' },
    { from: 'v2', to: 'c2' },
    { from: 'v2', to: 'e1' },
    { from: 'v3', to: 'c3' },
    { from: 'v3', to: 'e3' },
    { from: 'v4', to: 'c1' },
    { from: 'v4', to: 'e1' },
    { from: 'v5', to: 'c4' },
    { from: 'c2', to: 'e1' },
    { from: 'c3', to: 'e3' }
  ];

  var typeColors = {
    virtude: '#a67c52',
    citacao: '#6b8e9f',
    episodio: '#7a9e7e'
  };

  var typeLabels = {
    virtude: 'Virtude',
    citacao: 'Citação',
    episodio: 'Episódio'
  };

  function init() {
    var container = document.getElementById('networkGraph');
    if (!container) return;

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'network-svg');
    svg.setAttribute('aria-hidden', 'true');
    container.appendChild(svg);

    var nodeElements = {};

    nodesData.forEach(function (node) {
      var el = document.createElement('div');
      el.className = 'network-node';
      el.id = 'ng-node-' + node.id;
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', node.title + ': ' + node.description);

      var card = document.createElement('div');
      card.className = 'node-card type-' + node.type;
      card.innerHTML =
        '<span class="node-emoji" aria-hidden="true">' + node.emoji + '</span>' +
        '<div class="node-title">' + node.title + '</div>' +
        '<div class="node-desc">' + node.description + '</div>';

      var popup = document.createElement('div');
      popup.className = 'node-popup';
      popup.setAttribute('role', 'tooltip');
      popup.innerHTML =
        '<div class="popup-type popup-type-' + node.type + '">' + (typeLabels[node.type] || node.type) + '</div>' +
        '<div class="popup-title">' + node.title + '</div>' +
        '<div class="popup-text">' + node.fullText + '</div>';

      el.appendChild(card);
      el.appendChild(popup);
      container.appendChild(el);
      nodeElements[node.id] = el;
    });

    function positionNodes() {
      var w = container.offsetWidth;
      var h = container.offsetHeight;
      var cx = w / 2;
      var cy = h / 2;
      var r = Math.min(w * 0.42, h * 0.42, 260);
      var n = nodesData.length;

      nodesData.forEach(function (node, i) {
        var angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        var x = cx + r * Math.cos(angle);
        var y = cy + r * Math.sin(angle);
        var el = nodeElements[node.id];
        if (el) {
          el.style.left = x + 'px';
          el.style.top = y + 'px';
        }
      });
    }

    function drawConnections() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      var w = container.offsetWidth;
      var h = container.offsetHeight;
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      svg.setAttribute('width', w);
      svg.setAttribute('height', h);

      connectionsData.forEach(function (conn) {
        var fromEl = nodeElements[conn.from];
        var toEl = nodeElements[conn.to];
        if (!fromEl || !toEl) return;

        var fromNode = nodesData.find(function (n) { return n.id === conn.from; });
        var x1 = parseFloat(fromEl.style.left);
        var y1 = parseFloat(fromEl.style.top);
        var x2 = parseFloat(toEl.style.left);
        var y2 = parseFloat(toEl.style.top);

        var mx = (x1 + x2) / 2;
        var my = (y1 + y2) / 2;
        var cx = mx + (w / 2 - mx) * 0.25;
        var cy = my + (h / 2 - my) * 0.25;

        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' Q ' + cx + ' ' + cy + ' ' + x2 + ' ' + y2);
        path.setAttribute('stroke', typeColors[(fromNode && fromNode.type) || 'virtude']);
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-opacity', '0.35');
        path.setAttribute('class', 'ng-line ng-line-' + conn.from + ' ng-line-' + conn.to);
        svg.appendChild(path);
      });
    }

    function layout() {
      positionNodes();
      drawConnections();
    }

    layout();

    /* ── Proximity scale effect ── */
    container.addEventListener('mousemove', function (e) {
      var rect = container.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var my = e.clientY - rect.top;

      nodesData.forEach(function (node) {
        var el = nodeElements[node.id];
        if (!el) return;
        var nx = parseFloat(el.style.left);
        var ny = parseFloat(el.style.top);
        var dist = Math.sqrt(Math.pow(mx - nx, 2) + Math.pow(my - ny, 2));
        var proximity = Math.max(0, 1 - dist / PROXIMITY_THRESHOLD);
        var scale = 1 + proximity * 0.18;
        var opacity = 0.55 + proximity * 0.45;
        var card = el.querySelector('.node-card');
        if (card && !el.classList.contains('ng-active')) {
          card.style.transform = 'translate(-50%,-50%) scale(' + scale + ')';
          card.style.opacity = opacity;
        }
      });
    }, { passive: true });

    container.addEventListener('mouseleave', function () {
      nodesData.forEach(function (node) {
        var el = nodeElements[node.id];
        if (!el || el.classList.contains('ng-active')) return;
        var card = el.querySelector('.node-card');
        if (card) {
          card.style.transform = '';
          card.style.opacity = '';
        }
      });
    });

    /* ── Hover: popup & connection highlight ── */
    nodesData.forEach(function (node) {
      var el = nodeElements[node.id];
      if (!el) return;

      function onEnter() {
        el.classList.add('ng-active');
        adjustPopup(el);
        highlightConnections(node.id);
      }

      function onLeave() {
        el.classList.remove('ng-active');
        var card = el.querySelector('.node-card');
        if (card) {
          card.style.transform = '';
          card.style.opacity = '';
        }
        resetConnections();
      }

      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      el.addEventListener('focus', onEnter);
      el.addEventListener('blur', onLeave);
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.classList.toggle('ng-active');
          if (el.classList.contains('ng-active')) {
            adjustPopup(el);
            highlightConnections(node.id);
          } else {
            resetConnections();
          }
        }
      });
    });

    function adjustPopup(el) {
      var popup = el.querySelector('.node-popup');
      if (!popup) return;
      var containerRect = container.getBoundingClientRect();
      var elRect = el.getBoundingClientRect();
      var topSpace = elRect.top - containerRect.top;
      var elCenterX = elRect.left + elRect.width / 2 - containerRect.left;
      var popupW = 220;

      popup.style.cssText = '';

      if (topSpace < 180) {
        popup.style.top = 'calc(100% + 14px)';
        popup.style.bottom = 'auto';
      } else {
        popup.style.bottom = 'calc(100% + 14px)';
        popup.style.top = 'auto';
      }

      if (elCenterX - popupW / 2 < 10) {
        popup.style.left = '-' + Math.round(elRect.width / 2) + 'px';
        popup.style.transform = 'none';
      } else if (containerRect.width - (elCenterX + popupW / 2) < 10) {
        popup.style.right = '-' + Math.round(elRect.width / 2) + 'px';
        popup.style.left = 'auto';
        popup.style.transform = 'none';
      } else {
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
      }
    }

    function highlightConnections(nodeId) {
      var lines = svg.querySelectorAll('.ng-line');
      lines.forEach(function (line) {
        if (line.classList.contains('ng-line-' + nodeId)) {
          line.setAttribute('stroke-opacity', '0.85');
          line.setAttribute('stroke-width', '2.5');
        } else {
          line.setAttribute('stroke-opacity', '0.08');
        }
      });
    }

    function resetConnections() {
      var lines = svg.querySelectorAll('.ng-line');
      lines.forEach(function (line) {
        line.setAttribute('stroke-opacity', '0.35');
        line.setAttribute('stroke-width', '1.5');
      });
    }

    /* ── Resize handler ── */
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layout, 120);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
