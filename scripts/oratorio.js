/* ===== ORATÓRIO — MAPA DE VELAS E GEOLOCALIZAÇÃO ===== */
(function () {
  /* ---- Memória Litúrgica do Dia ---- */
  (function () {
    var conteudo = document.getElementById('memoriaLiturgicaConteudo');
    if (!conteudo) return;

    var agora = new Date();
    var dia = agora.getDate();
    var mes = agora.getMonth() + 1; /* 0-based */

    if (dia === 29 && mes === 4) {
      /* Hoje é a Memória Litúrgica! */
      conteudo.innerHTML =
        '<div class="memoria-festa">' +
        '<span class="memoria-festa-badge" aria-label="Hoje é a festa">🌹 Hoje</span>' +
        '<p class="memoria-festa-texto">Hoje, <strong>29 de abril</strong>, a Igreja celebra a <strong>Memória Obrigatória de Santa Catarina de Sena</strong> — virgem, mística, Doutora da Igreja, padroeira da Itália e copadroeira da Europa.</p>' +
        '<p class="memoria-festa-texto">Um dia de oração, devoção e gratidão pela vida desta mulher extraordinária que ousou falar a reis e papas movida unicamente pelo amor a Deus.</p>' +
        '</div>';
    } else {
      /* Calcula contagem regressiva para o próximo 29 de abril */
      var anoAtual = agora.getFullYear();
      var proximaFesta = new Date(anoAtual, 3, 29); /* 3 = abril (0-based) */
      if (agora >= proximaFesta) {
        proximaFesta = new Date(anoAtual + 1, 3, 29);
      }

      var diffMs = proximaFesta - agora;
      var diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      var diffHoras = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var diffMin = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      var anoFesta = proximaFesta.getFullYear();

      conteudo.innerHTML =
        '<div class="memoria-countdown">' +
        '<p class="memoria-countdown-desc">A Memória Litúrgica de Santa Catarina de Sena (<strong>29 de abril de ' + anoFesta + '</strong>) acontece em:</p>' +
        '<div class="memoria-countdown-display" id="memoriaCountdownDisplay" aria-live="polite" aria-label="Contagem regressiva para a festa">' +
        '<div class="memoria-countdown-unit"><span class="memoria-countdown-num" id="cdDias">' + diffDias + '</span><span class="memoria-countdown-label">dias</span></div>' +
        '<div class="memoria-countdown-unit"><span class="memoria-countdown-num" id="cdHoras">' + diffHoras + '</span><span class="memoria-countdown-label">horas</span></div>' +
        '<div class="memoria-countdown-unit"><span class="memoria-countdown-num" id="cdMin">' + diffMin + '</span><span class="memoria-countdown-label">minutos</span></div>' +
        '</div>' +
        '</div>';

      /* Atualiza o contador a cada minuto; para quando a festa chegar */
      var COUNTDOWN_UPDATE_INTERVAL = 60000;
      var elDias  = document.getElementById('cdDias');
      var elHoras = document.getElementById('cdHoras');
      var elMin   = document.getElementById('cdMin');
      var intervalId = setInterval(function () {
        var diff2 = proximaFesta - new Date();
        if (diff2 <= 0) {
          if (elDias)  elDias.textContent  = '0';
          if (elHoras) elHoras.textContent = '0';
          if (elMin)   elMin.textContent   = '0';
          clearInterval(intervalId);
          return;
        }
        if (elDias)  elDias.textContent  = Math.ceil(diff2 / (1000 * 60 * 60 * 24));
        if (elHoras) elHoras.textContent = Math.floor((diff2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (elMin)   elMin.textContent   = Math.floor((diff2 % (1000 * 60 * 60)) / (1000 * 60));
      }, COUNTDOWN_UPDATE_INTERVAL);
    }
  })();

  /* ---- Utilitários ---- */
  function formatVelaCount(n) {
    var s = n !== 1 ? 's' : '';
    return '🕯️ ' + n.toLocaleString('pt-BR') + ' vela' + s + ' acesa' + s;
  }
  /* ---- Mapa Leaflet com fundo escuro ---- */
  var mapEl = document.getElementById('candleMap');
  if (!mapEl) return;

  /* Se Leaflet não carregou (CDN bloqueado, offline, etc.), mostra fallback */
  if (typeof L === 'undefined') {
    mapEl.innerHTML = '<div class="candle-map-fallback"><p>🌍 O mapa de velas estará disponível quando o Supabase for configurado e a conexão com a internet estiver ativa.</p></div>';
    return;
  }

  var map = L.map('candleMap', {
    center: [20, 0],
    zoom: 2,
    minZoom: 1,
    maxZoom: 10,
    zoomControl: true,
    attributionControl: true,
    scrollWheelZoom: false
  });

  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }
  ).addTo(map);

  /* ---- Ícone de vela (marcador laranja brilhante) ---- */
  var candleIcon = L.divIcon({
    className: 'candle-map-marker',
    html: '<span class="candle-marker-flame" aria-hidden="true">🕯️</span>',
    iconSize: [28, 28],
    iconAnchor: [14, 24],
    popupAnchor: [0, -24]
  });

  /* ---- Carrega velas do Supabase ---- */
  var countEl = document.getElementById('mapaVelaCount');

  function carregarVelas() {
    if (window.SupabaseSena) {
      window.SupabaseSena.buscarVelasParaMapa().then(function (velas) {
        velas.forEach(function (v) {
          if (v.latitude && v.longitude) {
            var lat = parseFloat(v.latitude);
            var lng = parseFloat(v.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
              var marker = L.marker([lat, lng], { icon: candleIcon });
              var data = v.created_at ? new Date(v.created_at).toLocaleDateString('pt-BR') : '';
              var popup = L.popup();
              var popupDiv = document.createElement('div');
              popupDiv.className = 'candle-popup';
              var title = document.createTextNode('🕯️ Vela acesa');
              popupDiv.appendChild(title);
              if (v.intencao) {
                var em = document.createElement('em');
                em.style.fontSize = '0.85em';
                var excerpt = v.intencao.length > 80 ? v.intencao.slice(0, 80) + '…' : v.intencao;
                em.appendChild(document.createTextNode(excerpt));
                popupDiv.appendChild(document.createElement('br'));
                popupDiv.appendChild(em);
              }
              if (data) {
                var small = document.createElement('small');
                small.appendChild(document.createTextNode(data));
                popupDiv.appendChild(document.createElement('br'));
                popupDiv.appendChild(small);
              }
              popup.setContent(popupDiv);
              marker.bindPopup(popup);
              marker.addTo(map);
            }
          }
        });
        if (countEl && velas.length > 0) {
          countEl.textContent = formatVelaCount(velas.length) + ' ao redor do mundo';
        }
      });

      window.SupabaseSena.contarVelas().then(function (total) {
        if (countEl && total > 0) {
          countEl.textContent = formatVelaCount(total) + ' ao redor do mundo';
        }
      });
    } else {
      /* Sem Supabase configurado: mostra marcadores de demonstração */
      var demos = [
        { lat: -23.55, lng: -46.63, label: 'São Paulo, Brasil' },
        { lat: 43.77, lng: 11.25, label: 'Florença, Itália' },
        { lat: 41.89, lng: 12.49, label: 'Roma, Itália' },
        { lat: -15.78, lng: -47.93, label: 'Brasília, Brasil' },
        { lat: 38.71, lng: -9.14, label: 'Lisboa, Portugal' },
        { lat: 48.85, lng: 2.35, label: 'Paris, França' },
        { lat: -34.61, lng: -58.37, label: 'Buenos Aires, Argentina' },
        { lat: 40.41, lng: -3.7, label: 'Madri, Espanha' },
        { lat: 19.43, lng: -99.13, label: 'Cidade do México' },
        { lat: -8.05, lng: -34.88, label: 'Recife, Brasil' }
      ];
      demos.forEach(function (d) {
        var m = L.marker([d.lat, d.lng], { icon: candleIcon });
        m.bindPopup('<div class="candle-popup">🕯️ ' + d.label + '</div>');
        m.addTo(map);
      });
      if (countEl) {
        countEl.textContent = '🕯️ Conecte o Supabase para ver as velas em tempo real';
      }
    }
  }

  carregarVelas();

  /* ---- Integração com o botão de acender a vela ---- */
  var btn = document.getElementById('candleBtn');
  var geoMsg = document.getElementById('mapaGeoMsg');
  var userMarker = null;
  var SCROLL_TO_MAP_DELAY = 3500;

  function adicionarVelaNoMapa(lat, lng, label) {
    if (userMarker) {
      map.removeLayer(userMarker);
    }
    userMarker = L.marker([lat, lng], { icon: candleIcon });
    userMarker.bindPopup('<div class="candle-popup">🕯️ Sua vela<br><small>' + (label || '') + '</small></div>').openPopup();
    userMarker.addTo(map);
    map.flyTo([lat, lng], 5, { animate: true, duration: 1.5 });
  }

  function solicitarGeolocalizacao(onSuccess) {
    if (!navigator.geolocation) {
      if (geoMsg) geoMsg.textContent = 'Geolocalização não disponível neste navegador.';
      if (onSuccess) onSuccess(null);
      return;
    }
    if (geoMsg) geoMsg.textContent = '📍 Obtendo sua localização para marcar sua vela no mapa…';
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        var lat = pos.coords.latitude;
        var lng = pos.coords.longitude;
        if (geoMsg) geoMsg.textContent = '📍 Sua vela foi marcada no mapa!';
        adicionarVelaNoMapa(lat, lng, 'Sua localização');
        if (onSuccess) onSuccess({ latitude: lat, longitude: lng });
      },
      function () {
        if (geoMsg) geoMsg.textContent = '📍 Localização não concedida. Sua vela foi acesa no oratório!';
        if (onSuccess) onSuccess(null);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  }

  /* Sobrescreve o listener do botão de vela para incluir geolocalização e intenção */
  if (btn) {
    btn.addEventListener('click', function onCandleClick() {
      /* Aguarda o clique original do features.js processar primeiro */
      setTimeout(function () {
        /* Usa a classe 'lit' da chama como indicador de estado — definida pelo features.js */
        var flame = document.getElementById('candleFlame');
        var isLit = flame && flame.classList.contains('lit');
        if (isLit) {
          var intencaoEl = document.getElementById('intencaoInput');
          var intencao = intencaoEl ? intencaoEl.value.trim() || null : null;
          solicitarGeolocalizacao(function (coords) {
            if (window.SupabaseSena) {
              var lat = coords ? coords.latitude : null;
              var lng = coords ? coords.longitude : null;
              window.SupabaseSena.acenderVela(lat, lng, intencao).then(function () {
                window.SupabaseSena.contarVelas().then(function (total) {
                  var velaCountEl = document.getElementById('candleCount');
                  if (velaCountEl && total > 0) {
                    velaCountEl.textContent = formatVelaCount(total) + ' ao redor do mundo';
                  }
                });
              });
            }
          });
          /* Rola suavemente até o mapa */
          var mapSection = document.querySelector('.candle-map-section');
          if (mapSection) {
            setTimeout(function () {
              mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, SCROLL_TO_MAP_DELAY);
          }
        } else {
          if (geoMsg) geoMsg.textContent = '';
          if (userMarker) {
            map.removeLayer(userMarker);
            userMarker = null;
          }
        }
      }, 150);
    });
  }

  /* Invalida o tamanho do mapa quando visível (evita tiles em branco) */
  var mapObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        map.invalidateSize();
        mapObserver.unobserve(entry.target);
      }
    });
  });
  mapObserver.observe(mapEl);
})();

/* ===== ACCORDION DE ORAÇÕES ===== */
(function () {
  var toggles = document.querySelectorAll('.oracao-toggle');
  if (!toggles.length) return;

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var targetId = btn.getAttribute('aria-controls');
      var body     = document.getElementById(targetId);
      if (!body) return;

      if (expanded) {
        btn.setAttribute('aria-expanded', 'false');
        body.hidden = true;
      } else {
        /* Fecha os demais */
        toggles.forEach(function (other) {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            var otherId   = other.getAttribute('aria-controls');
            var otherBody = document.getElementById(otherId);
            if (otherBody) otherBody.hidden = true;
          }
        });
        btn.setAttribute('aria-expanded', 'true');
        body.hidden = false;
        /* Rola suavemente para o card aberto */
        setTimeout(function () {
          btn.closest('.oracao-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);
      }
    });
  });

  /* Abre o card cujo id coincide com o hash da URL (ex: #oracao-clareza) */
  if (window.location.hash) {
    var hash = window.location.hash.slice(1);
    var targetBtn = document.querySelector('.oracao-toggle[aria-controls="' + hash + '"]');
    if (targetBtn) {
      targetBtn.click();
    }
  }
})();
