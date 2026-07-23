(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value = '') => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const commons = filename => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1400`;
  const amap = keyword => `https://uri.amap.com/search?keyword=${encodeURIComponent(keyword)}&src=swadyaspace&callnative=1`;
  const translateUrl = text => `https://translate.google.com/?sl=it&tl=zh-CN&op=translate&text=${encodeURIComponent(text)}`;

  const PHOTO = {
    hero: commons('Hong Kong Skyline viewed from Victoria Peak.jpg'),
    hongkong: commons('Hong Kong Skyline at Night - Star Ferry - Flickr - Wilson Hui.jpg'),
    ferry: commons('Star Ferry ships at Hong Kong.jpg'),
    dragon: commons("Dragon's Back Trail.jpg"),
    shenzhen: commons('A spectacular view of Shenzhen Skyline.jpg'),
    hqb: commons('Huaqiangbei.jpg'),
    macao: commons("Ruins of St Paul's, Macau (30843847251).jpg"),
    xian: commons("Yongningmen, Xi'an City Wall, Xi'an.jpg"),
    terracotta: commons('Terracotta Army, View of Pit 1.jpg'),
    forbidden: commons('Forbidden City, Beijing - panoramio (2).jpg'),
    wall: commons('The Great Wall of China at Jinshanling.jpg'),
    summer: commons('The Summer Palace, Beijing.jpg'),
    art: commons('798 Art Zone.jpg'),
    temple: commons('Temple of Heaven, Beijing, China - 001.jpg'),
    avatar: commons('Zhangjiajie National Forest Park, China.jpg'),
    yangshuo: commons('Yangshuo-Li-River-2019-Luka-Peternel.jpg'),
    shanghai: commons('Shanghai skyline from the bund.jpg'),
    sanya: commons('Sanya Bay Hainan China.jpg')
  };

  const FOOD_PHOTO = {
    'food-pineapple-bun': commons('Pineapple bun and milk tea.jpg'),
    'food-char-siu': commons('Soy sauce chicken, siu yuk and char siu in Hong Kong - 20130614.jpg'),
    'food-changfen': commons('Chinese Steamed Rice Noodle Rolls 01.jpg'),
    'food-claypot': commons('Claypot rice.jpg'),
    'food-egg-tart': commons('Portuguese egg tart in Macau.jpg'),
    'food-pork-bun': commons('PorkChopBun.jpg'),
    'food-roujiamo': commons('Roujiamo.jpg'),
    'food-biangbiang': commons('Biangbiang noodles.jpg'),
    'food-paomo': commons('Yangrou Paomo.JPG'),
    'food-jianbing': commons('Jianbing.jpg'),
    'food-zhajiangmian': commons('Zhajiangmian 20180501.jpg'),
    'food-duck': commons('Peking duck.jpg')
  };

  const dayVisuals = [
    [PHOTO.hero, '香港', 'Hong Kong'], [PHOTO.ferry, '香港', 'Star Ferry e skyline'], [PHOTO.dragon, '龙脊', 'Dragon’s Back'],
    [PHOTO.shenzhen, '深圳', 'Shenzhen'], [PHOTO.hqb, '华强北', 'Huaqiangbei'], [PHOTO.macao, '澳门', 'Macao'],
    [PHOTO.xian, '西安', 'Xi’an'], [PHOTO.terracotta, '兵马俑', 'Esercito di Terracotta'], [PHOTO.xian, '西安城墙', 'Mura di Xi’an'],
    [PHOTO.forbidden, '北京', 'Città Proibita'], [PHOTO.wall, '长城', 'Grande Muraglia'], [PHOTO.summer, '颐和园', 'Palazzo d’Estate'],
    [PHOTO.art, '北京', 'Pechino contemporanea'], [PHOTO.temple, '天坛', 'Tempio del Cielo']
  ];

  const style = document.createElement('style');
  style.textContent = `
    :root{--china-red:#8b151b;--china-deep:#5e0b10;--china-gold:#d2a34d;--rice:#f7efe2;--ink:#241815}
    body{background:linear-gradient(rgba(136,64,34,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(136,64,34,.035) 1px,transparent 1px),radial-gradient(circle at 8% 2%,rgba(210,163,77,.18),transparent 24rem),var(--rice)!important;background-size:32px 32px,32px 32px,auto!important}
    body::after{content:'福';position:fixed;right:-2vw;top:17vh;z-index:-1;color:rgba(139,21,27,.035);font-family:serif;font-size:min(55vw,650px);font-weight:900;line-height:.8;pointer-events:none}
    .app-header{color:#fff;background:rgba(94,11,16,.97)!important;border-color:rgba(255,255,255,.18)!important;box-shadow:0 8px 26px rgba(61,4,8,.22)}
    .app-brand{color:#fff!important}.app-brand>span{color:var(--china-deep)!important;background:#f4d699!important;border:2px solid rgba(255,255,255,.48);font-family:serif}.app-brand b{font-size:1rem}.status-pill,.icon-button{color:#fff!important;background:rgba(255,255,255,.08)!important;border-color:rgba(255,255,255,.28)!important}
    .visual-hero{position:relative;display:grid!important;min-height:650px!important;align-items:end;margin-top:16px;padding:62px 38px 38px!important;overflow:hidden;color:#fff;border-radius:24px;background-image:linear-gradient(90deg,rgba(42,3,6,.92),rgba(55,6,10,.65) 50%,rgba(27,3,5,.18)),linear-gradient(0deg,rgba(31,3,5,.92),transparent 58%),url('${PHOTO.hero}')!important;background-size:cover!important;background-position:center!important;box-shadow:0 24px 65px rgba(69,17,12,.22)}
    .visual-hero::before{content:'中國';position:absolute;right:4%;top:2%;color:rgba(255,255,255,.11);font-family:serif;font-size:clamp(5rem,17vw,12rem);font-weight:950;letter-spacing:-.08em;line-height:1;pointer-events:none}
    .visual-hero .hero-copy,.visual-hero .hero-stats{position:relative;z-index:2}.visual-hero .kicker{color:#f0c877}.visual-hero h1{max-width:760px;color:#fff}.visual-hero h1 em{color:#f4d28d}.visual-hero .hero-copy>p:not(.kicker){color:#f3e4d8}.visual-hero .stat-card{color:#fff;background:rgba(77,8,13,.58);border-color:rgba(255,255,255,.23);backdrop-filter:blur(9px)}.visual-hero .stat-card span{color:#ead4cb}.visual-hero .secondary-button{color:#fff;background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.3)}
    .quickbar{top:61px;padding:12px 0!important;background:linear-gradient(rgba(247,239,226,.97) 74%,transparent)!important}.quickbar button{min-height:46px;padding:10px 15px!important;background:#fffaf1!important;border-color:#ddc7aa!important;font-size:.92rem}
    .visual-route{padding-top:58px}.visual-route-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:16px}.visual-route-head h2{margin:0;font-size:clamp(2rem,5vw,4rem);line-height:1}.visual-route-head p{max-width:560px;margin:0;color:#6d5d54}.visual-route-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.visual-route-card{position:relative;min-height:270px;overflow:hidden;border-radius:17px;background:#7a1a20;box-shadow:0 12px 30px rgba(63,39,27,.13);cursor:zoom-in}.visual-route-card img{width:100%;height:100%;object-fit:cover;transition:.25s}.visual-route-card:hover img{transform:scale(1.035)}.visual-route-card::after{content:'';position:absolute;inset:0;background:linear-gradient(0deg,rgba(31,3,5,.91),transparent 65%)}.visual-route-copy{position:absolute;z-index:2;inset:auto 14px 13px;color:#fff}.visual-route-copy span{color:#f3cc82;font-size:.7rem;font-weight:900;text-transform:uppercase}.visual-route-copy h3{margin:3px 0 0;font-size:1.25rem}.visual-route-copy p{margin:4px 0 0;color:#ead9d0;font-size:.76rem}
    .day-card{border-radius:18px!important}.day-card[open]{box-shadow:0 15px 38px rgba(68,34,22,.12)}.day-card>summary{background:linear-gradient(90deg,#fffaf1,#fff)}.day-number{background:var(--china-red)!important}.day-body{padding:16px!important}.polish-day-photo{position:relative;height:310px;margin:0 0 17px;overflow:hidden;border-radius:14px;background:linear-gradient(135deg,var(--china-red),var(--china-gold));cursor:zoom-in}.polish-day-photo img{width:100%;height:100%;object-fit:cover}.polish-day-photo::after{content:'';position:absolute;inset:0;background:linear-gradient(0deg,rgba(34,3,5,.85),transparent 58%)}.polish-day-caption{position:absolute;z-index:2;left:16px;right:16px;bottom:13px;color:#fff}.polish-day-caption b{display:block;color:#f3cc82;font-size:.78rem}.polish-day-caption strong{display:block;margin-top:2px;font-size:1.35rem}.polish-day-tools{display:flex;flex-wrap:wrap;gap:8px;margin:13px 0}.polish-day-tools a,.polish-day-tools button{min-height:37px;padding:7px 10px;color:var(--china-deep);background:#fff;border:1px solid #decbb5;border-radius:9px;text-decoration:none;font-size:.76rem;font-weight:850;cursor:pointer}.polish-day-tools .say{color:#fff;background:#276e5b;border-color:#276e5b}
    .visual-gallery{padding-top:62px}.visual-gallery-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:205px;gap:10px}.visual-gallery figure{position:relative;margin:0;overflow:hidden;border-radius:15px;background:#8f1e25;cursor:zoom-in}.visual-gallery figure:first-child{grid-column:span 2;grid-row:span 2}.visual-gallery img{width:100%;height:100%;object-fit:cover}.visual-gallery figcaption{position:absolute;inset:auto 0 0;padding:32px 13px 10px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.82));font-size:.76rem;font-weight:800}
    .food-card{border-radius:18px!important;box-shadow:0 12px 30px rgba(63,39,27,.08)}.food-card figure{position:relative;height:230px!important;overflow:hidden;background:linear-gradient(135deg,#7d171c,#d2a34d)!important;cursor:zoom-in}.food-card figure::after{content:attr(data-placeholder);position:absolute;inset:0;display:none;place-items:center;padding:18px;color:#fff;text-align:center;font-size:1.15rem;font-weight:900}.food-card figure.food-photo-missing::after{display:grid}.food-card figure.food-photo-missing img{display:none}.food-card img{width:100%;height:100%;object-fit:cover}.food-card-body{padding:18px!important}.food-card h3{font-size:1.22rem!important}.food-card .cn-line{font-size:1rem}.food-label{color:var(--china-red)!important}
    #phrases{padding-top:0!important;margin-top:70px;color:#fff;background:linear-gradient(135deg,#5e0b10,#971e25 55%,#4a090d);box-shadow:inset 0 1px rgba(255,255,255,.15)}#phrases .app-shell{padding:68px 0}#phrases .section-heading h2{color:#fff}#phrases .section-heading>p{color:#ead3cc}.direct-translator{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.translator-card{padding:18px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.23);border-radius:16px}.translator-card label,.translator-card>span{display:block;margin-bottom:7px;color:#f2cf87;font-size:.72rem;font-weight:950;text-transform:uppercase}.translator-card textarea{width:100%;min-height:150px;padding:14px;color:#241815;background:#fffaf2;border:0;border-radius:12px;font:inherit;resize:vertical}.translator-result{min-height:150px;display:grid;align-content:center;padding:16px;color:#501017;background:#fffaf2;border-radius:12px;font-family:'Noto Sans SC',system-ui,sans-serif;font-size:clamp(1.7rem,5vw,3.5rem);font-weight:950;line-height:1.25}.translator-card p{color:#ead6d0;font-size:.8rem}.translator-buttons{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.translator-buttons button,.translator-buttons a{min-height:40px;padding:8px 11px;border:1px solid rgba(255,255,255,.34);border-radius:9px;color:#fff;background:rgba(255,255,255,.08);font-weight:850;text-decoration:none;cursor:pointer}.translator-buttons .gold{color:#551017;background:#f0cc84;border-color:#f0cc84}.quick-phrases{margin-top:14px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.22);border-radius:14px}.quick-phrases summary{padding:15px 17px;font-weight:900;cursor:pointer}.quick-phrase-groups{padding:0 14px 14px}.quick-phrase-group{margin-top:9px;padding:12px;color:#241815;background:#fffaf2;border-radius:11px}.quick-phrase-group h3{margin:0;color:#8b151b;font-size:.84rem}.quick-phrase-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:9px 0;border-bottom:1px solid #eadbca}.quick-phrase-row:last-child{border-bottom:0}.quick-phrase-row strong{display:block}.quick-phrase-row span{display:block;color:#8b151b;font-weight:850}.quick-phrase-actions{display:flex;gap:5px;align-items:center}.quick-phrase-actions button{padding:6px 8px;border:1px solid #ddc8af;border-radius:8px;background:#fff;cursor:pointer;font-weight:800}
    .alternative-card-visual{position:relative;height:200px;margin:0 0 14px;overflow:hidden;border-radius:12px;background:linear-gradient(135deg,#8b151b,#d2a34d);cursor:zoom-in}.alternative-card-visual img{width:100%;height:100%;object-fit:cover}
    .polish-lightbox{width:min(1000px,calc(100% - 22px));padding:0;border:0;border-radius:18px;background:#160c0a;box-shadow:0 30px 90px rgba(0,0,0,.48)}.polish-lightbox::backdrop{background:rgba(19,9,7,.82);backdrop-filter:blur(7px)}.polish-lightbox img{display:block;width:100%;max-height:78vh;object-fit:contain}.polish-lightbox p{margin:0;padding:12px 16px;color:#fff}.polish-lightbox button{position:absolute;right:10px;top:10px;width:40px;height:40px;color:#fff;background:rgba(0,0,0,.62);border:1px solid rgba(255,255,255,.4);border-radius:50%;font-size:1.35rem}
    @media(max-width:1000px){.visual-route-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.visual-route-card:last-child{grid-column:span 2}.visual-gallery-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media(max-width:720px){.visual-hero{min-height:620px!important;margin-top:8px;padding:52px 20px 24px!important;border-radius:18px}.visual-hero::before{top:6%;right:2%;font-size:7rem}.visual-hero .hero-stats{grid-template-columns:repeat(3,minmax(0,1fr))}.visual-hero .stat-card{padding:11px}.visual-hero .stat-card strong{font-size:1.15rem}.visual-route-head{display:block}.visual-route-head p{margin-top:10px}.visual-route-grid{display:flex;overflow-x:auto;scroll-snap-type:x mandatory}.visual-route-card{flex:0 0 78%;scroll-snap-align:start}.visual-route-card:last-child{grid-column:auto}.polish-day-photo{height:245px}.visual-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:170px}.visual-gallery figure:first-child{grid-column:span 2;grid-row:span 1}.direct-translator{grid-template-columns:1fr}.quick-phrase-row{grid-template-columns:1fr}.quick-phrase-actions{margin-top:5px}.food-card figure{height:220px!important}}
  `;
  document.head.appendChild(style);

  const hero = $('#home');
  if (hero) {
    hero.classList.add('visual-hero');
    const title = $('h1', hero); if (title) title.innerHTML = 'Cina 2027.<br><em>Viverla, non spuntarla.</em>';
    const text = $('.hero-copy>p:not(.kicker)', hero); if (text) text.textContent = 'Hong Kong, Shenzhen, Macao, Xi’an e Pechino. Una guida visuale e operativa: giorni, GPS, cibo vero, hotel, frasi, bagagli e modalità offline.';
  }

  const routeData = [
    ['Hong Kong','香港','Giorni 1–3',PHOTO.hongkong,'Skyline, traghetti, mercati e sentieri.'],
    ['Shenzhen','深圳','Giorni 4–5',PHOTO.shenzhen,'Tecnologia, quartieri quotidiani e baia.'],
    ['Macao','澳门','Giorno 6',PHOTO.macao,'Centro storico, Taipa e una sera a Cotai.'],
    ['Xi’an','西安','Giorni 7–9',PHOTO.terracotta,'Mura, quartiere Hui ed Esercito di Terracotta.'],
    ['Pechino','北京','Giorni 10–14',PHOTO.wall,'Città Proibita, Muraglia e parchi imperiali.']
  ];
  const route = document.createElement('section');
  route.className = 'visual-route app-shell';
  route.innerHTML = `<div class="visual-route-head"><div><p class="kicker">Il percorso in immagini</p><h2>Cinque tappe, una direzione.</h2></div><p>Le immagini aprono le tappe principali. I dettagli pratici restano nelle sezioni sotto, senza essere ripetuti.</p></div><div class="visual-route-grid">${routeData.map(([city,cn,days,img,copy])=>`<article class="visual-route-card" data-polish-lightbox="${img}" data-caption="${city} · ${cn}"><img loading="lazy" src="${img}" alt="${city}"><div class="visual-route-copy"><span>${days} · ${cn}</span><h3>${city}</h3><p>${copy}</p></div></article>`).join('')}</div>`;
  $('.quickbar')?.insertAdjacentElement('afterend', route);

  $$('.day-card').forEach((card,index) => {
    const body = $('.day-body',card); if (!body || !dayVisuals[index]) return;
    const [src,cn,label] = dayVisuals[index];
    body.insertAdjacentHTML('afterbegin', `<figure class="polish-day-photo" data-polish-lightbox="${src}" data-caption="Giorno ${index+1} · ${esc(label)}"><img loading="lazy" src="${src}" alt="${esc(label)}"><figcaption class="polish-day-caption"><b>Giorno ${index+1} · ${cn}</b><strong>${esc(label)}</strong></figcaption></figure><div class="polish-day-tools"><a href="${amap(cn)}" target="_blank" rel="noopener">Apri ${cn} su Amap</a><button class="say" data-polish-speak="${cn}">▶ Pronuncia ${cn}</button></div>`);
  });

  const gallery = document.createElement('section');
  gallery.className = 'visual-gallery app-shell';
  const galleryItems = [[PHOTO.ferry,'Star Ferry'],[PHOTO.hqb,'Huaqiangbei'],[PHOTO.macao,'Macao'],[PHOTO.xian,'Mura di Xi’an'],[PHOTO.terracotta,'Esercito di Terracotta'],[PHOTO.forbidden,'Città Proibita'],[PHOTO.wall,'Jinshanling'],[PHOTO.summer,'Palazzo d’Estate']];
  gallery.innerHTML = `<div class="visual-route-head"><div><p class="kicker">Il viaggio che stiamo costruendo</p><h2>Non solo testo.</h2></div><p>Foto diverse per orientarsi prima di partire e riconoscere i luoghi una volta arrivati.</p></div><div class="visual-gallery-grid">${galleryItems.map(([src,label])=>`<figure data-polish-lightbox="${src}" data-caption="${esc(label)}"><img loading="lazy" src="${src}" alt="${esc(label)}"><figcaption>${label}</figcaption></figure>`).join('')}</div>`;
  $('#days')?.insertAdjacentElement('afterend',gallery);

  function applyFoodPhotos() {
    Object.entries(FOOD_PHOTO).forEach(([id,src]) => {
      const card = document.getElementById(id); if (!card) return;
      const figure = $('figure',card); const img = $('img',figure); if (!figure || !img) return;
      figure.dataset.placeholder = `${$('.food-card h3',card)?.firstChild?.textContent?.trim() || 'Piatto cinese'} · foto non disponibile`;
      figure.setAttribute('data-polish-lightbox',src); figure.setAttribute('data-caption',$('.food-card h3',card)?.textContent?.trim() || 'Piatto cinese');
      img.onerror = () => { figure.classList.add('food-photo-missing'); img.remove(); };
      if (img.src !== src) img.src = src;
    });
  }
  applyFoodPhotos();
  const foodGrid = $('#foodGrid'); if (foodGrid) new MutationObserver(()=>requestAnimationFrame(applyFoodPhotos)).observe(foodGrid,{childList:true});

  const alternativePhotos = [PHOTO.avatar,PHOTO.yangshuo,PHOTO.shanghai,PHOTO.sanya];
  $$('#alternativeList .fold-card').forEach((card,index)=>{
    const body=$('.fold-body',card); if(!body||!alternativePhotos[index])return;
    const old=$('.media-frame',body); if(old) old.remove();
    body.insertAdjacentHTML('afterbegin',`<figure class="alternative-card-visual" data-polish-lightbox="${alternativePhotos[index]}" data-caption="${esc($('.fold-title strong',card)?.textContent||'Alternativa')}"><img loading="lazy" src="${alternativePhotos[index]}" alt="Alternativa Cina"></figure>`);
  });

  const phrases = [
    ['Hotel','Siamo quattro turisti italiani. Potete registrarci?','我们是四名意大利游客。酒店可以为我们办理入住和住宿登记吗？'],
    ['Hotel','Mostri questo indirizzo al tassista.','请把这个地址给司机看。'],
    ['Cibo','Niente verdure, coriandolo né cipollotto.','不要蔬菜，不要香菜，也不要葱。'],
    ['Cibo','Non piccante, per favore.','请不要辣。'],
    ['Cibo','Siamo in quattro. Possiamo sederci qui?','我们四个人，可以坐这里吗？'],
    ['Cibo','Il conto, per favore.','请买单。'],
    ['Trasporto','Vogliamo andare qui. È il mezzo giusto?','我们要去这里。这趟车对吗？'],
    ['Trasporto','Ci porti a questo hotel, per favore.','请带我们去这家酒店。'],
    ['SIM','Vorrei una SIM breve soprattutto per Internet.','我持外国护照，想办理一张短期手机卡，主要需要流量。'],
    ['Acquisti','Quanto costa? Possiamo provarlo prima?','多少钱？我们可以先试一下吗？'],
    ['Aiuto','Ci siamo persi. Può aiutarci?','我们迷路了。可以帮帮我们吗？'],
    ['Aiuto','Ho bisogno di un medico.','我需要医生。'],
    ['Aiuto','Chiami la polizia, per favore.','请帮我报警。'],
    ['Aiuto','Dov’è il bagno?','洗手间在哪里？'],
    ['Bagagli','Possiamo spedire questa valigia al prossimo hotel?','可以用顺丰把这个行李箱寄到下一家酒店吗？'],
    ['Lavanderia','Dov’è una lavanderia self-service vicina?','附近有自助洗衣店吗？']
  ];

  const phraseSection = $('#phrases');
  if (phraseSection) {
    phraseSection.innerHTML = `<div class="app-shell"><div class="section-heading"><div><p class="kicker" style="color:#f2cb7e">Traduttore diretto</p><h2>Scrivi in italiano. Il telefono mostra e parla cinese.</h2></div><p>Online traduce direttamente; offline usa le frasi salvate più vicine. La frase può essere ingrandita davanti alla persona.</p></div><div class="direct-translator"><div class="translator-card"><label for="polishItalian">Italiano</label><textarea id="polishItalian" placeholder="Es. Siamo quattro e vogliamo andare a questo hotel…"></textarea><div class="translator-buttons"><button class="gold" id="polishTranslate">Traduci</button><button id="polishDictate">🎙 Dettatura</button><button id="polishClear">Pulisci</button></div></div><div class="translator-card"><span>Cinese semplificato</span><div class="translator-result" id="polishResult">译文</div><p id="polishNote">La traduzione apparirà qui.</p><div class="translator-buttons"><button class="gold" id="polishSpeakResult">▶ Pronuncia</button><button id="polishShowResult">Mostra grande</button><button id="polishCopyResult">Copia</button><a id="polishGoogle" target="_blank" rel="noopener">Google Translate</a></div></div></div><details class="quick-phrases"><summary>Frasi rapide già pronte</summary><div class="quick-phrase-groups" id="polishPhraseGroups"></div></details></div>`;
  }

  let voices=[]; const refreshVoices=()=>voices=window.speechSynthesis?.getVoices?.()||[];refreshVoices();if('speechSynthesis'in window)window.speechSynthesis.onvoiceschanged=refreshVoices;
  function speak(text){if(!text)return;if(!('speechSynthesis'in window)){window.open(`https://translate.google.com/?sl=zh-CN&tl=it&op=translate&text=${encodeURIComponent(text)}`,'_blank');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=.78;u.voice=voices.find(v=>v.lang.toLowerCase()==='zh-cn')||voices.find(v=>v.lang.toLowerCase().startsWith('zh'))||null;speechSynthesis.speak(u)}
  async function copy(text){if(!text)return;try{await navigator.clipboard.writeText(text)}catch{const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove()}}

  const groups=[...new Set(phrases.map(item=>item[0]))];
  const phraseGroups=$('#polishPhraseGroups'); if(phraseGroups) phraseGroups.innerHTML=groups.map(group=>`<section class="quick-phrase-group"><h3>${group}</h3>${phrases.filter(item=>item[0]===group).map(([,it,cn])=>`<article class="quick-phrase-row"><div><strong>${esc(it)}</strong><span>${cn}</span></div><div class="quick-phrase-actions"><button data-polish-speak="${cn}">▶</button><button data-polish-show="${cn}" data-label="${esc(it)}">Grande</button><button data-polish-copy="${cn}">Copia</button></div></article>`).join('')}</section>`).join('');

  const result=$('#polishResult'),note=$('#polishNote'),italian=$('#polishItalian'),google=$('#polishGoogle');let current='';
  const words=value=>value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w=>w.length>2);
  function offlineMatch(query){const q=words(query);let best=null,score=0;phrases.forEach(item=>{const set=new Set(words(item[0]+' '+item[1]));const s=q.reduce((n,w)=>n+(set.has(w)?2:[...set].some(x=>x.includes(w)||w.includes(x))?1:0),0);if(s>score){score=s;best=item}});return score?best:null}
  function setResult(text,message){current=text||'';if(result)result.textContent=current||'译文';if(note)note.textContent=message;if(google)google.href=translateUrl(italian?.value||'')}
  async function translateItalian(){const source=italian?.value.trim();if(!source){setResult('','Scrivi una frase in italiano.');return}setResult('',navigator.onLine?'Traduzione in corso…':'Offline: cerco tra le frasi salvate…');if(navigator.onLine){try{const response=await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=it&tl=zh-CN&dt=t&q=${encodeURIComponent(source)}`,{cache:'no-store'});if(!response.ok)throw new Error();const data=await response.json();const text=data?.[0]?.map(x=>x?.[0]||'').join('');if(text){setResult(text,'Traduzione online pronta.');return}}catch{}}const match=offlineMatch(source);if(match)setResult(match[2],`Frase offline più vicina: ${match[1]}`);else setResult('','Nessuna frase offline adatta. Usa Google Translate quando torna la rete.')}
  $('#polishTranslate')?.addEventListener('click',translateItalian);italian?.addEventListener('input',()=>{if(google)google.href=translateUrl(italian.value)});$('#polishSpeakResult')?.addEventListener('click',()=>speak(current));$('#polishCopyResult')?.addEventListener('click',()=>copy(current));$('#polishClear')?.addEventListener('click',()=>{if(italian)italian.value='';setResult('','La traduzione apparirà qui.')});

  const lightbox=document.createElement('dialog');lightbox.className='polish-lightbox';lightbox.innerHTML='<button aria-label="Chiudi">×</button><img alt=""><p></p>';document.body.appendChild(lightbox);const lbImg=$('img',lightbox),lbCaption=$('p',lightbox);$('button',lightbox).addEventListener('click',()=>lightbox.close());lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close()});
  function showLarge(text,label='Cinese'){const existing=$('#speakDialog');if(existing){$('#speakText').textContent=text;$('#speakLabel').textContent=label;existing.showModal()}else{alert(text)}}
  $('#polishShowResult')?.addEventListener('click',()=>{if(current)showLarge(current,italian?.value||'Traduzione')});

  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;const dictate=$('#polishDictate');if(Recognition&&dictate){dictate.addEventListener('click',()=>{const r=new Recognition();r.lang='it-IT';dictate.textContent='🎙 Ascolto…';r.onresult=e=>{italian.value=e.results[0][0].transcript;translateItalian()};r.onend=()=>dictate.textContent='🎙 Dettatura';r.onerror=()=>dictate.textContent='🎙 Dettatura';r.start()})}else if(dictate){dictate.disabled=true}

  document.addEventListener('click',event=>{
    const image=event.target.closest('[data-polish-lightbox]');if(image){const src=image.dataset.polishLightbox;lbImg.src=src;lbImg.alt=image.dataset.caption||'Cina';lbCaption.textContent=image.dataset.caption||'';lightbox.showModal();return}
    const say=event.target.closest('[data-polish-speak]');if(say){speak(say.dataset.polishSpeak);return}
    const show=event.target.closest('[data-polish-show]');if(show){showLarge(show.dataset.polishShow,show.dataset.label);return}
    const copyButton=event.target.closest('[data-polish-copy]');if(copyButton){copy(copyButton.dataset.polishCopy)}
  });

  const offlineImages=[...Object.values(PHOTO),...Object.values(FOOD_PHOTO)];
  if('serviceWorker'in navigator){navigator.serviceWorker.ready.then(()=>{const controller=navigator.serviceWorker.controller;if(controller)controller.postMessage({type:'CACHE_URLS',urls:[...new Set(offlineImages)]})}).catch(()=>{})}
})();
