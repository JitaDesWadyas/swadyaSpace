/* BIRIMANIA // Cinematic direction. Scroll-driven camera, fighter sequence and original WebAudio stingers.
   Runs without third-party animation libraries and respects reduced-motion and data-saving settings. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const clamp = (n, a=0, b=1) => Math.max(a, Math.min(b, n));
  const smooth = x => {const t=clamp(x);return t*t*(3-2*t);};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!navigator.connection?.saveData;
  const limited = reduced || saveData;
  document.documentElement.classList.add('js-cinema');

  // Kinetic headline reveals: each line lands with its own timing.
  const lines = $$('.scene-words');
  for (const heading of lines) {
    [...heading.children].forEach((part, i) => part.style.setProperty('--word-index', i));
    if (limited || !('IntersectionObserver' in window)) heading.classList.add('scene-done');
  }
  if (!limited && 'IntersectionObserver' in window) {
    const wordWatcher = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('scene-done');
        observer.unobserve(entry.target);
      }
    }, {threshold:.16,rootMargin:'0px 0px -8% 0px'});
    lines.forEach(node=>wordWatcher.observe(node));
  }

  const stage = $('#fighters-scroll');
  const red = $('.fighter-red');
  const cream = $('.fighter-cream');
  const redFigure = $('.fighter-red .fighter-art img');
  const creamFigure = $('.fighter-cream .fighter-art img');
  const redContent = $('.fighter-red .fighter-content');
  const creamContent = $('.fighter-cream .fighter-content');
  const vs = $('.fighters-center-vs');
  const fightProgress = $('.fighter-film-progress span');
  const hint = $('.fighter-film-hint');
  const arena = $('#arena-scene');
  const screen = $('#arena-screen-shell');
  const cutLeft = $('.hero-cutout-one');
  const cutRight = $('.hero-cutout-two');
  const faceoff = $('#faceoff-stage');
  let currentPhase = -1;
  let firstFighterSoundPlayed = false;
  let frame = 0;

  // Audio defaults OFF. A tap is required by mobile browser autoplay policies.
  const soundButton = $('#sound-toggle');
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;
  let soundOn = false;
  let lastStinger = 0;
  const tone = (start, freq, endFreq, duration, level, type='sine') => {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(endFreq,30),start+duration);
    gain.gain.setValueAtTime(.0001,start);
    gain.gain.exponentialRampToValueAtTime(level,start+.017);
    gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
    oscillator.connect(gain);gain.connect(audioCtx.destination);
    oscillator.start(start);oscillator.stop(start+duration+.02);
  };
  const hit = (kind='impact') => {
    if (!soundOn || !audioCtx || audioCtx.state!=='running' || document.hidden || $('#video-dialog')?.open) return;
    const now=performance.now();
    if(now-lastStinger<1150)return;
    lastStinger=now;
    const t=audioCtx.currentTime+.01;
    if(kind==='whoosh') {
      tone(t,280,65,.25,.045,'triangle');
      tone(t+.02,1100,200,.14,.016,'sawtooth');
    }else{
      tone(t,125,40,.36,.065,'sine');
      tone(t+.035,460,65,.16,.021,'triangle');
    }
  };
  soundButton?.addEventListener('click', async () => {
    if(!soundOn){
      if(!AudioContextCtor){soundButton.setAttribute('aria-label','Audio non supportato');return;}
      try{
        audioCtx ||= new AudioContextCtor();
        await audioCtx.resume();
        soundOn = audioCtx.state==='running';
      }catch{soundOn=false;}
    }else soundOn=false;
    soundButton.setAttribute('aria-pressed',String(soundOn));
    soundButton.setAttribute('aria-label',soundOn?'Disattiva audio ed effetti':'Attiva audio ed effetti');
    const label=$('.sound-label');if(label)label.textContent=soundOn?'AUDIO ON':'AUDIO OFF';
    const glyph=$('.sound-glyph');if(glyph)glyph.textContent=soundOn?'◖))':'◖';
    // Synchronously broadcast the consent choice for muted video previews.
    dispatchEvent(new CustomEvent('birimania:sound',{detail:{enabled:soundOn}}));
    if(soundOn){lastStinger=0;hit('impact');}
  });

  function draw() {
    frame=0;
    const wh=innerHeight;
    if (stage && red && cream && !reduced) {
      const rect=stage.getBoundingClientRect();
      if(rect.bottom>0&&rect.top<wh){
        const track=Math.max(1,rect.height-wh);
        const p=clamp(-rect.top/track);
        // Chapter A: red corner approaches; chapter B: second fighter wipes across;
        // finale: two faces share one screen, split organically without a static dividing rule.
        const coming=smooth((p-.34)/.30);
        const finale=smooth((p-.76)/.19);
        const redCut=50*finale;
        const rightInset=100*(1-coming)*(1-finale)+50*finale;
        red.style.clipPath=`inset(0 ${redCut.toFixed(2)}% 0 0)`;
        cream.style.clipPath=`inset(0 0 0 ${rightInset.toFixed(2)}%)`;
        if(redFigure)redFigure.style.transform=`translate3d(${(-p*3).toFixed(1)}%,0,0) scale(${(1+Math.min(p,.55)*.18).toFixed(3)})`;
        if(creamFigure)creamFigure.style.transform=`translate3d(${((1-coming)*8).toFixed(1)}%,0,0) scale(${(1.16-coming*.12+finale*.07).toFixed(3)})`;
        if(redContent)redContent.style.opacity=String(clamp(1-coming*.55-finale*.25,.15,1));
        if(creamContent)creamContent.style.opacity=String(clamp(.3+coming*.7-finale*.3,.18,1));
        if(vs){vs.style.opacity=String(finale);vs.style.transform=`translate(-50%,-50%) scale(${(.65+.35*finale).toFixed(3)})`;}
        if(fightProgress)fightProgress.style.transform=`scaleX(${p})`;
        if(hint)hint.style.opacity=String(1-smooth((p-.15)/.23));
        const phase=p<.35?0:p<.76?1:2;
        if(phase===0 && p>.04 && !firstFighterSoundPlayed){hit('impact');if(soundOn)firstFighterSoundPlayed=true;}
        if(phase!==currentPhase){
          if(currentPhase!==-1)hit(phase===1?'whoosh':'impact');
          else if(phase===0&&p>.02)hit();
          currentPhase=phase;
        }
      }
    }
    if (!limited && arena && screen) {
      const bounds=arena.getBoundingClientRect();
      if(bounds.bottom>0&&bounds.top<wh){
        const focus=clamp(1-Math.abs((bounds.top+bounds.height*.5-wh*.52)/(wh*.8)));
        screen.style.transform=`rotateX(${(3-focus*3).toFixed(2)}deg) rotateY(${(pointerYaw).toFixed(2)}deg) translateZ(${(focus*18).toFixed(2)}px)`;
      }
    }
    if(!limited && cutLeft && cutRight && scrollY<wh*1.4){
      const d=clamp(scrollY/(wh*1.4));
      cutLeft.style.transform=`translate3d(${(-d*17).toFixed(1)}px,${(-d*12).toFixed(1)}px,0) scale(${(1+d*.10).toFixed(3)})`;
      cutRight.style.transform=`translate3d(${(d*17).toFixed(1)}px,${(-d*12).toFixed(1)}px,0) scale(${(1+d*.10).toFixed(3)})`;
    }
    if(!limited && faceoff){
      const rect=faceoff.getBoundingClientRect();
      if(rect.bottom>0&&rect.top<wh){
        const f=clamp(1-Math.abs(rect.top+rect.height*.5-wh*.5)/(wh*.75));
        faceoff.style.filter=`brightness(${(.86+f*.14).toFixed(3)})`;
      }
    }
  }
  let pointerYaw=0;
  if(arena && !limited && matchMedia('(hover:hover)').matches) {
    arena.addEventListener('pointermove',event=>{
      const b=arena.getBoundingClientRect();
      pointerYaw=clamp((event.clientX-(b.left+b.width*.5))/b.width,-.5,.5)*-6;
      schedule();
    },{passive:true});
    arena.addEventListener('pointerleave',()=>{pointerYaw=0;schedule();});
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(draw);}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('pageshow',schedule);
  if(reduced && red && cream){red.style.clipPath='inset(0 50% 0 0)';cream.style.clipPath='inset(0 0 0 50%)';}
  schedule();
  addEventListener('pagehide',()=>{if(audioCtx?.state==='running')audioCtx.suspend().catch(()=>{});});
})();
