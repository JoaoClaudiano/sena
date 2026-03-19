// Menu mobile toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function() {
      menu.classList.toggle('active');
    });

    // Fecha o menu ao clicar em um link (opcional)
    const links = menu.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', function() {
        menu.classList.remove('active');
      });
    });
  }
});
