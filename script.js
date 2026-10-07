/* =========================================================
   DD-TECH — interactions (sans dépendance externe)
   Menu mobile, formulaire vers WhatsApp, année courante.
   ========================================================= */

(function () {
  'use strict';

  var WHATSAPP = '22667540204'; // format international, sans le "+"

  document.addEventListener('DOMContentLoaded', function () {

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

    /* ---------- Formulaire de contact vers WhatsApp ---------- */
    var form = document.querySelector('.contact-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var get = function (name) {
          var f = form.elements[name];
          return f ? f.value.trim() : '';
        };

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
        lines.push('', 'Besoin :', get('message'));

        var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n'));
        window.open(url, '_blank', 'noopener');

        var btn = form.querySelector('button[type="submit"]');
        if (btn) {
          var original = btn.innerHTML;
          btn.innerHTML = 'WhatsApp ouvert';
          btn.disabled = true;
          setTimeout(function () {
            btn.innerHTML = original;
            btn.disabled = false;
          }, 3000);
        }
      });

      form.addEventListener('input', function (e) {
        if (e.target.classList) e.target.classList.remove('field-error');
      });
    }

    /* ---------- Bouton WhatsApp : discret tant que la bannière est visible ---------- */
    var wa = document.querySelector('.wa-float');
    var hero = document.querySelector('.hero');
    if (wa && hero) {
      var majWa = function () {
        var bas = hero.getBoundingClientRect().bottom;
        wa.classList.toggle('wa-hidden', bas > window.innerHeight * 0.35);
      };
      majWa();
      window.addEventListener('scroll', majWa, { passive: true });
      window.addEventListener('resize', majWa);
    }

    /* ---------- Année courante ---------- */
    var year = new Date().getFullYear();
    document.querySelectorAll('.year').forEach(function (el) {
      el.textContent = year;
    });
  });
})();
