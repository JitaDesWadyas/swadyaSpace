/* BIRIMANIA · static event edition · 2026
   No analytics, payments, accounts, live betting or backend.
   Edit market odds below; values are editorial examples, NOT real offers.
   Add media/trailer.mp4, media/faceoff.mp4 and the two portrait images to activate them.
*/
(() => {
  'use strict';

  const market = Object.freeze({
    grb: { name: 'GRB_imisaj', decimal: 1.85 },
    oe: { name: 'Oeloves', decimal: 2.15 },
  });
  const eventTime = Date.parse('2026-10-30T19:00:00+01:00'); // Europe/Rome: CET, after DST change.
  const media = Object.freeze({
    trailer: { src: './media/trailer.mp4', title: 'OFFICIAL TEASER / BIRIMANIA', label: 'GUARDA IL TRAILER', detail: 'THE OFFICIAL BIRIMANIA TEASER' },
    faceoff: { src: './media/faceoff.mp4', title: 'THE FACEOFF / BIRIMANIA', label: 'GUARDA IL FACEOFF', detail: 'GRB_IMISAJ VS OELOVES / THE FACEOFF' },
  });
  const portraitSources = {
    grb: './media/grb-imisaj.webp',
    oe: './media/oeloves.webp',
  };
  const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const setText = (s, value) => { const el = $(s); if (el) el.textContent = value; };

  // The menu is custom-styled, accessible, and locks background scroll.
  const menuButton = $('#menu-toggle');
  const menu = $('#mobile-menu');
  const setMenuOpen = (open) => {
    menu.classList.toggle('is-open', open);
    menu.inert = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
    document.body.classList.toggle('menu-open', open);
    if (open) menu.querySelector('a')?.focus();
    else if (menu.contains(document.activeElement)) menuButton.focus();
  };
  menuButton.addEventListener('click', () => setMenuOpen(!menu.classList.contains('is-open')));
  $$('#mobile-menu a').forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
  addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) setMenuOpen(false);
  });
  addEventListener('resize', () => {
    if (innerWidth > 760 && menu.classList.contains('is-open')) setMenuOpen(false);
  }, { passive: true });

  // Deferred entrance; visible by default without JS to avoid inaccessible content.
  const revealNodes = $$('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    }, { threshold: .09, rootMargin: '0px 0px 20px 0px' });
    revealNodes.forEach((node) => observer.observe(node));
  } else revealNodes.forEach((node) => node.classList.add('is-visible'));

  // Scroll effects update only with requestAnimationFrame. No scroll-jacking.
  const progressBar = $('#reading-bar');
  const faceoffStage = $('#faceoff-stage');
  const leftLetter = $('.half-left .half-figure');
  const rightLetter = $('.half-right .half-figure');
  const heroCenter = $('.hero-center');
  let scrollFrame = false;
  const paintScroll = () => {
    scrollFrame = false;
    const y = scrollY;
    const total = document.documentElement.scrollHeight - innerHeight;
    if (total > 0) progressBar.style.transform = `scaleX(${clamp(y / total, 0, 1)})`;
    if (reducedMotion) return;
    const rect = faceoffStage.getBoundingClientRect();
    const midpoint = rect.top + rect.height * .5;
    const travel = clamp((innerHeight - midpoint) / (innerHeight + rect.height) + .5, 0, 1);
    const shift = travel * 16;
    leftLetter.style.transform = `translate(${30 - shift}%, 9%)`;
    rightLetter.style.transform = `translate(${-30 + shift}%, 9%)`;
    if (y < innerHeight * 1.3) {
      heroCenter.style.transform = `translate3d(0, ${-Math.min(y * .13, 120)}px, 0)`;
    }
  };
  addEventListener('scroll', () => {
    if (!scrollFrame) { scrollFrame = true; requestAnimationFrame(paintScroll); }
  }, { passive: true });
  addEventListener('resize', () => requestAnimationFrame(paintScroll), { passive: true });
  paintScroll();

  // Simulated match-winner odds. No transaction, storage or collection of stakes.
  const choiceButtons = $$('.odds-choice');
  const stakeInput = $('#stake');
  const stakeShortcuts = $$('.quick-stakes button');
  let selected = 'grb';
  const asStake = (raw) => {
    const n = Number(String(raw).replace(',', '.'));
    return Number.isFinite(n) ? clamp(n, 0, 100000) : 0;
  };
  const refreshOdds = () => {
    const stake = asStake(stakeInput.value);
    const { name, decimal } = market[selected];
    const returnValue = stake * decimal;
    choiceButtons.forEach((button) => {
      const active = button.dataset.choice === selected;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    stakeShortcuts.forEach((button) => button.classList.toggle('active', Number(button.dataset.stake) === stake));
    setText('#selected-fighter', name);
    setText('#selected-odd', `@ ${decimal.toFixed(2)}`);
    setText('#return-value', euro.format(returnValue));
    setText('#profit-value', `+ ${euro.format(stake * (decimal - 1))}`);
  };
  for (const [id, config] of Object.entries(market)) {
    setText(`[data-odds="${id}"]`, config.decimal.toFixed(2));
    setText(`[data-prob="${id}"]`, `PROB. IMPLICITA ${(100 / config.decimal).toLocaleString('it-IT', { maximumFractionDigits: 1 })}%`);
  }
  choiceButtons.forEach((button) => button.addEventListener('click', () => { selected = button.dataset.choice; refreshOdds(); }));
  stakeShortcuts.forEach((button) => button.addEventListener('click', () => { stakeInput.value = button.dataset.stake; refreshOdds(); }));
  stakeInput.addEventListener('input', refreshOdds);
  stakeInput.addEventListener('blur', () => {
    stakeInput.value = String(asStake(stakeInput.value));
    refreshOdds();
  });
  refreshOdds();

  // Countdown: use the absolute instant for Rome, not the visitor's local 19:00.
  const countdown = () => {
    const remaining = Math.max(0, Math.floor((eventTime - Date.now()) / 1000));
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    setText('#days', String(days).padStart(2, '0'));
    setText('#hours', String(hours).padStart(2, '0'));
    setText('#minutes', String(minutes).padStart(2, '0'));
    setText('#seconds', String(seconds).padStart(2, '0'));
    if (remaining === 0) setText('#countdown-label', 'FIGHT NIGHT · 30 OTTOBRE 2026');
  };
  countdown();
  setInterval(countdown, 1000);

  // Check real media availability before enabling buttons; no broken players.
  const videoDialog = $('#video-dialog');
  const featuredVideo = $('#featured-video');
  const videoClose = $('#video-close');
  let availableMedia = new Set();
  const activateMedia = (key) => {
    if (availableMedia.has(key)) return;
    availableMedia.add(key);
    $$(`[data-media="${key}"]`).forEach((button) => button.disabled = false);
    $$(`[data-media-label="${key}"]`).forEach((label) => { label.textContent = media[key].label; });
  };
  Object.entries(media).forEach(([key, item]) => {
    const probe = document.createElement('video');
    probe.preload = 'metadata';
    probe.muted = true;
    probe.playsInline = true;
    probe.addEventListener('loadedmetadata', () => {
      activateMedia(key);
      if (key === 'faceoff' && !reducedMotion) {
        const faceoffFilm = $('#faceoff-preview');
        faceoffFilm.src = item.src;
        faceoffFilm.preload = 'auto';
        faceoffFilm.play().then(() => { faceoffFilm.classList.add('is-ready'); $('#faceoff-stage').classList.add('has-film'); }).catch(() => {});
      }
      if (key === 'trailer' && !reducedMotion) {
        const heroFilm = $('#hero-film');
        heroFilm.src = item.src;
        heroFilm.preload = 'auto';
        heroFilm.play().then(() => heroFilm.classList.add('is-ready')).catch(() => {});
      }
    }, { once: true });
    probe.addEventListener('error', () => {}, { once: true }); // Buttons remain disabled until an actual film loads.
    probe.src = item.src;
    probe.load();
  });
  const closeFilm = () => {
    featuredVideo.pause();
    featuredVideo.removeAttribute('src');
    featuredVideo.load();
    document.body.classList.remove('modal-open');
    if (videoDialog.open) videoDialog.close();
  };
  $$('[data-media]').forEach((button) => button.addEventListener('click', () => {
    const key = button.dataset.media;
    if (!availableMedia.has(key)) return;
    const item = media[key];
    $('#video-dialog-title').textContent = item.title;
    $('#video-description').textContent = item.detail;
    featuredVideo.src = item.src;
    videoDialog.showModal();
    document.body.classList.add('modal-open');
    featuredVideo.play().catch(() => {}); // Native play control is always available.
  }));
  videoClose.addEventListener('click', closeFilm);
  videoDialog.addEventListener('click', (event) => { if (event.target === videoDialog) closeFilm(); });
  videoDialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    featuredVideo.pause();
    featuredVideo.removeAttribute('src');
    featuredVideo.load();
  });

  Object.entries(portraitSources).forEach(([key, src]) => {
    const target = $(`[data-portrait="${key}"]`);
    if (!target) return;
    const image = new Image();
    image.decoding = 'async';
    image.addEventListener('load', () => { target.src = src; target.classList.add('is-ready'); }, { once: true });
    image.src = src;
  });

  // Native share sheet, graceful clipboard fallback, always with a branded toast.
  const toast = $('#toast');
  let toastTimeout;
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('is-shown');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('is-shown'), 3600);
  };
  $('#share-event').addEventListener('click', async () => {
    const shareData = {
      title: 'BIRIMANIA — GRB_imisaj vs Oeloves',
      text: '30 ottobre 2026 · dalle 19:00 · Casa di Fari. BIRIMANIA.',
      url: location.href.split('#')[0],
    };
    if (navigator.share) {
      try { await navigator.share(shareData); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`); showToast('Link dell’evento copiato.'); }
    catch { showToast('Condivisione non disponibile in questo browser.'); }
  });
})();