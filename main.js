/**
 * IDEAgent Documentation - Navigation & Interactivity
 */
(function () {
  'use strict';

  // Mobile menu toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');

  if (toggle && nav) {
    var setMenuState = function (isOpen) {
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
    };

    toggle.addEventListener('click', function () {
      var isCurrentlyOpen = toggle.getAttribute('aria-expanded') === 'true';
      setMenuState(!isCurrentlyOpen);
    });

    // Close when clicking any nav link
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuState(false);
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        setMenuState(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenuState(false);
        toggle.focus();
      }
    });
  }
})();
