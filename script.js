// DD-TECH — interactions légères, sans dépendance externe

document.addEventListener('DOMContentLoaded', () => {

  // Barres du mini-dashboard (hauteurs pseudo-aléatoires, rejouées à chaque chargement)
  document.querySelectorAll('.dash-chart').forEach(chart => {
    const bars = chart.querySelectorAll('i');
    bars.forEach((bar, i) => {
      const h = 30 + Math.round(Math.sin(i * 1.3) * 20 + 25 + (i % 3) * 8);
      bar.style.height = Math.min(90, Math.max(20, h)) + '%';
      bar.style.animationDelay = (i * 0.06) + 's';
    });
  });

  // Menu mobile
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
  }

  // Formulaire de contact (démo statique — pas de backend)
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Message envoyé ✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
      }, 2800);
    });
  }

  // Année dynamique dans le footer
  document.querySelectorAll('.year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});
