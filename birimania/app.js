/* BIRIMANIA · static event edition · 2026
   No analytics, payments, accounts, live betting or backend.
   Edit market odds below; values are editorial examples, NOT real offers.
*/
(() => {
  'use strict';

  const market = Object.freeze({
    grb: { name: 'GRB_imisaj', decimal: 1.85 },
    oe: { name: 'Oeloves', decimal: 2.15 },
  });
  const eventTime = Date.parse('2026-10-30T19:00:00+01:00');
  const media = Object.freeze({
    trailer: { src: './media/trailer.mp4', title: 'OFFICIAL TRAILER / BIRIMANIA', label: 'GUARDA IL TRAILER', detail: 'THE OFFICIAL BIRIMANIA TRAILER' },
    faceoff: { src: './media/faceoff.mp4', title: 'THE FACEOFF / BIRIMANIA', label: 'GUARDA IL FACEOFF', detail: 'GRB_IMISAJ VS OELOVES / THE FACEOFF' },
  });
  const portraitSources = { grb: './media/grb-imisaj.webp', oe: './media/oeloves.webp' };
  const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const setText = (s, value) => { const el = $(s); if (el) el.textContent = value; };

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
  menuButton?.addEventListener('click', () => setMenuOpen(!menu.classList.contains('is-open')));
  $$('#mobile-menu a').forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
  addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) setMenuOpen(false);
  });
  addEventListener('resize', () => {
    if (innerWidth > 760 && menu.classList.contains('is-open')) setMenuOpen(false);
  }, { passive: true });

  const revealNodes = $$('.reveal');
  const fighterNodes = $$('.reveal-fighter');
  const revealTargets = [...revealNodes, ...fighterNodes];
  const markVisible = (node) => node.classList.add('is-visible');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        markVisible(entry.target);
        obs.unobserve(entry.target);
      }
    }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    revealTargets.forEach((node) => observer.observe(node));
  } else revealTargets.forEach(markVisible);

  const progressBar = $('#reading-bar');
  const hero = $('.hero');
  const heroCutoutOne = $('.hero-cutout-one');
  const heroCutoutTwo = $('.hero-cutout-two');
  const trailerCard = $('.hero-trailer-card');
  const faceoffStage = $('#faceoff-stage');
  const faceoffPreview = $('#faceoff-preview');
  let scrollFrame = false;
  const paintScroll = () => {
    scrollFrame = false;
    const y = scrollY;
    const total = document.documentElement.scrollHeight - innerHeight;
    if (total > 0 && progressBar) progressBar.style.transform = `scaleX(${clamp(y / total, 0, 1)})`;
    if (reducedMotion) return;

    if (hero && y < innerHeight * 1.4) {
      const depth = Math.min(y * .08, 60);
      if (heroCutoutOne) heroCutoutOne.style.transform = `translate3d(${-depth * .22}px, ${-depth * .08}px, 0)`;
      if (heroCutoutTwo) heroCutoutTwo.style.transform = `translate3d(${depth * .22}px, ${-depth * .12}px, 0)`;
      if (trailerCard) trailerCard.style.transform = `translate3d(0, ${Math.min(y * .03, 18)}px, 0)`;
    }

    if (faceoffStage && faceoffPreview) {
      const rect = faceoffStage.getBoundingClientRect();
      const progress = clamp(1 - Math.abs((rect.top + rect.height * .5) - innerHeight * .5) / (innerHeight * .8), 0, 1);
      faceoffPreview.style.transform = `scale(${1 + progress * .025})`;
      faceoffStage.style.boxShadow = `0 ${28 + progress * 18}px ${80 + progress * 18}px rgba(0,0,0,.42)`;
    }
  };
  addEventListener('scroll', () => {
    if (!scrollFrame) {
      scrollFrame = true;
      requestAnimationFrame(paintScroll);
    }
  }, { passive: true });
  addEventListener('resize', () => requestAnimationFrame(paintScroll), { passive: true });
  paintScroll();

  const choiceButtons = $$('.odds-choice');
  const stakeInput = $('#stake');
  const stakeShortcuts = $$('.quick-stakes button');
  let selected = 'grb';
  const asStake = (raw) => {
    const n = Number(String(raw).replace(',', '.'));
    return Number.isFinite(n) ? clamp(n, 0, 100000) : 0;
  };
  const refreshOdds = () => {
    if (!stakeInput) return;
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
  stakeShortcuts.forEach((button) => button.addEventListener('click', () => { if (stakeInput) stakeInput.value = button.dataset.stake; refreshOdds(); }));
  stakeInput?.addEventListener('input', refreshOdds);
  stakeInput?.addEventListener('blur', () => {
    stakeInput.value = String(asStake(stakeInput.value));
    refreshOdds();
  });
  refreshOdds();

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

  const videoDialog = $('#video-dialog');
  const featuredVideo = $('#featured-video');
  const videoClose = $('#video-close');
  const availableMedia = new Set();
  const previews = [];
  const previewAllowed = !reducedMotion && !(navigator.connection && navigator.connection.saveData);
  const previewIsVisible = (video) => {
    const bounds = video.getBoundingClientRect();
    return bounds.bottom > 0 && bounds.top < innerHeight;
  };
  const installPreview = (selector, source, afterPlay = () => {}) => {
    const video = $(selector);
    if (!video || !previewAllowed) return;
    video.src = source;
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    previews.push(video);
    const enter = () => video.play().then(() => {
      video.classList.add('is-ready');
      afterPlay();
    }).catch(() => {});
    if ('IntersectionObserver' in window) {
      const watcher = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !videoDialog.open) enter();
          else video.pause();
        }
      }, { threshold: .2 });
      watcher.observe(video);
    } else if (previewIsVisible(video)) enter();
  };
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
      if (key === 'trailer') installPreview('#hero-film', item.src, () => hero?.classList.add('is-playing'));
      if (key === 'faceoff') installPreview('#faceoff-preview', item.src, () => faceoffStage?.classList.add('has-film'));
    }, { once: true });
    probe.addEventListener('error', () => {}, { once: true });
    probe.src = item.src;
    probe.load();
  });

  const closeFilm = () => {
    if (!featuredVideo) return;
    featuredVideo.pause();
    featuredVideo.removeAttribute('src');
    featuredVideo.load();
    document.body.classList.remove('modal-open');
    if (videoDialog.open) videoDialog.close();
  };
  $$('[data-media]').forEach((button) => button.addEventListener('click', () => {
    const key = button.dataset.media;
    if (!availableMedia.has(key) || !videoDialog || !featuredVideo) return;
    const item = media[key];
    setText('#video-dialog-title', item.title);
    setText('#video-description', item.detail);
    featuredVideo.src = item.src;
    previews.forEach((video) => video.pause());
    videoDialog.showModal();
    document.body.classList.add('modal-open');
    featuredVideo.play().catch(() => {});
  }));
  videoClose?.addEventListener('click', closeFilm);
  videoDialog?.addEventListener('click', (event) => { if (event.target === videoDialog) closeFilm(); });
  videoDialog?.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (!featuredVideo) return;
    featuredVideo.pause();
    featuredVideo.removeAttribute('src');
    featuredVideo.load();
    previews.forEach((video) => { if (previewIsVisible(video) && previewAllowed) video.play().catch(() => {}); });
  });
  addEventListener('pagehide', () => previews.forEach((video) => video.pause()));

  Object.entries(portraitSources).forEach(([key, src]) => {
    const target = $(`[data-portrait="${key}"]`);
    if (!target) return;
    const image = new Image();
    image.decoding = 'async';
    image.addEventListener('load', () => {
      target.src = src;
      target.classList.add('is-ready');
    }, { once: true });
    image.src = src;
  });

  const toast = $('#toast');
  let toastTimeout;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-shown');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('is-shown'), 3600);
  };
  $('#share-event')?.addEventListener('click', async () => {
    const shareData = {
      title: 'BIRIMANIA — GRB_imisaj vs Oeloves',
      text: '30 ottobre 2026 · dalle 19:00 · Casa di Fari. BIRIMANIA.',
      url: location.href.split('#')[0],
    };
    if (navigator.share) {
      try { await navigator.share(shareData); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    try {
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      showToast('Link dell’evento copiato.');
    } catch {
      showToast('Condivisione non disponibile in questo browser.');
    }
  });
})();
