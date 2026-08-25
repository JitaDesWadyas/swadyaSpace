(()=>{
  const trips=window.KOREA_TRIPS;
  const $=s=>document.querySelector(s);
  const $$=s=>[...document.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function renderStats(trip){
    $('#stats').innerHTML=trip.stats.map(([a,b])=>`<div class="stat"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
  }
  function renderDays(trip){
    $('#days').innerHTML=trip.days.map(day=>`<article class="card day"><div class="day-meta"><strong>${day.n}</strong><span>${esc(day.place)}</span></div><div class="day-main"><h3>${esc(day.title)}</h3><p>${esc(day.desc)}</p><div class="slots">${day.slots.map(([label,text])=>`<div class="slot"><b>${esc(label)}</b><span>${esc(text)}</span></div>`).join('')}</div>${day.note?`<div class="note">${esc(day.note)}</div>`:''}</div></article>`).join('');
  }
  function renderBudget(trip){
    $('#budgetLabel').textContent=`${trip.label} · due persone`;
    $('#budgetTotal').textContent=trip.budget.total;
    $('#budgetRows').innerHTML=trip.budget.rows.map(([name,cost])=>`<div class="cost"><span>${esc(name)}</span><strong>${esc(cost)}</strong></div>`).join('');
  }
  function setTrip(key,{scroll=false}={}){
    const trip=trips[key];
    $$('.switcher button').forEach(b=>b.classList.toggle('active',b.dataset.trip===key));
    renderStats(trip);
    $('#tripTitle').textContent=`${trip.label}.`;
    $('#routeSummary').textContent=trip.route;
    renderDays(trip);
    renderBudget(trip);
    history.replaceState(null,'',`${location.pathname}${location.search}#${key}`);
    if(scroll) $('#itinerario').scrollIntoView({behavior:'smooth',block:'start'});
  }

  $$('.switcher button').forEach(btn=>btn.addEventListener('click',()=>setTrip(btn.dataset.trip,{scroll:true})));
  $$('img[data-fallback]').forEach(img=>img.addEventListener('error',()=>{
    if(img.dataset.fallbackUsed==='1'){
      img.removeAttribute('src');
      img.alt=`Immagine non disponibile · ${img.alt}`;
      img.style.background='linear-gradient(135deg,#121a28,#25172a)';
      return;
    }
    img.dataset.fallbackUsed='1';
    img.src=img.dataset.fallback;
  }));

  const sourceBox=$('.sources');
  if(sourceBox){
    const credits=document.createElement('div');
    credits.className='good';
    credits.innerHTML='Foto Commons: Itaewon bridge — <a href="https://commons.wikimedia.org/wiki/File:N-Seoul_tower_from_Itaewon_bridge_pinhole.jpg" target="_blank" rel="noreferrer">Aatu Dorochenko, CC BY-SA 4.0</a> · Gwangalli — <a href="https://commons.wikimedia.org/wiki/File:Gwangan_Bridge_and_Gwangalli_Beach_-_Gwangalli2721.jpg" target="_blank" rel="noreferrer">lumoplank, CC0</a> · Seoraksan — <a href="https://commons.wikimedia.org/wiki/File:Korean.Seoraksan-Ulsanbawi-01.jpg" target="_blank" rel="noreferrer">flowerguy, CC BY 2.0</a> · Jeonju — <a href="https://commons.wikimedia.org/wiki/File:Jeonju_Hanok_Maeul_(6).JPG" target="_blank" rel="noreferrer">콩가루, CC BY-SA 4.0</a>.';
    sourceBox.after(credits);
  }

  setTrip(location.hash==='#two'?'two':'week');
})();
