// Menu mobile toggle com animação suave e aria-current dinâmico
document.addEventListener('DOMContentLoaded', function() {
  var menuToggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.menu');

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function() {
      var isOpen = menu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    // Fecha o menu ao clicar em um link
    var links = menu.querySelectorAll('a');
    links.forEach(function(link) {
      link.addEventListener('click', function() {
        menu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
      });
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', function(e) {
      if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
        menu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
      }
    });

    // Fecha o menu ao pressionar Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        menu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        menuToggle.focus();
      }
    });
  }

  // Define aria-current="page" dinamicamente com base na URL atual
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  menu = menu || document.querySelector('.menu');
  if (menu) {
    menu.querySelectorAll('a').forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }
});
