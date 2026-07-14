export function initNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  const navbar = document.querySelector('.navbar');
  const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        toggle.classList.remove('active');
        menu.classList.remove('active');
      }
    });
  }

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener('click', function () {
      if (window.innerWidth <= 968) {
        this.parentElement.classList.toggle('open');
      }
    });
  });

  document.querySelectorAll('.nav-link, .nav-dropdown-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 968) {
        toggle.classList.remove('active');
        menu.classList.remove('active');
      }
    });
  });
}
