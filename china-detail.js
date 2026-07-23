(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const amap = (keyword) => `https://uri.amap.com/search?keyword=${encodeURIComponent(keyword)}`;
  const google = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const youtube = (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  const commons = (file, width = 1200) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
  const money = (value) => new Intl.NumberFormat('it-IT', {style: 'currency', currency: 'EUR', maximumFractionDigits: 0}).format(value);

  const styles = document.createElement('style');
  styles.textContent = `
    .deep-section{padding-top:72px}.deep-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:17px}.deep-card{min-width:0;overflow:hidden;background:var(--paper-2);border:1px solid var(--line);border-radius:var(--radius);box-shadow:0 11px 32px rgba(69,40,23,.08)}.deep-card-body{padding:20px}.deep-card h3{margin:0;font-size:1.32rem}.deep-card h4{margin:18px 0 5px;font-size:.98rem}.deep-card p{margin:7px 0 0;color:var(--muted)}.deep-card ul{margin:10px 0 0;padding-left:20px}.deep-card li+li{margin-top:6px}.deep-photo{position:relative;height:230px;margin:0;overflow:hidden;background:#d7c5b1;cursor:zoom-in}.deep-photo img{width:100%;height:100%;object-fit:cover}.deep-photo figcaption{position:absolute;inset:auto 0 0;padding:32px 14px 11px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.78));font-size:.76rem}.deep-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:15px}.deep-link,.copy-data{display:inline-flex;align-items:center;justify-content:center;min-height:38px;padding:7px 10px;color:var(--red-dark);background:#fff;border:1px solid var(--line);border-radius:9px;text-decoration:none;font-size:.78rem;font-weight:850;cursor:pointer}.deep-link:hover,.copy-data:hover{border-color:var(--red);background:#fff7ee}.price-band{display:flex;align-items:end;justify-content:space-between;gap:15px;margin:15px 0;padding:14px;color:#fff;background:var(--red-dark);border-radius:12px}.price-band strong{font-size:1.55rem;line-height:1}.price-band span{color:#ead6c8;font-size:.78rem}.truth-box{padding:18px;background:#fff4d5;border:1px solid #d8b468;border-radius:14px}.truth-box h3{margin:0}.truth-box p{margin:7px 0 0}.platform-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:18px}.platform-card{padding:15px;background:var(--paper-2);border:1px solid var(--line);border-radius:13px}.platform-card strong{display:block}.platform-card span{display:block;margin:4px 0 10px;color:var(--muted);font-size:.82rem}.search-phrases{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.search-phrase{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#fff;border:1px solid var(--line);border-radius:10px}.search-phrase code{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:.78rem}.city-ops{display:grid;gap:18px}.city-ops-card{overflow:hidden;background:var(--paper-2);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow)}.city-ops-head{display:grid;grid-template-columns:minmax(250px,.72fr) minmax(0,1.28fr);min-height:260px}.city-ops-photo{position:relative;min-height:250px;margin:0;overflow:hidden;background:#d7c5b1}.city-ops-photo img{width:100%;height:100%;object-fit:cover}.city-ops-copy{padding:22px}.city-ops-copy h3{margin:0;font-size:1.65rem}.city-ops-copy .where{margin:6px 0 0;color:var(--red);font-weight:900}.ops-columns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:18px}.ops-column{padding:14px;background:#fff;border:1px solid var(--line);border-radius:12px}.ops-column h4{margin:0 0 7px;font-size:.92rem}.ops-column p,.ops-column li{font-size:.84rem}.ops-column ul{margin:0;padding-left:18px}.point-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:0 22px 22px}.point-card{min-width:0;padding:14px;background:#fff;border:1px solid var(--line);border-radius:12px}.point-top{display:flex;justify-content:space-between;gap:10px}.point-card h4{margin:0;font-size:1rem}.point-kind{flex:0 0 auto;color:var(--red);font-size:.7rem;font-weight:900;text-transform:uppercase}.point-card p{margin:5px 0 0;color:var(--muted);font-size:.82rem}.point-card .deep-links{margin-top:9px}.ops-map-wrap{overflow:hidden;background:var(--paper-2);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow)}#ops-map{height:680px;background:#d6d0c5}.ops-map-toolbar{display:flex;flex-wrap:wrap;gap:8px;padding:14px;border-bottom:1px solid var(--line)}.ops-filter{padding:8px 11px;background:#fff;border:1px solid var(--line);border-radius:999px;font-size:.78rem;font-weight:850;cursor:pointer}.ops-filter.is-active{color:#fff;background:var(--red);border-color:var(--red)}.ops-marker{display:grid!important;width:25px!important;height:25px!important;place-items:center;color:#fff;border:2px solid #fff;border-radius:50%;box-shadow:0 3px 10px rgba(0,0,0,.3);font-size:.66rem;font-weight:900}.food-grid-pro{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px}.food-pro{overflow:hidden;background:var(--paper-2);border:1px solid var(--line);border-radius:16px;box-shadow:0 10px 28px rgba(69,40,23,.07)}.food-pro figure{height:205px;margin:0;overflow:hidden;background:#d7c5b1;cursor:zoom-in}.food-pro img{width:100%;height:100%;object-fit:cover}.food-pro-body{padding:16px}.food-pro h3{margin:0;font-size:1.16rem}.food-meta{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}.food-meta span{padding:4px 7px;color:var(--red-dark);background:var(--red-soft);border-radius:999px;font-size:.7rem;font-weight:850}.food-pro p{margin:9px 0 0;color:var(--muted);font-size:.84rem}.food-pro strong.label{display:block;margin-top:10px;font-size:.76rem;text-transform:uppercase;color:var(--red)}.connect-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.connect-card{padding:19px;background:var(--paper-2);border:1px solid var(--line);border-radius:16px}.connect-card h3{margin:0}.connect-card ol,.connect-card ul{padding-left:20px}.connect-card li+li{margin-top:7px}.alt-pro-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:17px}.alt-pro{overflow:hidden;background:var(--paper-2);border:1px solid var(--line);border-radius:18px}.alt-pro figure{height:245px;margin:0;overflow:hidden}.alt-pro img{width:100%;height:100%;object-fit:cover}.alt-pro-body{padding:19px}.alt-pro h3{margin:0}.swap-plan{margin-top:12px;padding:11px;color:#fff;background:var(--jade);border-radius:10px;font-size:.82rem}.source-note{margin-top:16px;color:var(--muted);font-size:.78rem}.hotel-totals{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:17px}.hotel-total{padding:14px;background:#fff;border:1px solid var(--line);border-radius:12px}.hotel-total strong{display:block;font-size:1.25rem}.hotel-total span{color:var(--muted);font-size:.78rem}.toast-copy{position:fixed;right:16px;bottom:16px;z-index:300;padding:11px 14px;color:#fff;background:#201815;border-radius:10px;opacity:0;transform:translateY(10px);pointer-events:none;transition:.2s}.toast-copy.is-visible{opacity:1;transform:none}.video-link::before{content:'▶ ';}.warning-line{margin-top:12px;padding:10px 12px;background:#f5dddd;border-left:4px solid var(--red);font-size:.82rem}.detail-source-list{columns:2;column-gap:34px}.detail-source-list li{break-inside:avoid;margin-bottom:8px}
    @media(max-width:900px){.platform-grid,.food-grid-pro{grid-template-columns:repeat(2,minmax(0,1fr))}.city-ops-head{grid-template-columns:1fr}.city-ops-photo{min-height:320px}.ops-columns{grid-template-columns:1fr}.point-list{grid-template-columns:1fr}.hotel-totals{grid-template-columns:1fr}.alt-pro-grid{grid-template-columns:1fr}}
    @media(max-width:620px){.deep-grid,.platform-grid,.food-grid-pro,.connect-grid{grid-template-columns:1fr}.deep-section{padding-top:55px}.city-ops-photo{min-height:230px}.city-ops-copy,.point-list{padding-left:17px;padding-right:17px}.point-list{padding-bottom:17px}#ops-map{height:560px}.price-band{align-items:start;flex-direction:column}.detail-source-list{columns:1}}
  `;
  document.head.appendChild(styles);

  const toast = document.createElement('div');
  toast.className = 'toast-copy';
  toast.textContent = 'Copiato';
  document.body.appendChild(toast);
  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); }
    catch { const area = document.createElement('textarea'); area.value = text; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove(); }
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 1200);
  };

  const nav = $('.toc');
  if (nav) {
    nav.insertAdjacentHTML('beforeend', '<a href="#alloggi-reali">🏨 Dormire</a><a href="#mappa-operativa">📍 Punti precisi</a><a href="#cibo-dettagliato">🥢 Piatti</a><a href="#telefono-cina">📶 Connessione</a>');
  }
  const mainNav = $('#main-nav');
  if (mainNav) mainNav.insertAdjacentHTML('beforeend', '<a href="#alloggi-reali">Alloggi</a><a href="#cibo-dettagliato">Cibo</a>');

  const bookingPlatforms = [
    {name:'Agoda in cinese', note:'Ottimo per appartamenti e offerte mobile. Controllare prezzo finale e numero reale di ospiti.', href:'https://www.agoda.com/zh-cn/'},
    {name:'携程 Ctrip', note:'Inventario domestico molto ampio. Leggere documenti ammessi e condizioni della camera.', href:'https://hotels.ctrip.com/'},
    {name:'Trip.com', note:'Interfaccia internazionale e assistenza più semplice; confrontare sempre con Ctrip.', href:'https://www.trip.com/hotels/'},
    {name:'去哪儿 Qunar', note:'Utile per confronto domestico; spesso richiede più cinese e pagamenti locali.', href:'https://hotel.qunar.com/'},
    {name:'美团 Meituan', note:'Offerte locali e pacchetti; può richiedere numero cinese e mini-app.', href:'https://hotel.meituan.com/'},
    {name:'飞猪 Fliggy', note:'Marketplace Alibaba. Verificare venditore, cancellazione e conferma immediata.', href:'https://www.fliggy.com/'}
  ];

  const stayAreas = [
    {
      city:'Hong Kong', nights:'2 notti', area:'Tsuen Wan MTR / Tsuen Wan West / Kwai Hing', target:'70–120 € / notte per 4', total:'140–240 €',
      image:'Tsuen Wan skyline 2019.jpg',
      why:'Più economica del waterfront di Kowloon, ma con MTR, mercati e ristoranti quotidiani sotto casa.',
      commute:'Tsuen Wan Line verso Mong Kok e Tsim Sha Tsui; evitare hotel che dipendono solo da navette.',
      searches:['荃湾站 酒店 四人','荃湾西站 家庭房','葵兴站 酒店'],
      chains:'Dorsett, Silka, Panda Hotel e strutture locali; confrontare camere familiari e due twin.',
      amap:'荃湾站', google:'Tsuen Wan MTR Station'
    },
    {
      city:'Shenzhen', nights:'2 notti', area:'Laojie / Hubei / Guomao, distretto Luohu', target:'30–60 € / notte per 4', total:'60–120 €',
      image:'Shenzhen skyline from Nanshan.jpg',
      why:'Quartiere più vecchio e vissuto, vicino a Dongmen e al confine; prezzi più bassi di Futian CBD.',
      commute:'Linea 1 e Linea 3. Huaqiangbei e Futian restano raggiungibili in metro; DiDi diviso in quattro per gli ultimi chilometri.',
      searches:['老街站 三室一厅 4人','湖贝站 酒店 外宾','国贸站 家庭房'],
      chains:'汉庭 Hanting, 海友 Hi Inn, 如家 Home Inn, 锦江之星 Jinjiang Inn, 7天, 维也纳: verificare ogni singola struttura.',
      amap:'深圳老街站', google:'Laojie Station Shenzhen'
    },
    {
      city:'Macao', nights:'0–1 notte', area:'Gita da Shenzhen oppure Taipa residenziale / Outer Harbour', target:'0 € se gita; 55–100 € se obbligatorio', total:'0–100 €',
      image:'Macau Skyline 2015.jpg',
      why:'I resort di Cotai falsano la media. L’opzione economica è non dormirci e rientrare, oppure cercare fuori dai casinò.',
      commute:'Shekou–Macao in traghetto quando operativo. Rientro in Cina continentale solo dopo aver verificato le regole di reingresso 2027.',
      searches:['澳门 氹仔 酒店 4人','澳门 外港 酒店 家庭房','珠海拱北口岸 酒店 外宾'],
      chains:'Hotel locali a Taipa/Areia Preta; Zhuhai Gongbei è il piano più economico solo se reingresso e volo successivo sono compatibili.',
      amap:'澳门议事亭前地', google:'Senado Square Macau'
    },
    {
      city:'Xi’an', nights:'2 notti', area:'Dachaishi / Hepingmen; Longshouyuan per il prezzo minimo', target:'25–55 € / notte per 4', total:'50–110 €',
      image:'Xi-an city wall.jpg',
      why:'Dachaishi è il compromesso migliore per mura, metro e cibo. Longshouyuan costa meno ed è diretto sulla Linea 2.',
      commute:'Entro 600 m dalla metro. Non serve stare esattamente alla Bell Tower, dove si paga il sovrapprezzo turistico.',
      searches:['大差市站 酒店 外宾','和平门站 家庭房 4人','龙首原站 酒店 接待外宾'],
      chains:'汉庭, 全季 Ji Hotel, 如家, 亚朵轻居, 锦江之星. Controllare “外宾” e il numero di letti.',
      amap:'西安大差市站', google:'Dachaishi Station Xi’an'
    },
    {
      city:'Pechino', nights:'5 notti', area:'Jinsong / Panjiayuan / Shilihe; Songjiazhuang come piano B', target:'35–70 € / notte per 4', total:'175–350 €',
      image:'Beijing CBD and Jingsong.jpg',
      why:'Sud-est del centro: metro forte, ristoranti residenziali e prezzi inferiori a Wangfujing, Qianmen e hutong boutique.',
      commute:'Linee 10 e 14. Valutare zone più lontane solo se il risparmio supera circa 20–25 € a notte.',
      searches:['劲松站 酒店 外宾 4人','潘家园站 家庭房','十里河站 酒店 接待外宾'],
      chains:'汉庭, 海友, 如家, 全季, 桔子 Orange, 维也纳, 亚朵. La catena non garantisce: verificare la proprietà precisa.',
      amap:'北京劲松站', google:'Jinsong Station Beijing'
    }
  ];

  const lodgingSection = document.createElement('section');
  lodgingSection.className = 'section shell deep-section';
  lodgingSection.id = 'alloggi-reali';
  lodgingSection.innerHTML = `
    <div class="section-head"><div><p class="section-kicker">Prezzi reali, non Booking come unica fonte</p><h2>Dormire spendendo davvero poco.</h2></div><p class="section-intro">Le fasce sotto sono <strong>obiettivi di ricerca per quattro persone</strong> costruiti su date comparabili del 2026. Non sono promesse per novembre 2027: l’inventario completo aprirà più avanti.</p></div>
    <div class="truth-box"><h3>Il metodo corretto</h3><p>Prima si confrontano <strong>Agoda in cinese, Ctrip, Trip.com, Qunar, Meituan e Fliggy</strong>. Poi si controllano prezzo finale, quattro ospiti reali, letti, tasse, deposito, cancellazione e accettazione del passaporto. Una VPN con uscita cinese può servire soltanto come confronto: <strong>non è necessaria per prenotare e non bisogna dichiarare una residenza falsa</strong>.</p></div>
    <div class="hotel-totals"><div class="hotel-total"><strong>425–820 €</strong><span>obiettivo totale per quattro, senza notte a Macao</span></div><div class="hotel-total"><strong>106–205 €</strong><span>obiettivo a persona per circa 11 notti pagate</span></div><div class="hotel-total"><strong>+55–100 €</strong><span>solo se gli orari obbligano a dormire a Macao</span></div></div>
    <div class="deep-grid" style="margin-top:18px">${stayAreas.map(area => `
      <article class="deep-card">
        <figure class="deep-photo" data-lightbox><img loading="lazy" src="${commons(area.image)}" alt="${area.city}" onerror="this.closest('figure').classList.add('image-error')"><figcaption>${area.city}: quartieri economici collegati alla metro.</figcaption></figure>
        <div class="deep-card-body"><h3>${area.city} · ${area.nights}</h3><p><strong>${area.area}</strong></p><div class="price-band"><div><span>Fascia da cercare</span><strong>${area.target}</strong></div><div><span>Totale tappa</span><strong>${area.total}</strong></div></div><p>${area.why}</p><h4>Trasporti</h4><p>${area.commute}</p><h4>Catene e formato</h4><p>${area.chains}</p><div class="search-phrases">${area.searches.map(term => `<span class="search-phrase"><code>${term}</code><button class="copy-data" data-copy="${term}">Copia</button></span>`).join('')}</div><div class="deep-links"><a class="deep-link" href="${amap(area.amap)}" target="_blank" rel="noopener">Amap zona</a><a class="deep-link" href="${google(area.google)}" target="_blank" rel="noopener">Google confronto</a></div></div>
      </article>`).join('')}</div>
    <h3 style="margin:35px 0 8px">Piattaforme da confrontare nello stesso momento</h3><div class="platform-grid">${bookingPlatforms.map(p => `<article class="platform-card"><strong>${p.name}</strong><span>${p.note}</span><a class="deep-link" href="${p.href}" target="_blank" rel="noopener">Apri</a></article>`).join('')}</div>
    <div class="deep-grid" style="margin-top:18px"><article class="deep-card"><div class="deep-card-body"><h3>Parole che devono comparire</h3><div class="search-phrases"><span class="search-phrase"><code>接待外宾</code><button class="copy-data" data-copy="接待外宾">Copia</button></span><span class="search-phrase"><code>接待来自任何国家/地区的客人</code><button class="copy-data" data-copy="接待来自任何国家/地区的客人">Copia</button></span><span class="search-phrase"><code>四人入住</code><button class="copy-data" data-copy="四人入住">Copia</button></span><span class="search-phrase"><code>免费取消</code><button class="copy-data" data-copy="免费取消">Copia</button></span><span class="search-phrase"><code>近地铁</code><button class="copy-data" data-copy="近地铁">Copia</button></span></div><p><strong>Domanda da inviare:</strong> 我们是四名意大利游客，持意大利护照。酒店可以正常办理入住和住宿登记吗？</p><button class="copy-data" data-copy="我们是四名意大利游客，持意大利护照。酒店可以正常办理入住和住宿登记吗？">Copia il messaggio</button></div></article><article class="deep-card"><div class="deep-card-body"><h3>Segnali da scartare</h3><ul><li><strong>仅限内宾 / 仅接待中国大陆居民</strong>: solo documenti cinesi.</li><li>Prezzo per due persone mentre la ricerca mostra quattro.</li><li>Appartamento senza reception né istruzioni per la registrazione.</li><li>Deposito o pagamento su WeChat personale fuori piattaforma.</li><li>Una sola recensione, posizione vaga o costo pulizie nascosto.</li><li>“Conferma su richiesta” senza risposta scritta sull’accettazione del passaporto.</li></ul></div></article></div>
    <p class="source-note">Dal 2024 le autorità cinesi hanno vietato alle piattaforme e agli operatori di usare presunte “qualifiche per stranieri” come barriera; nella pratica conviene comunque ottenere conferma scritta perché alcune strutture economiche gestiscono male la registrazione.</p>`;
  $('#riassunto')?.insertAdjacentElement('afterend', lodgingSection);

  const points = [
    {city:'Hong Kong',name:'Tsuen Wan MTR',cn:'荃湾站',kind:'dormi',lat:22.3717,lng:114.1179,why:'Base economica con linea diretta verso Kowloon.',when:'Hotel entro 700 m.'},
    {city:'Hong Kong',name:'Tsuen Wan West',cn:'荃湾西站',kind:'dormi',lat:22.3686,lng:114.1098,why:'Alternativa con West Rail e molti appartamenti.',when:'Confrontare tempi reali.'},
    {city:'Hong Kong',name:'Sam Pei Square',cn:'三陂坊',kind:'cibo',lat:22.3705,lng:114.1164,why:'Dai pai dong e cucina cantonese quotidiana.',when:'Cena.'},
    {city:'Hong Kong',name:'Chan Choi Kee',cn:'陈财记',kind:'cibo',lat:22.3704,lng:114.1163,why:'Wok hei, pollo al sale, calamari e piatti da dividere.',when:'Cena in quattro.'},
    {city:'Hong Kong',name:'Yeung Uk Road Market',cn:'杨屋道街市',kind:'vita',lat:22.3698,lng:114.1136,why:'Mercato coperto con pesce, carni e gastronomia.',when:'Mattina/pranzo.'},
    {city:'Hong Kong',name:'Star Ferry Tsim Sha Tsui',cn:'尖沙咀天星码头',kind:'attivita',lat:22.2940,lng:114.1688,why:'Attraversamento economico con vista skyline.',when:'Tramonto.'},
    {city:'Hong Kong',name:'Mong Kok',cn:'旺角',kind:'vita',lat:22.3193,lng:114.1694,why:'Negozi, mercati e densità urbana.',when:'Pomeriggio/sera.'},
    {city:'Hong Kong',name:'Temple Street',cn:'庙街夜市',kind:'cibo',lat:22.3067,lng:114.1695,why:'Mercato serale e piccoli ristoranti.',when:'Dopo le 18.'},
    {city:'Hong Kong',name:'Dragon’s Back',cn:'龙脊',kind:'natura',lat:22.2269,lng:114.2440,why:'Sentiero costiero accessibile dalla città.',when:'Mattina asciutta.'},
    {city:'Hong Kong',name:'Sham Shui Po',cn:'深水埗',kind:'cibo',lat:22.3307,lng:114.1622,why:'Elettronica, mercati e snack locali.',when:'Tardo pomeriggio.'},
    {city:'Shenzhen',name:'Laojie Station',cn:'老街站',kind:'dormi',lat:22.5456,lng:114.1181,why:'Base più economica vicino a Dongmen.',when:'Hotel entro 600 m.'},
    {city:'Shenzhen',name:'Hubei Station',cn:'湖贝站',kind:'dormi',lat:22.5453,lng:114.1263,why:'Alternativa residenziale collegata alla metro.',when:'Confronto appartamenti.'},
    {city:'Shenzhen',name:'Dongmen Old Street',cn:'东门老街',kind:'cibo',lat:22.5450,lng:114.1190,why:'Snack, noodles, barbecue e shopping economico.',when:'Cena e sera.'},
    {city:'Shenzhen',name:'Huaqiangbei',cn:'华强北',kind:'acquisti',lat:22.5453,lng:114.0859,why:'Elettronica e componenti; confrontare più piani.',when:'Mattina feriale.'},
    {city:'Shenzhen',name:'SEG Plaza',cn:'赛格广场',kind:'acquisti',lat:22.5439,lng:114.0860,why:'Mall verticale di elettronica.',when:'Dopo Huaqiangbei.'},
    {city:'Shenzhen',name:'Shenzhen Bay Park',cn:'深圳湾公园',kind:'natura',lat:22.4863,lng:113.9506,why:'Passeggiata sulla baia e vita locale.',when:'Tramonto.'},
    {city:'Shenzhen',name:'OCT Loft',cn:'华侨城创意文化园',kind:'sera',lat:22.5407,lng:113.9918,why:'Caffè, mostre, locali e serata tranquilla.',when:'Pomeriggio/sera.'},
    {city:'Shenzhen',name:'Shekou Cruise Homeport',cn:'蛇口邮轮母港',kind:'trasporto',lat:22.4720,lng:113.9140,why:'Partenza ufficiale dei traghetti per Macao.',when:'Arrivare con margine.'},
    {city:'Macao',name:'Ruins of St. Paul’s',cn:'大三巴牌坊',kind:'attivita',lat:22.1975,lng:113.5409,why:'Icona storica e punto di partenza a piedi.',when:'Prima delle comitive.'},
    {city:'Macao',name:'Senado Square',cn:'议事亭前地',kind:'attivita',lat:22.1935,lng:113.5393,why:'Centro storico portoghese-cinese.',when:'Mattina/pomeriggio.'},
    {city:'Macao',name:'Three Lamps District',cn:'三盏灯',kind:'cibo',lat:22.2048,lng:113.5442,why:'Cucina più quotidiana e meno da resort.',when:'Pranzo.'},
    {city:'Macao',name:'Taipa Village',cn:'氹仔旧城区',kind:'cibo',lat:22.1534,lng:113.5554,why:'Egg tart, pork chop bun e vie laterali.',when:'Pomeriggio.'},
    {city:'Macao',name:'Cotai Strip',cn:'路氹金光大道',kind:'sera',lat:22.1482,lng:113.5590,why:'Resort e casinò come spettacolo architettonico.',when:'Sera, budget fissato.'},
    {city:'Xi’an',name:'Dachaishi Station',cn:'大差市站',kind:'dormi',lat:34.2580,lng:108.9620,why:'Compromesso tra prezzo, mura e metro.',when:'Hotel entro 600 m.'},
    {city:'Xi’an',name:'Longshouyuan Station',cn:'龙首原站',kind:'dormi',lat:34.2920,lng:108.9530,why:'Base residenziale più economica sulla Linea 2.',when:'Piano risparmio.'},
    {city:'Xi’an',name:'Sajinqiao',cn:'洒金桥',kind:'cibo',lat:34.2705,lng:108.9365,why:'Strada del quartiere Hui con prezzi più locali.',when:'Colazione/pranzo.'},
    {city:'Xi’an',name:'Dapiyuan',cn:'大皮院',kind:'cibo',lat:34.2640,lng:108.9430,why:'Paomo, ravioli e carni halal fuori dalla via principale.',when:'Pranzo/cena.'},
    {city:'Xi’an',name:'Xiaonanmen Morning Market',cn:'小南门早市',kind:'cibo',lat:34.2515,lng:108.9340,why:'Colazione locale, bing, zuppe e prodotti freschi.',when:'Molto presto.'},
    {city:'Xi’an',name:'Yongning Gate',cn:'西安城墙永宁门',kind:'attivita',lat:34.2490,lng:108.9470,why:'Accesso scenografico alle mura.',when:'Mattina o luci serali.'},
    {city:'Xi’an',name:'Terracotta Army',cn:'秦始皇帝陵博物院',kind:'attivita',lat:34.3840,lng:109.2730,why:'Museo principale, non copie commerciali.',when:'Apertura, giornata intera.'},
    {city:'Pechino',name:'Jinsong Station',cn:'劲松站',kind:'dormi',lat:39.8847,lng:116.4613,why:'Base sud-est con metro e ristoranti residenziali.',when:'Prima scelta hotel.'},
    {city:'Pechino',name:'Panjiayuan Station',cn:'潘家园站',kind:'dormi',lat:39.8754,lng:116.4605,why:'Hotel economici e mercato dell’antiquariato.',when:'Confronto prezzi.'},
    {city:'Pechino',name:'Forbidden City',cn:'故宫博物院',kind:'attivita',lat:39.9163,lng:116.3972,why:'Prenotazione obbligatoria da verificare.',when:'Primo slot mattutino.'},
    {city:'Pechino',name:'Jingshan Park',cn:'景山公园',kind:'natura',lat:39.9230,lng:116.3960,why:'Vista dall’alto sulla Città Proibita.',when:'Subito dopo il museo.'},
    {city:'Pechino',name:'Jinshanling Great Wall',cn:'金山岭长城',kind:'natura',lat:40.6770,lng:117.2440,why:'Muraglia panoramica e meno congestionata.',when:'Partenza 07:00–08:00.'},
    {city:'Pechino',name:'Huguosi Street',cn:'护国寺街',kind:'cibo',lat:39.9360,lng:116.3670,why:'Snack tradizionali e colazione pechinese.',when:'Mattina.'},
    {city:'Pechino',name:'Niujie',cn:'牛街',kind:'cibo',lat:39.8860,lng:116.3630,why:'Cucina halal, montone, pasticcerie e mercato.',when:'Pranzo.'},
    {city:'Pechino',name:'Guijie',cn:'簋街',kind:'sera',lat:39.9410,lng:116.4290,why:'Ristoranti aperti tardi e atmosfera serale.',when:'Cena/notte.'},
    {city:'Pechino',name:'Temple of Heaven',cn:'天坛公园',kind:'attivita',lat:39.8822,lng:116.4066,why:'Architettura e vita nei parchi.',when:'Mattina presto.'},
    {city:'Pechino',name:'Summer Palace',cn:'颐和园',kind:'natura',lat:39.9999,lng:116.2755,why:'Lago, colline e passeggiata lunga.',when:'Mezza giornata.'},
    {city:'Pechino',name:'798 Art District',cn:'798艺术区',kind:'attivita',lat:39.9840,lng:116.4970,why:'Arte contemporanea e riuso industriale.',when:'Giornata libera.'}
  ];

  const cityInfo = [
    {city:'Hong Kong',image:'Hong Kong Skyline viewed from Victoria Peak.jpg',sleep:'Tsuen Wan o Kwai Hing, non waterfront di Tsim Sha Tsui.',move:'MTR + Octopus; autobus per Dragon’s Back. Monopattini elettrici non sono il piano di trasporto.',eat:'Sam Pei Square per wok cantonese, Yeung Uk Market per vita quotidiana; Mong Kok/Temple Street solo una sera.',video:'Hong Kong Tsuen Wan local food walking tour'},
    {city:'Shenzhen',image:'Shenzhen skyline at night.jpg',sleep:'Laojie–Hubei–Guomao a Luohu.',move:'Metro per quasi tutto; DiDi diviso in quattro quando si perde troppo tempo. Biciclette condivise solo dove sicure.',eat:'Dongmen per snack e noodles; cercare dim sum pieno di famiglie al mattino; food court nei mall per scelta e prezzi chiari.',video:'Shenzhen Dongmen Huaqiangbei food tour'},
    {city:'Macao',image:'Ruins of St. Pauls Macau.jpg',sleep:'Preferibilmente nessuna notte. Se obbligatoria, Taipa residenziale o Outer Harbour.',move:'Centro storico a piedi, autobus verso Taipa/Cotai; traghetto ufficiale da/per Shekou.',eat:'Three Lamps per pranzo meno turistico; Taipa per egg tart e pork chop bun; Cotai solo la sera.',video:'Macau local food Three Lamps Taipa Cotai walk'},
    {city:'Xi’an',image:'Xian City Wall 2019.jpg',sleep:'Dachaishi/Hepingmen; Longshouyuan se il prezzo è nettamente migliore.',move:'Metro dentro la città; DiDi o trasporto ufficiale per Terracotta. Non basarsi su scooter elettrici.',eat:'Sajinqiao, Dapiyuan e Xiaonanmen Morning Market; Beiyuanmen solo per l’atmosfera.',video:'Xi’an Sajinqiao food tour Terracotta Army guide'},
    {city:'Pechino',image:'Forbidden City Beijing Shenwumen Gate.jpg',sleep:'Jinsong, Panjiayuan o Shilihe.',move:'Metro + DiDi; transfer condiviso per Jinshanling. Biciclette condivise per brevi tratti, non monopattini.',eat:'Huguosi a colazione, Niujie a pranzo, Guijie una sera; cena quotidiana nelle vie di Jinsong/Panjiayuan.',video:'Beijing Huguosi Niujie Guijie food tour Jinshanling'}
  ];

  const operationalSection = document.createElement('section');
  operationalSection.className = 'section shell deep-section';
  operationalSection.id = 'mappa-operativa';
  operationalSection.innerHTML = `
    <div class="section-head"><div><p class="section-kicker">Punti realmente utilizzabili</p><h2>Mappa operativa con sonno, cibo e attività.</h2></div><p class="section-intro">Ogni punto ha il <strong>nome cinese da incollare in Amap</strong>, il momento consigliato e un motivo concreto. La mappa precedente mostra la rotta; questa serve sul posto.</p></div>
    <div class="ops-map-wrap"><div class="ops-map-toolbar"><button class="ops-filter is-active" data-ops="all">Tutto</button><button class="ops-filter" data-ops="dormi">Dormire</button><button class="ops-filter" data-ops="cibo">Cibo</button><button class="ops-filter" data-ops="attivita">Attività</button><button class="ops-filter" data-ops="natura">Natura</button><button class="ops-filter" data-ops="acquisti">Acquisti</button><button class="ops-filter" data-ops="sera">Sera</button><button class="ops-filter" data-ops="trasporto">Trasporti</button></div><div id="ops-map"></div></div>
    <div class="city-ops" style="margin-top:20px">${cityInfo.map(info => {
      const cityPoints = points.filter(p => p.city === info.city);
      return `<article class="city-ops-card"><div class="city-ops-head"><figure class="city-ops-photo" data-lightbox><img loading="lazy" src="${commons(info.image)}" alt="${info.city}" onerror="this.closest('figure').classList.add('image-error')"></figure><div class="city-ops-copy"><h3>${info.city}</h3><p class="where">Base consigliata: ${info.sleep}</p><div class="ops-columns"><div class="ops-column"><h4>Muoversi</h4><p>${info.move}</p></div><div class="ops-column"><h4>Mangiare</h4><p>${info.eat}</p></div><div class="ops-column"><h4>Preparazione visuale</h4><a class="deep-link video-link" href="${youtube(info.video)}" target="_blank" rel="noopener">Video reference</a></div></div></div></div><div class="point-list">${cityPoints.map(p => `<article class="point-card"><div class="point-top"><h4>${p.name}<br><small>${p.cn}</small></h4><span class="point-kind">${p.kind}</span></div><p>${p.why}</p><p><strong>Quando:</strong> ${p.when}</p><div class="deep-links"><a class="deep-link" href="${amap(p.cn)}" target="_blank" rel="noopener">Amap</a><a class="deep-link" href="${google(`${p.name} ${p.city}`)}" target="_blank" rel="noopener">Google</a><button class="copy-data" data-copy="${p.cn}">Copia nome</button></div></article>`).join('')}</div></article>`;
    }).join('')}</div>`;
  $('#mappa')?.insertAdjacentElement('afterend', operationalSection);

  if (window.L && $('#ops-map')) {
    const color = {dormi:'#2f7d65',cibo:'#d18127',attivita:'#7b4ba5',natura:'#3f69a8',acquisti:'#981c22',sera:'#29202e',trasporto:'#6c625c',vita:'#c39136'};
    const map = L.map('ops-map', {scrollWheelZoom:false});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:18, attribution:'&copy; OpenStreetMap'}).addTo(map);
    const markers = points.map((p, index) => {
      const marker = L.marker([p.lat,p.lng], {icon:L.divIcon({className:'',html:`<span class="ops-marker" style="background:${color[p.kind] || '#6c625c'}">${index+1}</span>`,iconSize:[25,25],iconAnchor:[12,12]})});
      marker.bindPopup(`<strong>${p.name}</strong><br>${p.cn}<br>${p.why}<br><a href="${amap(p.cn)}" target="_blank" rel="noopener">Apri in Amap</a>`).addTo(map);
      marker.opsKind = p.kind;
      return marker;
    });
    const bounds = L.latLngBounds(points.map(p => [p.lat,p.lng]));
    map.fitBounds(bounds.pad(.04));
    $$('[data-ops]').forEach(button => button.addEventListener('click', () => {
      const selected = button.dataset.ops;
      $$('[data-ops]').forEach(b => b.classList.remove('is-active'));
      button.classList.add('is-active');
      markers.forEach(marker => {
        const show = selected === 'all' || marker.opsKind === selected;
        if (show && !map.hasLayer(marker)) marker.addTo(map);
        if (!show && map.hasLayer(marker)) map.removeLayer(marker);
      });
    }));
  }

  const foods = [
    {city:'Hong Kong',name:'Pineapple bun + milk tea',cn:'菠萝油 + 港式奶茶',image:'Pineapple bun and milk tea.jpg',contains:'Pane dolce con crosta di zucchero; spesso burro. Il nome non indica ananas. Tè nero, latte evaporato/condensato e zucchero.',how:'Crosta biscotto sul panino, cotto e servito caldo con una fetta di burro.',where:'Cha chaan teng di Tsuen Wan; perfetto a colazione o merenda.',tags:['glutine','latte','dolce']},
    {city:'Hong Kong',name:'Char siu e roast meats',cn:'叉烧 / 烧味',image:'Soy sauce chicken, siu yuk and char siu in Hong Kong - 20130614.jpg',contains:'Maiale marinato con soia, zucchero/miele o maltosio, spezie e talvolta colorante; riso e verdure a lato.',how:'Carne marinata, arrostita e glassata più volte.',where:'Roast-meat shop pieno all’ora di pranzo; ordinare piatto condiviso.',tags:['maiale','soia','dolce-salato']},
    {city:'Shenzhen',name:'Changfen',cn:'肠粉',image:'Rice noodle roll with shrimp.jpg',contains:'Sfoglia di riso al vapore con gamberi, manzo o maiale; salsa di soia dolce. Spesso cipollotto e talvolta coriandolo.',how:'Pastella di riso stesa sottile, cotta al vapore, arrotolata e condita.',where:'Colazione a Luohu/Dongmen o ristorante dim sum.',tags:['riso','soia','possibile gambero']},
    {city:'Shenzhen',name:'Claypot rice',cn:'煲仔饭',image:'Claypot rice.jpg',contains:'Riso, salsa di soia, salsiccia/carne conservata, pollo o costine; verdura quasi sempre presente.',how:'Riso cotto direttamente nella pentola d’argilla fino alla crosta croccante.',where:'Cena semplice a Dongmen o nelle vie residenziali di Luohu.',tags:['riso','carne','verdure']},
    {city:'Macao',name:'Portuguese egg tart',cn:'葡式蛋挞',image:'Portuguese egg tart in Macau.jpg',contains:'Pasta sfoglia, uova, zucchero, latte o panna. Superficie caramellata.',how:'Crema all’uovo cotta ad alta temperatura dentro la sfoglia.',where:'Taipa Village; caldo, a metà pomeriggio.',tags:['uova','latte','glutine']},
    {city:'Macao',name:'Pork chop bun',cn:'猪扒包',image:'PorkChopBun.jpg',contains:'Panino croccante e braciola di maiale, spesso con osso, aglio, pepe e salsa di soia.',how:'Braciola marinata e fritta o grigliata, inserita nel pane senza molte salse.',where:'Taipa, pranzo o snack; controllare l’osso prima di mordere.',tags:['maiale','glutine','possibile osso']},
    {city:'Xi’an',name:'Roujiamo',cn:'肉夹馍',image:'Roujiamo.jpg',contains:'Pane piatto e carne tritata/stufata. Versione classica spesso maiale; nel quartiere Hui cercare manzo o agnello halal.',how:'Carne brasata a lungo con spezie, tagliata e messa nel pane tostato.',where:'Sajinqiao o Xiaonanmen a colazione/pranzo.',tags:['glutine','carne','chiedere tipo']},
    {city:'Xi’an',name:'Biangbiang noodles',cn:'油泼𰻝𰻝面',image:'Biangbiang noodles.jpg',contains:'Larghi noodles di grano, olio caldo, peperoncino, aceto, aglio; spesso verdure, germogli o carne.',how:'Nastro di pasta tirato a mano, condito e “scottato” con olio bollente.',where:'Dapiyuan/Sajinqiao; pranzo. Chiedere senza verdure prima della preparazione.',tags:['glutine','aglio','piccante']},
    {city:'Xi’an',name:'Yangrou paomo',cn:'羊肉泡馍',image:'Yangrou Paomo.JPG',contains:'Brodo di agnello, pane spezzato, carne; spesso vermicelli, cipollotto, coriandolo e aglio in salamoia.',how:'Il cliente spezza il pane, poi la cucina lo finisce nel brodo.',where:'Dapiyuan o Beiguangji Street; pranzo lento.',tags:['agnello','glutine','coriandolo']},
    {city:'Pechino',name:'Jianbing',cn:'煎饼',image:'Jianbing.jpg',contains:'Crêpe di cereali, uovo, cracker fritto, salsa dolce/salata, cipollotto e coriandolo.',how:'Pastella stesa sulla piastra, uovo e aromi, cracker al centro, piegata al momento.',where:'Bancarella mattutina vicino all’hotel; chiedere 不要香菜 e 不要葱.',tags:['uova','glutine','coriandolo']},
    {city:'Pechino',name:'Zhajiangmian',cn:'炸酱面',image:'Zhajiangmia.jpg',contains:'Noodles di grano, salsa fermentata di soia con maiale, verdure crude tagliate fini.',how:'Salsa densa cotta separatamente e mescolata ai noodles.',where:'Pranzo a Huguosi/Xisi o in ristorante residenziale.',tags:['glutine','soia','maiale','verdure crude']},
    {city:'Pechino',name:'Peking duck',cn:'北京烤鸭',image:'Peking duck.jpg',contains:'Anatra, pancake sottili, salsa dolce di fagioli, cetriolo e cipollotto.',how:'Anatra asciugata e arrostita finché la pelle diventa croccante, poi affettata al tavolo.',where:'Una sola cena condivisa; prenotare un ristorante con prezzi visibili.',tags:['anatra','glutine','soia']}
  ];

  const foodSection = document.createElement('section');
  foodSection.className = 'section shell deep-section';
  foodSection.id = 'cibo-dettagliato';
  foodSection.innerHTML = `<div class="section-head"><div><p class="section-kicker">Sapere cosa arriva nel piatto</p><h2>Cibo: ingredienti, preparazione, luogo e momento.</h2></div><p class="section-intro">Non è una lista di nomi famosi: ogni scheda spiega <strong>cosa contiene davvero</strong>, come viene preparato e dove inserirlo nell’itinerario.</p></div><div class="food-grid-pro">${foods.map(food => `<article class="food-pro"><figure data-lightbox><img loading="lazy" src="${commons(food.image, 900)}" alt="${food.name}" onerror="this.closest('figure').classList.add('image-error')"></figure><div class="food-pro-body"><h3>${food.name}<br><small>${food.cn}</small></h3><div class="food-meta">${food.tags.map(tag => `<span>${tag}</span>`).join('')}</div><strong class="label">Cosa contiene</strong><p>${food.contains}</p><strong class="label">Come si prepara</strong><p>${food.how}</p><strong class="label">Dove e quando</strong><p>${food.where}</p><div class="deep-links"><a class="deep-link" href="${amap(`${food.city} ${food.cn}`)}" target="_blank" rel="noopener">Cerca su Amap</a><a class="deep-link video-link" href="${youtube(`${food.name} recipe street food China`)}" target="_blank" rel="noopener">Ricetta/video</a></div></div></article>`).join('')}</div><div class="warning-line"><strong>Per evitare verdure e coriandolo:</strong> mostrare 不要蔬菜，不要香菜，也不要葱。 (“Niente verdure, coriandolo né cipollotto”). Brodi, ripieni e salse possono però essere già preparati.</div>`;
  $('#cibo')?.insertAdjacentElement('afterend', foodSection);

  const connectivitySection = document.createElement('section');
  connectivitySection.className = 'section shell deep-section';
  connectivitySection.id = 'telefono-cina';
  connectivitySection.innerHTML = `
    <div class="section-head"><div><p class="section-kicker">Telefono operativo anche senza eSIM</p><h2>SIM fisica, mappe offline e app.</h2></div><p class="section-intro">Il piano più robusto è avere <strong>un numero cinese locale</strong> per chiamate, hotel e mini-app, più roaming/eSIM internazionale quando disponibile per i servizi occidentali.</p></div>
    <div class="connect-grid"><article class="connect-card"><h3>SIM fisica cinese</h3><ol><li>Andare in una filiale ufficiale di <strong>China Mobile, China Unicom o China Telecom</strong> con passaporto.</li><li>Chiedere un piano dati senza contratto lungo: <code>我要办理一张手机卡，主要需要流量。</code></li><li>Controllare APN, chiamata e SMS prima di uscire.</li><li>Salvare il numero: serve per DiDi, contatti hotel e alcune mini-app.</li><li>Verificare le bande del telefono; non comprare SIM anonime da venditori casuali.</li></ol><div class="deep-links"><a class="deep-link" href="${amap('中国联通营业厅 深圳罗湖')}" target="_blank" rel="noopener">Unicom a Shenzhen</a><a class="deep-link" href="${amap('中国移动营业厅 深圳罗湖')}" target="_blank" rel="noopener">China Mobile</a><button class="copy-data" data-copy="外国护照可以办理手机卡吗？我要一个主要用于流量的短期套餐。">Copia richiesta</button></div></article><article class="connect-card"><h3>Amap offline</h3><ol><li>Installare 高德地图/Amap prima del viaggio.</li><li>Nell’app cercare <strong>离线地图</strong> e scaricare Shenzhen, Xi’an e Beijing su Wi‑Fi.</li><li>Salvare hotel, stazioni e attrazioni nei preferiti usando i nomi cinesi della mappa.</li><li>Fare screenshot di indirizzo, telefono e facciata dell’hotel.</li><li>Google Maps offline resta solo un backup: senza rete non offre trasporto pubblico e nel continente è meno utile di Amap.</li></ol><div class="deep-links"><a class="deep-link" href="https://mobile.amap.com/" target="_blank" rel="noopener">Download Amap</a><a class="deep-link" href="https://www.amap.com/" target="_blank" rel="noopener">Amap web</a><button class="copy-data" data-copy="离线地图">Copia “mappe offline”</button></div></article><article class="connect-card"><h3>Accesso a Internet</h3><ul><li><strong>Roaming o eSIM che instrada fuori dalla Cina</strong>: spesso mantiene accessibili i servizi occidentali senza configurazioni extra.</li><li><strong>SIM fisica cinese</strong>: fornisce numero locale e rete domestica; alcuni servizi esteri possono non essere raggiungibili.</li><li>Una VPN con uscita cinese non serve normalmente per vedere prezzi domestici: prima cambiare lingua, valuta CNY, app e account.</li><li>Non basare pagamenti o prenotazioni su VPN sconosciute; cambi di IP improvvisi possono attivare controlli antifrode.</li></ul></article><article class="connect-card"><h3>Pacchetto app da preparare</h3><ul><li><strong>Alipay</strong>: carta internazionale, pagamento e mini-app.</li><li><strong>WeChat</strong>: messaggi, QR e contatti hotel.</li><li><strong>Amap</strong>: navigazione e punti cinesi.</li><li><strong>DiDi</strong>: auto; controllare targa e destinazione.</li><li><strong>12306</strong>: treni; caricare i quattro passaporti e verificare l’account con anticipo.</li><li><strong>Ctrip/Trip.com + Agoda</strong>: prenotazioni e confronto.</li><li><strong>Pleco o traduttore offline</strong>: testo cinese e pronuncia.</li></ul><div class="deep-links"><a class="deep-link" href="https://www.12306.cn/en/index.html" target="_blank" rel="noopener">12306</a><a class="deep-link" href="https://www.wechat.com/" target="_blank" rel="noopener">WeChat</a><a class="deep-link" href="https://www.alipay.com/" target="_blank" rel="noopener">Alipay</a></div></article></div>`;
  $('#pratico')?.insertAdjacentElement('beforebegin', connectivitySection);

  const alternatives = [
    {name:'Zhangjiajie — le montagne “Avatar”',image:'Avatar World 37845-Zhangjiajie (49046811673).jpg',days:'Minimo 3 giorni / 2–3 notti',replace:'Sostituisce Macao e almeno un giorno tra Shenzhen e Pechino.',plan:'Volo Shenzhen → Zhangjiajie; Wulingyuan/Yuanjiajie + Tianzi Mountain; Tianmen Mountain è un’area separata. Poi volo o treno lungo verso Xi’an.',pros:'Paesaggio più unico del viaggio; novembre porta meno folla e possibili mari di nuvole.',cons:'Nebbia può coprire completamente i pilastri; molte navette, ascensori e code. Non inserirla come gita di un giorno.',official:'https://www.cn-zhangjiajie.com/',video:'Zhangjiajie Wulingyuan Yuanjiajie Tianzi Mountain November guide'},
    {name:'Yangshuo e Xingping',image:'Yangshuo-Li-River-2019-Luka-Peternel.jpg',days:'2–3 notti',replace:'Sostituisce Macao e una notte a Shenzhen.',plan:'Treno da Shenzhen/Guangzhou verso Yangshuo; base Xingping per il Li River e Yangshuo/Yulong per bici e campagna.',pros:'Natura facilmente combinabile con il sud e meno voli rispetto a Zhangjiajie.',cons:'Centro di Yangshuo e West Street possono essere molto turistici; scegliere paesi e strade rurali.',official:'https://www.chinahighlights.com/guilin/yangshuo/',video:'Yangshuo Xingping Yulong River cycling local villages'},
    {name:'Guangzhou + Foshan',image:'Lion dance in Foshang.jpg',days:'1–2 giorni',replace:'Sostituisce una giornata libera di Shenzhen, senza cambiare il resto.',plan:'Treno Shenzhen → Guangzhou; Liwan/Shamian/Yongqing Fang e gita metro a Foshan Ancestral Temple per lion dance.',pros:'La variante più semplice, economica e forte sul cibo cantonese.',cons:'Aggiunge un’altra grande città; meno spettacolare sul piano naturale.',official:'https://www.travelchina.org.cn/en/',video:'Guangzhou Foshan dim sum lion dance local food'},
    {name:'Shanghai',image:'Shanghai Skyline 2025.jpg',days:'3 notti',replace:'Sostituisce Macao e parte di Shenzhen o Pechino.',plan:'Volo interno oppure open-jaw; Bund, French Concession, mercati e quartieri moderni.',pros:'Icona urbana molto diversa da Pechino e ottima per fotografia notturna.',cons:'Più costo e trasferimenti; con Hong Kong e Shenzhen il viaggio è già molto urbano.',official:'https://www.meet-in-shanghai.net/',video:'Shanghai local neighborhoods food metro travel guide'},
    {name:'Sanya / Hainan',image:'Sanya bay sea beach.JPG',days:'3 notti',replace:'Sostituisce Macao e Shenzhen extra.',plan:'Volo verso Sanya, base fuori dai resort più cari, spiaggia e una giornata naturale.',pros:'Mare tropicale e pausa vera.',cons:'Volo, resort e meteo; offre meno contrasto culturale rispetto a Xi’an/Pechino.',official:'https://www.travelchina.org.cn/en/',video:'Sanya Hainan budget local beach food guide'},
    {name:'Dapeng Peninsula',image:'Dapeng Fortress.jpg',days:'1 giorno',replace:'Sostituisce Shenzhen Bay/OCT Loft, senza cambiare hotel.',plan:'DiDi/bus da Shenzhen verso Dapeng Fortress e Jiaochangwei; rientro la sera.',pros:'Costa, fortezza e villaggio senza volo.',cons:'Trasporto lungo; a novembre il mare è più panorama che balneazione.',official:'https://www.sz.gov.cn/en_szgov/',video:'Dapeng Fortress Jiaochangwei Shenzhen day trip'}
  ];
  const altRoot = $('#alternative');
  if (altRoot) {
    altRoot.querySelector('.section-head').innerHTML = '<div><p class="section-kicker">Scambi reali, non aggiunte impossibili</p><h2>Alternative spiegate con giorni e sacrifici.</h2></div><p class="section-intro">Ogni variante indica <strong>cosa deve uscire</strong> dal percorso di 14 giorni. Zhangjiajie è l’opzione “Avatar”; Yangshuo è la natura più facile da combinare.</p>';
    const existing = $('#alternatives');
    if (existing) {
      existing.className = 'alt-pro-grid';
      existing.innerHTML = alternatives.map(alt => `<article class="alt-pro"><figure data-lightbox><img loading="lazy" src="${commons(alt.image)}" alt="${alt.name}" onerror="this.closest('figure').classList.add('image-error')"></figure><div class="alt-pro-body"><h3>${alt.name}</h3><p><strong>Tempo:</strong> ${alt.days}</p><div class="swap-plan"><strong>Scambio:</strong> ${alt.replace}</div><h4>Piano</h4><p>${alt.plan}</p><h4>Perché sì</h4><p>${alt.pros}</p><h4>Perché no</h4><p>${alt.cons}</p><div class="deep-links"><a class="deep-link" href="${alt.official}" target="_blank" rel="noopener">Reference</a><a class="deep-link video-link" href="${youtube(alt.video)}" target="_blank" rel="noopener">Video</a></div></div></article>`).join('');
    }
  }

  const newBudgets = {
    low:{label:'Scenario tirato',total:'1.290 €',description:'Alloggi domestici verificati, voli in offerta, un solo bagaglio e cibo locale.',rows:{'Voli internazionali':'570 €','Alloggi':'140 €','Volo interno + treno':'250 €','Metro, ferry e DiDi':'75 €','Cibo':'175 €','Ingressi e attività':'45 €','SIM, assicurazione e margine':'35 €'}},
    mid:{label:'Scenario realistico',total:'1.570 €',description:'Prezzi domestici senza inseguire annunci rischiosi, trasporti comodi e attività principali.',rows:{'Voli internazionali':'650 €','Alloggi':'190 €','Volo interno + treno':'300 €','Metro, ferry e DiDi':'95 €','Cibo':'230 €','Ingressi e attività':'70 €','SIM, assicurazione e margine':'35 €'}},
    high:{label:'Scenario comodo',total:'1.960 €',description:'Orari migliori, camere più semplici da confermare, più DiDi e margine reale.',rows:{'Voli internazionali':'760 €','Alloggi':'280 €','Volo interno + treno':'370 €','Metro, ferry e DiDi':'125 €','Cibo':'285 €','Ingressi e attività':'95 €','SIM, assicurazione e margine':'45 €'}}
  };
  const renderNewBudget = (key) => {
    const budget = newBudgets[key];
    $('#budget-label').textContent = budget.label;
    $('#budget-total').textContent = budget.total;
    $('#budget-description').textContent = budget.description;
    $('#budget-table').innerHTML = '<thead><tr><th>Voce</th><th>Stima a persona</th></tr></thead><tbody>' + Object.entries(budget.rows).map(([name,value]) => `<tr><td>${name}</td><td>${value}</td></tr>`).join('') + '</tbody>';
  };
  const oldTabs = $('.budget-tabs');
  if (oldTabs) {
    const freshTabs = oldTabs.cloneNode(true);
    oldTabs.replaceWith(freshTabs);
    $$('[data-budget]', freshTabs).forEach(button => button.addEventListener('click', () => {
      $$('[data-budget]', freshTabs).forEach(b => b.classList.remove('is-active'));
      button.classList.add('is-active');
      renderNewBudget(button.dataset.budget);
    }));
    renderNewBudget('mid');
  }

  const sources = $('#fonti .sources');
  if (sources) {
    sources.classList.add('detail-source-list');
    sources.insertAdjacentHTML('beforeend', `
      <li><a href="https://english.www.gov.cn/news/202407/26/content_WS66a2d827c6d0868f4e8e975c.html" target="_blank" rel="noopener">Regole ufficiali: strutture e piattaforme non devono rifiutare gli stranieri per presunte qualifiche</a></li>
      <li><a href="https://ct.ctrip.com/faqs/1002" target="_blank" rel="noopener">Ctrip: significato di 内宾 / 中宾 / 外宾</a></li>
      <li><a href="https://fdi.mofcom.gov.cn/EN/come-newzonghe.html?Liindex=1&comeID=4&name=Foreign+Nationals+in+China&parentId=132" target="_blank" rel="noopener">Guida governativa 2025: acquisto SIM con passaporto</a></li>
      <li><a href="https://developer.amap.com/api/android-sdk/guide/create-map/offline-map" target="_blank" rel="noopener">Amap: mappe offline</a></li>
      <li><a href="https://www.macaotourism.gov.mo/en/travelessential/before-you-travel/travelling-to-macao" target="_blank" rel="noopener">Macao Tourism: collegamenti ufficiali da Shenzhen/Hong Kong</a></li>
      <li><a href="https://english.beijing.gov.cn/consuminginbeijing/onedayinbeijing/abiteofbeijing/updatesofabiteofbeijing/202508/t20250803_4165167.html" target="_blank" rel="noopener">Beijing: Huguosi e marchi storici</a></li>
      <li><a href="https://www.discoverhongkong.com/eng/place-to-go/travel.guide-chan-choi-kee.html" target="_blank" rel="noopener">Hong Kong Tourism Board: Chan Choi Kee, Tsuen Wan</a></li>
      <li><a href="https://en.xa.gov.cn/CultureTravel/Attractions/1691691506530373634.html" target="_blank" rel="noopener">Xi’an: museo dell’Esercito di Terracotta</a></li>`);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-copy]');
    if (button) copy(button.dataset.copy);
  });

  const dialog = $('#lightbox');
  const dialogImg = dialog?.querySelector('img');
  $$('[data-lightbox]').forEach(figure => {
    if (figure.dataset.deepLightbox === '1') return;
    figure.dataset.deepLightbox = '1';
    figure.addEventListener('click', () => {
      const img = figure.querySelector('img');
      if (!dialog || !dialogImg || !img || figure.classList.contains('image-error')) return;
      dialogImg.src = img.src;
      dialogImg.alt = img.alt;
      if (!dialog.open) dialog.showModal();
    });
  });
})();
