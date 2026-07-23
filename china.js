(() => {
  const D = window.CHINA_DATA;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const esc = (v = '') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const image = (src, alt, caption = '', cls = '') => `<figure class="${cls}" data-lightbox><img loading="lazy" src="${src}" alt="${esc(alt)}" onerror="this.closest('figure').classList.add('image-error')">${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>`;

  D.imgs.great_wall = 'https://commons.wikimedia.org/wiki/Special:FilePath/The%20Great%20Wall%20of%20China%20at%20Jinshanling-edit.jpg?width=1400';
  D.imgs.terracotta = 'https://commons.wikimedia.org/wiki/Special:FilePath/Terracotta%20Army%2C%20View%20of%20Pit%201.jpg?width=1400';

  D.days = [
    {n:1,date:'Sab 6 nov',id:'hong-kong',title:'Italia → Hong Kong',lead:'Partenza con biglietto multi-city: arrivo a Hong Kong e rientro da Pechino.',items:['Scegliere un volo <strong>Italia → Hong Kong</strong> con il miglior equilibrio tra prezzo e durata.','Preparare sul telefono <strong>eSIM, Alipay, WeChat, Amap, DiDi e traduttore offline</strong>.','Tenere nel bagaglio a mano cambio, farmaci, adattatore e una carta fisica separata.'],side:'Il primo giorno è volutamente solo viaggio. Niente coincidenze strette e niente prenotazioni non rimborsabili attorno a orari ancora incerti.',image:'hk_hero',caption:'Hong Kong vista da Victoria Peak.'},
    {n:2,date:'Dom 7 nov',title:'Hong Kong: skyline e quartieri',lead:'Primo impatto con la città senza trasformarla in una corsa alle attrazioni.',items:['<strong>Star Ferry</strong> tra Kowloon e Central, poi passeggiata sul waterfront.','Tsim Sha Tsui, Mong Kok e Temple Street, entrando nei negozi e nei mercati che attirano davvero.','Cena in un <strong>cha chaan teng</strong> e serata libera tra bar semplici e strade vive.'],links:[['Star Ferry','https://www.google.com/maps/search/?api=1&query=Star+Ferry+Hong+Kong'],['Mong Kok','https://www.google.com/maps/search/?api=1&query=Mong+Kok+Hong+Kong'],['Temple Street','https://www.google.com/maps/search/?api=1&query=Temple+Street+Night+Market']],side:'Comprare subito la Octopus: serve per trasporti e molti piccoli acquisti.',image:'hk_night',caption:'Hong Kong di notte.'},
    {n:3,date:'Lun 8 nov',title:'Hong Kong: natura dentro la metropoli',lead:'Una giornata attiva tra sentieri, mare e quartieri meno patinati.',items:['Mattina sul <strong>Dragon’s Back</strong>; alternativa breve a Victoria Peak se il meteo è brutto.','Pranzo e passeggiata a Shek O oppure rientro verso Central senza riempire ogni ora.','Sera a <strong>Sham Shui Po</strong> tra elettronica, mercati e street food.'],links:[['Dragon’s Back','https://www.google.com/maps/search/?api=1&query=Dragon%27s+Back+Trail+Hong+Kong'],['Shek O','https://www.google.com/maps/search/?api=1&query=Shek+O+Hong+Kong'],['Sham Shui Po','https://www.google.com/maps/search/?api=1&query=Sham+Shui+Po']],side:'Scarpe vere e programma flessibile: caldo, umidità e pioggia possono cambiare il sentiero.',image:'hk_peak',caption:'Hong Kong dall’alto.'},
    {n:4,date:'Mar 9 nov',id:'shenzhen',title:'Hong Kong → Shenzhen',lead:'Ingresso nella Cina continentale e prima giornata da residenti temporanei.',items:['Frontiera e trasferimento verso una base comoda a <strong>Futian o Nanshan</strong>.','Primo test reale di Alipay, WeChat Pay, metro, DiDi e Amap.','Cena, supermercato grande e giro serale senza itinerario rigido.'],links:[['Futian','https://www.google.com/maps/search/?api=1&query=Futian+Shenzhen'],['Coco Park','https://www.google.com/maps/search/?api=1&query=COCO+Park+Shenzhen'],['Amap Futian','https://uri.amap.com/search?keyword=深圳福田']],side:'La frontiera può mangiare tempo. La giornata resta semplice per non iniziare il viaggio già in ritardo.',image:'sz_sky',caption:'Skyline di Shenzhen.'},
    {n:5,date:'Mer 10 nov',title:'Shenzhen: tecnologia e vita quotidiana',lead:'La parte più moderna del viaggio, tra elettronica, mall verticali e quartieri normali.',items:['Mattina e primo pomeriggio a <strong>Huaqiangbei</strong>, SEG Plaza e mercati di componenti.','Confrontare almeno tre venditori e <strong>provare tutto prima di pagare</strong>.','Pomeriggio a Shenzhen Bay o Talent Park; sera tra OCT Loft, KTV, arcade o birra locale.'],links:[['Huaqiangbei','https://www.google.com/maps/search/?api=1&query=Huaqiangbei+Shenzhen'],['SEG Plaza','https://www.google.com/maps/search/?api=1&query=SEG+Plaza+Shenzhen'],['Shenzhen Bay Park','https://www.google.com/maps/search/?api=1&query=Shenzhen+Bay+Park']],side:'Batterie e power bank devono rispettare le regole dei voli interni e internazionali.',image:'sz_hqb',caption:'Huaqiangbei, il quartiere dell’elettronica.'},
    {n:6,date:'Gio 11 nov',id:'macao',title:'Shenzhen → Macao',lead:'Macao resta nel percorso come tappa compatta: centro storico, cucina e una sera nei casinò di Cotai.',items:['Traghetto da <strong>Shekou</strong> o collegamento via Zhuhai, scegliendo la soluzione più lineare disponibile nel 2027.','Senado Square, Ruins of St. Paul’s, vie laterali ed egg tart nel pomeriggio.','Sera a <strong>Cotai</strong>: entrare nei resort e nei casinò anche solo per vedere l’ambiente, con un budget massimo deciso prima.'],links:[['Shekou Port','https://www.google.com/maps/search/?api=1&query=Shekou+Cruise+Homeport'],['Senado Square','https://www.google.com/maps/search/?api=1&query=Senado+Square+Macau'],['Cotai Strip','https://www.google.com/maps/search/?api=1&query=Cotai+Strip+Macau']],side:'Una notte è sufficiente. Il casinò è un’esperienza facoltativa, non il centro del viaggio: niente rincorse alle perdite.',image:'macau2',caption:'Il centro storico di Macao.'},
    {n:7,date:'Ven 12 nov',id:'xian',title:'Macao → Xi’an',lead:'Trasferimento verso la Cina storica. L’obiettivo è arrivare con abbastanza tempo per vivere la città la sera.',items:['Cercare un volo diretto <strong>Macao → Xi’an</strong>; in alternativa partenza da Shenzhen o Hong Kong, senza scali assurdi.','Check-in vicino alla metro, poi primo giro nel centro storico.','Sera nel <strong>Muslim Quarter</strong> e nelle strade vicine, scegliendo i banchi più frequentati dai locali.'],links:[['Xi’an','https://www.google.com/maps/search/?api=1&query=Xi%27an+China'],['Muslim Quarter','https://www.google.com/maps/search/?api=1&query=Muslim+Quarter+Xi%27an']],side:'Il collegamento interno va scelto solo quando usciranno gli orari 2027. Il piano non dipende da una singola compagnia.',image:'terracotta',caption:'L’Esercito di Terracotta vicino a Xi’an.'},
    {n:8,date:'Sab 13 nov',title:'Esercito di Terracotta',lead:'La grande classica entra nel viaggio principale con una giornata dedicata, senza comprimerla tra due trasferimenti.',items:['Partenza presto per il <strong>Mausoleo del Primo Imperatore Qin</strong>.','Visita delle fosse principali dell’<strong>Esercito di Terracotta</strong>, con guida ufficiale o audioguida.','Rientro a Xi’an e serata libera tra City Wall, torri illuminate e ristoranti.'],links:[['Terracotta Army','https://www.google.com/maps/search/?api=1&query=Terracotta+Army+Xi%27an'],['Xi’an City Wall','https://www.google.com/maps/search/?api=1&query=Xi%27an+City+Wall']],side:'Comprare il biglietto da canali ufficiali e ignorare i falsi musei o le soste commerciali incluse nei tour economici.',image:'terracotta',caption:'Le fosse dell’Esercito di Terracotta.'},
    {n:9,date:'Dom 14 nov',title:'Xi’an storica → Pechino',lead:'Mezza giornata dentro le mura e poi treno ad alta velocità verso Pechino.',items:['Mattina sulla <strong>City Wall</strong>, a piedi o in bici se il meteo lo permette.','Bell Tower, Drum Tower e pranzo semplice prima della stazione.','Treno veloce <strong>Xi’an North → Beijing West</strong>; cena vicino all’alloggio e riposo.'],links:[['Xi’an City Wall','https://www.google.com/maps/search/?api=1&query=Xi%27an+City+Wall'],['Xi’an North Station','https://www.google.com/maps/search/?api=1&query=Xi%27an+North+Railway+Station'],['Beijing West','https://www.google.com/maps/search/?api=1&query=Beijing+West+Railway+Station']],side:'Il treno evita un altro aeroporto e collega direttamente i due blocchi classici del viaggio.',image:'terracotta',caption:'Xi’an, punto di passaggio verso Pechino.'},
    {n:10,date:'Lun 15 nov',id:'beijing',title:'Pechino imperiale',lead:'Primo giorno nella capitale: asse storico, quartieri tradizionali e vista dall’alto.',items:['<strong>Città Proibita</strong> con prenotazione anticipata e documento corretto.','Uscita a nord e salita a <strong>Jingshan Park</strong> per vedere il complesso dall’alto.','Sera tra hutong, piccoli ristoranti e bar senza trasformare Sanlitun in un obbligo.'],links:[['Forbidden City','https://www.google.com/maps/search/?api=1&query=Forbidden+City+Beijing'],['Jingshan Park','https://www.google.com/maps/search/?api=1&query=Jingshan+Park+Beijing']],side:'La Città Proibita può chiudere in giorni specifici e richiede prenotazione: ricontrollare calendario e regole nel 2027.',image:'great_wall',caption:'La Cina storica culmina a Pechino e sulla Muraglia.'},
    {n:11,date:'Mar 16 nov',title:'Muraglia Cinese a Jinshanling',lead:'La giornata simbolo del viaggio, scelta in una sezione più panoramica e meno congestionata.',items:['Partenza molto presto verso <strong>Jinshanling</strong> con transfer privato diviso in quattro o piccolo gruppo affidabile.','Camminata su una sezione restaurata e una più ruvida, senza inseguire un percorso troppo lungo.','Rientro a Pechino, doccia e cena vicino all’alloggio.'],links:[['Jinshanling Great Wall','https://www.google.com/maps/search/?api=1&query=Jinshanling+Great+Wall']],side:'Jinshanling è più lontana ma più coerente con la richiesta di natura e meno folla. Piano B: Mutianyu molto presto in un giorno feriale.',image:'great_wall',caption:'La Grande Muraglia a Jinshanling.'},
    {n:12,date:'Mer 17 nov',title:'Pechino lenta: lago, parchi e hutong',lead:'Dopo la Muraglia, una giornata meno rigida per capire la città oltre i monumenti.',items:['Mattina al <strong>Summer Palace</strong> e passeggiata lungo il lago.','Pomeriggio tra hutong, caffè, negozi, supermercato e parchi di quartiere.','Sera con hotpot, anatra alla pechinese condivisa oppure KTV.'],links:[['Summer Palace','https://www.google.com/maps/search/?api=1&query=Summer+Palace+Beijing'],['Hutong','https://www.google.com/maps/search/?api=1&query=Shichahai+Hutong+Beijing']],side:'Non serve visitare ogni edificio del Summer Palace. Il valore è anche stare nel parco e osservare la vita locale.',image:'great_wall',caption:'Pechino alterna grandi simboli e giornate lente.'},
    {n:13,date:'Gio 18 nov',title:'Pechino contemporanea e giornata libera',lead:'L’ultima giornata completa resta flessibile: arte, tecnologia, shopping e vita normale.',items:['Mattina al <strong>798 Art District</strong> oppure museo scelto sul posto.','Pomeriggio tra mall, bookstore, mercati, elettronica e acquisti finali.','Ultima serata vera: ristorante preferito, birra, KTV o passeggiata notturna.'],links:[['798 Art District','https://www.google.com/maps/search/?api=1&query=798+Art+District+Beijing'],['Sanlitun','https://www.google.com/maps/search/?api=1&query=Sanlitun+Beijing']],side:'Questa giornata assorbe stanchezza, meteo o una tappa saltata. Non riempirla in anticipo.',image:'great_wall',caption:'Pechino contemporanea chiude il viaggio.'},
    {n:14,date:'Ven 19 → Sab 20 nov',title:'Pechino → Italia',lead:'Ultime ore in città e rientro da Pechino, evitando di tornare inutilmente a Hong Kong.',items:['Se l’orario lo consente: <strong>Temple of Heaven</strong>, colazione locale o ultimi acquisti vicino all’hotel.','Partenza con largo margine verso PEK o Daxing, controllando quale aeroporto compare sul biglietto.','Volo <strong>Pechino → Italia</strong>; il sabato resta dedicato al viaggio e all’arrivo.'],links:[['Temple of Heaven','https://www.google.com/maps/search/?api=1&query=Temple+of+Heaven+Beijing'],['Beijing Capital Airport','https://www.google.com/maps/search/?api=1&query=Beijing+Capital+International+Airport'],['Beijing Daxing Airport','https://www.google.com/maps/search/?api=1&query=Beijing+Daxing+International+Airport']],side:'Il biglietto multi-city evita un volo interno di ritorno. Confrontarlo sempre con A/R Hong Kong più volo Pechino–Hong Kong.',image:'great_wall',caption:'Ultimo giorno a Pechino e rientro.'}
  ];

  D.routeCards = [
    ['Hong Kong','2,5 giorni','🌃 skyline + sentieri','hk_night','Ingresso semplice in Asia: ferry, mercati, quartieri e natura urbana.'],
    ['Shenzhen','2 giorni','🤖 tecnologia + vita quotidiana','sz_hqb','Elettronica, supermercati, parchi, KTV e una città vissuta senza checklist.'],
    ['Macao','1 notte','🎰 storia + casinò','macau2','Centro portoghese-cinese, cucina e una sera a Cotai senza dedicarle troppi giorni.'],
    ['Xi’an','2,5 giorni','🏺 Terracotta + mura','terracotta','Esercito di Terracotta, città murata, cucina musulmana e treno verso nord.'],
    ['Pechino','4,5 giorni','🧱 Muraglia + capitale','great_wall','Città Proibita, Jinshanling, hutong, parchi e vita contemporanea.']
  ];

  D.mapPoints = [
    {name:'Hong Kong Airport',lat:22.308,lng:113.9185,cat:'route',day:'1/2',note:'Arrivo in Cina'},
    {name:'Tsim Sha Tsui',lat:22.2973,lng:114.1722,cat:'culture',day:'2',note:'Waterfront e base possibile'},
    {name:'Mong Kok',lat:22.3193,lng:114.1694,cat:'shopping',day:'2',note:'Mercati e negozi'},
    {name:'Dragon’s Back',lat:22.2269,lng:114.244,cat:'nature',day:'3',note:'Sentiero con vista mare'},
    {name:'Sham Shui Po',lat:22.3307,lng:114.1622,cat:'shopping',day:'3',note:'Quartiere popolare ed elettronica'},
    {name:'Futian, Shenzhen',lat:22.541,lng:114.0579,cat:'route',day:'4/5',note:'Base a Shenzhen'},
    {name:'Huaqiangbei',lat:22.5453,lng:114.0859,cat:'shopping',day:'5',note:'Mercati di elettronica'},
    {name:'Shenzhen Bay Park',lat:22.4863,lng:113.9506,cat:'nature',day:'5',note:'Passeggiata sulla baia'},
    {name:'Shekou Port',lat:22.4707,lng:113.9135,cat:'route',day:'6',note:'Collegamento per Macao'},
    {name:'Macao Historic Centre',lat:22.1987,lng:113.5439,cat:'route',day:'6',note:'Centro storico'},
    {name:'Cotai Strip',lat:22.1482,lng:113.559,cat:'night',day:'6',note:'Resort e casinò'},
    {name:'Xi’an',lat:34.3416,lng:108.9398,cat:'route',day:'7/9',note:'Base storica'},
    {name:'Muslim Quarter',lat:34.2656,lng:108.947,cat:'food',day:'7',note:'Street food e sera'},
    {name:'Terracotta Army',lat:34.3841,lng:109.2785,cat:'culture',day:'8',note:'Grande classica del viaggio'},
    {name:'Xi’an City Wall',lat:34.259,lng:108.947,cat:'culture',day:'8/9',note:'Mura e centro storico'},
    {name:'Beijing',lat:39.9042,lng:116.4074,cat:'route',day:'9/14',note:'Ultima base'},
    {name:'Forbidden City',lat:39.9163,lng:116.3972,cat:'culture',day:'10',note:'Cuore imperiale'},
    {name:'Jingshan Park',lat:39.9237,lng:116.3964,cat:'nature',day:'10',note:'Vista sulla Città Proibita'},
    {name:'Jinshanling Great Wall',lat:40.6769,lng:117.2436,cat:'route',day:'11',note:'Muraglia panoramica e meno affollata'},
    {name:'Summer Palace',lat:39.9999,lng:116.2755,cat:'nature',day:'12',note:'Lago e parco'},
    {name:'798 Art District',lat:39.9845,lng:116.495,cat:'culture',day:'13',note:'Pechino contemporanea'},
    {name:'Temple of Heaven',lat:39.8822,lng:116.4066,cat:'culture',day:'14',note:'Ultime ore in città'},
    {name:'Beijing Airport',lat:40.0799,lng:116.6031,cat:'route',day:'14',note:'Rientro in Italia'}
  ];
  D.routeCoords = [[22.308,113.9185],[22.541,114.0579],[22.1987,113.5439],[34.3416,108.9398],[39.9042,116.4074],[40.6769,117.2436],[40.0799,116.6031]];
  D.gallery = [['hk_skyline','Hong Kong dalla baia'],['sz_sky2','Shenzhen e i suoi grattacieli'],['macau4','Macao tra storia e casinò'],['terracotta','L’Esercito di Terracotta'],['great_wall','La Muraglia a Jinshanling'],['hk_night','Hong Kong di notte']];

  document.title = 'Cina 2027 — Hong Kong, Shenzhen, Macao, Xi’an e Pechino';
  const metaDescription = $('meta[name="description"]');
  if (metaDescription) metaDescription.content = 'Guida completa di 14 giorni in Cina: Hong Kong, Shenzhen, Macao, Xi’an, Esercito di Terracotta, Pechino e Muraglia a Jinshanling.';
  const heroTitle = $('.hero h1');
  if (heroTitle) heroTitle.innerHTML = 'Cina 2027.<br>Dalle metropoli alla Muraglia.';
  const heroLead = $('.hero-lead');
  if (heroLead) heroLead.innerHTML = '<strong>Hong Kong, Shenzhen, Macao, Xi’an e Pechino.</strong> Quattordici giorni con tecnologia, vita quotidiana, cucina, Esercito di Terracotta e Muraglia Cinese, senza comprimere tutto in una checklist.';
  const itineraryNav = $('#main-nav a[href="#itinerario"]');
  if (itineraryNav) itineraryNav.textContent = '14 giorni';
  const durationChip = $$('.hero-chip').find(el => /15 giorni|14 giorni/.test(el.textContent));
  if (durationChip) durationChip.textContent = '🗓 14 giorni';
  const budgetChip = $$('.hero-chip').find(el => el.textContent.includes('€'));
  if (budgetChip) budgetChip.textContent = '💶 1.300–1.650 €';
  const routeChip = $$('.hero-chip').find(el => el.textContent.includes('percorso'));
  if (routeChip) routeChip.textContent = '✈️ multi-city + 1 volo interno';
  const natureChip = $$('.hero-chip').find(el => el.textContent.includes('città + natura'));
  if (natureChip) natureChip.textContent = '🧱 Muraglia + città';
  const itineraryTitle = $('#itinerario .chapter-copy h2');
  if (itineraryTitle) itineraryTitle.textContent = '14 giorni, tappa per tappa.';
  const eyebrow = $('.eyebrow');
  if (eyebrow) eyebrow.textContent = 'Viaggio dei quattro · sabato 6 → sabato 20 novembre 2027 · 14 giorni';
  const summaryIntro = $('#riassunto .section-intro');
  if (summaryIntro) summaryIntro.innerHTML = 'Il percorso unisce <strong>Cina moderna e grandi classiche</strong>: si entra da Hong Kong, si vive Shenzhen, si passa una sera a Macao, poi si sale verso <strong>Xi’an e Pechino</strong> fino alla Muraglia.';
  const routeTitle = $('#percorso .section-head h2');
  if (routeTitle) routeTitle.textContent = 'Cinque tappe, da sud a nord.';
  const routeIntro = $('#percorso .section-intro');
  if (routeIntro) routeIntro.innerHTML = 'Biglietto <strong>multi-city</strong>, un solo volo interno e un treno veloce: niente ritorno inutile a Hong Kong.';
  const alternativeTitle = $('#alternative .section-head h2');
  if (alternativeTitle) alternativeTitle.textContent = 'Cosa resta fuori dal percorso principale.';
  const alternativeIntro = $('#alternative .section-intro');
  if (alternativeIntro) alternativeIntro.innerHTML = 'Le classiche sono già dentro. Qui restano solo sostituzioni possibili, non tappe da accumulare.';
  const budgetIntro = $('#budget .section-intro');
  if (budgetIntro) budgetIntro.textContent = 'Xi’an, Pechino e il volo interno alzano il costo, ma il biglietto multi-city evita di tornare a Hong Kong.';

  const oldGuangzhou = $('.toc a[href="#guangzhou"]');
  const oldYangshuo = $('.toc a[href="#yangshuo"]');
  const oldMacao = $('.toc a[href="#macao"]');
  if (oldGuangzhou) { oldGuangzhou.href = '#macao'; oldGuangzhou.textContent = '🎰 Macao'; }
  if (oldYangshuo) { oldYangshuo.href = '#xian'; oldYangshuo.textContent = '🏺 Xi’an'; }
  if (oldMacao && oldMacao !== oldGuangzhou) { oldMacao.href = '#beijing'; oldMacao.textContent = '🧱 Pechino'; }

  const mobileTextFix = document.createElement('style');
  mobileTextFix.textContent = `.day-content{min-width:0;word-break:normal;overflow-wrap:break-word}.day-content li{display:block!important;position:relative;min-width:0;padding-left:31px;word-break:normal;overflow-wrap:break-word}.day-content li::before{position:absolute;left:2px;top:.42em;transform:none!important}.day-content li strong{display:inline;white-space:normal;word-break:normal}@media(max-width:760px){.day-content li{padding-left:28px}}`;
  document.head.appendChild(mobileTextFix);

  const menuButton = $('.menu-toggle'), nav = $('#main-nav');
  menuButton.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); menuButton.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('menu-open', open); });
  $$('#main-nav a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded','false'); document.body.classList.remove('menu-open'); }));

  $('#snapshot-grid').innerHTML = [
    ['✈️','Volo','Italia → Hong Kong e Pechino → Italia: confrontare multi-city e A/R.'],
    ['🏠','Alloggi','Camere o appartamenti per quattro vicino a metro e stazioni utili.'],
    ['🏺','Classiche','Esercito di Terracotta e Muraglia sono dentro il viaggio reale.'],
    ['🤖','Cina moderna','Shenzhen, elettronica, mall, supermercati e KTV.'],
    ['🌿','Natura','Dragon’s Back, parchi di Pechino e Jinshanling.'],
    ['🍜','Vita quotidiana','Mercati, colazioni, street food, bar e giornate non programmate al minuto.']
  ].map(x => `<article class="snapshot"><span class="snapshot-icon">${x[0]}</span><strong>${x[1]}</strong><span>${x[2]}</span></article>`).join('');

  $('#summary-box').innerHTML = `<div class="summary-box"><div><h3>Il percorso consigliato</h3><p><strong>Hong Kong → Shenzhen → Macao → Xi’an → Pechino.</strong> È il compromesso migliore tra vita quotidiana, città moderne e simboli storici.</p><ul class="summary-list"><li><span>✓</span><span><strong>Hong Kong</strong>: skyline, quartieri e sentieri.</span></li><li><span>✓</span><span><strong>Shenzhen</strong>: tecnologia e Cina contemporanea.</span></li><li><span>✓</span><span><strong>Macao</strong>: centro storico e una sera a Cotai.</span></li><li><span>✓</span><span><strong>Xi’an</strong>: Terracotta, mura e cucina locale.</span></li><li><span>✓</span><span><strong>Pechino</strong>: capitale, hutong e Muraglia a Jinshanling.</span></li></ul></div><aside class="summary-side"><strong>Logistica corretta</strong><span>Arrivo a Hong Kong, volo Macao/Shenzhen–Xi’an, treno Xi’an–Pechino e rientro da Pechino.</span></aside></div>`;

  $('#route-grid').innerHTML = D.routeCards.map((r,i) => `<article class="route-card"><figure data-lightbox><img loading="lazy" src="${D.imgs[r[3]]}" alt="${esc(r[0])}" onerror="this.closest('figure').classList.add('image-error')"><span class="route-number">${i+1}</span></figure><div class="route-body"><h3>${r[0]}</h3><p>${r[4]}</p><div class="route-meta"><span class="mini-chip">${r[1]}</span><span class="mini-chip">${r[2]}</span></div></div></article>`).join('');

  $('#days').innerHTML = D.days.map(d => {
    const links = (d.links || []).map(l => `<a class="map-link" href="${l[1]}" target="_blank" rel="noopener">⌖ ${esc(l[0])}</a>`).join('');
    const items = d.items.map(x => `<li>${x}</li>`).join('');
    return `<article class="day-card"${d.id ? ` id="${d.id}"` : ''}><div class="day-number"><b>${d.n}</b><span>${d.date}</span></div><div class="day-content"><h3>${d.title}</h3><p class="day-lead">${d.lead}</p><ul>${items}</ul><div class="day-links">${links}</div><aside class="day-tip"><strong>Nota pratica:</strong> ${d.side}</aside></div>${image(D.imgs[d.image],d.caption,d.caption,'day-photo')}</article>`;
  }).join('');

  $('#gallery').innerHTML = D.gallery.map(g => image(D.imgs[g[0]],g[1],g[1])).join('');

  const alternatives = [
    ['ys_karst','Yangshuo e Guilin','La scelta migliore se volete più natura: sostituisce Macao e uno o due giorni di Pechino.','Sostituzione natura',''],
    ['gz','Guangzhou e Foshan','Ottime per cucina cantonese e vita urbana, ma meno decisive di Xi’an e Pechino in un primo viaggio.','Sostituzione sud',''],
    ['hk_2019','Shanghai','Può sostituire Shenzhen oppure due giorni di Pechino, ma aggiunge un’altra grande metropoli.','Sostituzione città',''],
    ['ys_karst','Zhangjiajie','Paesaggio spettacolare ma logistica più pesante. Va inserita al posto di Macao e Shenzhen.','Sostituzione natura',''],
    ['dapeng14','Sanya','Mare tropicale e resort: cambia completamente il tono del viaggio e richiede un altro volo.','Solo viaggio mare','no'],
    ['dapeng','Dapeng','Facile da Shenzhen, ma con le classiche dentro il viaggio non vale più un giorno intero.','Gita opzionale','']
  ];
  $('#alternatives').innerHTML = alternatives.map(a => `<article class="option-card">${image(D.imgs[a[0]],a[1])}<div><h3>${a[1]}</h3><p>${a[2]}</p><span class="verdict ${a[4]}">${a[3]}</span></div></article>`).join('');

  const food = [
    ['🥢','Hong Kong, Shenzhen e Macao','<ul><li><strong>Dim sum</strong>, char siu, roast duck e claypot rice.</li><li>Cha chaan teng, food court e supermercati.</li><li>A Macao: egg tart e pork chop bun.</li></ul>'],
    ['🌶️','Xi’an','<ul><li><strong>Roujiamo</strong>, biangbiang noodles e dumpling.</li><li>Muslim Quarter con criterio: guardare dove mangiano i locali.</li><li>Chiedere il livello di piccante prima di ordinare.</li></ul>'],
    ['🦆','Pechino','<ul><li><strong>Anatra alla pechinese</strong> da dividere in quattro.</li><li>Jianbing, hotpot, noodles e colazioni locali.</li><li>Un ristorante importante basta; il resto può essere semplice.</li></ul>'],
    ['🍺','Birra e serata','<ul><li>Tsingtao, Snow e Harbin come birre facili.</li><li>KTV a Shenzhen o Pechino.</li><li>A Macao fissare prima il budget del casinò.</li></ul>']
  ];
  $('#food-grid').innerHTML = food.map(x => `<article class="practical-card"><span class="practical-icon">${x[0]}</span><h3>${x[1]}</h3>${x[2]}</article>`).join('');

  const shopping = [
    ['🎒','Prima di partire','<ul><li>Adattatore universale USB-C.</li><li>Power bank certificato.</li><li>Scarpe vere per Muraglia e sentieri.</li><li>Farmaci, assicurazione e due carte fisiche.</li></ul>'],
    ['🔌','Shenzhen','<ul><li>Cavi e accessori di marchi verificabili.</li><li>Gadget elettronici provati davanti al venditore.</li><li>Fotografare modello, bancarella e ricevuta.</li></ul>'],
    ['🏺','Xi’an e Pechino','<ul><li>Cartoleria, tè, poster, piccoli oggetti artigianali.</li><li>Souvenir della Terracotta senza comprare copie ingombranti.</li><li>Snack e bevande da dividere al ritorno.</li></ul>'],
    ['🚫','Da evitare','<ul><li>SSD, memorie e batterie senza test.</li><li>Contraffatti e oggetti problematici in dogana.</li><li>Smartphone senza verificare bande, lingua e garanzia.</li></ul>']
  ];
  $('#shopping-grid').innerHTML = shopping.map(x => `<article class="practical-card"><span class="practical-icon">${x[0]}</span><h3>${x[1]}</h3>${x[2]}</article>`).join('');

  const apps = [
    ['支','Alipay','Pagamenti e mini-app. Collegare la carta e fare un test prima.'],
    ['微','WeChat','Messaggi, QR e pagamento di riserva. Attivarlo con anticipo.'],
    ['地','Amap / 高德地图','Mappa principale nella Cina continentale. Cercare anche in cinese.'],
    ['滴','DiDi','Auto con destinazione già scritta nell’app. Controllare sempre la targa.'],
    ['铁','12306 / Trip.com','Treno Xi’an–Pechino e altri spostamenti con passaporto.'],
    ['译','Traduttore','Mandarino offline, screenshot e indirizzi degli hotel.'],
    ['網','eSIM / roaming','Verificare copertura separata per Cina, Hong Kong e Macao.'],
    ['八','Octopus','Trasporti e piccoli pagamenti a Hong Kong.']
  ];
  $('#apps').innerHTML = apps.map(x => `<article class="app"><span class="app-icon">${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p></article>`).join('');
  $('#practical-details').innerHTML = `<details open><summary>Voli e percorso</summary><div><p><strong>Prima scelta:</strong> Italia → Hong Kong e Pechino → Italia. Aggiungere un volo interno Macao/Shenzhen → Xi’an e il treno veloce Xi’an → Pechino. Confrontare il totale con un normale A/R Hong Kong.</p></div></details><details><summary>Documenti e prenotazioni</summary><div><ul><li>Passaporto e regola visto 2027 verificati su fonte ufficiale.</li><li>Città Proibita, Terracotta e treni prenotati con i dati identici al passaporto.</li><li>Assicurazione sanitaria e prenotazioni disponibili offline.</li></ul></div></details><details><summary>Backup</summary><div><p>Dividere carte e contanti, salvare gli indirizzi in cinese e non dipendere da una sola app o da un solo collegamento interno.</p></div></details>`;

  if (window.L) {
    const colors = {route:'#981c22',nature:'#2f7d65',shopping:'#3f69a8',food:'#d18127',culture:'#7b4ba5',night:'#29202e'};
    const map = L.map('trip-map',{zoomControl:true,scrollWheelZoom:false});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap'}).addTo(map);
    const routeLine = L.polyline(D.routeCoords,{color:'#981c22',weight:4,opacity:.82,dashArray:'10 8'}).addTo(map);
    let routeNumber = 0;
    const markers = D.mapPoints.map(p => {
      if (p.cat === 'route') routeNumber++;
      const icon = p.cat === 'route' ? L.divIcon({className:'',html:`<span class="route-marker">${routeNumber}</span>`,iconSize:[30,30],iconAnchor:[15,15]}) : L.divIcon({className:'',html:`<span class="point-marker" style="background:${colors[p.cat]}"></span>`,iconSize:[17,17],iconAnchor:[8,8]});
      const marker = L.marker([p.lat,p.lng],{icon}).bindPopup(`<strong>${p.name}</strong><br>Giorno ${p.day} · ${p.note}`).addTo(map);
      marker.category = p.cat;
      return marker;
    });
    const routeBounds = L.latLngBounds(D.routeCoords);
    map.fitBounds(routeBounds.pad(.08));
    $('#fit-route').addEventListener('click',() => map.fitBounds(routeBounds.pad(.08)));
    $$('[data-map-filter]').forEach(btn => btn.addEventListener('click',() => {
      const cat = btn.dataset.mapFilter;
      $$('[data-map-filter]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      markers.forEach(marker => { const show = cat === 'all' || marker.category === cat; if (show && !map.hasLayer(marker)) marker.addTo(map); if (!show && map.hasLayer(marker)) map.removeLayer(marker); });
      if (cat === 'all' || cat === 'route') { if (!map.hasLayer(routeLine)) routeLine.addTo(map); } else if (map.hasLayer(routeLine)) map.removeLayer(routeLine);
    }));
  } else {
    $('#trip-map').innerHTML = '<div class="map-fallback"><strong>Mappa non caricata.</strong><span>Controlla la connessione e ricarica la pagina.</span></div>';
    $$('.map-filter').forEach(b => b.disabled = true);
  }

  const budgets = {
    low:{label:'Scenario tirato',total:'1.300 €',description:'Multi-city in offerta, alloggi base, volo interno economico e attività selezionate.',rows:{'Voli internazionali':'600 €','Alloggi':'220 €','Volo interno + treno':'180 €','Trasporti locali':'90 €','Cibo':'145 €','Ingressi, eSIM e assicurazione':'65 €'}},
    mid:{label:'Scenario realistico',total:'1.520 €',description:'Voli prenotati bene, camere condivise, transfer per Jinshanling e margine vero.',rows:{'Voli internazionali':'680 €','Alloggi':'285 €','Volo interno + treno':'220 €','Trasporti locali':'110 €','Cibo':'175 €','Ingressi, eSIM e assicurazione':'50 €'}},
    high:{label:'Scenario comodo',total:'1.850 €',description:'Orari migliori, alloggi più centrali, transfer privati e più libertà.',rows:{'Voli internazionali':'780 €','Alloggi':'370 €','Volo interno + treno':'260 €','Trasporti locali':'145 €','Cibo':'220 €','Ingressi, eSIM e assicurazione':'75 €'}}
  };
  function renderBudget(key) {
    const c = budgets[key];
    $('#budget-label').textContent = c.label;
    $('#budget-total').textContent = c.total;
    $('#budget-description').textContent = c.description;
    $('#budget-table').innerHTML = '<thead><tr><th>Voce</th><th>Stima</th></tr></thead><tbody>' + Object.entries(c.rows).map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('') + '</tbody>';
  }
  renderBudget('mid');
  $$('.budget-tab').forEach(b => b.addEventListener('click',() => { $$('.budget-tab').forEach(x => x.classList.remove('is-active')); b.classList.add('is-active'); renderBudget(b.dataset.budget); }));

  const checklist = [
    ['passport','Passaporto controllato','Validità, pagine libere e copie offline.'],
    ['visa','Regola visto 2027 verificata','Solo fonte ufficiale aggiornata.'],
    ['insurance','Assicurazione sanitaria','Massimali, assistenza e rimpatrio.'],
    ['flight','Volo multi-city confrontato','Italia–Hong Kong e Pechino–Italia.'],
    ['internal','Volo interno deciso','Macao/Shenzhen–Xi’an con piano alternativo.'],
    ['payments','Alipay e WeChat testati','Due carte e metodo di riserva.'],
    ['data','eSIM/roaming deciso','Copertura Cina, Hong Kong e Macao.'],
    ['tickets','Classiche prenotate','Terracotta, Città Proibita e Muraglia.'],
    ['trains','Treno Xi’an–Pechino','Dati identici al passaporto.'],
    ['bags','Bagagli e batterie controllati','Power bank e limiti compagnie.']
  ];
  $('#checklist-grid').innerHTML = checklist.map(x => `<label class="check-item"><input type="checkbox" data-check="${x[0]}"><span><strong>${x[1]}</strong><span>${x[2]}</span></span></label>`).join('');
  const boxes = $$('[data-check]'), storageKey = 'swadyaspace-china-checklist-v3';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch (e) {}
  function progress() { const done = boxes.filter(b => b.checked).length, pct = Math.round(done / boxes.length * 100); $('#progress-label').textContent = pct + '%'; $('#progress-bar').style.width = pct + '%'; }
  boxes.forEach(b => { b.checked = !!saved[b.dataset.check]; b.addEventListener('change',() => { saved[b.dataset.check] = b.checked; localStorage.setItem(storageKey,JSON.stringify(saved)); progress(); }); });
  progress();

  const translateBase = 'https://translate.google.com/?sl=zh-CN&tl=it&op=translate&text=';
  $('#phrase-body').innerHTML = D.phrases.map(p => `<tr data-search="${esc(p[3])}"><td><span class="hanzi">${p[0]}</span><span class="pinyin">${p[1]}</span></td><td>${p[2]}</td><td><button class="speak-btn" data-text="${esc(p[0])}">▶ Ascolta</button><a class="translate-link" href="${translateBase + encodeURIComponent(p[0])}" target="_blank" rel="noopener">Translate</a></td></tr>`).join('');
  const rows = $$('#phrase-body tr'), search = $('#phrase-search'), count = $('#phrase-count');
  function filterPhrases() { const q = search.value.trim().toLowerCase(); let n = 0; rows.forEach(r => { const show = !q || (r.textContent + ' ' + r.dataset.search).toLowerCase().includes(q); r.hidden = !show; if (show) n++; }); count.textContent = n + ' frasi'; }
  search.addEventListener('input',filterPhrases);
  filterPhrases();
  let voices = [];
  const refresh = () => voices = window.speechSynthesis?.getVoices?.() || [];
  refresh();
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = refresh;
  $$('.speak-btn').forEach(b => b.addEventListener('click',() => { if (!('speechSynthesis' in window)) { window.open(translateBase + encodeURIComponent(b.dataset.text)); return; } speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(b.dataset.text); u.lang = 'zh-CN'; u.rate = .78; u.voice = voices.find(v => v.lang.toLowerCase() === 'zh-cn') || voices.find(v => v.lang.toLowerCase().startsWith('zh')) || null; speechSynthesis.speak(u); }));

  const dialog = $('#lightbox'), dialogImg = $('#lightbox img');
  $$('[data-lightbox]').forEach(f => f.addEventListener('click',() => { const img = $('img',f); if (!img || f.classList.contains('image-error')) return; dialogImg.src = img.src; dialogImg.alt = img.alt; dialog.showModal(); }));
  $('#lightbox button').addEventListener('click',() => dialog.close());
  dialog.addEventListener('click',e => { if (e.target === dialog) dialog.close(); });
})();
