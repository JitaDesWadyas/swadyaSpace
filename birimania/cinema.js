/* BIRIMANIA / director's cut: one scroll animation owner, media sound after a user gesture.
   No libraries; no frame-by-frame clip-path, canvas or forced scrolling. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const clamp = (value, min=0, max=1) => Math.max(min, Math.min(max, value));
  const ease = value => { const x = clamp(value); return x*x*(3-2*x); };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!navigator.connection?.saveData;
  const limited = reduced || saveData;
  document.documentElement.classList.add('js-cinema');

  for (const heading of $$('.scene-words')) {
    [...heading.children].forEach((part,i) => part.style.setProperty('--word-index', i));
    if (limited || !('IntersectionObserver' in window)) heading.classList.add('scene-done');
  }
  if (!limited && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries,watcher) => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('scene-done'); watcher.unobserve(entry.target);
      }
    }, { threshold:.15 });
    $$('.scene-words').forEach(heading => observer.observe(heading));
  }

  const soundToggle = $('#sound-toggle');
  const soundCTA = $('#experience-audio');
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  let audioContext = null;
  let soundOn = false;
  let userChoseSound = false;
  let lastHit = 0;

  const updateSoundUI = () => {
    document.documentElement.classList.toggle('audio-is-on', soundOn);
    if (!soundToggle) return;
    soundToggle.setAttribute('aria-pressed',String(soundOn));
    soundToggle.setAttribute('aria-label', soundOn?'Disattiva la colonna sonora':'Attiva la colonna sonora');
    const label = soundToggle.querySelector('.sound-label');
    if (label) label.textContent = soundOn?'AUDIO ON':'AUDIO OFF';
    const glyph = soundToggle.querySelector('.sound-glyph');
    if (glyph) glyph.textContent = soundOn?'◖))':'◖';
  };
  const setSound = enabled => {
    userChoseSound = true;
    soundOn = !!enabled;
    if (soundOn && AudioCtor) {
      try {
        audioContext ||= new AudioCtor();
        // Invocation begins inside the pointer/keyboard event, not after a timer or observer.
        audioContext.resume().catch(() => {});
      } catch { audioContext = null; }
    }
    updateSoundUI();
    dispatchEvent(new CustomEvent('birimania:sound',{detail:{enabled:soundOn}}));
  };
  soundToggle?.addEventListener('click',() => setSound(!soundOn));
  soundCTA?.addEventListener('click',event => {event.stopPropagation();setSound(true);});

  // The first deliberate touch unlocks the soundscape, as requested. It is never
  // re-enabled automatically after the user switches it off.
  const firstInteraction = event => {
    if (userChoseSound || document.hidden) return;
    if (event.target?.closest?.('#sound-toggle,#experience-audio,#video-dialog')) return;
    setSound(true);
  };
  document.addEventListener('pointerup',firstInteraction,{capture:true,passive:true});
  document.addEventListener('keydown',event => {
    if (!userChoseSound && ['Enter',' ','ArrowDown','PageDown'].includes(event.key)) firstInteraction(event);
  });
  updateSoundUI();

  const stinger = type => {
    if (!soundOn || !audioContext || audioContext.state!=='running' || document.hidden || $('#video-dialog')?.open) return;
    if (performance.now()-lastHit < 900) return;
    lastHit = performance.now();
    const t=audioContext.currentTime+.015;
    const playTone=(f1,f2,duration,gainValue,wave) => {
      const osc=audioContext.createOscillator(),gain=audioContext.createGain();
      osc.type=wave;
      osc.frequency.setValueAtTime(f1,t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(f2,30),t+duration);
      gain.gain.setValueAtTime(.0001,t);
      gain.gain.exponentialRampToValueAtTime(gainValue,t+.012);
      gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
      osc.connect(gain);gain.connect(audioContext.destination);
      osc.start(t);osc.stop(t+duration+.02);
    };
    if(type==='sweep'){
      playTone(600,90,.32,.035,'triangle');
    }else{
      playTone(110,42,.36,.075,'sine');
      playTone(410,65,.18,.026,'triangle');
    }
  };

  const chapter=$('#fighters-scroll');
  const stage=$('#fighter-grid');
  const red=$('.fighter-red');
  const cream=$('.fighter-cream');
  const redFigure=$('.fighter-red .fighter-art img');
  const creamFigure=$('.fighter-cream .fighter-art img');
  const redContent=$('.fighter-red .fighter-content');
  const creamContent=$('.fighter-cream .fighter-content');
  const duo=$('#fighter-duo');
  const progress=$('.fighter-film-progress span');
  const hint=$('.fighter-film-hint');
  const arena=$('#arena-scene');
  const screen=$('#arena-screen-shell');
  const faceoff=$('#faceoff-stage');
  let lastPhase=-1, frame=0, pointerYaw=0;

  const paint=() => {
    frame=0;
    if (!document.hidden && chapter && stage && !reduced) {
      const rect=chapter.getBoundingClientRect();
      const vh=innerHeight;
      if(rect.bottom>0 && rect.top<vh){
        const progressY=clamp(-rect.top/Math.max(1,rect.height-vh));
        const enterCream=ease((progressY-.22)/.39);
        const revealDuo=ease((progressY-.69)/.25);
        const creamX=112*(1-enterCream);
        if(cream) cream.style.transform=`translate3d(${creamX.toFixed(2)}%,0,0)`;
        if(redFigure) redFigure.style.transform=`translate3d(${(-2*progressY).toFixed(2)}%,0,0) scale(${(1+ease(progressY/.3)*.075).toFixed(3)})`;
        if(creamFigure) creamFigure.style.transform=`scale(${(1.045-.025*enterCream).toFixed(3)})`;
        if(redContent) redContent.style.opacity=String(clamp(1-enterCream*.48-revealDuo*.18,.3,1));
        if(creamContent) creamContent.style.opacity=String(clamp(.55+enterCream*.45-revealDuo*.3,.3,1));
        if(duo){
          duo.style.visibility=revealDuo>.005?'visible':'hidden';
          duo.style.opacity=revealDuo.toFixed(3);
          duo.style.transform=`translate3d(0,${((1-revealDuo)*5).toFixed(2)}%,0)`;
        }
        if(progress) progress.style.transform=`scaleX(${progressY.toFixed(3)})`;
        if(hint) hint.style.opacity=String(1-ease((progressY-.12)/.15));
        const phase=progressY<.24?0:progressY<.70?1:2;
        if(phase!==lastPhase){
          if(progressY>.015) stinger(phase===1?'sweep':'impact');
          lastPhase=phase;
        }
      }else lastPhase=-1;
    }
    if(!limited && arena && screen){
      const bounds=arena.getBoundingClientRect();
      if(bounds.bottom>0&&bounds.top<innerHeight){
        const focus=clamp(1-Math.abs((bounds.top+bounds.height*.5-innerHeight*.51)/(innerHeight*.85)));
        screen.style.transform=`rotateX(${(2-focus*1.7).toFixed(2)}deg) rotateY(${pointerYaw.toFixed(2)}deg) translateZ(${(focus*12).toFixed(2)}px)`;
      }
    }
    if(!limited && faceoff){
      // No animated brightness/filter on an active H.264 video: decoding remains cheap.
      const rect=faceoff.getBoundingClientRect();
      if(rect.bottom>0&&rect.top<innerHeight) faceoff.style.setProperty('--film-spot','1');
    }
  };
  function requestPaint(){if(!frame)frame=requestAnimationFrame(paint);}
  addEventListener('scroll',requestPaint,{passive:true});
  addEventListener('resize',requestPaint,{passive:true});
  addEventListener('pageshow',requestPaint);
  if(arena && !limited && matchMedia('(hover:hover)').matches){
    arena.addEventListener('pointermove',event=>{
      const box=arena.getBoundingClientRect();
      pointerYaw=clamp((event.clientX-box.left-box.width/2)/box.width,-.5,.5)*-3;
      requestPaint();
    },{passive:true});
    arena.addEventListener('pointerleave',()=>{pointerYaw=0;requestPaint();});
  }
  requestPaint();
  addEventListener('pagehide',()=>audioContext?.suspend?.().catch(()=>{}));
})();
