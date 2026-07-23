(() => {
  const D = window.CHINA_DATA;
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const image = (src, alt, caption='', cls='') => `<figure class="${cls}" data-lightbox><img loading="lazy" src="${src}" alt="${esc(alt)}" onerror="this.closest('figure').classList.add('image-error')">${caption?`<figcaption>${esc(caption)}</figcaption>`:''}</figure>`;

  const menuButton=$('.menu-toggle'), nav=$('#main-nav');
  menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menuButton.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open)});
  $$('#main-nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')}));

  $('#snapshot-grid').innerHTML = [
    ['✈️','Volo','Hong Kong A/R. Target 600–700 €.'],
    ['🏠','Alloggi','Camere/appartamenti per quattro; Shenzhen come base economica.'],
    ['🚄','Ritmo','Una sola regione, senza giornate buttate negli aeroporti.'],
    ['🌿','Natura','Dapeng, sentieri di Hong Kong e colline di Yangshuo.'],
    ['🏙️','Città','Tech, mall, mercati, quartieri normali e bar.'],
    ['🍚','Vita vera','Supermercati, colazioni locali e serate libere.']
  ].map(x=>`<article class="snapshot"><span class="snapshot-icon">${x[0]}</span><strong>${x[1]}</strong><span>${x[2]}</span></article>`).join('');

  $('#summary-box').innerHTML = `<div class="summary-box"><div><h3>La scelta consigliata</h3><p><strong>Tenere Shanghai e Sanya fuori dal piano principale.</strong> Il sud offre già metropoli, mare, villaggi, nightlife e natura senza aggiungere un volo interno.</p><ul class="summary-list">
  <li><span>✓</span><span><strong>Hong Kong</strong> per primo impatto, skyline e sentieri.</span></li>
  <li><span>✓</span><span><strong>Shenzhen</strong> come base moderna ed economica.</span></li>
  <li><span>✓</span><span><strong>Dapeng</strong> per mare, fortezza e giornata lenta.</span></li>
  <li><span>✓</span><span><strong>Guangzhou + Foshan</strong> per cibo e cultura cantonese.</span></li>
  <li><span>✓</span><span><strong>Yangshuo/Xingping</strong> per la natura più forte.</span></li>
  <li><span>✓</span><span><strong>Macao</strong> come chiusura diversa.</span></li></ul></div><aside class="summary-side"><strong>Regola del viaggio</strong><span>Ogni giornata ha un piano principale e spazio libero. Se un quartiere vi piace, rimanete. La guida offre scelte, non obblighi.</span></aside></div>`;

  $('#route-grid').innerHTML = D.routeCards.map((r,i)=>`<article class="route-card"><figure data-lightbox><img loading="lazy" src="${D.imgs[r[3]]}" alt="${esc(r[0])}" onerror="this.closest('figure').classList.add('image-error')"><span class="route-number">${i+1}</span></figure><div class="route-body"><h3>${r[0]}</h3><p>${r[4]}</p><div class="route-meta"><span class="mini-chip">${r[1]}</span><span class="mini-chip">${r[2]}</span></div></div></article>`).join('');

  $('#days').innerHTML = D.days.map(d => {
    const links=(d.links||[]).map(l=>`<a class="map-link" href="${l[1]}" target="_blank" rel="noopener">⌖ ${esc(l[0])}</a>`).join('');
    const items=d.items.map(x=>`<li>${x}</li>`).join('');
    return `<article class="day-card"${d.id?` id="${d.id}"`:''}><div class="day-number"><b>${d.n}</b><span>${d.date}</span></div><div class="day-content"><h3>${d.title}</h3><p class="day-lead">${d.lead}</p><ul>${items}</ul><div class="day-links">${links}</div><aside class="day-tip"><strong>Nota pratica:</strong> ${d.side}</aside></div>${image(D.imgs[d.image],d.caption,d.caption,'day-photo')}</article>`;
  }).join('');

  $('#gallery').innerHTML = D.gallery.map(g=>image(D.imgs[g[0]],g[1],g[1])).join('');

  const alternatives = [
    ['ys_karst','Zhangjiajie','Fortissima, ma lontana. Ha senso solo sostituendo Yangshuo, non aggiungendola.','Alternativa vera',''],
    ['hk_2019','Shanghai','Altra grande metropoli e altro volo interno. In questo piano duplica parte dell’effetto urbano.','Lasciare fuori','no'],
    ['dapeng14','Sanya','Mare tropicale, ma richiede un volo e clima favorevole. Sostituirebbe Dapeng e un blocco città.','Solo se volete mare',''],
    ['macau3','Kaiping Diaolou','Coerente geograficamente: torri rurali e campagna del Guangdong, ma serve un giorno dedicato.','Buon extra',''],
    ['hk_peak','Pechino + Muraglia','Merita un viaggio proprio. Per farla bene servono almeno 4–5 giorni e un volo interno.','Altro viaggio','no'],
    ['macau4','Zhuhai','Facile da collegare a Macao, ma meno diversa di Yangshuo. Utile come notte economica.','Jolly logistico','']
  ];
  $('#alternatives').innerHTML = alternatives.map(a=>`<article class="option-card">${image(D.imgs[a[0]],a[1])}<div><h3>${a[1]}</h3><p>${a[2]}</p><span class="verdict ${a[4]}">${a[3]}</span></div></article>`).join('');

  const food = [
    ['🥟','Da provare nel Guangdong','<ul><li><strong>Dim sum</strong> al mattino o pranzo.</li><li><strong>Char siu</strong>, anatra arrosto e claypot rice.</li><li>Hotpot, noodles di riso, congee e dumpling.</li><li>A Macao: <strong>egg tart</strong>, pork chop bun e jerky.</li></ul>'],
    ['🍺','Birra e serata','<ul><li><strong>Tsingtao, Snow, Harbin</strong> come birre facili.</li><li>Cercare taproom locali senza fissarne uno un anno prima.</li><li><strong>KTV</strong> è più caratteristico della classica discoteca.</li><li>Chiedere prezzo e minimo d’ordine prima di sedersi.</li></ul>'],
    ['🛒','Supermercato come attività','<ul><li>Bevande strane, snack di alghe, noodles e gelati.</li><li>Guardare la gastronomia pronta, non solo gli scaffali.</li><li>Comprare piccoli assaggi da dividere.</li></ul>'],
    ['🌶️','Per chi odia le verdure','<p>Salvare <strong>不要蔬菜</strong> (“niente verdure”) e <strong>不要香菜</strong> (“niente coriandolo”). Brodi e ripieni possono contenerle comunque.</p>']
  ];
  $('#food-grid').innerHTML = food.map(x=>`<article class="practical-card"><span class="practical-icon">${x[0]}</span><h3>${x[1]}</h3>${x[2]}</article>`).join('');

  const shopping = [
    ['🎒','Prima di partire','<ul><li>Adattatore universale USB-C.</li><li>Power bank certificato.</li><li>Scarpe comode e giacca impermeabile.</li><li>Farmaci abituali e assicurazione.</li><li>Due carte fisiche separate.</li></ul>'],
    ['🔌','Acquisti sensati','<ul><li>Cavi e accessori di marchi verificabili.</li><li>Piccoli gadget elettronici particolari.</li><li>Tè, tazze, bacchette, poster e cartoleria.</li><li>Snack e bevande da condividere al ritorno.</li></ul>'],
    ['🚫','Da evitare','<ul><li>SSD, memorie e batterie senza test.</li><li>Contraffatti, droni e oggetti problematici in dogana.</li><li>Smartphone senza verificare bande, lingua e garanzia.</li></ul>'],
    ['🧾','Metodo Huaqiangbei','<ol><li>Fotografa prodotto e bancarella.</li><li>Chiedi modello e garanzia.</li><li>Confronta tre venditori.</li><li>Prova davanti al venditore.</li><li>Paga quando funziona.</li></ol>']
  ];
  $('#shopping-grid').innerHTML = shopping.map(x=>`<article class="practical-card"><span class="practical-icon">${x[0]}</span><h3>${x[1]}</h3>${x[2]}</article>`).join('');

  const apps = [
    ['支','Alipay','Pagamenti e mini-app. Collegare la carta e fare un test prima.'],
    ['微','WeChat','Messaggi, QR e pagamento di riserva. Attivarlo con anticipo.'],
    ['地','Amap / 高德地图','Mappa più utile nella Cina continentale. Usare nomi cinesi.'],
    ['滴','DiDi','Auto con destinazione scritta nell’app. Controllare targa.'],
    ['铁','12306 / Trip.com','Treni con passaporto. Trip.com è più semplice.'],
    ['译','Traduttore','Scaricare mandarino offline e salvare screenshot.'],
    ['網','eSIM / roaming','Verificare Cina continentale, Hong Kong e Macao.'],
    ['八','Octopus','Trasporti e piccoli pagamenti a Hong Kong.']
  ];
  $('#apps').innerHTML = apps.map(x=>`<article class="app"><span class="app-icon">${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p></article>`).join('');
  $('#practical-details').innerHTML = `<details open><summary>Documenti e ingresso</summary><div><ul><li>Passaporto con validità adeguata.</li><li>Visto o esenzione valida nel 2027.</li><li>Assicurazione sanitaria e rimpatrio.</li><li>Prenotazioni disponibili offline.</li><li>Confermare che l’alloggio registri gli ospiti stranieri.</li></ul></div></details><details><summary>Trasporti: quando prenotare</summary><div><p><strong>Volo:</strong> monitorare 8–10 mesi prima. <strong>Alloggi cancellabili:</strong> bloccarli presto. <strong>Treni:</strong> aprono più vicino alla data. <strong>Traghetti/frontiere:</strong> ricontrollare nel 2027.</p></div></details><details><summary>Emergenze e backup</summary><div><p>Dividere carte e contanti, condividere copie dei documenti, salvare indirizzi in cinese e numero dell’assicurazione.</p></div></details>`;

  if (window.L) {
    const colors={route:'#981c22',nature:'#2f7d65',shopping:'#3f69a8',food:'#d18127',culture:'#7b4ba5',night:'#29202e'};
    const map=L.map('trip-map',{zoomControl:true,scrollWheelZoom:false});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap'}).addTo(map);
    const routeLine=L.polyline(D.routeCoords,{color:'#981c22',weight:4,opacity:.82,dashArray:'10 8'}).addTo(map);
    let routeNumber=0;
    const markers=D.mapPoints.map(p=>{
      if(p.cat==='route') routeNumber++;
      const icon=p.cat==='route'
        ?L.divIcon({className:'',html:`<span class="route-marker">${routeNumber}</span>`,iconSize:[30,30],iconAnchor:[15,15]})
        :L.divIcon({className:'',html:`<span class="point-marker" style="background:${colors[p.cat]}"></span>`,iconSize:[17,17],iconAnchor:[8,8]});
      const m=L.marker([p.lat,p.lng],{icon}).bindPopup(`<strong>${p.name}</strong><br>Giorno ${p.day} · ${p.note}`).addTo(map);
      m.category=p.cat; return m;
    });
    const routeBounds=L.latLngBounds(D.routeCoords); map.fitBounds(routeBounds.pad(.08));
    $('#fit-route').addEventListener('click',()=>map.fitBounds(routeBounds.pad(.08)));
    $$('[data-map-filter]').forEach(btn=>btn.addEventListener('click',()=>{
      const cat=btn.dataset.mapFilter;
      $$('[data-map-filter]').forEach(b=>b.classList.remove('is-active'));btn.classList.add('is-active');
      markers.forEach(m=>{const show=cat==='all'||m.category===cat;if(show&&!map.hasLayer(m))m.addTo(map);if(!show&&map.hasLayer(m))map.removeLayer(m)});
      if(cat==='all'||cat==='route'){if(!map.hasLayer(routeLine))routeLine.addTo(map)}else if(map.hasLayer(routeLine))map.removeLayer(routeLine);
    }));
  } else {
    $('#trip-map').innerHTML='<div class="map-fallback"><strong>Mappa non caricata.</strong><span>Controlla la connessione e ricarica la pagina.</span></div>';
    $$('.map-filter').forEach(b=>b.disabled=true);
  }

  const budgets={
    low:{label:'Scenario tirato',total:'1.105 €',description:'Volo in offerta, alloggi base, cibo locale e pochi ingressi.',rows:{Volo:'580 €',Alloggi:'185 €',Trasporti:'125 €',Cibo:'145 €',Attività:'30 €','eSIM, assicurazione e margine':'40 €'}},
    mid:{label:'Scenario realistico',total:'1.370 €',description:'Prenotato bene, camere condivise, cibo misto e attività scelte.',rows:{Volo:'650 €',Alloggi:'250 €',Trasporti:'150 €',Cibo:'190 €',Attività:'60 €','eSIM, assicurazione e margine':'70 €'}},
    high:{label:'Scenario comodo',total:'1.660 €',description:'Voli migliori, alloggi più centrali e più libertà.',rows:{Volo:'750 €',Alloggi:'330 €',Trasporti:'180 €',Cibo:'240 €',Attività:'80 €','eSIM, assicurazione e margine':'80 €'}}
  };
  function renderBudget(key){
    const c=budgets[key]; $('#budget-label').textContent=c.label; $('#budget-total').textContent=c.total; $('#budget-description').textContent=c.description;
    $('#budget-table').innerHTML='<thead><tr><th>Voce</th><th>Stima</th></tr></thead><tbody>'+Object.entries(c.rows).map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')+'</tbody>';
  }
  renderBudget('mid');
  $$('.budget-tab').forEach(b=>b.addEventListener('click',()=>{$$('.budget-tab').forEach(x=>x.classList.remove('is-active'));b.classList.add('is-active');renderBudget(b.dataset.budget)}));

  const checklist=[
    ['passport','Passaporto controllato','Validità, pagine libere, copie offline.'],
    ['visa','Regola visto 2027 verificata','Fonte ufficiale, non blog vecchio.'],
    ['insurance','Assicurazione sanitaria','Massimali, assistenza e rimpatrio.'],
    ['flight','Volo A/R e ultima notte','Rientro senza frontiere la mattina stessa.'],
    ['payments','Alipay e WeChat testati','Due carte e metodo di riserva.'],
    ['data','eSIM/roaming deciso','Copertura Cina, HK e Macao.'],
    ['apps','App installate','Amap, DiDi, Trip.com e traduttore.'],
    ['addresses','Indirizzi in cinese','Hotel, stazioni e tappe offline.'],
    ['trains','Treni principali prenotati','Passaporto uguale alla prenotazione.'],
    ['bags','Bagagli e batterie controllati','Power bank e limiti compagnia.']
  ];
  $('#checklist-grid').innerHTML=checklist.map(x=>`<label class="check-item"><input type="checkbox" data-check="${x[0]}"><span><strong>${x[1]}</strong><span>${x[2]}</span></span></label>`).join('');
  const boxes=$$('[data-check]'), storageKey='swadyaspace-china-checklist-v2'; let saved={}; try{saved=JSON.parse(localStorage.getItem(storageKey)||'{}')}catch(e){}
  function progress(){const done=boxes.filter(b=>b.checked).length,pct=Math.round(done/boxes.length*100);$('#progress-label').textContent=pct+'%';$('#progress-bar').style.width=pct+'%'}
  boxes.forEach(b=>{b.checked=!!saved[b.dataset.check];b.addEventListener('change',()=>{saved[b.dataset.check]=b.checked;localStorage.setItem(storageKey,JSON.stringify(saved));progress()})});progress();

  const translateBase='https://translate.google.com/?sl=zh-CN&tl=it&op=translate&text=';
  $('#phrase-body').innerHTML=D.phrases.map(p=>`<tr data-search="${esc(p[3])}"><td><span class="hanzi">${p[0]}</span><span class="pinyin">${p[1]}</span></td><td>${p[2]}</td><td><button class="speak-btn" data-text="${esc(p[0])}">▶ Ascolta</button><a class="translate-link" href="${translateBase+encodeURIComponent(p[0])}" target="_blank" rel="noopener">Translate</a></td></tr>`).join('');
  const rows=$$('#phrase-body tr'), search=$('#phrase-search'), count=$('#phrase-count');
  function filterPhrases(){const q=search.value.trim().toLowerCase();let n=0;rows.forEach(r=>{const show=!q||(r.textContent+' '+r.dataset.search).toLowerCase().includes(q);r.hidden=!show;if(show)n++});count.textContent=n+' frasi'}
  search.addEventListener('input',filterPhrases);filterPhrases();
  let voices=[];const refresh=()=>voices=window.speechSynthesis?.getVoices?.()||[];refresh();if('speechSynthesis'in window)window.speechSynthesis.onvoiceschanged=refresh;
  $$('.speak-btn').forEach(b=>b.addEventListener('click',()=>{if(!('speechSynthesis'in window)){window.open(translateBase+encodeURIComponent(b.dataset.text));return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(b.dataset.text);u.lang='zh-CN';u.rate=.78;u.voice=voices.find(v=>v.lang.toLowerCase()==='zh-cn')||voices.find(v=>v.lang.toLowerCase().startsWith('zh'))||null;speechSynthesis.speak(u)}));

  const dialog=$('#lightbox'), dialogImg=$('#lightbox img');
  $$('[data-lightbox]').forEach(f=>f.addEventListener('click',()=>{const img=$('img',f);if(!img||f.classList.contains('image-error'))return;dialogImg.src=img.src;dialogImg.alt=img.alt;dialog.showModal()}));
  $('#lightbox button').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
})();