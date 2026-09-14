(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  let audio = null, sound = false, sequencer = null, beat = 0;
  const soundButton = $('sound'), motionButton = $('motion');

  function syncMotion() {
    document.documentElement.classList.toggle('paused', paused);
    motionButton.textContent = paused ? 'Attiva effetti' : 'Pausa effetti';
    motionButton.setAttribute('aria-pressed', String(paused));
  }
  syncMotion();
  motionButton.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reduced.addEventListener('change', e => { paused = e.matches; syncMotion(); });

  function tone(freq, duration=.12, type='sine', volume=.04, end=freq) {
    if (!sound || !audio || audio.state !== 'running' || document.hidden) return;
    const o=audio.createOscillator(), g=audio.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,audio.currentTime); o.frequency.exponentialRampToValueAtTime(Math.max(1,end),audio.currentTime+duration);
    g.gain.setValueAtTime(volume,audio.currentTime); g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+duration);
    o.connect(g); g.connect(audio.destination); o.start(); o.stop(audio.currentTime+duration);
  }
  function stopSound(){ sound=false; clearInterval(sequencer); sequencer=null; if(audio) audio.suspend().catch(()=>{}); soundButton.innerHTML='Suono OFF <span aria-hidden="true">◖))</span>'; soundButton.setAttribute('aria-pressed','false'); }
  soundButton.addEventListener('click', async()=>{
    if(sound){stopSound();return;}
    try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw 0;if(!audio)audio=new Audio();await audio.resume();sound=true;soundButton.innerHTML='Suono ON <span aria-hidden="true">◖))</span>';soundButton.setAttribute('aria-pressed','true');tone(440,.2,'triangle');sequencer=setInterval(()=>{const n=[110,110,130.81,98,110,164.81,130.81,98];tone(n[beat%n.length],.2,'triangle',.025);if(beat%2===0)tone(140,.15,'sine',.04,42);beat++;},254);}catch(_){stopSound();soundButton.textContent='Audio non disponibile';}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSound();}); window.addEventListener('pagehide',stopSound);

  function burst(x,y,count=16){
    if(paused||reduced.matches)return; const layer=$('particles'); if(layer.childElementCount>80)return;
    for(let i=0;i<count;i++){const p=document.createElement('span');p.className='particle';p.textContent=['✳','+','↗','●','□'][i%5];p.style.left=x+'px';p.style.top=y+'px';p.style.setProperty('--dx',(Math.random()-.5)*520+'px');p.style.setProperty('--dy',(Math.random()-.65)*480+'px');p.style.setProperty('--rotation',(Math.random()-.5)*700+'deg');layer.appendChild(p);setTimeout(()=>p.remove(),1400);}
  }
  function centerBurst(el,count){const r=el.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,count);}

  const completed=new Set();
  function completeStep(name){if(completed.has(name))return;completed.add(name);const c=completed.size;$('prep-title').textContent=c+' / 3';$('prep-fill').style.transform=`scaleX(${c/3})`;$('prep-copy').textContent=c===1?'Uno fatto.':c===2?'Ne manca uno.':'Tutto provato.';document.querySelector(`[data-step="${name}"]`)?.classList.add('completed');if(c===3){const card=$('completion-card');card.classList.add('show');tone(520,.16,'triangle');setTimeout(()=>card.classList.remove('show'),3200);}}

  let chaos=0, chaosStep=0, chaosTimer;
  const chaosStates=[
    {value:14,text:'Ok.'},{value:28,text:'Ancora?'},{value:43,text:'Adesso si muove qualcosa.'},{value:61,text:'Hai insistito.'},{value:79,text:'Quasi abbastanza.'},{value:100,text:'Perfetto.'}
  ];
  function setChaos(value){chaos=Math.min(100,value);$('chaos-value').textContent=chaos+'%';$('chaos-fill').style.transform=`scaleX(${chaos/100})`;document.body.dataset.chaos=chaos>=100?'100':chaos>=75?'75':chaos>=50?'50':chaos>=25?'25':'0';}
  function spawnEvent(type){if(paused||reduced.matches)return;const layer=$('event-layer'),item=document.createElement('div');item.className=`event event-${type}`;if(type==='rc')item.innerHTML='<span>RC</span>▰';if(type==='potato')item.textContent='🥔';if(type==='notice')item.textContent='JITA HAS ENTERED THE SERVER';if(type==='warning')item.textContent='GRAVITÀ: NON DISPONIBILE';layer.appendChild(item);setTimeout(()=>item.remove(),type==='notice'||type==='warning'?2400:4000);}

  $('chaos').addEventListener('click',()=>{
    const next=chaosStates[Math.min(chaosStep,chaosStates.length-1)];
    chaosStep=Math.min(chaosStep+1,chaosStates.length-1);
    setChaos(next.value); $('chaos-status').textContent=next.text; centerBurst($('chaos'),chaos>=75?36:20); tone(120+chaos*2,.35,'sawtooth',.02,500+chaos*4);
    if(!paused&&!reduced.matches){document.body.classList.add('party');clearTimeout(chaosTimer);chaosTimer=setTimeout(()=>document.body.classList.remove('party'),900);}
    if(chaos>=25&&chaos<50)spawnEvent('rc');
    if(chaos>=50&&chaos<75)spawnEvent(Math.random()>.5?'potato':'warning');
    if(chaos>=75&&chaos<100)spawnEvent(Math.random()>.5?'notice':'rc');
    if(chaos===100){document.body.classList.add('chaos-max');spawnEvent('notice');setTimeout(()=>spawnEvent('potato'),350);setTimeout(()=>spawnEvent('warning'),700);setTimeout(()=>document.body.classList.remove('chaos-max'),4200);}
  });

  $('jump').addEventListener('click',()=>{const pad=$('jump'),scene=document.querySelector('.jump');pad.classList.remove('bouncing');void pad.offsetWidth;pad.classList.add('bouncing');scene.classList.remove('scene-jump');void scene.offsetWidth;scene.classList.add('scene-jump');tone(130,.3,'sine',.06,620);centerBurst(pad,12);completeStep('jump');});

  const positions=[[8,10],[69,49],[20,60],[62,8],[40,36]];let hits=0;
  $('target').addEventListener('click',()=>{hits++;centerBurst($('target'),8);tone(1000,.16,'sawtooth',.025,100);$('score').textContent=hits<5?hits+' / 5':'5 / 5';const arena=$('arena');arena.classList.remove('flash');void arena.offsetWidth;arena.classList.add('flash');if(hits===5){$('target').disabled=true;completeStep('laser');return;}$('target').style.left=positions[hits-1][0]+'%';$('target').style.top=positions[hits-1][1]+'%';});
  $('reset-game').addEventListener('click',()=>{hits=0;$('score').textContent='0 / 5';$('target').disabled=false;$('target').style.left='45%';$('target').style.top='25%';$('target').focus();});

  let washed=false;
  $('wash').addEventListener('input',e=>{const v=Number(e.target.value);$('wash-label').textContent=v<30?'POST LASER':v<70?'IN CORSO':v<100?'QUASI':'PRONTO';document.querySelector('.shower').style.setProperty('--wash',v+'%');if(v===100&&!washed){washed=true;centerBurst($('wash-label'),16);tone(660,.3,'triangle');completeStep('wash');}if(v<100)washed=false;});

  $('share').addEventListener('click',async()=>{const url=new URL('compleanno-jita.html',location.href).href;const data={title:'Compleanno Jita',text:'Sabato 26 settembre: Hyperspace, laser game e Walles.',url};try{if(navigator.share){await navigator.share(data);$('share-status').textContent='Invito condiviso.';}else if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(url);$('share-status').textContent='Link copiato.';}else $('share-status').textContent='Copia il link dalla barra degli indirizzi.';}catch(e){if(e.name!=='AbortError')$('share-status').textContent='Non sono riuscito a condividere il link.';}});

  const rareEvents=['rc','potato','notice'];const rareTimer=setInterval(()=>{if(document.hidden||paused||reduced.matches||Math.random()>.35)return;spawnEvent(rareEvents[Math.floor(Math.random()*rareEvents.length)]);},14000);window.addEventListener('pagehide',()=>clearInterval(rareTimer));
  let titleClicks=0,titleTimer;$('title').addEventListener('click',()=>{titleClicks++;clearTimeout(titleTimer);titleTimer=setTimeout(()=>titleClicks=0,1800);if(titleClicks>=7){titleClicks=0;document.body.classList.toggle('secret-mode');spawnEvent('warning');}});$('title').style.pointerEvents='auto';

  let framePending=false;function updateProgress(){const range=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.transform='scaleX('+(range>0?Math.min(1,Math.max(0,scrollY/range)):0)+')';framePending=false;}window.addEventListener('scroll',()=>{if(!framePending){framePending=true;requestAnimationFrame(updateProgress);}},{passive:true});window.addEventListener('resize',updateProgress);updateProgress();
})();
