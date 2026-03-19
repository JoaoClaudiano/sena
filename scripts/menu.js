// Menu mobile toggle com animação suave
document.addEventListener('DOMContentLoaded', function() {
  var menuToggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.menu');

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function() {
      var isOpen = menu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Fecha o menu ao clicar em um link
    var links = menu.querySelectorAll('a');
    links.forEach(function(link) {
      link.addEventListener('click', function() {
        menu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', function(e) {
      if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
        menu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
});
