/* BIRIMANIA cinematic duo. Only transforms and opacity change during scroll.
   Sound unlock happens during the first trusted pointer / keyboard interaction. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const clamp = (x,min=0,max=1) => Math.min(max,Math.max(min,x));
  const smooth = x => {x=clamp(x);return x*x*(3-2*x)};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!navigator.connection?.saveData;
  const limited = reduced || saveData;
  document.documentElement.classList.add('js-cinema');

  for(const heading of $$('.scene-words')) {
    [...heading.children].forEach((node,i)=>node.style.setProperty('--word-index',i));
    if(limited) heading.classList.add('scene-done');
  }
  if(!limited && 'IntersectionObserver' in window) {
    const obs=new IntersectionObserver((entries,io)=>{
      for(const item of entries) if(item.isIntersecting) {
        item.target.classList.add('scene-done');io.unobserve(item.target);
      }
    },{threshold:.1});
    $$('.scene-words').forEach(node=>obs.observe(node));
  } else $$('.scene-words').forEach(node=>node.classList.add('scene-done'));

  const AudioCtor=window.AudioContext||window.webkitAudioContext;
  let audioContext=null, soundOn=false,hitAt=0;
  const unlockSound=event=>{
    if(soundOn || document.hidden || !event.isTrusted) return;
    soundOn=true;
    if(AudioCtor){
      try {audioContext=new AudioCtor();audioContext.resume().catch(()=>{});}catch{}
    }
    // The media handler plays the selected preview immediately in this gesture.
    dispatchEvent(new CustomEvent('birimania:sound',{detail:{enabled:true}}));
  };
  document.addEventListener('pointerdown',unlockSound,{capture:true,passive:true});
  document.addEventListener('keydown',event=>{
    if(['Enter',' ','ArrowDown','PageDown'].includes(event.key)) unlockSound(event);
  },{capture:true});

  const whoosh=()=>{
    if(!soundOn||!audioContext||audioContext.state!=='running'||document.hidden||$('#video-dialog')?.open)return;
    const now=performance.now();if(now-hitAt<1100)return;hitAt=now;
    const t=audioContext.currentTime+.01;
    const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();
    oscillator.type='triangle';oscillator.frequency.setValueAtTime(280,t);
    oscillator.frequency.exponentialRampToValueAtTime(54,t+.28);
    gain.gain.setValueAtTime(.0001,t);
    gain.gain.exponentialRampToValueAtTime(.028,t+.015);
    gain.gain.exponentialRampToValueAtTime(.0001,t+.29);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(t);oscillator.stop(t+.3);
  };

  const chapter=$('#fighters-scroll');
  const duo=$('#fighter-duo');
  const topShot=$('.duo-red');
  const bottomShot=$('.duo-black');
  const topImage=$('.duo-red img');
  const bottomImage=$('.duo-black img');
  const topWord=$('.duo-red .duo-word');
  const bottomWord=$('.duo-black .duo-word');
  const versus=$('.duo-versus');
  const progressLine=$('.fighter-film-progress span');
  const arena=$('#arena-scene');
  const screen=$('#arena-screen-shell');
  let frame=0,previousStage=-1,pointerYaw=0;
  function draw(){
    frame=0;
    if(chapter && duo && !limited){
      const rect=chapter.getBoundingClientRect(),vh=innerHeight;
      if(rect.bottom>0 && rect.top<vh){
        const progress=clamp(-rect.top/Math.max(1,rect.height-vh));
        // Small deliberate camera choreography: tighten on GRB, reveal the lower
        // fighter on the diagonal, pull back to the complete two-shot.
        const intro=smooth(progress/.28);
        const reveal=smooth((progress-.22)/.32);
        const finale=smooth((progress-.56)/.35);
        const overall=1+.055*(1-finale);
        duo.style.transform=`translate3d(0,0,0) scale(${overall.toFixed(3)})`;
        if(topImage) topImage.style.transform=`translate3d(0,${(-intro*1.5+finale*1.5).toFixed(2)}%,0) scale(${(1+.065*intro-.065*finale).toFixed(3)})`;
        if(bottomImage) bottomImage.style.transform=`translate3d(0,${((1-reveal)*6).toFixed(2)}%,0) scale(${(1+.05*(1-finale)).toFixed(3)})`;
        if(bottomShot) bottomShot.style.opacity=String(.42+.58*reveal);
        if(bottomWord) bottomWord.style.opacity=String(.5+.5*reveal);
        if(topWord) topWord.style.transform=`translate3d(${(-1.8*intro+1.8*finale).toFixed(2)}%,0,0)`;
        if(versus) versus.style.transform=`translate(-50%,-50%) rotate(${(-7+7*finale).toFixed(2)}deg) scale(${(.78+.22*reveal).toFixed(3)})`;
        if(progressLine) progressLine.style.transform=`scaleX(${progress.toFixed(3)})`;
        const stage=progress<.24?0:progress<.58?1:2;
        if(stage!==previousStage){if(progress>.1) whoosh();previousStage=stage;}
      } else previousStage=-1;
    }
    if(!limited&&arena&&screen){
      const bounds=arena.getBoundingClientRect();
      if(bounds.bottom>0 && bounds.top<innerHeight){
        const focus=clamp(1-Math.abs((bounds.top+bounds.height*.5-innerHeight*.5)/(innerHeight*.9)));
        screen.style.transform=`rotateX(${(1.6-focus).toFixed(2)}deg) rotateY(${pointerYaw.toFixed(2)}deg)`;
      }
    }
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(draw)}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('pageshow',schedule);
  if(arena&&!limited&&matchMedia('(hover:hover)').matches){
    arena.addEventListener('pointermove',e=>{
      const box=arena.getBoundingClientRect();pointerYaw=clamp((e.clientX-box.left-box.width/2)/box.width,-.5,.5)*-2;
      schedule();
    },{passive:true});
    arena.addEventListener('pointerleave',()=>{pointerYaw=0;schedule()});
  }
  schedule();
  addEventListener('pagehide',()=>audioContext?.suspend?.().catch(()=>{}));
})();
