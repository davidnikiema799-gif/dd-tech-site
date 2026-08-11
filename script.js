/* =========================================================
   DD-TECH — interactions (sans dépendance externe)
   ========================================================= */

(function () {
  'use strict';

  var WHATSAPP = '22667540204'; // numéro principal, format international sans "+"

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Header : état "scrollé" ---------- */
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------- Menu mobile ---------- */
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');

    if (toggle && links) {
      var closeMenu = function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      };

      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      // Fermeture au clic sur un lien, hors du menu, ou via Échap
      links.addEventListener('click', function (e) {
        if (e.target.closest('a')) closeMenu();
      });
      document.addEventListener('click', function (e) {
        if (!links.classList.contains('open')) return;
        if (!e.target.closest('.nav-links') && !e.target.closest('.nav-toggle')) closeMenu();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && links.classList.contains('open')) {
          closeMenu();
          toggle.focus();
        }
      });
      window.addEventListener('resize', function () {
        if (window.innerWidth > 900) closeMenu();
      });
    }

    /* ---------- Barres du mini-dashboard ---------- */
    document.querySelectorAll('.dash-chart').forEach(function (chart) {
      chart.querySelectorAll('i').forEach(function (bar, i) {
        var h = 34 + Math.round(Math.sin(i * 1.25) * 18 + 26 + (i % 3) * 7);
        bar.style.height = Math.min(94, Math.max(22, h)) + '%';
        bar.style.animationDelay = (i * 0.07) + 's';
      });
    });

    /* ---------- Animations d'apparition au scroll ---------- */
    var revealables = document.querySelectorAll('.reveal');
    if (revealables.length) {
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealables.forEach(function (el) { io.observe(el); });
      } else {
        revealables.forEach(function (el) { el.classList.add('in'); });
      }
    }

    /* ---------- Compteurs animés ---------- */
    var counters = document.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window) {
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      var runCount = function (el) {
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        if (reduced || isNaN(target)) {
          el.textContent = target + suffix;
          return;
        }
        var duration = 1400;
        var start = null;
        var step = function (ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };

      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCount(entry.target);
            co.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { co.observe(el); });
    }

    /* ---------- Formulaire de contact → WhatsApp ---------- */
    var form = document.querySelector('.contact-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var get = function (name) {
          var f = form.elements[name];
          return f ? f.value.trim() : '';
        };

        // Validation simple des champs requis
        var valid = true;
        ['name', 'phone', 'message'].forEach(function (name) {
          var field = form.elements[name];
          if (!field) return;
          var empty = field.value.trim() === '';
          field.classList.toggle('field-error', empty);
          if (empty) valid = false;
        });

        var status = form.querySelector('.form-status');
        if (!valid) {
          if (status) status.textContent = 'Merci de renseigner votre nom, votre téléphone et votre message.';
          return;
        }
        if (status) status.textContent = '';

        var lines = [
          'Bonjour DD-TECH, je souhaite discuter d\'un projet.',
          '',
          'Nom : ' + get('name'),
          'Téléphone : ' + get('phone')
        ];
        if (get('company')) lines.push('Structure : ' + get('company'));
        if (get('activity')) lines.push('Activité : ' + get('activity'));
        if (get('budget')) lines.push('Budget envisagé : ' + get('budget'));
        lines.push('', 'Besoin :', get('message'));

        var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n'));
        window.open(url, '_blank', 'noopener');

        var btn = form.querySelector('button[type="submit"]');
        if (btn) {
          var original = btn.innerHTML;
          btn.innerHTML = 'WhatsApp ouvert ✓';
          btn.disabled = true;
          setTimeout(function () {
            btn.innerHTML = original;
            btn.disabled = false;
          }, 3000);
        }
      });

      // Retire le surlignage d'erreur dès la saisie
      form.addEventListener('input', function (e) {
        if (e.target.classList) e.target.classList.remove('field-error');
      });
    }

    /* ---------- Année dynamique ---------- */
    var year = new Date().getFullYear();
    document.querySelectorAll('.year').forEach(function (el) {
      el.textContent = year;
    });
  });
})();
