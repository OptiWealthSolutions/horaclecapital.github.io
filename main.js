document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const navLinks = document.getElementById('nav-links');
  const navOverlay = document.getElementById('nav-overlay');

  if (menuToggle && menuClose && navLinks && navOverlay) {
    const openMenu = () => {
      navLinks.classList.add('active');
      navOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Empêche le scroll du fond
    };

    const closeMenu = () => {
      navLinks.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = ''; // Restaure le scroll
    };

    menuToggle.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    navOverlay.addEventListener('click', closeMenu); // Ferme si on clique sur le fond sombre
    
    // Ferme le menu si l'utilisateur clique sur un lien
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }
});