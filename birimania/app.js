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

  // Lightweight reading progress; cinematic sequences live in cinema.js.
  const progressBar = $('#reading-bar');
  let progressFrame = 0;
  const paintReading = () => {
    progressFrame = 0;
    const total = document.documentElement.scrollHeight - innerHeight;
    if (progressBar && total > 0) progressBar.style.transform = `scaleX(${clamp(scrollY / total, 0, 1)})`;
  };
  addEventListener('scroll', () => { if (!progressFrame) progressFrame = requestAnimationFrame(paintReading); }, {passive:true});
  paintReading();

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
  const previewVideos = {trailer:$('#hero-film'),faceoff:$('#faceoff-preview')};
  const previews = Object.values(previewVideos).filter(Boolean);
  const AudioClass = window.AudioContext || window.webkitAudioContext;
  let audioUnlocked = false, audioContext = null, activeFilm = null, syncPending = false;
  const gains = {};
  let fadeTimer = null, handoffVersion = 0;
  const previewAllowed = !reducedMotion && !navigator.connection?.saveData;
  const clampVolume = amount => Math.min(1,Math.max(0,amount));
  const previewIsVisible = video => {
    if (!video) return false;
    const rect = video.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < innerHeight;
  };
  const activateMedia = key => {
    if (availableMedia.has(key)) return;
    availableMedia.add(key);
    $$(`[data-media="${key}"]`).forEach(button => button.disabled = false);
    $$(`[data-media-label="${key}"]`).forEach(label => { label.textContent = media[key].label; });
  };
  // The small MP4s are loaded early: a first gesture cannot unlock sound on a
  // video with no decoded metadata. Video is allowed to autoplay *muted* only.
  for (const [key, item] of Object.entries(media)) {
    const video = previewVideos[key];
    if (!video) continue;
    video.muted = true;
    video.volume = 1;
    video.loop = true;
    video.playsInline = true;
    video.preload = key === 'trailer' ? 'auto' : 'metadata';
    video.addEventListener('loadedmetadata', () => {
      activateMedia(key);
      video.classList.add('is-ready');
      if (key === 'trailer') $('.hero')?.classList.add('is-playing');
      else $('#faceoff-stage')?.classList.add('has-film');
      requestAmbient();
    });
    video.addEventListener('error', () => {}, {once:true});
    video.src = item.src;
    video.load();
  }
  // Web Audio gain fades work on Android AND iOS, unlike HTMLMediaElement.volume.
  // If Web Audio is unavailable the media volume remains a safe fallback.
  const unlockAudio = () => {
    if (audioUnlocked || document.hidden || videoDialog?.open) return;
    audioUnlocked = true;
    if (AudioClass) {
      try {
        audioContext = new AudioClass();
        for (const [key, video] of Object.entries(previewVideos)) {
          if (!video) continue;
          const source = audioContext.createMediaElementSource(video);
          const gain = audioContext.createGain();
          gain.gain.value = 0;
          source.connect(gain).connect(audioContext.destination);
          gains[key] = gain;
        }
        audioContext.resume().catch(() => {});
      } catch (error) { audioContext = null; }
    }
    // Prime both media elements inside the same trusted gesture. Safari/WebView
    // may block a later unmuted play if the second film was never authorized.
    const wanted = chosenFilm();
    for (const [key, video] of Object.entries(previewVideos)) {
      if (!video) continue;
      video.muted = false;
      video.play().catch(() => {});
      if (key !== wanted) fadeGain(key,0,.05);
    }
    // Calling play() in the *original pointerdown* is critical; a deferred
    // callback may lose the browser's transient user activation.
    syncAmbient(true);
    const skip = wanted === 'trailer' ? 'faceoff' : 'trailer';
    setTimeout(() => {
      if (activeFilm !== skip) previewVideos[skip]?.pause();
    }, 120);
  };
  document.addEventListener('pointerdown', unlockAudio, {capture:true,passive:true});
  document.addEventListener('keydown', event => {
    if (['Enter',' ','ArrowDown','PageDown'].includes(event.key)) unlockAudio();
  }, {capture:true});
  const chosenFilm = () => {
    const faceoff = $('#faceoff-stage');
    if (!faceoff) return 'trailer';
    const rect = faceoff.getBoundingClientRect();
    // The faceoff becomes the soundtrack only when the movie actually enters.
    return rect.top < innerHeight * .7 && rect.bottom > innerHeight * .16 ? 'faceoff' : 'trailer';
  };
  const fadeGain = (key, target, seconds=.45, delay=0) => {
    const video = previewVideos[key];
    if (!video) return;
    const gain = gains[key];
    if (audioContext && gain) {
      const t = audioContext.currentTime + delay;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setValueAtTime(gain.gain.value, t);
      gain.gain.linearRampToValueAtTime(target, t + seconds);
    } else {
      // volume is sometimes read-only on Safari; gain graph above is preferred.
      try { video.volume = clampVolume(target); } catch {}
    }
  };
  const silenceAll = () => {
    clearTimeout(fadeTimer);
    ++handoffVersion;
    for (const [key, video] of Object.entries(previewVideos)) {
      if (!video) continue;
      fadeGain(key,0,.12);
      video.pause();
      video.muted = true;
    }
    activeFilm = null;
  };
  function syncAmbient(immediateGesture=false) {
    syncPending = false;
    if (document.hidden || videoDialog?.open) { silenceAll(); return; }
    if (!audioUnlocked) {
      if (!previewAllowed) return;
      const trailer = previewVideos.trailer;
      if (trailer && trailer.paused && previewIsVisible(trailer)) trailer.play().catch(()=>{});
      return;
    }
    const key=chosenFilm(),chosen=previewVideos[key];
    if (!chosen) return;
    // Remove HTML mute inside the gesture; output is controlled by the gain node.
    chosen.muted=false;
    if (immediateGesture) chosen.pause();
    if (immediateGesture || chosen.paused) chosen.play().catch(() => {
      // A few embedded browsers require another explicit tap. We never pretend
      // that playback succeeded; the next pointerdown retries this path.
      chosen.muted = true;
      chosen.play().catch(()=>{});
      audioUnlocked = false;
    });
    if (activeFilm === key) return;
    const old = activeFilm;
    activeFilm = key;
    const version=++handoffVersion;
    clearTimeout(fadeTimer);
    if (old && previewVideos[old]) fadeGain(old,0,.23);
    fadeGain(key,.85,old ? .40 : .55, old ? .22 : 0);
    if (old && previewVideos[old]) {
      fadeTimer=setTimeout(() => {
        if (version!==handoffVersion) return;
        previewVideos[old].pause();
        previewVideos[old].muted=true;
      },510);
    }
  }
  function requestAmbient() {
    if (syncPending) return;
    syncPending=true;
    requestAnimationFrame(() => syncAmbient());
  }
  addEventListener('scroll',requestAmbient,{passive:true});
  addEventListener('resize',requestAmbient,{passive:true});
  document.addEventListener('visibilitychange',requestAmbient);
  requestAmbient();

  const videoContainer = $('#cinema-video-wrap');
  const filmPlay = $('#film-play');
  const bigPlay = $('#cinema-big-play');
  const filmMute = $('#film-mute');
  const filmProgress = $('#film-progress');
  const filmFullscreen = $('#film-fullscreen');
  const filmTime = $('#film-time');
  const filmDuration = $('#film-duration');
  const displayTime = seconds => {
    const secs = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    return `${String(Math.floor(secs / 60)).padStart(2,'0')}:${String(secs % 60).padStart(2,'0')}`;
  };
  const syncFilm = () => {
    if (!featuredVideo || !filmProgress) return;
    const duration = featuredVideo.duration || 0;
    const pct = duration ? clamp(featuredVideo.currentTime / duration, 0, 1) : 0;
    filmProgress.value = String(Math.round(pct * 1000));
    filmProgress.style.setProperty('--film-position', `${pct*100}%`);
    filmTime.textContent = displayTime(featuredVideo.currentTime);
    filmDuration.textContent = displayTime(duration);
    const paused = featuredVideo.paused;
    filmPlay.textContent = paused ? '▶' : 'Ⅱ';
    filmPlay.setAttribute('aria-label', paused ? 'Riproduci' : 'Metti in pausa');
    bigPlay.classList.toggle('is-paused', paused);
    filmMute.textContent = featuredVideo.muted ? '◌' : '◖';
    filmMute.setAttribute('aria-label', featuredVideo.muted ? 'Attiva audio del video' : 'Disattiva audio del video');
  };
  const toggleFilm = () => {
    if (!featuredVideo || !videoDialog.open) return;
    if (featuredVideo.paused) featuredVideo.play().catch(syncFilm);
    else featuredVideo.pause();
    syncFilm();
  };
  for (const eventName of ['loadedmetadata','timeupdate','play','pause','ended','volumechange']) {
    featuredVideo?.addEventListener(eventName, syncFilm);
  }
  filmPlay?.addEventListener('click', toggleFilm);
  bigPlay?.addEventListener('click', toggleFilm);
  featuredVideo?.addEventListener('click', toggleFilm);
  filmProgress?.addEventListener('input', () => {
    if (Number.isFinite(featuredVideo.duration) && featuredVideo.duration > 0)
      featuredVideo.currentTime = featuredVideo.duration * (Number(filmProgress.value) / 1000);
    syncFilm();
  });
  filmMute?.addEventListener('click', () => {featuredVideo.muted = !featuredVideo.muted; syncFilm();});
  filmFullscreen?.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else if (videoContainer?.requestFullscreen) videoContainer.requestFullscreen().catch(() => {});
    else featuredVideo?.webkitEnterFullscreen?.();
  });
  addEventListener('keydown', event => {
    if (!videoDialog?.open) return;
    if (event.code === 'Space' && !['INPUT','BUTTON'].includes(document.activeElement?.tagName)) {
      event.preventDefault(); toggleFilm();
    }
    if (event.key === 'ArrowRight' && document.activeElement === filmProgress) featuredVideo.currentTime += 5;
  });
  const closeFilm = () => {
    if (!featuredVideo) return;
    featuredVideo.pause();
    featuredVideo.removeAttribute('src');
    featuredVideo.load();
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    document.body.classList.remove('modal-open');
    if (videoDialog.open) videoDialog.close();
    syncFilm();
  };
  $$('[data-media]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.media;
    if (!availableMedia.has(key) || !videoDialog || !featuredVideo) return;
    const item = media[key];
    setText('#video-dialog-title', item.title);
    setText('#video-description', item.detail);
    featuredVideo.src = item.src;
    featuredVideo.muted = false; // Click is an explicit user gesture.
    featuredVideo.volume = 1;
    silenceAll();
    videoDialog.showModal();
    document.body.classList.add('modal-open');
    featuredVideo.play().catch(syncFilm);
    syncFilm();
  }));
  videoClose?.addEventListener('click', closeFilm);
  videoDialog?.addEventListener('click', event => {if (event.target === videoDialog) closeFilm();});
  videoDialog?.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (!featuredVideo) return;
    featuredVideo.pause();
    featuredVideo.removeAttribute('src');
    featuredVideo.load();
    activeFilm = null;
    requestAmbient();
    syncFilm();
  });
  addEventListener('pagehide', () => { silenceAll(); audioContext?.suspend().catch(()=>{}); });

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
