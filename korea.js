(()=>{
  const trips=window.KOREA_TRIPS;
  const $=s=>document.querySelector(s);
  const $$=s=>[...document.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  let activeTrip='week';

  const PLACES={
    seoulbam:{city:'Seoul · Itaewon',name:'Seoulbam · 서울밤',type:'Itaewon Class · cena/bar',address:'Itaewon-dong 454-1, Yongsan-gu, Seoul',hours:'18:00–23:00 · lunedì da ricontrollare',price:'₩20.000–30.000 a persona',order:'Cena semplice + drink; venite soprattutto per chiudere qui la giornata Itaewon Class.',why:'È il locale reale associato a SEOUL BAM/DanBam nelle guide ufficiali delle location.',naver:'서울밤 이태원',backup:'Southside Parlor, 218 Noksapyeong-daero, per cocktail dopo Noksapyeong.',mode:'SEGNATELO'},
    bogwang:{city:'Seoul · Itaewon',name:'bogwangjung · 보광정',type:'Korean BBQ',address:'118 Bogwang-ro, Yongsan-gu, Seoul',hours:'16:00–00:00 feriali · 12:00–00:00 weekend',price:'circa ₩20.000–40.000 a persona',order:'Samgyeopsal / pork BBQ da dividere + riso + soju o birra.',why:'È perfetto per il blocco Bogwang-dong/G Guesthouse: mangiate nel quartiere invece di tornare nelle vie più turistiche.',naver:'보광정 이태원',backup:'Se c’è coda assurda, scegliete un BBQ pieno nella stessa Bogwang-ro invece di attraversare Seoul.',mode:'PRENOTA/CODA'},
    southside:{city:'Seoul · Noksapyeong',name:'Southside Parlor',type:'Cocktail bar',address:'218 Noksapyeong-daero, Yongsan-gu, Seoul',hours:'circa 18:00–00:30 · più tardi ven/sab',price:'₩10.000–50.000',order:'Un cocktail e basta: è il secondo giro, non la cena.',why:'Sta sulla direttrice Noksapyeong e funziona bene quando volete continuare dopo Itaewon senza entrare subito in un club.',naver:'Southside Parlor Seoul',backup:'Restate a Haebangchon e scegliete un bar piccolo sul momento.',mode:'OPZIONALE'},
    nogari:{city:'Seoul · Euljiro',name:'Euljiro Nogari Alley · 을지로 노가리골목',type:'strada di pub / tavoli fuori',address:'12 Chungmuro 9-gil, Jung-gu, Seoul',hours:'sera; i singoli locali cambiano orari',price:'₩10.000–25.000 a persona',order:'Birra + nogari/anelli secchi o snack; se uno stand non vi convince, camminate 50 metri e sceglietene un altro.',why:'Qui NON serve scegliere il “ristorante numero uno”: la strada stessa è l’esperienza. Di giorno è normale, la sera diventa tavoli e pub.',naver:'을지로 노가리골목',backup:'Jongno 3-ga pocha street.',mode:'SCEGLIETE LÌ'},
    ace4:{city:'Seoul · Euljiro',name:'Ace 4 Club',type:'cocktail / wine bar',address:'105 Eulji-ro, Jung-gu, Seoul',hours:'18:00–01:00 · ven/sab fino ~02:00',price:'₩10.000–50.000',order:'Un cocktail dopo Nogari Alley.',why:'Secondo giro preciso quando volete passare dai tavolini di plastica a qualcosa di curato senza cambiare quartiere.',naver:'Ace 4 Club Euljiro',backup:'Fabrik Seoul.',mode:'BAR 2'},
    fabrik:{city:'Seoul · Euljiro',name:'Fabrik Seoul',type:'bar / cocktail / wine',address:'16-3, Jung-gu, Seoul · 1F/2F',hours:'fino ~02:00; ven/sab ~04:00',price:'₩10.000–30.000',order:'Cocktail o vino. Usatelo solo se avete ancora voglia di stare fuori.',why:'Buon piano B o terza tappa a Euljiro, specialmente venerdì/sabato.',naver:'Fabrik Seoul',backup:'Tornate a Hongdae: non serve fare after per forza.',mode:'PIANO B'},
    hongs:{city:'Seoul · Hongdae',name:'Hong’s Makgeolli Brewery · 홍스막걸리',type:'makgeolli pub',address:'14 Hongik-ro 5an-gil, Mapo-gu, Seoul',hours:'16:00–00:00 circa · martedì può chiudere più tardi',price:'₩10.000–20.000',order:'Una bottiglia di makgeolli + pajeon/jeon da dividere.',why:'È un primo contatto molto più interessante del solito pub internazionale di Hongdae.',naver:'홍스 막걸리 홍대',backup:'Saltatelo e scegliete un hof pieno nelle strade laterali di Hongdae.',mode:'BUONA PRIMA SERA'},
    soo:{city:'Seoul · Hongdae',name:'Soo Karaoke Hongdae · 수노래연습장',type:'noraebang',address:'67 Eoulmadang-ro, Mapo-gu, Seoul',hours:'molto estesi · weekend 24h',price:'variabile per stanza/orario',order:'Stanza privata 60–90 min. Cercate prima le canzoni che volete fare.',why:'È una chiusura di serata concreta, facile e centrale.',naver:'수노래연습장 홍대',backup:'Coin noraebang qualsiasi con buona affluenza nelle vie vicine.',mode:'DOPO I DRINK'},
    goldpig:{city:'Seoul · Sindang',name:'Geumdwaeji Sikdang · 금돼지식당',type:'BBQ famoso',address:'149 Dasan-ro, Jung-gu, Seoul',hours:'11:30–23:00 circa',price:'₩20.000–60.000 a persona',order:'Pork BBQ; andate presto e non costruite una serata rigida intorno alla coda.',why:'È il BBQ “destinazione” da tenere come bonus, non come obbligo.',naver:'금돼지식당',backup:'bogwangjung è logisticamente migliore nel giorno Itaewon.',mode:'BONUS'},
    gwanganHQ:{city:'Busan · Gwangalli',name:'HQ Gwangan',type:'bar sul mare',address:'237 Gwanganhaebyeon-ro, Suyeong-gu, Busan',hours:'19:00–00:00/01:00 · ven/sab fino ~03:00',price:'₩10.000–20.000',order:'Birra/drink con vista Gwangan Bridge.',why:'È letteralmente sul lungomare: perfetto dopo spiaggia e cena, senza spostamenti stupidi.',naver:'HQ Gwangan',backup:'Oasis Bar nello stesso edificio/indirizzo.',mode:'BAR 1'},
    oasis:{city:'Busan · Gwangalli',name:'Oasis Bar Busan',type:'tiki / cocktail bar',address:'237 Gwanganhaebyeon-ro, Suyeong-gu, Busan · 2F',hours:'12:00–04:00',price:'₩10.000–20.000',order:'Cocktail; venite dopo HQ se la serata gira bene.',why:'È il bar 2 facile: stesso tratto di Gwangalli, zero taxi inutili.',naver:'Oasis Bar Busan Gwangalli',backup:'Prendete birre al convenience store e tornate sulla spiaggia.',mode:'BAR 2'},
    yeongjin:{city:'Busan · Nam-gu',name:'Yeongjin Dwaeji Gukbap · 영진돼지국밥',type:'zuppa di maiale e riso',address:'18 Suyeong-ro 346beon-gil, Nam-gu, Busan',hours:'09:00–22:00',price:'₩10.000 circa',order:'Dwaeji-gukbap; aggiustate sale/condimenti al tavolo.',why:'Più adatto a voi del “devi mangiare pesce perché sei a Busan”. È un piatto cittadino, caldo e cheap.',naver:'영진돼지국밥 경성부경점',backup:'Ssangdung-i Dwaeji Gukbap, 35-1 UN pyeonghwa-ro.',mode:'DA FARE'},
    kkangtong:{city:'Busan · Nampo',name:'Bupyeong Kkangtong Market · 부평깡통시장',type:'night market',address:'39 Bupyeong 1-gil, Jung-gu, Busan',hours:'mercato fino ~23:30 · night stalls ~19:30–23:30',price:'₩5.000–20.000 a persona assaggiando',order:'Prendete 2–3 cose diverse invece di una cena unica.',why:'È perfetto come cena mobile dopo Nampo: si mangia, si guarda e si cambia bancarella.',naver:'부평깡통시장',backup:'Gukje Market/Nampo streets.',mode:'SCEGLIETE LÌ'},
    momos:{city:'Busan · Yeongdo',name:'Momos Yeongdo Roastery & Coffee Bar',type:'caffetteria',address:'160 Bongnaenaru-ro, Yeongdo-gu, Busan',hours:'08:00–18:00',price:'₩5.000–10.000',order:'Caffè filtro o espresso prima/dopo Yeongdo.',why:'Buona sosta vera nella giornata Huinnyeoul/Yeongdo, non una catena messa per riempire.',naver:'모모스커피 영도',backup:'Qualsiasi caffè con vista lungo Huinnyeoul se non volete deviazioni.',mode:'PAUSA'},
    sokchoMarket:{city:'Sokcho',name:'Sokcho Tourist & Fishery Market · 속초관광수산시장',type:'mercato',address:'16 Jungang-ro 147beon-gil, Sokcho-si',hours:'08:00–22:00 circa',price:'₩5.000–25.000 a persona',order:'Dakgangjeong, hotteok, snack; il reparto pesce è facoltativo.',why:'È il posto più semplice per entrare subito nel ritmo di Sokcho senza cercare tre ristoranti diversi.',naver:'속초관광수산시장',backup:'Abai Village per cena.',mode:'SCEGLIETE LÌ'},
    manseok:{city:'Sokcho',name:'Manseok Dakgangjeong · 만석닭강정',type:'pollo fritto glassato',address:'72 Cheongchohoban-ro, Sokcho-si',hours:'10:00–20:00',price:'₩10.000–20.000',order:'Dakgangjeong da condividere; ottimo anche takeaway.',why:'È la risposta per Sokcho se il pesce non vi interessa.',naver:'만석닭강정 본점',backup:'Filiale dentro/accanto al Jungang Market.',mode:'PER VOI'},
    veteran:{city:'Jeonju · Hanok Village',name:'Veteran Kalguksu · 베테랑칼국수',type:'kalguksu',address:'135 Gyeonggijeon-gil, Wansan-gu, Jeonju',hours:'09:00–20:00',price:'sotto ₩10.000',order:'Kalguksu + mandu da dividere.',why:'Economico, storico e dentro la zona Hanok: perfetto per pranzo senza spezzare il giro.',naver:'베테랑칼국수 전주',backup:'Waengi Kongnamul-gukbap.',mode:'PRANZO'},
    waengi:{city:'Jeonju',name:'Waengi Kongnamul-gukbap · 왱이콩나물국밥',type:'bean sprout soup + rice',address:'88 Dongmun-gil, Jeonju',hours:'07:00–20:30',price:'sotto ₩10.000',order:'Kongnamul-gukbap, perfetto a colazione/pranzo.',why:'È una colazione coreana vera e cheap, soprattutto dopo una sera di makgeolli.',naver:'왱이콩나물국밥',backup:'Sambaekjip main branch.',mode:'COLAZIONE'},
    gyodong:{city:'Jeonju · Hanok Village',name:'Gyodong Tea Garden · 교동다원',type:'traditional tea house',address:'65-5 Eunhaeng-ro, Wansan-gu, Jeonju',hours:'11:00–19:00',price:'sotto ₩10.000',order:'Tè tradizionale e pausa vera nel pomeriggio.',why:'È una pausa coerente con Jeonju invece dell’ennesimo café instagrammabile.',naver:'교동다원 전주',backup:'Scegliete una piccola tea house nelle vie laterali del villaggio.',mode:'PAUSA'},
    hanok:{city:'Jeonju',name:'Dream Hanok Stay',type:'hanok accommodation',address:'85-11 Hyanggyo-gil, Wansan-gu, Jeonju',hours:'check-in da verificare in prenotazione',price:'indicativamente fascia economica/media',order:'Non è un ristorante: prenotate una notte in camera tradizionale.',why:'Dormire davvero in hanok cambia la tappa più che aggiungere altre due attrazioni.',naver:'전주한옥마을 드림한옥스테이',backup:'The Hanok JeonJu, 68-15 Eunhaeng-ro.',mode:'PRENOTA'}
  };

  const DAY_DETAIL={
    week:{
      1:{eat:['hongs'],night:['soo'],search:'연남동 경의선숲길',free:'Dopo cena camminate Yeonnam/Hongdae e scegliete un secondo posto solo se vi ispira. Non prenotare la prima notte.'},
      2:{eat:['bogwang','seoulbam'],night:['southside'],search:'녹사평 육교 이태원클라쓰',free:'Tra G Guesthouse e Noksapyeong lasciate 1–2 ore senza prenotazioni: è il giorno in cui i vicoli contano.'},
      3:{eat:['nogari'],night:['ace4','fabrik'],search:'종로3가 포차거리',free:'A Nogari Alley scegliete il tavolo in base all’atmosfera. Se è vuoto, spostatevi a Jongno 3-ga.'},
      4:{eat:['goldpig'],night:['soo'],search:'망원시장 망원한강공원',free:'Se c’è KBO, il baseball sostituisce completamente BBQ famoso + karaoke: non comprimere tutto.'},
      5:{eat:['yeongjin'],night:['gwanganHQ','oasis'],search:'광안리 해수욕장',free:'Dopo il bar potete semplicemente comprare due birre e stare sulla sabbia guardando il ponte.'},
      6:{eat:['momos','kkangtong'],night:[],search:'흰여울문화마을 부평깡통시장',free:'Il mercato è la cena: scegliete bancarelle sul posto. Nessun ristorante obbligatorio.'},
      7:{eat:[],night:[],search:'부산역 KTX',free:'Ultimo giorno volutamente leggero: niente locale famoso prima di un trasferimento lungo.'}
    },
    two:{
      1:{eat:['hongs'],night:['soo'],search:'연남동 경의선숲길',free:'Prima sera libera dopo questi due riferimenti.'},
      2:{eat:['seoulbam'],night:['southside'],search:'녹사평 육교 이태원클라쓰',free:'Tenete Noksapyeong per blu dell’ora/notte.'},
      3:{eat:['bogwang'],night:['southside'],search:'보광동 이태원 해방촌',free:'Dopo BBQ scegliete HBC/Itaewon sul momento.'},
      4:{eat:['nogari'],night:['ace4','fabrik'],search:'을지로 노가리골목',free:'Prima tavolo fuori, poi cocktail solo se avete ancora voglia.'},
      5:{eat:[],night:[],search:'북한산 국립공원',free:'Cena vicino al jjimjilbang/hotel: dopo hike non serve attraversare Seoul per un ristorante famoso.'},
      6:{eat:[],night:['soo'],search:'망원시장 망원한강공원',free:'KBO ha priorità su tutto quando il calendario coincide.'},
      7:{eat:['sokchoMarket','manseok'],night:[],search:'속초관광수산시장 속초해수욕장',free:'Prendete il pollo al mercato e mangiatelo dove vi va; niente cena formale.'},
      8:{eat:['manseok'],night:[],search:'설악산 울산바위',free:'Dopo Seoraksan: bagno caldo, cena semplice, letto.'},
      9:{eat:['yeongjin'],night:['gwanganHQ','oasis'],search:'광안리 해수욕장',free:'Arrivati a Busan non aggiungete attrazioni: mare + cibo + bar.'},
      10:{eat:['momos','kkangtong'],night:[],search:'흰여울문화마을 부평깡통시장',free:'Cena girando per il mercato.'},
      11:{eat:['yeongjin'],night:['gwanganHQ'],search:'이기대 해안산책로',free:'Seconda Gwangalli più libera: potete cambiare bar semplicemente guardando dove c’è gente.'},
      12:{eat:['veteran'],night:[],search:'전주 한옥마을',free:'Appena arrivati a Jeonju: passeggiata e basta.'},
      13:{eat:['waengi','veteran','gyodong'],night:[],search:'전주 막걸리 골목',free:'Per il makgeolli non vi blocco su un solo ristorante: andate nella zona e scegliete il tavolo pieno che vi ispira.'},
      14:{eat:['waengi'],night:[],search:'전주역 KTX',free:'Colazione precisa, poi rientro con margine.'}
    }
  };

  function naverUrl(q){return `https://map.naver.com/p/search/${encodeURIComponent(q)}`}
  function placeCard(id){
    const p=PLACES[id];
    return `<article class="exact-place"><div class="exact-top"><span>${esc(p.mode)}</span><b>${esc(p.city)}</b></div><h4>${esc(p.name)}</h4><p class="exact-type">${esc(p.type)}</p><dl><div><dt>Dove</dt><dd>${esc(p.address)}</dd></div><div><dt>Quando</dt><dd>${esc(p.hours)}</dd></div><div><dt>Budget</dt><dd>${esc(p.price)}</dd></div><div><dt>Ordina/fai</dt><dd>${esc(p.order)}</dd></div><div><dt>Perché</dt><dd>${esc(p.why)}</dd></div><div><dt>Piano B</dt><dd>${esc(p.backup)}</dd></div></dl><a class="naver-btn" href="${naverUrl(p.naver)}" target="_blank" rel="noreferrer">Naver Map · cerca “${esc(p.naver)}” ↗</a></article>`;
  }

  function injectV2(){
    if($('#koreaV2'))return;
    const style=document.createElement('style');
    style.textContent=`
      .v2-period{display:grid;grid-template-columns:1.35fr .85fr;gap:16px}.period-main,.period-alt{padding:26px}.period-main{background:linear-gradient(145deg,rgba(30,74,138,.34),rgba(17,12,26,.96))}.period-main strong{display:block;font-size:clamp(2rem,6vw,4.5rem);letter-spacing:-.06em;color:#fff}.period-main em{color:#64f4ce;font-style:normal;font-weight:900}.period-alt strong{font-size:1.5rem}.period-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}.period-mini{padding:15px;border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,.03)}.period-mini b{display:block;color:#64f4ce}.period-mini span{display:block;color:var(--muted);margin-top:5px;line-height:1.45}.detail-days{display:grid;gap:14px}.detail-day{padding:22px}.detail-head{display:flex;justify-content:space-between;gap:16px;align-items:start}.detail-head b{font-size:1.35rem}.detail-head span{color:#64f4ce;font-weight:900}.detail-free{margin:14px 0;padding:13px 15px;border-left:3px solid #f04bb6;background:rgba(240,75,182,.07);color:#e7dce8;line-height:1.5}.detail-search{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;color:#cbd4ff;font-size:.86rem}.exact-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px}.exact-place{padding:18px;border:1px solid var(--line);border-radius:18px;background:rgba(8,12,22,.8)}.exact-top{display:flex;justify-content:space-between;gap:10px;font-size:.7rem;letter-spacing:.08em}.exact-top span{color:#64f4ce;font-weight:950}.exact-top b{color:#9aa8c9}.exact-place h4{margin:10px 0 3px;font-size:1.25rem}.exact-type{margin:0 0 12px;color:#f58bc9}.exact-place dl{margin:0}.exact-place dl div{display:grid;grid-template-columns:78px 1fr;gap:10px;padding:8px 0;border-top:1px solid rgba(255,255,255,.08)}.exact-place dt{font-weight:900;color:#9aa8c9}.exact-place dd{margin:0;color:#e7e9f2;line-height:1.42}.naver-btn{display:inline-flex;margin-top:13px;padding:9px 11px;border-radius:10px;background:#1ec800;color:#071109;text-decoration:none;font-weight:950;font-size:.78rem}.directory{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.directory .exact-place{height:100%}@media(max-width:850px){.v2-period{grid-template-columns:1fr}.period-grid{grid-template-columns:1fr}.directory{grid-template-columns:1fr 1fr}}@media(max-width:600px){.exact-grid,.directory{grid-template-columns:1fr}.detail-head{display:block}.detail-head span{display:block;margin-top:5px}.exact-place dl div{grid-template-columns:68px 1fr}.period-main,.period-alt{padding:20px}}
    `;
    document.head.appendChild(style);
    const target=$('#budget')||$('#pratico');
    const section=document.createElement('section');
    section.id='koreaV2';
    section.className='section';
    section.innerHTML=`<div class="head"><div><p class="eyebrow">V2 · quando andare davvero</p><h2>Periodo scelto.</h2></div><p>Per questo itinerario il clima conta: ci sono Itaewon a piedi, Bukhansan, Seoraksan e costa a Busan. Non scegliamo il mese solo perché i voli costano meno.</p></div>
      <div class="v2-period"><article class="card period-main"><span class="tag">MIGLIORE · 14 GIORNI</span><strong>12–25 ottobre.</strong><p>Il compromesso che sceglierei: autunno fresco, serate vivibili, hike sensati e possibilità concreta di vedere Seoraksan iniziare a colorarsi. Nel 2025 il primo foliage a Seoraksan era previsto dal 30 settembre e Bukhansan dal 17 ottobre; il picco nazionale arrivava tra fine ottobre e inizio novembre.</p><em>Se volete più foliage: spostate di ~7 giorni verso fine ottobre.</em></article><article class="card period-alt"><span class="tag">ALTERNATIVA · PRIMAVERA</span><strong>4–15 aprile.</strong><p>La finestra bella se volete ciliegi. Nel 2026 Seoul era prevista in fioritura dal 3 aprile con piena circa il 10; Busan partiva prima. Le date 2027 andranno ricontrollate a marzo.</p><div class="note">Eviteri luglio/agosto per questa specifica rotta: caldo e umidità peggiorano proprio le giornate più fisiche.</div></article></div>
      <div class="period-grid"><div class="period-mini"><b>Autunno</b><span>VISITKOREA indica ~15 °C medi stagionali e lo considera ottimo per attività outdoor.</span></div><div class="period-mini"><b>Seoraksan</b><span>Il foliage parte prima in montagna: mettendolo al giorno 8, metà/fine ottobre ha molto senso.</span></div><div class="period-mini"><b>Regola 2027</b><span>Fioriture, foliage, KBO e orari locali si ricontrollano 3–6 settimane prima della partenza.</span></div></div>
      <div class="head" style="margin-top:58px"><div><p class="eyebrow">Giorno per giorno</p><h2>Dove mangiate davvero.</h2></div><p>Ogni giornata ora ha posti precisi, query da copiare in Naver Map e una parte volutamente libera. Se un locale diventa mediocre o chiude, il viaggio non collassa.</p></div><div class="detail-days" id="detailDays"></div>
      <div class="head" style="margin-top:58px"><div><p class="eyebrow">Rubrica operativa</p><h2>Posti da salvare.</h2></div><p>Questi sono i riferimenti concreti. Gli orari sono quelli trovati ora: prima del viaggio si ricontrollano su Naver Map perché in Corea cambiano.</p></div><div class="directory" id="placeDirectory"></div>`;
    target?.parentNode.insertBefore(section,target);
    $('#placeDirectory').innerHTML=Object.keys(PLACES).map(placeCard).join('');
  }

  function renderDetails(key){
    const box=$('#detailDays'); if(!box)return;
    const detail=DAY_DETAIL[key]||{};
    box.innerHTML=trips[key].days.map(day=>{
      const d=detail[day.n]||{eat:[],night:[],search:'',free:''};
      const ids=[...(d.eat||[]),...(d.night||[])];
      return `<article class="card detail-day"><div class="detail-head"><b>Giorno ${day.n} · ${esc(day.place)}</b><span>${ids.length?`${ids.length} riferimenti precisi`:'giornata volutamente libera'}</span></div>${d.search?`<p class="detail-search">NAVER → ${esc(d.search)}</p>`:''}${d.free?`<div class="detail-free"><b>Spazio libero:</b> ${esc(d.free)}</div>`:''}${ids.length?`<div class="exact-grid">${ids.map(placeCard).join('')}</div>`:''}</article>`;
    }).join('');
  }

  function renderStats(trip){$('#stats').innerHTML=trip.stats.map(([a,b])=>`<div class="stat"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('')}
  function renderDays(trip){$('#days').innerHTML=trip.days.map(day=>`<article class="card day"><div class="day-meta"><strong>${day.n}</strong><span>${esc(day.place)}</span></div><div class="day-main"><h3>${esc(day.title)}</h3><p>${esc(day.desc)}</p><div class="slots">${day.slots.map(([label,text])=>`<div class="slot"><b>${esc(label)}</b><span>${esc(text)}</span></div>`).join('')}</div>${day.note?`<div class="note">${esc(day.note)}</div>`:''}</div></article>`).join('')}
  function renderBudget(trip){$('#budgetLabel').textContent=`${trip.label} · due persone`;$('#budgetTotal').textContent=trip.budget.total;$('#budgetRows').innerHTML=trip.budget.rows.map(([name,cost])=>`<div class="cost"><span>${esc(name)}</span><strong>${esc(cost)}</strong></div>`).join('')}
  function setTrip(key,{scroll=false}={}){
    activeTrip=key;
    const trip=trips[key];
    $$('.switcher button').forEach(b=>b.classList.toggle('active',b.dataset.trip===key));
    renderStats(trip);$('#tripTitle').textContent=`${trip.label}.`;$('#routeSummary').textContent=trip.route;renderDays(trip);renderBudget(trip);renderDetails(key);
    history.replaceState(null,'',`${location.pathname}${location.search}#${key}`);
    if(scroll)$('#itinerario').scrollIntoView({behavior:'smooth',block:'start'});
  }

  $$('.switcher button').forEach(btn=>btn.addEventListener('click',()=>setTrip(btn.dataset.trip,{scroll:true})));
  $$('img[data-fallback]').forEach(img=>img.addEventListener('error',()=>{if(img.dataset.fallbackUsed==='1'){img.removeAttribute('src');img.alt=`Immagine non disponibile · ${img.alt}`;img.style.background='linear-gradient(135deg,#121a28,#25172a)';return}img.dataset.fallbackUsed='1';img.src=img.dataset.fallback}));

  const sourceBox=$('.sources');
  if(sourceBox){const credits=document.createElement('div');credits.className='good';credits.innerHTML='Foto Commons: Itaewon bridge — <a href="https://commons.wikimedia.org/wiki/File:N-Seoul_tower_from_Itaewon_bridge_pinhole.jpg" target="_blank" rel="noreferrer">Aatu Dorochenko, CC BY-SA 4.0</a> · Gwangalli — <a href="https://commons.wikimedia.org/wiki/File:Gwangan_Bridge_and_Gwangalli_Beach_-_Gwangalli2721.jpg" target="_blank" rel="noreferrer">lumoplank, CC0</a> · Seoraksan — <a href="https://commons.wikimedia.org/wiki/File:Korean.Seoraksan-Ulsanbawi-01.jpg" target="_blank" rel="noreferrer">flowerguy, CC BY 2.0</a> · Jeonju — <a href="https://commons.wikimedia.org/wiki/File:Jeonju_Hanok_Maeul_(6).JPG" target="_blank" rel="noreferrer">콩가루, CC BY-SA 4.0</a>.';sourceBox.after(credits)}

  injectV2();
  setTrip(location.hash==='#two'?'two':'week');
})();
