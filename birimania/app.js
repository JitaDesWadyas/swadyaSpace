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

  // Native soundtrack players. Crucial: play() is executed synchronously inside
  // the first trusted pointerdown, not after a Promise/WebAudio resume. The
  // trailer soundtrack is independent of the muted video preview so it remains
  // audible while the visitor scrolls away from the hero.
  const videoDialog = $('#video-dialog');
  const featuredVideo = $('#featured-video');
  const videoClose = $('#video-close');
  const availableMedia = new Set();
  const previewVideos = {trailer:$('#hero-film'), faceoff:$('#faceoff-preview')};
  const previews = Object.values(previewVideos).filter(Boolean);
  const soundtracks = {trailer:$('#trailer-soundtrack'),faceoff:$('#faceoff-soundtrack')};
  let audioUnlocked = false, activeFilm = null, transitionFrame = 0, audioFrame = 0, transitionToken = 0;
  const previewAllowed = !reducedMotion && !navigator.connection?.saveData;
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
  const faceoffStage = $('#faceoff-stage');
  const chosenFilm = () => {
    if (!faceoffStage) return 'trailer';
    const rect = faceoffStage.getBoundingClientRect();
    return rect.top < innerHeight * .66 && rect.bottom > innerHeight * .25 ? 'faceoff' : 'trailer';
  };
  for (const [key, item] of Object.entries(media)) {
    const video = previewVideos[key];
    if (!video) continue;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = key === 'trailer' ? 'auto' : 'metadata';
    video.addEventListener('loadedmetadata', () => {
      activateMedia(key);
      video.classList.add('is-ready');
      if (key === 'trailer') $('.hero')?.classList.add('is-playing');
      else faceoffStage?.classList.add('has-film');
    });
    video.src = item.src;
    video.load();
    if (!previewAllowed) continue;
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => {
        if (entries[0]?.isIntersecting && !videoDialog?.open && !document.hidden) video.play().catch(() => {});
        else video.pause();
      },{threshold:.12});
      obs.observe(video);
    } else video.play().catch(() => {});
  }

  const stopFade = () => {
    transitionToken++;
    if (transitionFrame) cancelAnimationFrame(transitionFrame);
    transitionFrame=0;
  };
  const setSoundVolume = (key,value) => {
    try {if(soundtracks[key])soundtracks[key].volume=clamp(value,0,1);} catch {}
  };
  const pauseSoundtrack = key => soundtracks[key]?.pause();
  function switchSoundtrack(next) {
    if (!audioUnlocked || document.hidden || videoDialog?.open) return;
    const incoming = soundtracks[next];
    if (!incoming || activeFilm === next) return;
    const previous = activeFilm, outgoing = previous ? soundtracks[previous] : null;
    stopFade();
    // A faceoff entry starts the film and its soundtrack at the same time.
    if (next === 'faceoff') {
      try {incoming.currentTime=0;} catch {}
      const video=previewVideos.faceoff;
      if (video) {try{video.currentTime=0;}catch{} video.play().catch(()=>{});}
    }
    activeFilm = next;
    if (!previous) {
      setSoundVolume(next,1);
      incoming.play().catch(()=>{audioUnlocked=false;activeFilm=null;});
      return;
    }
    const initialIn = Number(incoming.volume) || 0;
    const initialOut = Number(outgoing?.volume) || 0;
    incoming.play().catch(() => {});
    const token=transitionToken;
    const start=performance.now(), duration=500;
    const tick=now=>{
      if(token!==transitionToken) return;
      const t=clamp((now-start)/duration,0,1);
      const ease=t*t*(3-2*t);
      setSoundVolume(next,initialIn+(1-initialIn)*ease);
      if(outgoing)setSoundVolume(previous,initialOut*(1-ease));
      if(t<1) transitionFrame=requestAnimationFrame(tick);
      else {transitionFrame=0;if(outgoing){outgoing.pause();setSoundVolume(previous,0);}}
    };
    transitionFrame=requestAnimationFrame(tick);
  }
  function syncAmbient() {
    audioFrame=0;
    if(!audioUnlocked || videoDialog?.open || document.hidden)return;
    switchSoundtrack(chosenFilm());
  }
  function requestAmbient(){if(!audioFrame)audioFrame=requestAnimationFrame(syncAmbient);}
  // Mobile autoplay restrictions are explicit: a visible, intentional TAP is
  // required. Do not unlock audio on scroll/pointerdown or claim it is playing.
  const startButton = $('#start-fight-audio');
  const lockIntroScroll = (locked) => {
    document.documentElement.classList.toggle('intro-locked', locked);
    document.body.classList.toggle('intro-locked', locked);
    if (locked) window.scrollTo(0, 0);
  };
  lockIntroScroll(true);
  const stopIntroScroll = (event) => {
    if (!document.body.classList.contains('intro-locked')) return;
    event.preventDefault();
  };
  ['wheel','touchmove'].forEach(type => startButton?.addEventListener(type, stopIntroScroll, { passive: false }));
  startButton?.addEventListener('keydown', event => { if (['Space','ArrowDown','ArrowUp','PageDown','PageUp'].includes(event.code || event.key)) event.preventDefault(); });
  const showSoundPrompt = message => {
    if(!startButton) return;
    startButton.hidden=false;
    startButton.classList.remove('is-started');
    if(message) {
      const label=startButton.querySelector('small');
      if(label) label.textContent=message;
    }
  };
  const startOnTap = () => {
    const trailer=soundtracks.trailer;
    const faceoff=soundtracks.faceoff;
    if(!trailer) return;
    if(audioUnlocked){startButton?.classList.add('is-started');return;}
    // Both calls happen in the same genuine click event: no await before play().
    // Once authorised, later soundtrack transitions can start in the background.
    trailer.muted=false;
    trailer.loop=true;
    setSoundVolume('trailer',1);
    const initial=chosenFilm();
    const startPromise=trailer.play();
    if(faceoff){
      faceoff.muted=false;
      faceoff.loop=true;
      setSoundVolume('faceoff',0);
      const prime=faceoff.play();
      if(prime && typeof prime.then==='function') prime.then(()=>{
        if(initial!=='faceoff')faceoff.pause();
      }).catch(()=>{});
    }
    Promise.resolve(startPromise).then(()=>{
      audioUnlocked=true;
      activeFilm='trailer';
      startButton?.classList.add('is-started');
      lockIntroScroll(false);
      document.documentElement.classList.add('audio-is-on');
      if(initial==='faceoff') switchSoundtrack('faceoff');
      else requestAmbient();
    }).catch(()=>{
      audioUnlocked=false;
      activeFilm=null;
      showSoundPrompt('RIPROVA PER AVVIARE LA MUSICA');
    });
  };
  startButton?.addEventListener('click',startOnTap);
  addEventListener('scroll',requestAmbient,{passive:true});
  addEventListener('resize',requestAmbient,{passive:true});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){stopFade();Object.values(soundtracks).forEach(x=>x?.pause());}
    else if(audioUnlocked){soundtracks[activeFilm||'trailer']?.play().catch(()=>{});requestAmbient();}
  });
  function silenceAll() {
    stopFade();
    for(const key of Object.keys(soundtracks)){setSoundVolume(key,0);pauseSoundtrack(key);}
    activeFilm=null;
  }
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
    if(audioUnlocked) {const next=chosenFilm();setSoundVolume(next,1);soundtracks[next]?.play().catch(()=>{});activeFilm=next;}
    requestAmbient();
    syncFilm();
  });
  addEventListener('pagehide', () => silenceAll());

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
