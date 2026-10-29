/* BIRIMANIA v9 — deterministic 3-act camera direction. No double portraits,
   no per-frame clip paths, no scrubbed videos, and no animation timeouts. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
  const chapter=$('#fighters-scroll'),stage=$('#fighter-grid'),first=$('.v9-grb'),second=$('.v9-oe'),curtain=$('.v9-curtain'),duo=$('#fighter-duo');
  const firstImage=first?.querySelector('img'),secondImage=second?.querySelector('img');
  const bar=$('.fighter-film-progress span');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js-cinema');

  for (const el of document.querySelectorAll('.scene-words')) {
    if (reduced || !('IntersectionObserver' in window)) el.classList.add('scene-done');
    else {
      const obs=new IntersectionObserver(entries=>{
        if(entries[0]?.isIntersecting){el.classList.add('scene-done');obs.disconnect();}
      },{threshold:.1}); obs.observe(el);
    }
  }
  let scheduled=false;
  function paint(){
    scheduled=false;
    if(!chapter||!stage||!first||!second||!curtain||!duo||reduced)return;
    const b=chapter.getBoundingClientRect(),h=window.innerHeight;
    if(b.top>h || b.bottom<0)return;
    const travel=Math.max(1,b.height-h);
    const p=clamp(-b.top/travel);
    // Act 1: GRB from 0 to 32%, a strong camera push-in.
    // Act 2: Oeloves wipes GRB away (32-43%), then gets his own push-in.
    // Act 3: black-out of previous shot, then a fast zoom-out to both at 75-96%.
    const wipe=ease((p-.31)/.14);
    const leave=ease((p-.65)/.11);
    const opening=ease((p-.76)/.075);
    const pullBack=ease((p-.755)/.205);
    const zoomA=ease(p/.32), zoomB=ease((p-.45)/.20);
    first.style.visibility=p>.47?'hidden':'visible';
    second.style.transform=`translate3d(${(104*(1-wipe)).toFixed(2)}%,0,0)`;
    second.style.opacity=(1-leave).toFixed(3);
    if(firstImage)firstImage.style.transform=`translate3d(0,${(-3*zoomA).toFixed(2)}%,0) scale(${(1.06+.42*zoomA).toFixed(3)})`;
    if(secondImage)secondImage.style.transform=`translate3d(0,${(-3*zoomB).toFixed(2)}%,0) scale(${(1.05+.42*zoomB).toFixed(3)})`;
    curtain.style.opacity=String((1-opening).toFixed(3));
    duo.style.setProperty('--v9-scale',(0.38+0.62*pullBack).toFixed(3));
    duo.style.setProperty('--v9-names',ease((p-.88)/.075).toFixed(3));
    if(bar)bar.style.transform=`scaleX(${p.toFixed(4)})`;
  }
  const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(paint)}};
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('pageshow',schedule);
  schedule();
})();
