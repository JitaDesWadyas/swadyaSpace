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
  const stage=$('#fighter-grid');
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
    // PHASE 1 - GRB alone, large cinematic push-in.
    // PHASE 2 - Oeloves crosses over from right, holds, then exits upwards.
    // PHASE 3 - final diagonal two-up composition, both figures complete.
    const moveA=smooth((p-.24)/.16);
    const enterB=smooth((p-.28)/.17);
    const exitB=smooth((p-.61)/.18);
    const revealFinal=smooth((p-.67)/.18);
    soloA.style.opacity=String(1-moveA);
    soloA.style.transform=`translate3d(${(-102*moveA).toFixed(2)}%,0,0)`;
    soloB.style.opacity=String(enterB*(1-exitB));
    soloB.style.transform=`translate3d(${(104*(1-enterB)).toFixed(2)}%,${(-103*exitB).toFixed(2)}%,0)`;
    if(aImg)aImg.style.transform=`translate3d(0,${(-2*smooth(p/.30)).toFixed(2)}%,0) scale(${(1.12+.28*smooth(p/.37)).toFixed(3)})`;
    if(bImg)bImg.style.transform=`translate3d(0,${(-2*smooth((p-.30)/.35)).toFixed(2)}%,0) scale(${(1.14+.24*smooth((p-.30)/.44)).toFixed(3)})`;
    duo.style.opacity=String(.72+.28*revealFinal);
    if(versus)versus.style.transform=`translate(-50%,-50%) scale(${(.80+.20*revealFinal).toFixed(3)})`;
    if(progressBar)progressBar.style.transform=`scaleX(${p.toFixed(3)})`;
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(draw)}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('pageshow',schedule);
  if(reduced){soloA.style.display='none';soloB.style.display='none';duo.style.opacity='1';}
  else schedule();
})();
