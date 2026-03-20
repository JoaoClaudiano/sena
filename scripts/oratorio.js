/* ===== ORATÓRIO — MAPA DE VELAS E GEOLOCALIZAÇÃO ===== */
(function () {
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
              var pais = v.country ? ' — ' + v.country : '';
              marker.bindPopup('<div class="candle-popup">🕯️ Vela acesa' + pais + (data ? '<br><small>' + data + '</small>' : '') + '</div>');
              marker.addTo(map);
            }
          }
        });
        if (countEl && velas.length > 0) {
          countEl.textContent = '🕯️ ' + velas.length.toLocaleString('pt-BR') + ' vela' + (velas.length !== 1 ? 's' : '') + ' acesa' + (velas.length !== 1 ? 's' : '') + ' ao redor do mundo';
        }
      });

      window.SupabaseSena.contarVelas().then(function (total) {
        if (countEl && total > 0) {
          countEl.textContent = '🕯️ ' + total.toLocaleString('pt-BR') + ' vela' + (total !== 1 ? 's' : '') + ' acesa' + (total !== 1 ? 's' : '') + ' ao redor do mundo';
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

  /* Sobrescreve o listener do botão de vela para incluir geolocalização */
  if (btn) {
    btn.addEventListener('click', function onCandleClick() {
      /* Aguarda o clique original do features.js processar primeiro */
      setTimeout(function () {
        /* Usa a classe 'lit' da chama como indicador de estado — definida pelo features.js */
        var flame = document.getElementById('candleFlame');
        var isLit = flame && flame.classList.contains('lit');
        if (isLit) {
          solicitarGeolocalizacao(function (coords) {
            if (coords && window.SupabaseSena) {
              window.SupabaseSena.salvarVela(coords);
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
