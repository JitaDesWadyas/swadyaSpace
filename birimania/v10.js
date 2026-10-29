/* V10: video-driven three-act fight reveal. Pure scroll position, never timelines. */
(() => {
  'use strict';
  const reel=document.querySelector('#v10-reel');
  const stage=document.querySelector('#v10-stage');
  if(!reel||!stage)return;
  const grb=document.querySelector('#v10-grb');
  const oe=document.querySelector('#v10-oe');
  const final=document.querySelector('#v10-final');
  const filmCut=document.querySelector('#v10-cut');
  const vg=document.querySelector('#v10-grb-film');
  const vo=document.querySelector('#v10-oe-film');
  const progress=document.querySelector('#v10-reel-progress');
  const number=document.querySelector('#v10-act');
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let scheduled=false,wasVisible=false,currentAct=-1;
  function pauseAll(){vg?.pause();vo?.pause()}
  function run(){
    scheduled=false;
    if(document.hidden){pauseAll();return;}
    const box=reel.getBoundingClientRect(),height=innerHeight;
    const visible=box.top<height&&box.bottom>0;
    if(!visible){if(wasVisible){pauseAll();wasVisible=false;}return;}
    wasVisible=true;
    const p=clamp(-box.top/Math.max(1,box.height-height));
    if(progress)progress.style.transform=`scaleX(${p.toFixed(4)})`;
    if(reduced){pauseAll();return;}
    // Two clean camera cuts: cover the frame before switching sources.
    const cutA=smooth(Math.max(0,1-Math.abs(p-.365)/.044));
    const cutB=smooth(Math.max(0,1-Math.abs(p-.743)/.051));
    const settle=smooth((p-.72)/.24);
    const zoomGrb=smooth(p/.31);
    const zoomOe=smooth((p-.44)/.23);
    if(grb){grb.style.visibility=p>.365?'hidden':'visible';}
    if(vg)vg.style.transform=`scale(${(1+.19*zoomGrb).toFixed(4)}) translate3d(0,${(-1.1*zoomGrb).toFixed(3)}%,0)`;
    if(oe){oe.style.visibility=p>=.365&&p<.743?'visible':'hidden';oe.style.transform='translate3d(0,0,0)';}
    if(filmCut)filmCut.style.opacity=String(Math.max(cutA,cutB).toFixed(3));
    if(vo)vo.style.transform=`scale(${(1+.18*zoomOe).toFixed(4)})`;
    if(final)final.style.transform=`translate3d(0,0,0) scale(${(1.16-.16*settle).toFixed(4)})`;
    const act=p<.365?0:p<.743?1:2;
    if(act!==currentAct){currentAct=act;if(number)number.textContent=`0${act+1} / 03`;}
    // Only decode footage while its shot is onscreen. Brief overlap at the wipe.
    if(p<.40){if(vg?.paused)vg.play().catch(()=>{});}else if(vg&&!vg.paused)vg.pause();
    if(p>.34&&p<.78){if(vo?.paused)vo.play().catch(()=>{});}else if(vo&&!vo.paused)vo.pause();
  }
  const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(run)}};
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('pageshow',schedule);
  document.addEventListener('visibilitychange',schedule);
  schedule();
})();
