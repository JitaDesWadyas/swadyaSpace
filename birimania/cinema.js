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
  let frame=0,pointerYaw=0;
  function draw(){
    frame=0;
    if(chapter && duo && !limited){
      const rect=chapter.getBoundingClientRect(),vh=innerHeight;
      if(rect.bottom>0 && rect.top<vh){
        const progress=clamp(-rect.top/Math.max(1,rect.height-vh));
        // Absolute scroll progress, no springs/tweens: backtracking reproduces
        // the exact same position with no sticky drift or whole-scene scaling.
        const focus=smooth(progress/.25);
        const reveal=smooth((progress-.21)/.38);
        const settle=smooth((progress-.55)/.35);
        duo.style.transform='translate3d(0,0,0)';
        if(topImage) topImage.style.transform=`translate3d(0,${(-1.2*focus+1.2*settle).toFixed(2)}%,0) scale(${(1+.045*focus-.045*settle).toFixed(3)})`;
        if(bottomImage) bottomImage.style.transform=`translate3d(0,${(4*(1-reveal)).toFixed(2)}%,0) scale(${(1+.045*(1-settle)).toFixed(3)})`;
        if(bottomShot) bottomShot.style.opacity=String(.72+.28*reveal);
        if(bottomWord) bottomWord.style.opacity=String(.64+.36*reveal);
        if(topWord) topWord.style.transform='translate3d(0,0,0)';
        if(versus) versus.style.transform=`translate(-50%,-50%) rotate(${(-4+4*settle).toFixed(2)}deg) scale(${(.90+.10*reveal).toFixed(3)})`;
        if(progressLine) progressLine.style.transform=`scaleX(${progress.toFixed(3)})`;
      }
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


  // Procedural flames drawn behind portraits at ~24fps. Low internal resolution,
  // no high-cost blur/clip-path updates during scroll; no AI images or libraries.
  const fireCanvases = $$('.duo-shot .stage-fire');
  const flames = fireCanvases.map((canvas,index)=>{
    const ctx=canvas.getContext('2d',{alpha:true});
    return {ctx,canvas,index,particles:Array.from({length:24},(_,i)=>({
      x:(i*47%97)/97,y:(i*29%89)/89,r:1.2+(i%4)*.55,s:.003+(i%5)*.0006
    }))};
  }).filter(x=>x.ctx);
  let lastFire=0,fireFrame=0,fireActive=false;
  const prng=(a,b)=>Math.sin(a*18.117+b*117.33)*0.5+0.5;
  function paintFlames(now){
    fireFrame=0;
    if(!fireActive||document.hidden||limited)return;
    if(now-lastFire<40){fireFrame=requestAnimationFrame(paintFlames);return;}
    lastFire=now;
    flames.forEach(({ctx,canvas,index,particles})=>{
      const w=canvas.width,h=canvas.height,t=now*.001;
      ctx.clearRect(0,0,w,h);
      // Red arena: saturated orange tongues. Gold arena: warm amber light.
      ctx.globalCompositeOperation='lighter';
      for(let i=0;i<19;i++){
        const x=i*w/18, phase=t*(1.9+i%3*.14)+i*1.81;
        const gust=Math.sin(phase)*14+Math.sin(phase*.7+i)*8;
        const height=(29+prng(i,4)*58)*(0.76+0.24*Math.sin(phase*.55));
        const flameWidth=13+(i%3)*4;
        const baseY=h+4, tipY=h-height;
        const grad=ctx.createLinearGradient(x,baseY,x+gust,tipY);
        grad.addColorStop(0,index?'rgba(255,192,70,.55)':'rgba(255,74,21,.72)');
        grad.addColorStop(.45,index?'rgba(240,125,39,.45)':'rgba(245,110,17,.50)');
        grad.addColorStop(1,'rgba(205,35,12,0)');
        ctx.fillStyle=grad;
        ctx.beginPath();ctx.moveTo(x-flameWidth,baseY);
        ctx.bezierCurveTo(x-flameWidth*.9,h-height*.35,x+gust-flameWidth*.24,tipY+19,x+gust,tipY);
        ctx.bezierCurveTo(x+gust+flameWidth*.12,tipY+18,x+flameWidth*.8,h-height*.24,x+flameWidth,baseY);
        ctx.closePath();ctx.fill();
      }
      for(const p of particles){
        const yy=(p.y - (t*p.s*50)%1+1)%1;
        const px=(p.x*w+Math.sin(t*.7+p.x*7)*14+w)%w;
        ctx.fillStyle=index?'rgba(255,205,95,.63)':'rgba(255,145,46,.65)';
        ctx.beginPath();ctx.arc(px,yy*h,p.r,0,Math.PI*2);ctx.fill();
      }
      ctx.globalCompositeOperation='source-over';
    });
    fireFrame=requestAnimationFrame(paintFlames);
  }
  const fireObserver = ('IntersectionObserver' in window && duo) ? new IntersectionObserver(entries=>{
    fireActive=entries[0]?.isIntersecting ?? false;
    if(fireActive&&!fireFrame&&!limited)fireFrame=requestAnimationFrame(paintFlames);
    if(!fireActive&&fireFrame){cancelAnimationFrame(fireFrame);fireFrame=0;}
  },{threshold:0}):null;
  if(fireObserver)fireObserver.observe(duo);
  else if(duo&&!limited){fireActive=true;fireFrame=requestAnimationFrame(paintFlames);}
})();
