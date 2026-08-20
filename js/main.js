/* ─────────────────────────────────────────────────────────────────────────────
   FOCAL AGENCIES — Shared JavaScript
───────────────────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV SCROLL STATE ── */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── MOBILE MENU ── */
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = toggle.querySelectorAll('span');
      if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    // close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  /* ── SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── COUNTER ANIMATION ── */
  function animateCount(el) {
    const raw = el.dataset.count || '0';
    const target = parseFloat(raw);
    const isFloat = raw.includes('.');
    const duration = 1800;
    const start = performance.now();
    const update = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = isFloat ? (eased * target).toFixed(2) : Math.round(eased * target);
      if (t < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCount(e.target); io2.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => io2.observe(el));
  }

  /* ── TABS ── */
  document.querySelectorAll('[data-tab-group]').forEach(group => {
    const groupId = group.dataset.tabGroup;
    const tabs = group.querySelectorAll('[data-tab]');
    const panels = document.querySelectorAll(`[data-panel="${groupId}"]`);

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('tab-active'));
        tab.classList.add('tab-active');
        panels.forEach(p => {
          p.classList.toggle('panel-active', p.dataset.panelId === target);
        });
      });
    });
    // init first active
    if (tabs.length) tabs[0].classList.add('tab-active');
    if (panels.length) panels[0].classList.add('panel-active');
  });

  /* ── PRICING SLIDER ── */
  const slider = document.getElementById('vol-slider');
  const sliderDisplay = document.getElementById('vol-display');
  const costDisplay = document.getElementById('vol-cost');
  const saveDisplay = document.getElementById('vol-save');
  const platformDisplay = document.getElementById('vol-platform');

  if (slider) {
    const RATE = 0.062;
    const PLATFORM_RATE = 0.30;
    const update = () => {
      const mins = parseInt(slider.value);
      const cost = (mins * RATE).toFixed(0);
      const platform = (mins * PLATFORM_RATE).toFixed(0);
      const save = (platform - cost).toFixed(0);
      sliderDisplay.textContent = mins.toLocaleString();
      costDisplay.textContent = '$' + parseInt(cost).toLocaleString();
      platformDisplay.textContent = '$' + parseInt(platform).toLocaleString();
      saveDisplay.textContent = '$' + parseInt(save).toLocaleString();
    };
    slider.addEventListener('input', update);
    update();
  }

  /* ── SMOOTH ANCHOR OFFSET ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  /* ── IFRAME PREVIEW: detect if external site allows embedding ── */
  document.querySelectorAll('.site-preview-frame').forEach(function(iframe) {
    iframe.addEventListener('load', function() {
      try {
        var loc = iframe.contentWindow.location.href;
        if (loc && loc !== 'about:blank') {
          var wrap = iframe.closest('.wc-site-preview, .work-site-preview, .cs-site-preview');
          if (wrap) wrap.classList.add('iframe-loaded');
        }
      } catch(e) {
        // SecurityError = cross-origin content loaded successfully
        var wrap = iframe.closest('.wc-site-preview, .work-site-preview, .cs-site-preview');
        if (wrap) wrap.classList.add('iframe-loaded');
      }
    });
  });

});
