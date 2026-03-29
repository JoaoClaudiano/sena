/* ===== MAPA DE LOCAIS — BIOGRAFIA DE SANTA CATARINA ===== */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  if (typeof L === 'undefined') return;

  var mapa = L.map('mapa-sena', { scrollWheelZoom: false }).setView([43.3, 12.0], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mapa);

  var lugares = [
    { lat: 43.3186, lng: 11.3309, nome: 'Siena',      desc: 'Cidade natal de Santa Catarina (1347–1380)' },
    { lat: 41.9028, lng: 12.4964, nome: 'Roma',       desc: 'Onde trabalhou pela reforma da Igreja e faleceu em 1380' },
    { lat: 43.7228, lng: 10.4017, nome: 'Pisa',       desc: 'Onde recebeu os estigmas invisíveis (1375)' },
    { lat: 43.9493, lng:  4.8055, nome: 'Avinhão',    desc: 'Onde convenceu o Papa Gregório XI a retornar a Roma (1376)' },
    { lat: 43.4678, lng: 11.8836, nome: 'Montepulciano', desc: 'Onde visitou o corpo de Santa Inês de Montepulciano' }
  ];

  lugares.forEach(function (l) {
    L.marker([l.lat, l.lng])
      .addTo(mapa)
      .bindPopup('<strong>' + l.nome + '</strong><br>' + l.desc);
  });
});
