/* ===== MAPAS — PÁGINA SIENA ===== */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  if (typeof L === 'undefined') return;

  /* ── Mapa de Siena ── */
  var mapa = L.map('mapa-siena', { scrollWheelZoom: false }).setView([43.3186, 11.3309], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mapa);

  var lugares = [
    { lat: 43.3182, lng: 11.3275, nome: 'Casa de Santa Catarina — Santuário',        desc: 'Casa natal de Catarina Benincasa, hoje Santuário. Capelas nas antigas dependências da casa familiar.' },
    { lat: 43.3197, lng: 11.3262, nome: 'Basílica de São Domingos (San Domenico)',    desc: 'Guarda a relíquia da cabeça de Santa Catarina e o único retrato feito em vida (Andrea Vanni, c. 1375).' },
    { lat: 43.3187, lng: 11.3312, nome: 'Piazza del Campo',                           desc: 'O coração de Siena medieval, palco do Palio e da vida pública que Catarina conheceu.' },
    { lat: 43.3172, lng: 11.3278, nome: 'Fonte Branda',                               desc: 'A antiga fonte medieval junto à qual Catarina vivia. Ponto de encontro do bairro da Oca, onde nasceu.' },
    { lat: 43.3168, lng: 11.3330, nome: 'Catedral de Siena (Duomo)',                  desc: 'A espetacular catedral de Siena, em mármore branco e negro. Parte do cenário espiritual que Catarina conheceu.' }
  ];

  lugares.forEach(function (l) {
    L.marker([l.lat, l.lng])
      .addTo(mapa)
      .bindPopup('<strong>' + l.nome + '</strong><br>' + l.desc);
  });

  /* ── Mapa do Brasil ── */
  if (document.getElementById('mapa-brasil')) {
    var mapaBR = L.map('mapa-brasil', { scrollWheelZoom: false }).setView([-15.78, -47.93], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapaBR);

    var lugaresBR = [
      { lat:  -8.0089, lng: -34.8553, nome: 'Convento de São Domingos — Olinda/PE',             desc: 'O mais antigo mosteiro dominicano das Américas (1558). Berço da espiritualidade dominicana no Brasil, que inclui a devoção a Santa Catarina de Sena.' },
      { lat: -23.5937, lng: -46.6547, nome: 'Paróquia Santa Catarina de Sena — São Paulo/SP',   desc: 'Bairro Saúde. Comunidade paroquial dedicada à santa sienense, com celebração especial em 29 de abril.' },
      { lat: -20.3194, lng: -40.3380, nome: 'Convento São Domingos — Vitória/ES',               desc: 'Sede da Província Dominicana do Brasil. Centro da espiritualidade dominicana, onde a memória de Santa Catarina é especialmente cultivada.' },
      { lat: -22.8833, lng: -43.1036, nome: 'Instituto Teológico São Domingos — Niterói/RJ',    desc: 'Centro acadêmico dominicano com estudos sobre a mística e escritos de Santa Catarina de Sena.' },
      { lat: -29.1678, lng: -51.1794, nome: 'Comunidade Ítalo-Brasileira — Caxias do Sul/RS',   desc: 'Região de forte imigração italiana. Devoção popular a Santa Catarina de Sena mantida por famílias de descendência italiana há gerações.' },
      { lat: -28.6848, lng: -49.3594, nome: 'Região de Imigração Italiana — Criciúma/SC',       desc: 'Sul de Santa Catarina: cidades como Criciúma, Urussanga e Nova Veneza guardam tradição devocional italiana, incluindo a devoção à padroeira da Itália.' },
      { lat: -22.9035, lng: -43.1731, nome: 'Igreja do Glicério — Rio de Janeiro/RJ',           desc: 'Região histórica da colônia italiana no Rio de Janeiro, com imagens e devoções ligadas a Santa Catarina de Sena.' },
      { lat: -25.4284, lng: -49.2733, nome: 'Fraternidade Dominicana Leiga — Curitiba/PR',      desc: 'Grupo de leigos dominicanos que celebra a festa de Santa Catarina de Sena em 29 de abril com orações, meditação e estudo dos escritos de Santa Catarina.' }
    ];

    lugaresBR.forEach(function (l) {
      L.marker([l.lat, l.lng])
        .addTo(mapaBR)
        .bindPopup('<strong>' + l.nome + '</strong><br>' + l.desc);
    });
  }
});
