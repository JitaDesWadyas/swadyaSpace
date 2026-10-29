/* BIRIMANIA chapter director: all motion is a pure function of scroll progress.
   GPU composited transforms only; no canvas painting or dynamic clip-path. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js-cinema');
  const chapter=$('#fighters-scroll'),soloA=$('.solo-grb'),soloB=$('.solo-oe');
  const aImg=soloA?.querySelector('img'),bImg=soloB?.querySelector('img');
  const versus=$('.duo-versus'),duo=$('#fighter-duo'),progressBar=$('.fighter-film-progress span');
  const stage=$('#fighter-grid'),impact=$('.scene-impact');
  let raf=0;
  for(const heading of $$('.scene-words')){
    if('IntersectionObserver' in window && !reduced){
      const obs=new IntersectionObserver(entries=>{
        if(entries[0]?.isIntersecting){heading.classList.add('scene-done');obs.disconnect();}
      },{threshold:.12});obs.observe(heading);
    }else heading.classList.add('scene-done');
  }
  function draw(){
    raf=0;
    if(!chapter || !soloA || !soloB || !duo) return;
    const rect=chapter.getBoundingClientRect(),h=innerHeight;
    if(rect.bottom<0||rect.top>h)return;
    const p=clamp(-rect.top/Math.max(1,rect.height-h));

    // One opaque layer per camera shot. Never crossfade two full-size faces:
    // overlapping portraits are what caused the V7 "ghost" transition.
    // Act I: GRB with a pronounced zoom (0..0.3).
    // Act II: Oeloves replaces GRB with one diagonal sliding shutter (.32.. .47).
    // Act III: the solo scene slides UP to reveal the intact two-up composition (.69.. .84).
    const arrive=smooth((p-.30)/.18);
    const endSolo=smooth((p-.62)/.14);
    const final=smooth((p-.76)/.13);
    const zoomA=smooth(p/.34);
    const zoomB=smooth((p-.48)/.18);
    // Exact inverse positions; scroll-back always returns to the same frame.
    soloA.style.transform=`translate3d(${(-100*arrive).toFixed(3)}%,0,0)`;
    soloB.style.transform=`translate3d(${(100*(1-arrive)).toFixed(3)}%,${(-102*endSolo).toFixed(3)}%,0)`;
    soloA.style.opacity='1';
    soloB.style.opacity='1';
    duo.style.opacity='1';
    if(impact)impact.style.transform=`translate3d(0,${(-102*final).toFixed(3)}%,0)`;
    if(aImg)aImg.style.transform=`translate3d(0,${(-4*zoomA).toFixed(2)}%,0) scale(${(1.07+.36*zoomA).toFixed(3)})`;
    if(bImg)bImg.style.transform=`translate3d(0,${(-4*zoomB).toFixed(2)}%,0) scale(${(1.07+.33*zoomB).toFixed(3)})`;
    if(versus)versus.style.transform=`translate(-50%,-50%) scale(${(.92+.08*final).toFixed(3)})`;
    const slash=document.querySelector('.fighter-seam');
    if(slash){
      slash.style.opacity=(arrive>0.01&&arrive<.99)?'1':'0';
      slash.style.transform=`translate3d(${(110-120*arrive).toFixed(2)}vw,0,0) skewX(-12deg)`;
    }
    if(progressBar)progressBar.style.transform=`scaleX(${p.toFixed(3)})`;
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(draw)}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('pageshow',schedule);
  if(reduced){soloA.style.display='none';soloB.style.display='none';duo.style.opacity='1';
    if(impact)impact.style.transform=`translate3d(0,${(-102*final).toFixed(3)}%,0)`;}
  else schedule();
})();
