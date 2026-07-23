(() => {
  'use strict';

  const D = window.CHINA_DATA || { imgs: {} };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const amap = (keyword) => `https://uri.amap.com/search?keyword=${encodeURIComponent(keyword)}`;
  const google = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const youtube = (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  const commons = (file, width = 1200) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

  const images = {
    hk: D.imgs.hk_hero,
    hkNight: D.imgs.hk_night,
    shenzhen: D.imgs.sz_sky2 || D.imgs.sz_sky,
    shenzhenTech: D.imgs.sz_hqb,
    macao: D.imgs.macau2,
    xian: commons("Xi'an city walls.jpg", 1400),
    terracotta: D.imgs.terracotta || commons('Terracotta Army, View of Pit 1.jpg', 1400),
    beijing: commons('Forbidden City Beijing China.jpg', 1400),
    wall: D.imgs.great_wall || commons('The Great Wall of China at Jinshanling-edit.jpg', 1400),
    summer: commons('Summer Palace, Beijing, China.jpg', 1400),
    fallback: D.imgs.hk_hero
  };

  const safeImage = (src, fallback, alt, caption = '', className = '') => `
    <figure class="${className} safe-photo" data-detail-lightbox>
      <img loading="lazy" src="${src}" alt="${alt}" onerror="this.onerror=null;this.src='${fallback}';this.closest('figure').classList.add('used-fallback')">
      ${caption ? `<figcaption>${caption}</figcaption>` : ''}
    </figure>`;

  const styles = document.createElement('style');
  styles.textContent = `
    .map-shell,#trip-map,.leaflet-container{position:relative!important;z-index:0!important;isolation:isolate;overflow:hidden!important}
    .map-shell{contain:paint}.leaflet-pane,.leaflet-top,.leaflet-bottom{z-index:auto!important}.leaflet-control{position:relative;z-index:3!important}
    .section,.chapter,footer{position:relative;z-index:1}
    .detail-section{padding-top:64px}.detail-head{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:28px;align-items:end;margin-bottom:18px}
    .detail-head h2{margin:0}.detail-head p{margin:0;color:var(--muted)}
    .fold-list{display:grid;gap:12px}.fold-card{overflow:hidden;background:var(--paper-2);border:1px solid var(--line);border-radius:15px;box-shadow:0 9px 28px rgba(69,40,23,.07)}
    .fold-card>summary{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:17px 18px;cursor:pointer;list-style:none}.fold-card>summary::-webkit-details-marker{display:none}
    .fold-card>summary::after{content:'＋';display:grid;width:30px;height:30px;place-items:center;color:var(--red-dark);background:#fff;border:1px solid var(--line);border-radius:50%;font-weight:900}.fold-card[open]>summary::after{content:'−'}
    .fold-title{min-width:0}.fold-title strong{display:block;font-size:1.08rem}.fold-title span{display:block;margin-top:3px;color:var(--muted);font-size:.84rem;line-height:1.4}
    .fold-body{padding:0 18px 18px;border-top:1px solid var(--line)}
    .stay-layout{display:grid;grid-template-columns:240px minmax(0,1fr);gap:18px;padding-top:18px}.stay-photo{height:190px;margin:0;border-radius:12px;overflow:hidden;background:#e9dfd1}
    .safe-photo{position:relative;margin:0;overflow:hidden;background:#e9dfd1}.safe-photo img{display:block;width:100%;height:100%;object-fit:cover}.safe-photo figcaption{position:absolute;inset:auto 0 0;padding:30px 12px 9px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.75));font-size:.75rem}.safe-photo.used-fallback::after{content:'Immagine alternativa';position:absolute;right:8px;top:8px;padding:3px 6px;color:#fff;background:rgba(0,0,0,.55);border-radius:6px;font-size:.62rem}
    .price-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:13px 0}.price-box{min-width:0;padding:12px 13px;background:#f6ead6;border:1px solid #ead7b9;border-radius:11px}.price-box span{display:block;color:#6b5c50;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em}.price-box strong{display:block;margin-top:4px;font-size:clamp(.98rem,2.4vw,1.22rem);line-height:1.25;overflow-wrap:anywhere}
    .detail-copy h3,.detail-copy h4{margin:0}.detail-copy h4{margin-top:15px;font-size:.9rem}.detail-copy p{margin:6px 0 0;color:var(--muted)}
    .detail-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:13px}.detail-link,.copy-button{display:inline-flex;min-height:38px;align-items:center;justify-content:center;padding:7px 10px;color:var(--red-dark);background:#fff;border:1px solid var(--line);border-radius:9px;text-decoration:none;font-size:.78rem;font-weight:850;cursor:pointer}.detail-link:hover,.copy-button:hover{border-color:var(--red)}
    .platforms{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.platform{padding:14px;background:#fff;border:1px solid var(--line);border-radius:11px}.platform strong{display:block}.platform p{margin:5px 0 10px;color:var(--muted);font-size:.82rem}
    .status-box{margin-bottom:14px;padding:15px 16px;background:#fff4d5;border:1px solid #d8b468;border-radius:13px}.status-box p{margin:5px 0 0}
    .point-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding-top:14px}.point-card{min-width:0;padding:14px;background:#fff;border:1px solid var(--line);border-radius:11px}.point-card h4{margin:0;font-size:.98rem}.point-card small{color:var(--red);font-weight:800}.point-card p{margin:6px 0 0;color:var(--muted);font-size:.82rem}
    .food-grid-clean{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding-top:14px}.food-card{display:grid;grid-template-columns:150px minmax(0,1fr);overflow:hidden;background:#fff;border:1px solid var(--line);border-radius:12px}.food-card .safe-photo{height:100%;min-height:185px}.food-body{padding:14px}.food-body h4{margin:0}.food-body p{margin:6px 0 0;color:var(--muted);font-size:.82rem}.food-label{display:block;margin-top:9px;color:var(--red);font-size:.7rem;font-weight:900;text-transform:uppercase}
    .connect-grid-clean{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding-top:14px}.connect-card-clean{padding:15px;background:#fff;border:1px solid var(--line);border-radius:11px}.connect-card-clean h4{margin:0}.connect-card-clean ul,.connect-card-clean ol{margin:9px 0 0;padding-left:20px}.connect-card-clean li+li{margin-top:6px}
    .alternative-grid-clean{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding-top:14px}.alternative-card{overflow:hidden;background:#fff;border:1px solid var(--line);border-radius:12px}.alternative-card .safe-photo{height:190px}.alternative-body{padding:14px}.alternative-body h4{margin:0}.alternative-body p{margin:7px 0 0;color:var(--muted);font-size:.84rem}.swap{margin-top:10px;padding:9px 10px;color:#fff;background:var(--jade);border-radius:9px;font-size:.78rem}
    .compact-summary{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 0}.compact-summary span{padding:6px 9px;background:#fff;border:1px solid var(--line);border-radius:999px;font-size:.76rem;font-weight:800}
    .detail-toast{position:fixed;right:15px;bottom:15px;z-index:300;padding:10px 13px;color:#fff;background:#201815;border-radius:9px;opacity:0;transform:translateY(8px);pointer-events:none;transition:.18s}.detail-toast.show{opacity:1;transform:none}
    .gallery figure{isolation:isolate}.gallery .safe-photo{height:100%}
    @media(max-width:900px){.detail-head{grid-template-columns:1fr}.stay-layout{grid-template-columns:1fr}.stay-photo{height:220px}.platforms{grid-template-columns:repeat(2,minmax(0,1fr))}.food-grid-clean,.alternative-grid-clean{grid-template-columns:1fr}}
    @media(max-width:620px){.detail-section{padding-top:50px}.fold-card>summary{padding:15px}.fold-body{padding:0 15px 15px}.price-row,.point-grid,.platforms,.connect-grid-clean{grid-template-columns:1fr}.food-card{grid-template-columns:1fr}.food-card .safe-photo{height:190px;min-height:0}.stay-photo{height:185px}.detail-links{display:grid;grid-template-columns:1fr}.detail-link,.copy-button{width:100%}}
  `;
  document.head.appendChild(styles);

  $('#mappa-operativa')?.remove();
  $$('a[href="#mappa-operativa"]').forEach(link => link.remove());

  const toast = document.createElement('div');
  toast.className = 'detail-toast';
  toast.textContent = 'Copiato';
  document.body.appendChild(toast);

  const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1100);
  };

  const bookingPlatforms = [
    ['Agoda in cinese','Buono per appartamenti e offerte mobile; verificare sempre quattro ospiti reali.','https://www.agoda.com/zh-cn/'],
    ['携程 Ctrip','Inventario domestico ampio; leggere documenti ammessi, letti e conferma immediata.','https://hotels.ctrip.com/'],
    ['Trip.com','Più semplice per assistenza internazionale; confrontare lo stesso hotel con Ctrip.','https://www.trip.com/hotels/'],
    ['去哪儿 Qunar','Confronto domestico utile, ma interfaccia e pagamenti possono essere meno accessibili.','https://hotel.qunar.com/'],
    ['美团 Meituan','Offerte locali; alcune richiedono numero cinese o mini-app.','https://hotel.meituan.com/'],
    ['飞猪 Fliggy','Marketplace Alibaba: controllare venditore, cancellazione e prezzo finale.','https://www.fliggy.com/']
  ];

  const stayAreas = [
    {city:'Hong Kong',nights:'2 notti',area:'Tsuen Wan / Tsuen Wan West / Kwai Hing',target:'70–120 €',total:'140–240 €',image:images.hk,why:'Più economica del waterfront di Kowloon, ma con MTR, mercati e ristoranti quotidiani.',move:'Scegliere entro 700 metri dalla MTR e scartare strutture che dipendono solo da navette.',chains:'Dorsett, Silka, Panda Hotel e strutture locali; confrontare una familiare con due camere twin.',searches:['荃湾站 酒店 四人','荃湾西站 家庭房','葵兴站 酒店'],map:'荃湾站'},
    {city:'Shenzhen',nights:'2 notti',area:'Laojie / Hubei / Guomao, Luohu',target:'30–60 €',total:'60–120 €',image:images.shenzhen,why:'Zona vissuta, vicina a Dongmen e collegata bene a Huaqiangbei e Futian.',move:'Hotel o appartamento entro 600 metri da Linea 1 o 3; DiDi diviso in quattro per gli ultimi chilometri.',chains:'Hanting, Hi Inn, Home Inn, Jinjiang Inn, 7 Days e Vienna; verificare sempre la singola proprietà.',searches:['老街站 三室一厅 4人','湖贝站 酒店 外宾','国贸站 家庭房'],map:'深圳老街站'},
    {city:'Macao',nights:'0–1 notte',area:'Gita in giornata; altrimenti Taipa residenziale o Outer Harbour',target:'0–100 €',total:'0–100 €',image:images.macao,why:'I resort di Cotai alzano molto la media. La scelta economica è evitare il pernottamento quando la logistica lo consente.',move:'Verificare nel 2027 orari traghetti e condizioni di reingresso prima di costruire la gita.',chains:'Piccoli hotel a Taipa o Outer Harbour; non usare i resort di Cotai come riferimento del prezzo medio.',searches:['澳门 氹仔 酒店 4人','澳门 外港 酒店 家庭房'],map:'澳门议事亭前地'},
    {city:'Xi’an',nights:'2 notti',area:'Dachaishi / Hepingmen; Longshouyuan per risparmiare',target:'25–55 €',total:'50–110 €',image:images.xian,why:'Dachaishi è il compromesso tra centro, mura e metro. Longshouyuan costa meno ed è diretto sulla Linea 2.',move:'Restare entro 600 metri dalla metro; non pagare il sovrapprezzo della Bell Tower.',chains:'Hanting, Ji Hotel, Home Inn, Jinjiang Inn e Atour Light; controllare “接待外宾”.',searches:['大差市站 酒店 外宾','和平门站 家庭房 4人','龙首原站 酒店 接待外宾'],map:'西安大差市站'},
    {city:'Pechino',nights:'5 notti',area:'Jinsong / Panjiayuan / Shilihe',target:'35–70 €',total:'175–350 €',image:images.beijing,why:'Quadrante sud-est con metropolitana, ristoranti residenziali e prezzi inferiori a Wangfujing e Qianmen.',move:'Linee 10 e 14. Allontanarsi ancora solo quando il risparmio supera circa 20–25 euro a notte.',chains:'Hanting, Hi Inn, Home Inn, Ji Hotel, Orange, Vienna e Atour; la catena non sostituisce il controllo passaporti.',searches:['劲松站 酒店 外宾 4人','潘家园站 家庭房','十里河站 酒店 接待外宾'],map:'北京劲松站'}
  ];

  const lodgingSection = document.createElement('section');
  lodgingSection.className = 'section shell detail-section';
  lodgingSection.id = 'alloggi-reali';
  lodgingSection.innerHTML = `
    <div class="detail-head"><div><p class="section-kicker">Prezzi domestici e controllo passaporti</p><h2>Dormire spendendo poco, senza farsi fregare.</h2></div><p>Le cifre sono <strong>fasce-obiettivo per quattro persone</strong> basate su date confrontabili, non tariffe garantite per il 2027. Apri solo la città che stai prenotando.</p></div>
    <div class="status-box"><strong>Metodo:</strong><p>Confronta Agoda cinese, Ctrip, Trip.com, Qunar, Meituan e Fliggy. Controlla prezzo finale, quattro ospiti, letti, deposito, cancellazione e la frase <strong>接待外宾</strong>. Una VPN cinese è solo un test di confronto, non una scorciatoia.</p><div class="compact-summary"><span>Totale obiettivo: 425–820 € per 4</span><span>Circa 106–205 € a persona</span><span>Macao: meglio senza notte</span></div></div>
    <div class="fold-list">${stayAreas.map((area, index) => `
      <details class="fold-card" ${index === 1 ? 'open' : ''}>
        <summary><span class="fold-title"><strong>${area.city} · ${area.area}</strong><span>${area.nights} · obiettivo ${area.target} a notte per quattro</span></span></summary>
        <div class="fold-body"><div class="stay-layout">${safeImage(area.image, images.fallback, area.city, `${area.city}: zona economica collegata ai trasporti.`, 'stay-photo')}<div class="detail-copy"><div class="price-row"><div class="price-box"><span>Prezzo per notte</span><strong>${area.target}</strong></div><div class="price-box"><span>Totale tappa</span><strong>${area.total}</strong></div></div><p>${area.why}</p><h4>Trasporti</h4><p>${area.move}</p><h4>Catene e formato</h4><p>${area.chains}</p><div class="detail-links">${area.searches.map(term => `<button class="copy-button" data-copy="${term}">${term}</button>`).join('')}<a class="detail-link" href="${amap(area.map)}" target="_blank" rel="noopener">Apri zona in Amap</a></div></div></div></div>
      </details>`).join('')}
      <details class="fold-card"><summary><span class="fold-title"><strong>Piattaforme e controlli</strong><span>Dove confrontare e quali annunci scartare</span></span></summary><div class="fold-body"><div class="platforms" style="padding-top:14px">${bookingPlatforms.map(p => `<article class="platform"><strong>${p[0]}</strong><p>${p[1]}</p><a class="detail-link" href="${p[2]}" target="_blank" rel="noopener">Apri</a></article>`).join('')}</div><div class="status-box" style="margin-top:12px"><strong>Messaggio da inviare</strong><p>我们是四名意大利游客，持意大利护照。酒店可以正常办理入住和住宿登记吗？</p><button class="copy-button" data-copy="我们是四名意大利游客，持意大利护照。酒店可以正常办理入住和住宿登记吗？">Copia il messaggio</button></div><p><strong>Scarta:</strong> 仅限内宾, pagamento fuori piattaforma, posizione vaga, pulizie nascoste, una sola recensione o nessuna risposta scritta sui passaporti.</p></div></details>
    </div>`;
  $('#riassunto')?.insertAdjacentElement('afterend', lodgingSection);

  const points = {
    'Hong Kong':[
      ['Tsuen Wan MTR','荃湾站','Base economica collegata a Kowloon.','Hotel entro 700 m.'],['Sam Pei Square','三陂坊','Cucina cantonese quotidiana e piatti da condividere.','Cena'],['Yeung Uk Road Market','杨屋道街市','Mercato coperto e gastronomia locale.','Mattina/pranzo'],['Star Ferry','尖沙咀天星码头','Attraversamento economico con skyline.','Tramonto'],['Dragon’s Back','龙脊','Sentiero costiero.','Mattina asciutta']
    ],
    'Shenzhen':[
      ['Laojie Station','老街站','Base conveniente vicino a Dongmen.','Hotel entro 600 m.'],['Dongmen Old Street','东门老街','Snack, noodles e ristoranti economici.','Cena/sera'],['Huaqiangbei','华强北','Elettronica e componenti.','Mattina feriale'],['Shenzhen Bay Park','深圳湾公园','Passeggiata sulla baia.','Tramonto'],['Shekou Cruise Homeport','蛇口邮轮母港','Terminale traghetti per Macao.','Arrivare con margine']
    ],
    'Macao':[
      ['Ruins of St. Paul’s','大三巴牌坊','Punto storico principale.','Mattina'],['Senado Square','议事亭前地','Centro storico pedonale.','Mattina/pomeriggio'],['Three Lamps District','三盏灯','Pranzo meno turistico.','Pranzo'],['Taipa Village','氹仔旧城区','Egg tart e pork chop bun.','Pomeriggio'],['Cotai Strip','路氹金光大道','Resort e casinò come esperienza visiva.','Sera']
    ],
    'Xi’an':[
      ['Dachaishi Station','大差市站','Base pratica tra mura e metro.','Hotel entro 600 m.'],['Sajinqiao','洒金桥','Cibo del quartiere Hui.','Colazione/pranzo'],['Dapiyuan','大皮院','Paomo, ravioli e carni halal.','Pranzo/cena'],['Yongning Gate','西安城墙永宁门','Ingresso scenografico alle mura.','Mattina o sera'],['Terracotta Army','秦始皇帝陵博物院','Museo ufficiale.','Apertura, giornata dedicata']
    ],
    'Pechino':[
      ['Jinsong Station','劲松站','Base sud-est con metro e ristoranti.','Prima scelta hotel'],['Forbidden City','故宫博物院','Ingresso da prenotare.','Primo slot'],['Jinshanling Great Wall','金山岭长城','Muraglia panoramica.','Partenza presto'],['Huguosi Street','护国寺街','Snack e colazione tradizionale.','Mattina'],['Niujie','牛街','Cucina halal e mercato.','Pranzo'],['Summer Palace','颐和园','Lago e parchi.','Mezza giornata']
    ]
  };

  const pointSection = document.createElement('section');
  pointSection.className = 'section shell detail-section';
  pointSection.id = 'punti-operativi';
  pointSection.innerHTML = `<div class="detail-head"><div><p class="section-kicker">Una sola mappa, dettagli sotto</p><h2>Punti precisi da aprire in Amap.</h2></div><p>La mappa principale resta l’unica mappa della pagina. Qui sotto trovi i punti divisi per città, richiudibili e senza sovrapposizioni durante lo scroll.</p></div><div class="fold-list">${Object.entries(points).map(([city, list]) => `<details class="fold-card"><summary><span class="fold-title"><strong>${city}</strong><span>${list.length} punti pratici</span></span></summary><div class="fold-body"><div class="point-grid">${list.map(item => `<article class="point-card"><h4>${item[0]}<br><small>${item[1]}</small></h4><p>${item[2]}</p><p><strong>Quando:</strong> ${item[3]}</p><div class="detail-links"><a class="detail-link" href="${amap(item[1])}" target="_blank" rel="noopener">Amap</a><a class="detail-link" href="${google(`${item[0]} ${city}`)}" target="_blank" rel="noopener">Google</a><button class="copy-button" data-copy="${item[1]}">Copia nome</button></div></article>`).join('')}</div></div></details>`).join('')}</div>`;
  $('#mappa')?.insertAdjacentElement('afterend', pointSection);

  const foods = {
    'Hong Kong':[
      ['Pineapple bun + milk tea','菠萝油 + 港式奶茶',commons('Pineapple bun and milk tea.jpg',900),images.hkNight,'Pane dolce con crosta zuccherata, spesso burro; tè nero con latte evaporato o condensato.','Colazione o merenda in un cha chaan teng di Tsuen Wan.'],
      ['Char siu','叉烧',commons('Soy sauce chicken, siu yuk and char siu in Hong Kong - 20130614.jpg',900),images.hk,'Maiale marinato con soia, zucchero o miele e spezie, poi arrostito e glassato.','Pranzo in un roast-meat shop affollato.']
    ],
    'Shenzhen':[
      ['Changfen','肠粉',commons('Rice noodle roll with shrimp.jpg',900),images.shenzhen,'Sfoglia di riso al vapore con gamberi, manzo o maiale e salsa di soia dolce.','Colazione a Luohu o ristorante dim sum.'],
      ['Claypot rice','煲仔饭',commons('Claypot rice.jpg',900),images.shenzhenTech,'Riso cotto nella pentola d’argilla con carne o salsiccia e spesso verdure.','Cena nelle vie residenziali di Luohu.']
    ],
    'Macao':[
      ['Portuguese egg tart','葡式蛋挞',commons('Portuguese egg tart in Macau.jpg',900),images.macao,'Sfoglia, uova, zucchero, latte o panna con superficie caramellata.','Caldo nel pomeriggio a Taipa Village.'],
      ['Pork chop bun','猪扒包',commons('PorkChopBun.jpg',900),images.macao,'Pane croccante e braciola di maiale con aglio, pepe e soia.','Pranzo o snack a Taipa; attenzione all’osso.']
    ],
    'Xi’an':[
      ['Roujiamo','肉夹馍',commons('Roujiamo.jpg',900),images.xian,'Pane piatto con carne brasata; nel quartiere Hui cercare manzo o agnello halal.','Sajinqiao o Xiaonanmen a colazione/pranzo.'],
      ['Biangbiang noodles','油泼𰻝𰻝面',commons('Biangbiang noodles.jpg',900),images.terracotta,'Larghi noodles di grano con olio caldo, peperoncino, aceto e aglio; spesso verdure.','Dapiyuan o Sajinqiao a pranzo.']
    ],
    'Pechino':[
      ['Jianbing','煎饼',commons('Jianbing.jpg',900),images.beijing,'Crêpe con uovo, cracker fritto, salsa, cipollotto e coriandolo.','Bancarella mattutina vicino all’hotel.'],
      ['Peking duck','北京烤鸭',commons('Peking duck.jpg',900),images.beijing,'Anatra, pancake, salsa dolce di fagioli, cetriolo e cipollotto.','Una cena condivisa con prezzo visibile.']
    ]
  };

  const foodSection = document.createElement('section');
  foodSection.className = 'section shell detail-section';
  foodSection.id = 'cibo-dettagliato';
  foodSection.innerHTML = `<div class="detail-head"><div><p class="section-kicker">Foto con fallback e schede richiudibili</p><h2>Cosa mangiare, cosa contiene e quando.</h2></div><p>Le immagini ora hanno una foto alternativa automatica: niente più riquadri vuoti. Apri soltanto la città che ti serve.</p></div><div class="fold-list">${Object.entries(foods).map(([city,list]) => `<details class="fold-card"><summary><span class="fold-title"><strong>${city}</strong><span>${list.map(x=>x[0]).join(' · ')}</span></span></summary><div class="fold-body"><div class="food-grid-clean">${list.map(food => `<article class="food-card">${safeImage(food[2],food[3],food[0])}<div class="food-body"><h4>${food[0]}<br><small>${food[1]}</small></h4><span class="food-label">Cosa contiene</span><p>${food[4]}</p><span class="food-label">Dove e quando</span><p>${food[5]}</p><div class="detail-links"><a class="detail-link" href="${amap(`${city} ${food[1]}`)}" target="_blank" rel="noopener">Amap</a><a class="detail-link" href="${youtube(`${food[0]} recipe China`)}" target="_blank" rel="noopener">Video/ricetta</a></div></div></article>`).join('')}</div></div></details>`).join('')}<details class="fold-card"><summary><span class="fold-title"><strong>Frase per evitare verdure e coriandolo</strong><span>Niente verdure, coriandolo né cipollotto</span></span></summary><div class="fold-body"><p style="padding-top:14px"><strong>不要蔬菜，不要香菜，也不要葱。</strong> Brodi, ripieni e salse possono comunque essere già preparati.</p><button class="copy-button" data-copy="不要蔬菜，不要香菜，也不要葱。">Copia frase</button></div></details></div>`;
  $('#cibo')?.insertAdjacentElement('afterend', foodSection);

  const connectivitySection = document.createElement('section');
  connectivitySection.className = 'section shell detail-section';
  connectivitySection.id = 'telefono-cina';
  connectivitySection.innerHTML = `<div class="detail-head"><div><p class="section-kicker">Telefono ordinato</p><h2>SIM, mappe offline e backup.</h2></div><p>Le istruzioni lunghe sono richiudibili. Aprile durante la preparazione, non mentre stai leggendo l’itinerario.</p></div><div class="fold-list"><details class="fold-card"><summary><span class="fold-title"><strong>SIM fisica cinese</strong><span>China Mobile, China Unicom o China Telecom con passaporto</span></span></summary><div class="fold-body"><div class="connect-grid-clean"><article class="connect-card-clean"><h4>Procedura</h4><ol><li>Filiale ufficiale con passaporto.</li><li>Chiedere un piano breve principalmente dati.</li><li>Provare APN, chiamata e SMS prima di uscire.</li><li>Salvare il numero per hotel, DiDi e mini-app.</li></ol></article><article class="connect-card-clean"><h4>Frase pronta</h4><p>外国护照可以办理手机卡吗？我要一个主要用于流量的短期套餐。</p><div class="detail-links"><button class="copy-button" data-copy="外国护照可以办理手机卡吗？我要一个主要用于流量的短期套餐。">Copia</button><a class="detail-link" href="${amap('中国联通营业厅 深圳罗湖')}" target="_blank" rel="noopener">Unicom Luohu</a></div></article></div></div></details><details class="fold-card"><summary><span class="fold-title"><strong>Amap offline</strong><span>Scarica Shenzhen, Xi’an e Pechino prima di partire</span></span></summary><div class="fold-body"><div class="connect-grid-clean"><article class="connect-card-clean"><h4>Download</h4><ol><li>Installare 高德地图.</li><li>Cercare <strong>离线地图</strong>.</li><li>Scaricare Shenzhen, Xi’an e Beijing su Wi‑Fi.</li><li>Salvare hotel, stazioni e attrazioni con nome cinese.</li></ol></article><article class="connect-card-clean"><h4>Backup</h4><ul><li>Screenshot di indirizzo, telefono e facciata hotel.</li><li>Google Maps soltanto come confronto.</li><li>Indirizzi importanti anche in una nota offline.</li></ul><div class="detail-links"><a class="detail-link" href="https://mobile.amap.com/" target="_blank" rel="noopener">Download Amap</a><button class="copy-button" data-copy="离线地图">Copia “mappe offline”</button></div></article></div></div></details><details class="fold-card"><summary><span class="fold-title"><strong>Internet e pagamenti</strong><span>Roaming/eSIM, SIM locale e due metodi di pagamento</span></span></summary><div class="fold-body"><div class="connect-grid-clean"><article class="connect-card-clean"><h4>Connessione</h4><ul><li>Roaming o eSIM internazionale come accesso principale ai servizi occidentali.</li><li>SIM fisica locale per numero cinese e rete domestica.</li><li>VPN cinese soltanto per confronto prezzi, mai per dichiarare dati falsi.</li></ul></article><article class="connect-card-clean"><h4>Pagamenti</h4><ul><li>Alipay e WeChat Pay configurati prima.</li><li>Due carte fisiche separate.</li><li>Piccolo contante di emergenza.</li><li>Screenshot delle prenotazioni.</li></ul></article></div></div></details></div>`;
  $('#pratico')?.insertAdjacentElement('afterend', connectivitySection);

  const alternatives = [
    ['Zhangjiajie · montagne “Avatar”',D.imgs.ys_karst || images.wall,images.wall,'Pilastri di Wulingyuan, Yuanjiajie e Tianzi Mountain. Servono almeno due o tre notti e il meteo può coprire completamente il paesaggio.','Sostituisce Macao + una giornata Shenzhen oppure due giornate di Pechino; richiede un volo interno.'],
    ['Yangshuo e Xingping',D.imgs.ys_river2 || images.summer,images.summer,'Fiume Li, colline carsiche, bici e villaggi. Più rilassante e naturale del blocco classico.','Sostituisce due o tre giorni di Pechino oppure Xi’an; non va aggiunta sopra a tutto.'],
    ['Guangzhou e Foshan',D.imgs.gz || images.shenzhen,images.shenzhen,'Cibo cantonese, quartieri storici e lion dance. Logistica facile dal sud, ma meno iconica di Xi’an e Pechino.','Sostituisce Macao e una giornata Shenzhen.'],
    ['Shanghai',D.imgs.hk_2019 || images.hk,images.hk,'Metropoli forte, Bund, quartieri e nightlife. Nel viaggio attuale duplica parte dell’effetto urbano di Hong Kong e Shenzhen.','Ha senso solo sostituendo una delle due città del sud.']
  ];

  const altSection = document.createElement('section');
  altSection.className = 'section shell detail-section';
  altSection.id = 'alternative-spiegate';
  altSection.innerHTML = `<div class="detail-head"><div><p class="section-kicker">Alternative ordinate</p><h2>Cosa cambiano davvero.</h2></div><p>Ogni opzione indica cosa sostituire. Nessuna viene proposta come aggiunta infinita al viaggio di quattordici giorni.</p></div><div class="fold-list">${alternatives.map(alt => `<details class="fold-card"><summary><span class="fold-title"><strong>${alt[0]}</strong><span>${alt[3]}</span></span></summary><div class="fold-body"><div class="stay-layout">${safeImage(alt[1],alt[2],alt[0],'','stay-photo')}<div class="detail-copy"><p>${alt[3]}</p><div class="swap"><strong>Come entra nel viaggio:</strong> ${alt[4]}</div><div class="detail-links"><a class="detail-link" href="${youtube(`${alt[0]} travel guide`)}" target="_blank" rel="noopener">Video reference</a></div></div></div></div></details>`).join('')}</div>`;
  $('#alternative')?.insertAdjacentElement('afterend', altSection);

  const gallery = $('#gallery');
  if (gallery) {
    const curated = [
      [images.hk,'Hong Kong'],[images.shenzhen,'Shenzhen'],[images.macao,'Macao'],[images.xian,'Mura di Xi’an'],
      [images.terracotta,'Esercito di Terracotta'],[images.beijing,'Città Proibita'],[images.wall,'Muraglia a Jinshanling'],[images.summer,'Palazzo d’Estate']
    ];
    gallery.innerHTML = curated.map(item => safeImage(item[0],images.fallback,item[1],item[1])).join('');
  }

  const dayPhotos = {
    7:images.xian,8:images.terracotta,9:images.xian,10:images.beijing,11:images.wall,12:images.summer,13:images.beijing,14:images.beijing
  };
  $$('#days .day-card').forEach(card => {
    const number = Number($('.day-number b',card)?.textContent || 0);
    const img = $('.day-photo img',card);
    if (img && dayPhotos[number]) {
      img.onerror = null;
      img.src = dayPhotos[number];
    }
  });
  const chapterImage = $('#itinerario .chapter-banner img');
  if (chapterImage) chapterImage.src = images.wall;

  const originalAltGrid = $('#alternative .option-grid');
  if (originalAltGrid && !originalAltGrid.closest('details')) {
    const wrapper = document.createElement('details');
    wrapper.className = 'fold-card';
    wrapper.innerHTML = '<summary><span class="fold-title"><strong>Riepilogo rapido delle alternative</strong><span>Apri per vedere tutte le schede brevi</span></span></summary><div class="fold-body" style="padding-top:14px"></div>';
    originalAltGrid.parentNode.insertBefore(wrapper, originalAltGrid);
    $('.fold-body',wrapper).appendChild(originalAltGrid);
  }

  const toc = $('.toc');
  if (toc) toc.insertAdjacentHTML('beforeend','<a href="#alloggi-reali">🏨 Alloggi</a><a href="#punti-operativi">📍 Punti</a><a href="#cibo-dettagliato">🥢 Piatti</a><a href="#telefono-cina">📶 SIM</a>');

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-copy]');
    if (button) copyText(button.dataset.copy);
  });

  const dialog = $('#lightbox');
  const dialogImg = dialog ? $('img',dialog) : null;
  $$('[data-detail-lightbox]').forEach(figure => figure.addEventListener('click', () => {
    const img = $('img',figure);
    if (!dialog || !dialogImg || !img) return;
    dialogImg.src = img.src;
    dialogImg.alt = img.alt;
    dialog.showModal();
  }));
})();
