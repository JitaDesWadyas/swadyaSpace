(()=>{
  const trips=window.KOREA_TRIPS;
  const $=s=>document.querySelector(s);
  const $$=s=>[...document.querySelectorAll(s)];
  let active='week';
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function renderStats(trip){
    $('#stats').innerHTML=trip.stats.map(([a,b])=>`<div class="stat"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
  }
  function renderDays(trip){
    $('#days').innerHTML=trip.days.map(day=>`<article class="card day"><div class="day-meta"><strong>${day.n}</strong><span>${esc(day.place)}</span></div><div class="day-main"><h3>${esc(day.title)}</h3><p>${esc(day.desc)}</p><div class="slots">${day.slots.map(([label,text])=>`<div class="slot"><b>${esc(label)}</b><span>${esc(text)}</span></div>`).join('')}</div>${day.note?`<div class="note">${esc(day.note)}</div>`:''}</div></article>`).join('');
  }
  function renderBudget(key,trip){
    $('#budgetLabel').textContent=`${trip.label} · due persone`;
    $('#budgetTotal').textContent=trip.budget.total;
    $('#budgetRows').innerHTML=trip.budget.rows.map(([name,cost])=>`<div class="cost"><span>${esc(name)}</span><strong>${esc(cost)}</strong></div>`).join('');
  }
  function setTrip(key,{scroll=false}={}){
    active=key;
    const trip=trips[key];
    $$('.switcher button').forEach(b=>b.classList.toggle('active',b.dataset.trip===key));
    renderStats(trip);
    $('#tripTitle').textContent=`${trip.label}.`;
    $('#routeSummary').textContent=trip.route;
    renderDays(trip);
    renderBudget(key,trip);
    history.replaceState(null,'',`${location.pathname}${location.search}#${key}`);
    if(scroll) $('#itinerario').scrollIntoView({behavior:'smooth',block:'start'});
  }

  $$('.switcher button').forEach(btn=>btn.addEventListener('click',()=>setTrip(btn.dataset.trip,{scroll:true})));

  $$('img[data-fallback]').forEach(img=>{
    img.addEventListener('error',()=>{
      if(img.dataset.fallbackUsed==='1'){
        img.removeAttribute('src');
        img.alt=`Immagine non disponibile · ${img.alt}`;
        img.style.background='linear-gradient(135deg,#121a28,#25172a)';
        return;
      }
      img.dataset.fallbackUsed='1';
      img.src=img.dataset.fallback;
    });
  });

  const initial=location.hash==='#two'?'two':'week';
  setTrip(initial);
})();
