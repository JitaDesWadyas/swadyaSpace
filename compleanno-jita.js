(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  let audio = null, sound = false, sequencer = null, beat = 0;
  const soundButton = $('sound');
  const motionButton = $('motion');
  function syncMotion() {
    document.documentElement.classList.toggle('paused', paused);
    motionButton.textContent = paused ? 'Attiva effetti' : 'Pausa effetti';
    motionButton.setAttribute('aria-pressed', String(paused));
  }
  syncMotion();
  motionButton.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reduced.addEventListener('change', event => { paused = event.matches; syncMotion(); });
  function tone(freq, duration = .12, type = 'sine', volume = .04, end = freq) {
    if (!sound || !audio || audio.state !== 'running' || document.hidden) return;
    const oscillator = audio.createOscillator(), gain = audio.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audio.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(end, audio.currentTime + duration);
    gain.gain.setValueAtTime(volume, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + duration);
    oscillator.connect(gain); gain.connect(audio.destination);
    oscillator.start(); oscillator.stop(audio.currentTime + duration);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  function stopSound() {
    sound = false; clearInterval(sequencer); sequencer = null;
    if (audio) audio.suspend().catch(() => {});
    soundButton.innerHTML = 'Suono OFF <span aria-hidden="true">◖))</span>';
    soundButton.setAttribute('aria-pressed', 'false');
  }
  soundButton.addEventListener('click', async () => {
    if (sound) { stopSound(); return; }
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) throw new Error('unsupported');
      if (!audio) audio = new Audio();
      await audio.resume();
      sound = true;
      soundButton.innerHTML = 'Suono ON <span aria-hidden="true">◖))</span>';
      soundButton.setAttribute('aria-pressed', 'true');
      tone(440, .2, 'triangle');
      sequencer = setInterval(() => {
        const notes = [110, 110, 130.81, 98, 110, 164.81, 130.81, 98];
        tone(notes[beat % notes.length], .2, 'triangle', .035);
        if (beat % 2 === 0) tone(140, .15, 'sine', .06, 42);
        if (beat % 4 === 3) tone(880, .05, 'triangle', .008);
        beat++;
      }, 254);
    } catch (_) { stopSound(); soundButton.textContent = 'Audio non disponibile'; }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopSound(); });
  window.addEventListener('pagehide', stopSound);
  function burst(x, y, count = 16) {
    if (paused || reduced.matches) return;
    const layer = $('particles');
    if (layer.childElementCount > 60) return;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      particle.className = 'particle';
      particle.textContent = ['✳', '+', '↗', '●'][i % 4];
      particle.style.left = x + 'px'; particle.style.top = y + 'px';
      particle.style.color = ['#e5ff43', '#ff6b35', '#f2eedf', '#6576ff'][i % 4];
      particle.style.setProperty('--dx', (Math.random() - .5) * 480 + 'px');
      particle.style.setProperty('--dy', (Math.random() - .65) * 440 + 'px');
      particle.style.setProperty('--rotation', (Math.random() - .5) * 700 + 'deg');
      layer.appendChild(particle); setTimeout(() => particle.remove(), 1400);
    }
  }
  function centerBurst(element, count) { const r = element.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, count); }
  let chaosTimer;
  $('chaos').addEventListener('click', () => {
    centerBurst($('chaos'), 32); tone(120, .6, 'sawtooth', .025, 900);
    $('chaos-status').textContent = ['Hai premuto. Sei decisamente nel gruppo giusto.', 'Achievement: zero autocontrollo.', 'Le patatine hanno abbandonato l’orbita.'][Math.floor(Math.random() * 3)];
    if (!paused && !reduced.matches) { document.body.classList.add('party'); clearTimeout(chaosTimer); chaosTimer = setTimeout(() => document.body.classList.remove('party'), 1200); }
  });
  $('jump').addEventListener('click', () => {
    const pad = $('jump'); pad.classList.remove('bouncing'); void pad.offsetWidth; pad.classList.add('bouncing');
    tone(130, .3, 'sine', .06, 620); centerBurst(pad, 10);
  });
  const positions = [[8, 10], [69, 49], [20, 60], [62, 8], [40, 36]];
  let hits = 0;
  $('target').addEventListener('click', () => {
    hits++; centerBurst($('target'), 8); tone(1000, .16, 'sawtooth', .025, 100);
    $('score').textContent = hits < 5 ? hits + ' / 5' : '5 / 5 · MIRA CALDA';
    if (hits === 5) { $('target').disabled = true; return; }
    $('target').style.left = positions[hits - 1][0] + '%';
    $('target').style.top = positions[hits - 1][1] + '%';
  });
  $('reset-game').addEventListener('click', () => {
    hits = 0; $('score').textContent = '0 / 5'; $('target').disabled = false;
    $('target').style.left = '45%'; $('target').style.top = '25%'; $('target').focus();
  });
  let washed = false;
  $('wash').addEventListener('input', event => {
    const value = Number(event.target.value);
    $('wash-label').textContent = value < 30 ? 'POST LASER' : value < 70 ? 'RESET IN CORSO' : value < 100 ? 'QUASI UMANO' : 'PRONTO PER WALLES';
    if (value === 100 && !washed) { washed = true; centerBurst($('wash-label'), 18); tone(660, .3, 'triangle'); }
    if (value < 100) washed = false;
  });
  $('share').addEventListener('click', async () => {
    const url = new URL('compleanno-jita.html', location.href).href;
    const data = { title: 'Compleanno Jita', text: 'Salti, laser game, doccia e Walles. Sei nel gruppo giusto. Data e orari da confermare.', url };
    try {
      if (navigator.share) { await navigator.share(data); $('share-status').textContent = 'Invito condiviso.'; }
      else if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(url); $('share-status').textContent = 'Link copiato. Incollalo nella chat della crew.'; }
      else { $('share-status').textContent = 'Copia il link dalla barra degli indirizzi e mandalo alla crew.'; }
    } catch (error) { if (error.name !== 'AbortError') $('share-status').textContent = 'Condivisione non riuscita. Copia il link dalla barra degli indirizzi.'; }
  });
  let framePending = false;
  function updateProgress() {
    const range = document.documentElement.scrollHeight - innerHeight;
    document.querySelector('.progress').style.transform = 'scaleX(' + (range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0) + ')';
    framePending = false;
  }
  window.addEventListener('scroll', () => { if (!framePending) { framePending = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  window.addEventListener('resize', updateProgress); updateProgress();
})();
