(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const store = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  };
  const esc = (value = '') => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const amap = keyword => `https://uri.amap.com/search?keyword=${encodeURIComponent(keyword)}&src=swadyaspace&callnative=1`;
  const google = (lat, lng, name) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng} ${name}`)}`;
  const translate = text => `https://translate.google.com/?sl=it&tl=zh-CN&op=translate&text=${encodeURIComponent(text)}`;
  const commons = filename => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1200`;
  const formatEuro = value => new Intl.NumberFormat('it-IT', {style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number(value) || 0);

  const IMG = {
    hk: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hong%20Kong%20Skyline%20viewed%20from%20Victoria%20Peak.jpg?width=1600',
    hkNight: 'https://commons.wikimedia.org/wiki/Special:FilePath/Skyline%20-%20Hong%20Kong%2C%20China.jpg?width=1400',
    shenzhen: 'https://commons.wikimedia.org/wiki/Special:FilePath/A%20spectacular%20view%20of%20Shenzhen%20Skyline.jpg?width=1400',
    hqb: 'https://commons.wikimedia.org/wiki/Special:FilePath/Huaqiangbei.jpg?width=1400',
    macao: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ruins%20of%20St%20Paul%27s%2C%20Macau%20%2830843847251%29.jpg?width=1400',
    terracotta: 'https://commons.wikimedia.org/wiki/Special:FilePath/Terracotta%20Army%2C%20View%20of%20Pit%201.jpg?width=1400',
    wall: 'https://commons.wikimedia.org/wiki/Special:FilePath/The%20Great%20Wall%20of%20China%20at%20Jinshanling-edit.jpg?width=1400',
    xian: commons("Xi'an city walls.jpg"),
    beijing: commons('Forbidden City Beijing China.jpg'),
    summer: commons('Summer Palace, Beijing, China.jpg'),
    avatar: commons('Zhangjiajie National Forest Park, China.jpg'),
    yangshuo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Yangshuo-Li-River-2019-Luka-Peternel.jpg?width=1400',
    shanghai: commons('Shanghai skyline from the bund.jpg'),
    sanya: commons('Sanya Bay Hainan China.jpg'),
    fallback: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hong%20Kong%20Skyline%20viewed%20from%20Victoria%20Peak.jpg?width=1200'
  };

  const cities = ['Tutte','Hong Kong','Shenzhen','Macao','Xi’an','Pechino'];
  const categories = ['Tutte','Dormire','Cibo','Attività','Natura','Acquisti','Sera','Trasporto','Utilità'];

  const foods = [
    {id:'pineapple-bun',city:'Hong Kong',name:'Pineapple bun + milk tea',cn:'菠萝油和港式奶茶',image:commons('Pineapple bun with butter.jpg'),fallback:IMG.hkNight,contains:'Panino dolce con crosta di zucchero e spesso una fetta di burro. Il nome non significa che contenga ananas. Il tè usa tè nero, latte evaporato o condensato e zucchero.',how:'Il panino viene cotto con una crosta simile a un biscotto; il burro si scioglie quando viene servito caldo.',where:'Cha chaan teng di Tsuen Wan, colazione o merenda.',tags:['glutine','latte','dolce']},
    {id:'char-siu',city:'Hong Kong',name:'Char siu e roast meats',cn:'叉烧和烧味',image:commons('Soy sauce chicken, siu yuk and char siu in Hong Kong - 20130614.jpg'),fallback:IMG.hk,contains:'Maiale marinato con soia, zucchero o miele, spezie e talvolta colorante; spesso arriva con riso e verdure.',how:'La carne viene marinata, arrostita e glassata più volte.',where:'Roast-meat shop pieno a pranzo; ordinare piatti da dividere.',tags:['maiale','soia','dolce-salato']},
    {id:'changfen',city:'Shenzhen',name:'Changfen',cn:'肠粉',image:commons('Rice noodle roll with shrimp.jpg'),fallback:IMG.hqb,contains:'Sfoglia di riso al vapore con gamberi, manzo o maiale; salsa di soia dolce. Possibili cipollotto e coriandolo.',how:'Pastella di riso stesa sottile, cotta al vapore, arrotolata e condita.',where:'Colazione a Luohu/Dongmen o ristorante dim sum.',tags:['riso','soia','possibile gambero']},
    {id:'claypot',city:'Shenzhen',name:'Claypot rice',cn:'煲仔饭',image:commons('Claypot rice.jpg'),fallback:IMG.shenzhen,contains:'Riso, salsa di soia, salsiccia o carne conservata, pollo o costine; verdura spesso presente.',how:'Il riso cuoce direttamente nella pentola d’argilla fino a creare una crosta croccante.',where:'Cena semplice a Dongmen o nelle vie residenziali di Luohu.',tags:['riso','carne','verdure']},
    {id:'egg-tart',city:'Macao',name:'Portuguese egg tart',cn:'葡式蛋挞',image:commons('Portuguese egg tart in Macau.jpg'),fallback:IMG.macao,contains:'Pasta sfoglia, uova, zucchero, latte o panna.',how:'Crema all’uovo cotta ad alta temperatura fino alla superficie caramellata.',where:'Taipa Village, caldo a metà pomeriggio.',tags:['uova','latte','glutine']},
    {id:'pork-bun',city:'Macao',name:'Pork chop bun',cn:'猪扒包',image:commons('PorkChopBun.jpg'),fallback:IMG.macao,contains:'Panino croccante e braciola di maiale, spesso con osso, aglio, pepe e salsa di soia.',how:'La braciola viene marinata e fritta o grigliata, poi inserita nel pane.',where:'Taipa, pranzo o snack. Controllare l’osso prima di mordere.',tags:['maiale','glutine','possibile osso']},
    {id:'roujiamo',city:'Xi’an',name:'Roujiamo',cn:'肉夹馍',image:commons('Roujiamo.jpg'),fallback:IMG.terracotta,contains:'Pane piatto e carne tritata o stufata. La versione classica può essere di maiale; nel quartiere Hui si trova manzo o agnello halal.',how:'Carne brasata a lungo con spezie, poi tagliata e inserita nel pane tostato.',where:'Sajinqiao o Xiaonanmen, colazione o pranzo.',tags:['glutine','carne','chiedere il tipo']},
    {id:'biangbiang',city:'Xi’an',name:'Biangbiang noodles',cn:'油泼𰻝𰻝面',image:commons('Biangbiang noodles.jpg'),fallback:IMG.xian,contains:'Larghi noodles di grano, olio caldo, peperoncino, aceto e aglio; spesso verdure, germogli o carne.',how:'Nastro di pasta tirato a mano, condito e scottato con olio bollente.',where:'Dapiyuan o Sajinqiao a pranzo. Chiedere senza verdure prima della preparazione.',tags:['glutine','aglio','piccante']},
    {id:'paomo',city:'Xi’an',name:'Yangrou paomo',cn:'羊肉泡馍',image:commons('Yangrou Paomo.JPG'),fallback:IMG.terracotta,contains:'Brodo di agnello, pane spezzato e carne; spesso vermicelli, cipollotto, coriandolo e aglio in salamoia.',how:'Il cliente spezza il pane, poi la cucina lo finisce nel brodo.',where:'Dapiyuan o Beiguangji Street, pranzo lento.',tags:['agnello','glutine','coriandolo']},
    {id:'jianbing',city:'Pechino',name:'Jianbing',cn:'煎饼',image:commons('Jianbing.jpg'),fallback:IMG.beijing,contains:'Crêpe di cereali, uovo, cracker fritto, salsa, cipollotto e coriandolo.',how:'Pastella stesa sulla piastra, uovo e aromi, cracker al centro, poi piegata.',where:'Bancarella mattutina vicino all’hotel.',tags:['uova','glutine','coriandolo']},
    {id:'zhajiangmian',city:'Pechino',name:'Zhajiangmian',cn:'炸酱面',image:commons('Zhajiangmian.jpg'),fallback:IMG.beijing,contains:'Noodles di grano, salsa fermentata di soia con maiale e verdure crude tagliate fini.',how:'La salsa densa viene cotta separatamente e mescolata ai noodles.',where:'Pranzo a Huguosi, Xisi o in un ristorante residenziale.',tags:['glutine','soia','maiale','verdure crude']},
    {id:'duck',city:'Pechino',name:'Anatra alla pechinese',cn:'北京烤鸭',image:commons('Peking duck.jpg'),fallback:IMG.wall,contains:'Anatra, pancake sottili, salsa dolce di fagioli, cetriolo e cipollotto.',how:'Anatra asciugata e arrostita finché la pelle diventa croccante, poi affettata al tavolo.',where:'Una cena condivisa, con menu e prezzo visibili.',tags:['anatra','glutine','soia']}
  ];

  const places = [
    {city:'Hong Kong',name:'Tsuen Wan MTR',cn:'荃湾站',category:'Dormire',lat:22.3717,lng:114.1179,why:'Base economica collegata a Kowloon.',when:'Hotel entro 700 metri.'},
    {city:'Hong Kong',name:'Sam Pei Square',cn:'三陂坊',category:'Cibo',lat:22.3705,lng:114.1164,why:'Dai pai dong e cucina cantonese quotidiana.',when:'Cena.'},
    {city:'Hong Kong',name:'Yeung Uk Road Market',cn:'杨屋道街市',category:'Cibo',lat:22.3698,lng:114.1136,why:'Mercato coperto con gastronomia e vita locale.',when:'Mattina o pranzo.'},
    {city:'Hong Kong',name:'Star Ferry Tsim Sha Tsui',cn:'尖沙咀天星码头',category:'Attività',lat:22.2940,lng:114.1688,why:'Attraversamento economico con skyline.',when:'Tramonto.'},
    {city:'Hong Kong',name:'Mong Kok',cn:'旺角',category:'Acquisti',lat:22.3193,lng:114.1694,why:'Negozi, mercati e densità urbana.',when:'Pomeriggio o sera.'},
    {city:'Hong Kong',name:'Temple Street',cn:'庙街夜市',category:'Sera',lat:22.3067,lng:114.1695,why:'Mercato serale e piccoli ristoranti.',when:'Dopo le 18.'},
    {city:'Hong Kong',name:'Dragon’s Back',cn:'龙脊',category:'Natura',lat:22.2269,lng:114.2440,why:'Sentiero costiero accessibile dalla città.',when:'Mattina asciutta.'},
    {city:'Hong Kong',name:'Sham Shui Po',cn:'深水埗',category:'Acquisti',lat:22.3307,lng:114.1622,why:'Elettronica, mercati e snack locali.',when:'Tardo pomeriggio.'},
    {city:'Shenzhen',name:'Laojie Station',cn:'老街站',category:'Dormire',lat:22.5456,lng:114.1181,why:'Base economica vicino a Dongmen.',when:'Hotel entro 600 metri.'},
    {city:'Shenzhen',name:'Dongmen Old Street',cn:'东门老街',category:'Cibo',lat:22.5450,lng:114.1190,why:'Snack, noodles, barbecue e shopping.',when:'Cena e sera.'},
    {city:'Shenzhen',name:'Huaqiangbei',cn:'华强北',category:'Acquisti',lat:22.5453,lng:114.0859,why:'Elettronica e componenti; confrontare più venditori.',when:'Mattina feriale.'},
    {city:'Shenzhen',name:'SEG Plaza',cn:'赛格广场',category:'Acquisti',lat:22.5439,lng:114.0860,why:'Mall verticale di elettronica.',when:'Dopo Huaqiangbei.'},
    {city:'Shenzhen',name:'Shenzhen Bay Park',cn:'深圳湾公园',category:'Natura',lat:22.4863,lng:113.9506,why:'Passeggiata sulla baia e vita locale.',when:'Tramonto.'},
    {city:'Shenzhen',name:'OCT Loft',cn:'华侨城创意文化园',category:'Sera',lat:22.5407,lng:113.9918,why:'Caffè, mostre e locali tranquilli.',when:'Pomeriggio o sera.'},
    {city:'Shenzhen',name:'Shekou Cruise Homeport',cn:'蛇口邮轮母港',category:'Trasporto',lat:22.4720,lng:113.9140,why:'Terminal dei traghetti per Macao.',when:'Arrivare con margine.'},
    {city:'Shenzhen',name:'China Unicom Luohu',cn:'中国联通营业厅 罗湖',category:'Utilità',lat:22.5481,lng:114.1188,why:'Filiale da cercare per SIM fisica con passaporto.',when:'Primo giorno in continente.'},
    {city:'Macao',name:'Ruins of St. Paul’s',cn:'大三巴牌坊',category:'Attività',lat:22.1975,lng:113.5409,why:'Icona storica e punto di partenza a piedi.',when:'Prima delle comitive.'},
    {city:'Macao',name:'Senado Square',cn:'议事亭前地',category:'Attività',lat:22.1935,lng:113.5393,why:'Centro storico portoghese-cinese.',when:'Mattina o pomeriggio.'},
    {city:'Macao',name:'Three Lamps District',cn:'三盏灯',category:'Cibo',lat:22.2048,lng:113.5442,why:'Cucina più quotidiana e meno da resort.',when:'Pranzo.'},
    {city:'Macao',name:'Taipa Village',cn:'氹仔旧城区',category:'Cibo',lat:22.1534,lng:113.5554,why:'Egg tart, pork chop bun e vie laterali.',when:'Pomeriggio.'},
    {city:'Macao',name:'Cotai Strip',cn:'路氹金光大道',category:'Sera',lat:22.1482,lng:113.5590,why:'Resort e casinò come spettacolo, con budget fissato.',when:'Sera.'},
    {city:'Xi’an',name:'Dachaishi Station',cn:'大差市站',category:'Dormire',lat:34.2580,lng:108.9620,why:'Compromesso tra prezzo, mura e metro.',when:'Hotel entro 600 metri.'},
    {city:'Xi’an',name:'Longshouyuan Station',cn:'龙首原站',category:'Dormire',lat:34.2920,lng:108.9530,why:'Base residenziale più economica sulla Linea 2.',when:'Piano risparmio.'},
    {city:'Xi’an',name:'Sajinqiao',cn:'洒金桥',category:'Cibo',lat:34.2705,lng:108.9365,why:'Cibo Hui e prezzi più locali.',when:'Colazione o pranzo.'},
    {city:'Xi’an',name:'Dapiyuan',cn:'大皮院',category:'Cibo',lat:34.2640,lng:108.9430,why:'Paomo, ravioli e carni halal.',when:'Pranzo o cena.'},
    {city:'Xi’an',name:'Xiaonanmen Morning Market',cn:'小南门早市',category:'Cibo',lat:34.2515,lng:108.9340,why:'Colazione locale, bing, zuppe e prodotti freschi.',when:'Molto presto.'},
    {city:'Xi’an',name:'Yongning Gate',cn:'西安城墙永宁门',category:'Attività',lat:34.2490,lng:108.9470,why:'Accesso scenografico alle mura.',when:'Mattina o luci serali.'},
    {city:'Xi’an',name:'Terracotta Army',cn:'秦始皇帝陵博物院',category:'Attività',lat:34.3840,lng:109.2730,why:'Museo ufficiale, non copie commerciali.',when:'Apertura, giornata intera.'},
    {city:'Xi’an',name:'Xi’an North Railway Station',cn:'西安北站',category:'Trasporto',lat:34.3766,lng:108.9398,why:'Treno veloce per Pechino.',when:'Arrivare 60–90 minuti prima.'},
    {city:'Pechino',name:'Jinsong Station',cn:'劲松站',category:'Dormire',lat:39.8847,lng:116.4613,why:'Base sud-est con metro e ristoranti residenziali.',when:'Prima scelta hotel.'},
    {city:'Pechino',name:'Panjiayuan Station',cn:'潘家园站',category:'Dormire',lat:39.8754,lng:116.4605,why:'Hotel economici e mercato dell’antiquariato.',when:'Confronto prezzi.'},
    {city:'Pechino',name:'Forbidden City',cn:'故宫博物院',category:'Attività',lat:39.9163,lng:116.3972,why:'Prenotazione e passaporto richiesti.',when:'Primo slot mattutino.'},
    {city:'Pechino',name:'Jingshan Park',cn:'景山公园',category:'Natura',lat:39.9230,lng:116.3960,why:'Vista dall’alto sulla Città Proibita.',when:'Subito dopo il museo.'},
    {city:'Pechino',name:'Jinshanling Great Wall',cn:'金山岭长城',category:'Natura',lat:40.6770,lng:117.2440,why:'Muraglia panoramica e meno congestionata.',when:'Partenza 07:00–08:00.'},
    {city:'Pechino',name:'Huguosi Street',cn:'护国寺街',category:'Cibo',lat:39.9360,lng:116.3670,why:'Snack tradizionali e colazione pechinese.',when:'Mattina.'},
    {city:'Pechino',name:'Niujie',cn:'牛街',category:'Cibo',lat:39.8860,lng:116.3630,why:'Cucina halal, montone e pasticcerie.',when:'Pranzo.'},
    {city:'Pechino',name:'Guijie',cn:'簋街',category:'Sera',lat:39.9410,lng:116.4290,why:'Ristoranti aperti tardi.',when:'Cena o notte.'},
    {city:'Pechino',name:'Temple of Heaven',cn:'天坛公园',category:'Attività',lat:39.8822,lng:116.4066,why:'Architettura e vita nei parchi.',when:'Mattina presto.'},
    {city:'Pechino',name:'Summer Palace',cn:'颐和园',category:'Natura',lat:39.9999,lng:116.2755,why:'Lago, colline e passeggiata lunga.',when:'Mezza giornata.'},
    {city:'Pechino',name:'798 Art District',cn:'798艺术区',category:'Attività',lat:39.9840,lng:116.4970,why:'Arte contemporanea e riuso industriale.',when:'Giornata libera.'},
    {city:'Pechino',name:'Beijing West Railway Station',cn:'北京西站',category:'Trasporto',lat:39.8948,lng:116.3213,why:'Arrivo del treno da Xi’an.',when:'Seguire uscita corretta.'},
    {city:'Pechino',name:'Beijing Daxing Airport',cn:'北京大兴国际机场',category:'Trasporto',lat:39.5098,lng:116.4105,why:'Controllare se il volo parte da PKX.',when:'Largo margine.'},
    {city:'Pechino',name:'Beijing Capital Airport',cn:'北京首都国际机场',category:'Trasporto',lat:40.0799,lng:116.6031,why:'Controllare se il volo parte da PEK.',when:'Largo margine.'}
  ];

  const days = [
    {n:1,date:'Sab 6 nov',title:'Italia → Hong Kong',city:'Volo',lead:'Partenza con biglietto multi-city: ingresso da Hong Kong e ritorno da Pechino.',tasks:['Controllare terminale, bagaglio incluso e power bank nel bagaglio a mano.','Aprire offline questa app, salvare polizza e prenotazioni.'],links:[],food:[]},
    {n:2,date:'Dom 7 nov',title:'Hong Kong: skyline e quartieri',city:'Hong Kong',lead:'Star Ferry, waterfront, Mong Kok e prima cena cantonese.',tasks:['Comprare o configurare Octopus.','Non riempire la giornata dopo il volo.'],links:['Star Ferry Tsim Sha Tsui','Mong Kok','Temple Street'],food:['pineapple-bun','char-siu']},
    {n:3,date:'Lun 8 nov',title:'Hong Kong: natura e quartieri locali',city:'Hong Kong',lead:'Dragon’s Back se il meteo è asciutto, poi Sham Shui Po.',tasks:['Portare acqua, cappellino e scarpe con grip.','Piano pioggia: mercati coperti e musei scelti sul posto.'],links:['Dragon’s Back','Sham Shui Po'],food:['char-siu']},
    {n:4,date:'Mar 9 nov',title:'Hong Kong → Shenzhen',city:'Shenzhen',lead:'Frontiera, check-in a Luohu e configurazione completa delle app cinesi.',tasks:['Comprare SIM fisica se manca eSIM/roaming.','Testare Alipay, WeChat Pay, Amap e DiDi.'],links:['Laojie Station','China Unicom Luohu','Dongmen Old Street'],food:['changfen','claypot']},
    {n:5,date:'Mer 10 nov',title:'Shenzhen: tecnologia e baia',city:'Shenzhen',lead:'Huaqiangbei al mattino, Shenzhen Bay al tramonto.',tasks:['Fotografare modello e banco prima di comprare.','Non comprare power bank senza marchio CCC se poi si vola in Cina.'],links:['Huaqiangbei','SEG Plaza','Shenzhen Bay Park','OCT Loft'],food:['changfen','claypot']},
    {n:6,date:'Gio 11 nov',title:'Macao compatta',city:'Macao',lead:'Centro storico, cibo di Taipa e Cotai la sera. Pernottamento solo se la logistica lo richiede.',tasks:['Verificare reingresso nella Cina continentale nel 2027.','Casinò facoltativo con budget deciso prima.'],links:['Ruins of St. Paul’s','Senado Square','Three Lamps District','Taipa Village','Cotai Strip'],food:['egg-tart','pork-bun']},
    {n:7,date:'Ven 12 nov',title:'Macao/Shenzhen → Xi’an',city:'Xi’an',lead:'Volo interno e prima serata nel quartiere Hui.',tasks:['Power bank CCC leggibile nel bagaglio a mano.','Hotel vicino a Dachaishi o Longshouyuan.'],links:['Dachaishi Station','Sajinqiao'],food:['roujiamo','paomo']},
    {n:8,date:'Sab 13 nov',title:'Esercito di Terracotta',city:'Xi’an',lead:'Giornata dedicata al museo ufficiale del mausoleo Qin.',tasks:['Partire presto e usare biglietto/trasporto ufficiale.','Ignorare falsi musei e soste commerciali.'],links:['Terracotta Army'],food:['biangbiang','roujiamo']},
    {n:9,date:'Dom 14 nov',title:'Mura di Xi’an → Pechino',city:'Xi’an/Pechino',lead:'Mattina sulle mura e treno veloce Xi’an North → Beijing West.',tasks:['Arrivare in stazione con 60–90 minuti di margine.','Ogni adulto può portare gratuitamente fino a 20 kg sul treno, entro le dimensioni previste.'],links:['Yongning Gate','Xi’an North Railway Station','Beijing West Railway Station'],food:['roujiamo','jianbing']},
    {n:10,date:'Lun 15 nov',title:'Pechino imperiale',city:'Pechino',lead:'Città Proibita, Jingshan Park e hutong.',tasks:['Prenotazione anticipata con passaporto corretto.','Vestirsi a strati: il nord è molto più freddo.'],links:['Forbidden City','Jingshan Park','Huguosi Street'],food:['jianbing','zhajiangmian']},
    {n:11,date:'Mar 16 nov',title:'Muraglia a Jinshanling',city:'Pechino',lead:'La giornata simbolo, con transfer affidabile e partenza presto.',tasks:['Piumino leggero, guanti sottili e scarpe con grip.','Piano B: Mutianyu se transfer o meteo rendono Jinshanling poco praticabile.'],links:['Jinshanling Great Wall'],food:['duck']},
    {n:12,date:'Mer 17 nov',title:'Palazzo d’Estate e Pechino lenta',city:'Pechino',lead:'Lago, parchi, quartieri quotidiani e cena condivisa.',tasks:['Non visitare ogni edificio: lasciare tempo per passeggiare.','Lavanderia serale vicino all’hotel.'],links:['Summer Palace','Niujie'],food:['duck','zhajiangmian']},
    {n:13,date:'Gio 18 nov',title:'Pechino flessibile',city:'Pechino',lead:'798, Tempio del Cielo, shopping o recupero di una tappa saltata.',tasks:['Usare la giornata come cuscinetto per stanchezza o meteo.','Preparare bagaglio e controllare aeroporto PEK/PKX.'],links:['798 Art District','Temple of Heaven','Guijie'],food:['jianbing','duck']},
    {n:14,date:'Ven 19 → Sab 20 nov',title:'Pechino → Italia',city:'Rientro',lead:'Ultime ore, aeroporto corretto e volo di ritorno.',tasks:['Tenere almeno una giornata-cuscinetto tra acquisti importanti e volo.','Pesare bagagli e spostare batterie nel bagaglio a mano.'],links:['Beijing Daxing Airport','Beijing Capital Airport'],food:[]}
  ];

  const stays = [
    {id:'hk',city:'Hong Kong',nights:2,area:'Tsuen Wan MTR / Tsuen Wan West / Kwai Hing',target:'70–120 € a notte per quattro',image:IMG.hk,why:'Più economica del waterfront di Kowloon ma ancora collegata bene. Evitare hotel che dipendono solo da navette.',move:'Tsuen Wan Line verso Mong Kok e Tsim Sha Tsui.',search:['荃湾站 酒店 四人','荃湾西站 家庭房','葵兴站 酒店'],chains:'Dorsett, Silka, Panda Hotel e strutture locali; confrontare camere familiari e due twin.'},
    {id:'sz',city:'Shenzhen',nights:2,area:'Laojie / Hubei / Guomao, distretto Luohu',target:'30–60 € a notte per quattro',image:IMG.shenzhen,why:'Inventario domestico e appartamenti possono essere molto più economici di Booking. La cifra di circa 66 € per due notti può essere plausibile, ma va verificata alla schermata finale.',move:'Linee 1 e 3; Huaqiangbei e Futian restano raggiungibili in metro.',search:['老街站 三室一厅 4人','湖贝站 酒店 外宾','国贸站 家庭房'],chains:'Hanting, Hi Inn, Home Inn, Jinjiang Inn, 7Days e Vienna; la catena non garantisce l’accettazione del passaporto.'},
    {id:'mo',city:'Macao',nights:0,area:'Gita da Shenzhen; Taipa o Outer Harbour solo se serve dormire',target:'0 € come gita; 55–100 € se necessario',image:IMG.macao,why:'I resort di Cotai falsano la media. L’opzione economica è non dormire a Macao, salvo orari o regole di reingresso.',move:'Traghetto da Shekou quando operativo; ricontrollare nel 2027.',search:['澳门 氹仔 酒店 4人','澳门 外港 酒店 家庭房'],chains:'Strutture locali a Taipa o Areia Preta; evitare di scegliere il resort solo perché compare per primo.'},
    {id:'xa',city:'Xi’an',nights:2,area:'Dachaishi / Hepingmen; Longshouyuan per il prezzo minimo',target:'25–55 € a notte per quattro',image:IMG.terracotta,why:'Non serve stare alla Bell Tower. Dachaishi è il compromesso; Longshouyuan costa meno ed è sulla Linea 2.',move:'Hotel entro 600 metri dalla metro.',search:['大差市站 酒店 外宾','和平门站 家庭房 4人','龙首原站 酒店 接待外宾'],chains:'Hanting, Ji Hotel, Home Inn, Atour Light e Jinjiang Inn.'},
    {id:'bj',city:'Pechino',nights:5,area:'Jinsong / Panjiayuan / Shilihe',target:'35–70 € a notte per quattro',image:IMG.wall,why:'Sud-est del centro: metro forte e prezzi inferiori a Wangfujing, Qianmen e hutong boutique.',move:'Linee 10 e 14. Allontanarsi ancora solo per un risparmio netto importante.',search:['劲松站 酒店 外宾 4人','潘家园站 家庭房','十里河站 酒店 接待外宾'],chains:'Hanting, Hi Inn, Home Inn, Ji Hotel, Orange, Vienna e Atour.'}
  ];

  const phrases = [
    {group:'Hotel',it:'Siamo quattro turisti italiani con passaporto italiano. Potete registrarci?',cn:'我们是四名意大利游客，持意大利护照。酒店可以为我们办理入住和住宿登记吗？'},
    {group:'Hotel',it:'Mostri questo indirizzo al tassista, per favore.',cn:'请把这个地址给司机看。'},
    {group:'Cibo',it:'Niente verdure, coriandolo né cipollotto.',cn:'不要蔬菜，不要香菜，也不要葱。'},
    {group:'Cibo',it:'Non piccante, per favore.',cn:'请不要辣。'},
    {group:'Cibo',it:'Quattro persone. Possiamo sederci qui?',cn:'我们四个人，可以坐这里吗？'},
    {group:'Cibo',it:'Il conto, per favore.',cn:'请买单。'},
    {group:'Trasporto',it:'Vogliamo andare qui. È il treno/autobus giusto?',cn:'我们要去这里。这趟车对吗？'},
    {group:'Trasporto',it:'Per favore ci porti a questo hotel.',cn:'请带我们去这家酒店。'},
    {group:'SIM',it:'Ho un passaporto straniero. Vorrei una SIM di breve durata soprattutto per internet.',cn:'我持外国护照，想办理一张短期手机卡，主要需要流量。'},
    {group:'Acquisti',it:'Quanto costa? Possiamo provarlo prima?',cn:'多少钱？我们可以先试一下吗？'},
    {group:'Aiuto',it:'Ci siamo persi. Può aiutarci?',cn:'我们迷路了。可以帮帮我们吗？'},
    {group:'Aiuto',it:'Ho bisogno di un medico.',cn:'我需要医生。'},
    {group:'Aiuto',it:'Chiami la polizia, per favore.',cn:'请帮我报警。'},
    {group:'Aiuto',it:'Dov’è il bagno?',cn:'洗手间在哪里？'},
    {group:'Bagagli',it:'Possiamo spedire questa valigia al prossimo hotel con SF Express?',cn:'可以用顺丰把这个行李箱寄到下一家酒店吗？'},
    {group:'Lavanderia',it:'Dov’è una lavanderia self-service vicina?',cn:'附近有自助洗衣店吗？'}
  ];

  const weather = [
    {city:'Hong Kong',range:'19–26 °C',note:'Mite, spesso asciutta; possibile caldo diurno.',wear:'T-shirt, strato leggero, guscio compatto.'},
    {city:'Shenzhen/Macao',range:'19–27 °C',note:'Autunno tardivo; umidità ancora presente.',wear:'Vestiti leggeri, felpa sottile, impermeabile.'},
    {city:'Xi’an',range:'3–15 °C',note:'Escursione forte e sere fredde.',wear:'Strati, pile, giacca calda, pantaloni lunghi.'},
    {city:'Pechino/Muraglia',range:'−2–12 °C',note:'Freddo secco, vento e temperature inferiori fuori città.',wear:'Piumino leggero, termica, guanti e berretto.'}
  ];

  const periods = [
    {name:'23 ottobre – 6 novembre',label:'Miglior clima complessivo',recommended:true,weather:5,crowds:4,value:3,text:'Più mite a Xi’an e Pechino, foliage migliore e sud ancora piacevole. Partire dopo la settimana nazionale di inizio ottobre. Prezzi più alti rispetto a metà novembre.'},
    {name:'6 – 20 novembre',label:'Scelta attuale: miglior valore',recommended:true,weather:4,crowds:5,value:5,text:'Sud molto piacevole e nord più freddo ma gestibile. Meno folla e spesso prezzi migliori. Serve valigia a strati e Muraglia ben equipaggiata.'},
    {name:'20 marzo – 3 aprile',label:'Primavera economica',recommended:false,weather:3,crowds:4,value:4,text:'Nord fresco e variabile; Shenzhen/Hong Kong più umide, con nebbia o pioviggine possibili. Verificare Qingming e rischio vento/polvere a Pechino.'},
    {name:'10 – 24 maggio',label:'Più caldo, più pioggia',recommended:false,weather:3,crowds:3,value:3,text:'Temperature facili al nord, ma il sud entra nella stagione calda e piovosa. Evitare i giorni attorno al Labor Day.'},
    {name:'Da evitare',label:'Folle o clima difficile',recommended:false,weather:1,crowds:1,value:1,text:'Settimana nazionale attorno al 1° ottobre, Capodanno lunare, luglio-agosto e festività ufficiali 2027 ancora da pubblicare.'}
  ];

  const alternatives = [
    {name:'Zhangjiajie · montagne “Avatar”',image:IMG.avatar,nights:'3 notti minime',swap:'Sostituisce Macao + una parte di Shenzhen oppure due giornate di Pechino.',why:'Pilastri di quarzite, Wulingyuan, Yuanjiajie e Tianzi Mountain. È spettacolare ma aggiunge un volo o un treno lungo e il meteo può coprire tutto con nebbia.',choose:'Sceglierla se natura scenografica batte tecnologia, Macao e ritmo semplice.'},
    {name:'Yangshuo e Xingping',image:IMG.yangshuo,nights:'3 notti',swap:'Sostituisce Macao + una giornata Shenzhen.',why:'Fiume Li, colline carsiche, bici e campagna. Più semplice logisticamente dal sud rispetto a Zhangjiajie, ma meno compatibile con Xi’an e Pechino nello stesso viaggio.',choose:'Sceglierla se volete natura vissuta e non solo monumenti.'},
    {name:'Shanghai',image:IMG.shanghai,nights:'3 notti',swap:'Sostituisce Macao + Shenzhen oppure due giornate di Pechino.',why:'Grande metropoli, Bund, quartieri contemporanei e cucina locale. Duplica parte dell’effetto urbano già dato da Hong Kong e Shenzhen.',choose:'Sceglierla per skyline, design e vita urbana; non aggiungerla sopra a tutto.'},
    {name:'Sanya',image:IMG.sanya,nights:'3 notti',swap:'Sostituisce Macao + Shenzhen o una parte consistente del nord.',why:'Mare tropicale e resort. Richiede volo, stagione meteo corretta e cambia completamente il carattere del viaggio.',choose:'Sceglierla solo se il mare è una priorità assoluta.'}
  ];

  const transportCards = [
    {title:'Amap, DiDi e mappe offline',summary:'La navigazione principale nel continente.',body:`<ol><li>Installare <strong>高德地图 Amap</strong> prima della partenza.</li><li>Cercare <strong>离线地图</strong> e scaricare Shenzhen, Xi’an e Pechino su Wi‑Fi.</li><li>Salvare hotel e luoghi usando i nomi cinesi di questa app.</li><li>Usare DiDi per auto; dividendo in quattro può essere più efficiente della metro.</li><li>I monopattini elettrici non devono essere il piano principale: metro, taxi e biciclette condivise sono più affidabili.</li></ol>`,links:[['Download Amap','https://mobile.amap.com/'],['Amap web','https://www.amap.com/']]},
    {title:'SIM fisica se manca eSIM',summary:'Numero locale per hotel, DiDi e mini-app.',body:`<ol><li>Andare in una filiale ufficiale China Unicom, China Mobile o China Telecom con passaporto.</li><li>Chiedere un piano breve soprattutto dati.</li><li>Testare chiamata, SMS, APN e numero prima di uscire.</li><li>Una SIM cinese può non dare accesso diretto a tutti i servizi occidentali; roaming/eSIM internazionale può restare il backup.</li></ol><button class="speak-button" data-cn="我持外国护照，想办理一张短期手机卡，主要需要流量。" data-label="Richiesta SIM">▶ Pronuncia richiesta SIM</button>`,links:[['Cerca Unicom a Luohu',amap('中国联通营业厅 罗湖')],['Cerca China Mobile',amap('中国移动营业厅 罗湖')]]},
    {title:'Treno Xi’an → Pechino',summary:'Passaporto, sicurezza e bagaglio.',body:`<ul><li>Comprare su 12306 ufficiale o Trip.com, usando lo stesso passaporto che verrà mostrato.</li><li>Arrivare con 60–90 minuti di margine per sicurezza e controllo documenti.</li><li>China Railway indica per un adulto <strong>20 kg gratuiti</strong>; sui treni EMU la somma delle dimensioni di ogni collo è indicata fino a 130 cm.</li><li>Non spedire il passaporto o i farmaci essenziali.</li></ul>`,links:[['12306 ufficiale','https://www.12306.cn/en/index.html'],['FAQ bagagli 12306','https://www.12306.cn/en/faq.html?item=1']]},
    {title:'Volo interno e power bank',summary:'La regola CCC può bloccare il caricatore.',body:`<ul><li>Dal 28 giugno 2025, sui voli domestici cinesi sono vietati power bank senza marchio CCC leggibile, con marchio dubbio o appartenenti a lotti richiamati.</li><li>Il power bank resta nel bagaglio a mano, mai in stiva.</li><li>Controllare comunque limite Wh e regole della compagnia scelta.</li><li>Non comprare il power bank economico il giorno prima del volo senza verificare marchio e modello.</li></ul>`,links:[['Avviso CAAC','https://www.caac.gov.cn/English/News/202507/t20250709_227894.html']]},
    {title:'Scaricare questa app offline',summary:'Testo, checklist e immagini anche senza rete.',body:`<ol><li>Premere <strong>Offline</strong> in alto mentre si è su Wi‑Fi.</li><li>Aprire almeno una volta mappa, cibo e hotel.</li><li>Installare l’app quando compare il pulsante.</li><li>Le mappe viste vengono memorizzate progressivamente; nessuna pagina web può scaricare tutta la cartografia cinese in automatico.</li><li>Fare comunque screenshot di hotel, biglietti e polizza.</li></ol>`,links:[]}
  ];

  const packingCards = [
    {title:'Valigia consigliata',summary:'Leggera all’andata, espandibile al ritorno.',body:`<ul><li><strong>Per persona:</strong> trolley da cabina o zaino 35–45 L + zainetto giornaliero.</li><li>4–5 magliette, 2 pantaloni, 1 strato termico, 1 pile/felpa, piumino comprimibile, guscio antivento/pioggia.</li><li>6–7 cambi intimi, calze tecniche, pigiama leggero.</li><li>Scarpe già rodate con grip; nessun secondo paio pesante salvo necessità.</li><li>Sacchetto pieghevole o borsone leggero per gli acquisti finali.</li></ul>`},
    {title:'Lavanderia',summary:'Lavare due volte evita una valigia grande.',body:`<ul><li>Programmare una lavanderia a Shenzhen e una a Pechino.</li><li>Chiedere hotel con lavatrice o cercare <strong>自助洗衣店</strong>.</li><li>Tenere un cambio completo nel bagaglio a mano durante i trasferimenti.</li></ul><button class="speak-button" data-cn="附近有自助洗衣店吗？" data-label="Lavanderia">▶ Chiedi una lavanderia</button>`},
    {title:'Spedire le valigie?',summary:'Possibile, ma non è la scelta di base.',body:`<ul><li>SF Express offre servizi domestici tracciabili e consegne porta a porta, ma per turisti conviene chiedere ai due hotel di confermare indirizzo, destinatario e accettazione.</li><li>Spedire solo vestiti e oggetti non essenziali, con almeno un giorno di margine.</li><li>Non spedire passaporti, farmaci, power bank, batterie, dispositivi costosi o tutto il guardaroba insieme.</li><li>Per questo itinerario il piano migliore è viaggiare leggeri e usare lavanderie; spedire solo se gli acquisti diventano ingombranti.</li></ul><button class="speak-button" data-cn="可以用顺丰把这个行李箱寄到下一家酒店吗？" data-label="Spedizione valigia">▶ Chiedi all’hotel</button>`},
    {title:'Cosa resta sempre addosso',summary:'Mai in stiva o in un pacco.',body:`<ul><li>Passaporto, telefono, carta principale e una carta di riserva.</li><li>Farmaci, polizza, biglietti e indirizzi cinesi offline.</li><li>Power bank CCC, cavi, adattatore e un cambio.</li><li>Contanti separati tra due persone.</li></ul>`},
    {title:'Abbigliamento per la Muraglia',summary:'Il punto climaticamente più duro.',body:`<ul><li>Base termica, pile e piumino leggero sotto un guscio antivento.</li><li>Guanti sottili, berretto, calze asciutte e scarpe con grip.</li><li>Portare uno strato in più nel veicolo e decidere sul posto.</li><li>Niente outfit da Hong Kong: fuori Pechino vento e temperatura percepita possono essere molto inferiori.</li></ul>`}
  ];

  const checklist = [
    ['passport','Passaporto e copie offline','Numero uguale su voli, hotel e 12306.'],
    ['visa','Visto/esenzione 2027 verificati','Controllo su fonte ufficiale prima dei voli non rimborsabili.'],
    ['insurance','Assicurazione sanitaria','Assistenza, massimali e rimpatrio.'],
    ['flights','Volo multi-city','Italia → Hong Kong; Pechino → Italia.'],
    ['baggage','Franchigia bagagli salvata','Cabina, stiva, dimensioni e peso per ogni tratta.'],
    ['powerbank','Power bank CCC controllato','Marchio leggibile per il volo domestico.'],
    ['payments','Alipay e WeChat testati','Due carte e metodo di riserva.'],
    ['sim','SIM/eSIM decisa','Numero locale o piano di backup.'],
    ['offline','App e mappe offline','Amap, indirizzi, hotel e screenshot.'],
    ['hotels','Hotel confermati per passaporti italiani','Prezzo finale per quattro, letti e registrazione.'],
    ['trains','Treno Xi’an–Pechino','Passaporti aggiunti e margine in stazione.'],
    ['weather','Previsioni ricontrollate','Sud e nord richiedono vestiti diversi.'],
    ['laundry','Lavanderie pianificate','Shenzhen e Pechino.'],
    ['emergency','Numeri e frasi salvati','110, 120, 119, 122.']
  ];

  const sources = [
    ['China Railway 12306: biglietti e bagaglio','https://www.12306.cn/en/faq.html?item=1'],
    ['CAAC: power bank senza CCC vietati sui voli domestici','https://www.caac.gov.cn/English/News/202507/t20250709_227894.html'],
    ['Hong Kong Observatory: clima e novembre','https://www.hko.gov.hk/en/cis/climahk.htm'],
    ['Shenzhen Meteorological Bureau: clima locale','https://weather.sz.gov.cn/qixiangfuwu/qihoufuwu/qihouguanceyupinggu/qihougaikuang/mindex.html'],
    ['SF Express: servizi domestici porta a porta','https://www.sf-express.com/chn/en/express/delivery/standard'],
    ['Calendario festività: controllare quello ufficiale 2027 quando pubblicato','https://english.www.gov.cn/'],
    ['Ambasciata cinese in Italia: visto ed esenzioni','https://it.china-embassy.gov.cn/ita/lqgz/'],
    ['Amap','https://www.amap.com/']
  ];

  const toast = document.createElement('div');
  toast.className = 'toast';
  document.body.appendChild(toast);
  function notify(message) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 1800); }
  async function copyText(text) { try { await navigator.clipboard.writeText(text); notify('Copiato'); } catch { notify('Copia non disponibile'); } }

  let voices = [];
  function refreshVoices() { voices = window.speechSynthesis?.getVoices?.() || []; }
  refreshVoices();
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = refreshVoices;
  function speakChinese(text) {
    if (!text) return;
    if (!('speechSynthesis' in window)) { window.open(`https://translate.google.com/?sl=zh-CN&tl=it&op=translate&text=${encodeURIComponent(text)}`, '_blank'); return; }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN'; utterance.rate = 0.78;
    utterance.voice = voices.find(v => v.lang.toLowerCase() === 'zh-cn') || voices.find(v => v.lang.toLowerCase().startsWith('zh')) || null;
    speechSynthesis.speak(utterance);
  }

  const speakDialog = $('#speakDialog');
  let currentSpeakText = '';
  function openSpeak(text, label = 'Testo cinese') {
    currentSpeakText = text; $('#speakLabel').textContent = label; $('#speakText').textContent = text; speakDialog.showModal();
  }
  $('#closeSpeak').addEventListener('click', () => speakDialog.close());
  speakDialog.addEventListener('click', event => { if (event.target === speakDialog) speakDialog.close(); });
  $('#dialogSpeak').addEventListener('click', () => speakChinese(currentSpeakText));
  $('#dialogCopy').addEventListener('click', () => copyText(currentSpeakText));

  function safeImg(src, fallback, alt) { return `<img loading="lazy" src="${src}" alt="${esc(alt)}" onerror="this.onerror=null;this.src='${fallback}'">`; }
  function speakButton(cn, label) { return `<button class="speak-button" data-cn="${esc(cn)}" data-label="${esc(label)}">▶ Cinese</button>`; }
  function placeLink(name) { const place = places.find(item => item.name === name); return place ? `<a class="tag tag-link" href="#map" data-place-id="${places.indexOf(place)}">${esc(name)}</a>` : ''; }
  function foodLink(id) { const food = foods.find(item => item.id === id); return food ? `<a class="tag tag-link" href="#food-${id}">${esc(food.name)}</a>` : ''; }

  $('#heroStats').innerHTML = [
    ['5','tappe principali'],['14','giorni'],['1','volo interno'],['1','treno veloce'],['42','punti GPS'],['16','frasi parlabili']
  ].map(([value,label]) => `<div class="stat-card"><strong>${value}</strong><span>${label}</span></div>`).join('');

  $('#dayList').innerHTML = days.map((day, index) => `<details class="day-card" ${index === 1 ? 'open' : ''}>
    <summary><span class="day-number">${day.n}</span><span class="day-summary"><strong>${day.title}</strong><span>${day.date} · ${day.city}</span></span></summary>
    <div class="day-body"><h3>${day.lead}</h3><ul>${day.tasks.map(task => `<li>${task}</li>`).join('')}</ul>
    ${day.links.length ? `<div class="tag-row"><b>Punti:</b>${day.links.map(placeLink).join('')}</div>` : ''}
    ${day.food.length ? `<div class="tag-row"><b>Cibo:</b>${day.food.map(foodLink).join('')}</div>` : ''}</div>
  </details>`).join('');

  $('#cityFilter').innerHTML = cities.map(city => `<option>${city}</option>`).join('');
  $('#categoryFilter').innerHTML = categories.map(category => `<option>${category}</option>`).join('');
  let map, mapMarkers = [], userMarker;
  const categoryColor = {'Dormire':'#276e5b','Cibo':'#c58b26','Attività':'#7a4595','Natura':'#3572a6','Acquisti':'#941f24','Sera':'#241915','Trasporto':'#6d5d54','Utilità':'#2f7f84'};

  function markerIcon(place) {
    return L.divIcon({className:'',html:`<span style="display:grid;width:25px;height:25px;place-items:center;border:2px solid white;border-radius:50%;color:white;background:${categoryColor[place.category]};font-size:11px;font-weight:900;box-shadow:0 3px 10px #0005">${places.indexOf(place)+1}</span>`,iconSize:[25,25],iconAnchor:[12,12]});
  }
  function initMap() {
    if (!window.L) { $('#tripMap').innerHTML = '<p style="padding:20px">Mappa non disponibile offline. L’elenco dei punti resta utilizzabile.</p>'; return; }
    map = L.map('tripMap', {scrollWheelZoom:false, zoomControl:true});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:18,attribution:'&copy; OpenStreetMap'}).addTo(map);
    mapMarkers = places.map(place => {
      const marker = L.marker([place.lat, place.lng], {icon:markerIcon(place)}).bindPopup(`<strong>${place.name}</strong><br>${place.cn}<br>${place.why}<br><a href="${amap(place.cn)}" target="_blank" rel="noopener">Amap</a>`).addTo(map);
      marker.place = place; return marker;
    });
    const route = [[22.31,114.17],[22.54,114.1],[22.19,113.55],[34.27,108.95],[39.91,116.4]];
    L.polyline(route,{color:'#941f24',weight:4,dashArray:'9 8',opacity:.75}).addTo(map);
    map.fitBounds(L.latLngBounds(route).pad(.08));
  }

  function renderPlaces() {
    const city = $('#cityFilter').value;
    const category = $('#categoryFilter').value;
    const query = $('#placeSearch').value.trim().toLowerCase();
    const filtered = places.filter(place => (city === 'Tutte' || place.city === city) && (category === 'Tutte' || place.category === category) && (!query || `${place.city} ${place.name} ${place.cn} ${place.why}`.toLowerCase().includes(query)));
    $('#placeList').innerHTML = filtered.map(place => `<article class="place-card" id="place-${places.indexOf(place)}">
      <div class="place-top"><h3>${place.name}<span class="cn-line">${place.cn}</span></h3><span class="category-label">${place.category}</span></div>
      <p>${place.why}</p><p><strong>Quando:</strong> ${place.when}</p>
      <div class="link-row"><a class="mini-button" href="${amap(place.cn)}" target="_blank" rel="noopener">Amap</a><a class="mini-button" href="${google(place.lat,place.lng,place.name)}" target="_blank" rel="noopener">Mappa</a>${speakButton(place.cn, place.name)}<button class="mini-button" data-copy="${esc(place.cn)}">Copia</button></div>
    </article>`).join('') || '<p>Nessun punto corrisponde ai filtri.</p>';
    if (map) mapMarkers.forEach(marker => { const show = filtered.includes(marker.place); if (show && !map.hasLayer(marker)) marker.addTo(map); if (!show && map.hasLayer(marker)) map.removeLayer(marker); });
  }
  ['change','input'].forEach(eventName => { $('#cityFilter').addEventListener(eventName, renderPlaces); $('#categoryFilter').addEventListener(eventName, renderPlaces); $('#placeSearch').addEventListener(eventName, renderPlaces); });
  initMap(); renderPlaces();

  function haversine(lat1,lng1,lat2,lng2) { const R=6371,toRad=v=>v*Math.PI/180; const dLat=toRad(lat2-lat1),dLng=toRad(lng2-lng1); const a=Math.sin(dLat/2)**2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2; return 2*R*Math.asin(Math.sqrt(a)); }
  function locateUser() {
    if (!navigator.geolocation) { notify('GPS non disponibile'); return; }
    $('#gpsResult').hidden = false; $('#gpsResult').textContent = 'Ricerca posizione…';
    navigator.geolocation.getCurrentPosition(position => {
      const {latitude,longitude} = position.coords;
      const nearest = places.map(place => ({...place,distance:haversine(latitude,longitude,place.lat,place.lng)})).sort((a,b)=>a.distance-b.distance).slice(0,6);
      $('#gpsResult').innerHTML = `<strong>Punti più vicini</strong><div class="tag-row">${nearest.map(place => `<a class="tag" href="${amap(place.cn)}" target="_blank" rel="noopener">${place.name} · ${place.distance<1?Math.round(place.distance*1000)+' m':place.distance.toFixed(1)+' km'}</a>`).join('')}</div>`;
      if (map) { if (userMarker) map.removeLayer(userMarker); userMarker = L.circleMarker([latitude,longitude],{radius:9,color:'#fff',weight:3,fillColor:'#276e5b',fillOpacity:1}).addTo(map).bindPopup('La tua posizione approssimativa').openPopup(); map.setView([latitude,longitude],13); }
    }, error => { $('#gpsResult').textContent = `GPS non disponibile: ${error.message}`; }, {enableHighAccuracy:true,timeout:12000,maximumAge:60000});
  }
  $('#locateButton').addEventListener('click', locateUser); $('#nearestHero').addEventListener('click', () => { $('#map').scrollIntoView({behavior:'smooth'}); setTimeout(locateUser,400); });

  const stayCosts = store.get('china-stay-costs', {});
  function renderStayTotal() { const total = Object.values(stayCosts).reduce((sum,value)=>sum+(Number(value)||0),0); $('#stayTotal').textContent=formatEuro(total); $('#stayPerPerson').textContent=formatEuro(total/4); }
  $('#stayList').innerHTML = stays.map((stay,index) => `<details class="fold-card" ${index===1?'open':''}>
    <summary><span></span><span class="fold-title"><strong>${stay.city} · ${stay.nights} notti</strong><span>${stay.area}</span></span></summary>
    <div class="fold-body"><div class="stay-layout"><figure class="media-frame">${safeImg(stay.image,IMG.fallback,stay.city)}</figure><div>
      <div class="price-grid"><div class="price-box"><span>Obiettivo</span><strong>${stay.target}</strong></div><div class="price-box"><span>Zona</span><strong>${stay.area}</strong></div></div>
      <p>${stay.why}</p><p><strong>Muoversi:</strong> ${stay.move}</p><p><strong>Catene/formato:</strong> ${stay.chains}</p>
      <div class="tag-row">${stay.search.map(term=>`<button class="tag" data-copy="${term}">${term}</button>`).join('')}</div>
      <div class="cost-wrap"><label for="cost-${stay.id}">Prezzo vero totale trovato (€)</label><input class="cost-input" id="cost-${stay.id}" data-stay-cost="${stay.id}" type="number" min="0" step="1" value="${stayCosts[stay.id]||''}" placeholder="0"></div>
      <div class="link-row"><a class="mini-button" href="${amap(stay.area)}" target="_blank" rel="noopener">Amap zona</a>${speakButton('我们是四名意大利游客，持意大利护照。酒店可以为我们办理入住和住宿登记吗？','Check-in hotel')}</div>
    </div></div></div>
  </details>`).join('');
  $$('[data-stay-cost]').forEach(input => input.addEventListener('input', () => { stayCosts[input.dataset.stayCost]=Number(input.value)||0; store.set('china-stay-costs',stayCosts); renderStayTotal(); }));
  $('#resetStayCosts').addEventListener('click', () => { Object.keys(stayCosts).forEach(key=>delete stayCosts[key]); store.set('china-stay-costs',stayCosts); $$('[data-stay-cost]').forEach(input=>input.value=''); renderStayTotal(); });
  renderStayTotal();

  const platforms = [
    ['Agoda in cinese','Offerte mobile e appartamenti; controllare totale per quattro.','https://www.agoda.com/zh-cn/'],
    ['携程 Ctrip','Grande inventario domestico; leggere documenti ammessi.','https://hotels.ctrip.com/'],
    ['Trip.com','Assistenza internazionale e confronto semplice.','https://www.trip.com/hotels/'],
    ['去哪儿 Qunar','Confronto domestico, interfaccia più cinese.','https://hotel.qunar.com/'],
    ['美团 Meituan','Offerte locali; può richiedere numero cinese.','https://hotel.meituan.com/'],
    ['飞猪 Fliggy','Marketplace Alibaba; verificare venditore e cancellazione.','https://www.fliggy.com/']
  ];
  $('#bookingGuide').innerHTML = `<p><strong>Non usare Booking come unica misura.</strong> Cercare le stesse date, quattro adulti e la stessa zona su più piattaforme. Verificare prezzo finale, letti, deposito, pulizie, cancellazione e passaporto.</p><div class="platform-grid">${platforms.map(([name,note,url])=>`<article class="platform-card"><strong>${name}</strong><p>${note}</p><a class="mini-button" href="${url}" target="_blank" rel="noopener">Apri</a></article>`).join('')}</div><div class="tag-row"><button class="tag" data-copy="接待外宾">接待外宾</button><button class="tag" data-copy="四人入住">四人入住</button><button class="tag" data-copy="免费取消">免费取消</button><button class="tag" data-copy="近地铁">近地铁</button></div><p><strong>Scartare:</strong> 仅限内宾 / 仅接待中国大陆居民, pagamento fuori piattaforma, posizione vaga, una sola recensione, prezzo per due persone mascherato da ricerca per quattro.</p>`;

  const foodCities = ['Tutti',...new Set(foods.map(food=>food.city))];
  $('#foodFilters').innerHTML = foodCities.map((city,index)=>`<button class="filter-button ${index===0?'active':''}" data-food-city="${city}">${city}</button>`).join('');
  function renderFood(city='Tutti') {
    $('#foodGrid').innerHTML = foods.filter(food=>city==='Tutti'||food.city===city).map(food=>`<article class="food-card" id="food-${food.id}"><figure>${safeImg(food.image,food.fallback,food.name)}</figure><div class="food-card-body"><h3>${food.name}<span class="cn-line">${food.cn}</span></h3><div class="tag-row">${food.tags.map(tag=>`<span class="tag">${tag}</span>`).join('')}</div><span class="food-label">Cosa contiene</span><p>${food.contains}</p><span class="food-label">Preparazione</span><p>${food.how}</p><span class="food-label">Dove e quando</span><p>${food.where}</p><div class="link-row"><a class="mini-button" href="${amap(`${food.city} ${food.cn}`)}" target="_blank" rel="noopener">Cerca su Amap</a>${speakButton(food.cn,food.name)}</div></div></article>`).join('');
  }
  renderFood();
  $('#foodFilters').addEventListener('click', event => { const button=event.target.closest('[data-food-city]'); if(!button)return; $$('[data-food-city]').forEach(item=>item.classList.remove('active'));button.classList.add('active');renderFood(button.dataset.foodCity); });

  function renderFoldList(target, cards) {
    $(target).innerHTML = cards.map((card,index)=>`<details class="fold-card" ${index===0?'open':''}><summary><span></span><span class="fold-title"><strong>${card.title}</strong><span>${card.summary}</span></span></summary><div class="fold-body">${card.body}${card.links?.length?`<div class="link-row">${card.links.map(([label,url])=>`<a class="mini-button" href="${url}" target="_blank" rel="noopener">${label}</a>`).join('')}</div>`:''}</div></details>`).join('');
  }
  renderFoldList('#transportList',transportCards);
  renderFoldList('#packingList',packingCards);

  $('#weatherStrip').innerHTML = weather.map(item=>`<article class="weather-card"><strong>${item.city}</strong><b>${item.range}</b><span>${item.note}</span><span><strong>Vestiti:</strong> ${item.wear}</span></article>`).join('');
  $('#periodGrid').innerHTML = periods.map(period=>`<article class="period-card ${period.recommended?'recommended':''}"><p class="kicker">${period.label}</p><h3>${period.name}</h3><p>${period.text}</p><div class="score-row"><div class="score"><strong>${period.weather}/5</strong><span>meteo</span></div><div class="score"><strong>${period.crowds}/5</strong><span>poca folla</span></div><div class="score"><strong>${period.value}/5</strong><span>valore</span></div></div></article>`).join('');
  $('#alternativeList').innerHTML = alternatives.map(alt=>`<details class="fold-card"><summary><span></span><span class="fold-title"><strong>${alt.name}</strong><span>${alt.nights} · ${alt.swap}</span></span></summary><div class="fold-body"><div class="stay-layout"><figure class="media-frame">${safeImg(alt.image,IMG.fallback,alt.name)}</figure><div><p>${alt.why}</p><p><strong>Quando sceglierla:</strong> ${alt.choose}</p></div></div></div></details>`).join('');

  $('#phraseGrid').innerHTML = phrases.map(phrase=>`<article class="phrase-card"><h3>${phrase.group} · ${phrase.it}</h3><div class="phrase-cn">${phrase.cn}</div><div class="link-row">${speakButton(phrase.cn,phrase.it)}<button class="mini-button" data-show-cn="${esc(phrase.cn)}" data-label="${esc(phrase.it)}">Mostra grande</button><button class="mini-button" data-copy="${esc(phrase.cn)}">Copia</button></div></article>`).join('');
  $('#speakCustom').addEventListener('click',()=>speakChinese($('#customChinese').value.trim()));
  $('#translateCustom').href=translate('');
  $('#customChinese').addEventListener('input',()=>{$('#translateCustom').href=`https://translate.google.com/?sl=auto&tl=zh-CN&op=translate&text=${encodeURIComponent($('#customChinese').value)}`});

  $('#emergencyGrid').innerHTML = [
    ['Numeri in Cina','110 Polizia · 120 Ambulanza · 119 Vigili del fuoco · 122 Incidenti stradali','请帮我报警。'],
    ['Serve un medico','Mostrare polizza, allergie e farmaci.','我需要医生。'],
    ['Ci siamo persi','Mostrare l’hotel salvato in cinese.','我们迷路了。可以帮帮我们吗？'],
    ['Passaporto smarrito','Contattare polizia, assicurazione e rappresentanza italiana.','我的护照丢了。'],
    ['Allergia grave','Indicare ingrediente e chiamare il 120.','我有严重过敏。请叫救护车。'],
    ['Telefono scarico','Tenere power bank CCC e indirizzi cartacei.','我的手机没电了。可以帮我充电吗？']
  ].map(([title,text,cn])=>`<article class="emergency-card"><h3>${title}</h3><p>${text}</p><div class="phrase-cn">${cn}</div><div class="link-row">${speakButton(cn,title)}<button class="mini-button" data-show-cn="${esc(cn)}" data-label="${esc(title)}">Mostra</button></div></article>`).join('');

  const savedChecks = store.get('china-final-checklist',{});
  $('#checkGrid').innerHTML = checklist.map(([id,title,note])=>`<label class="check-item"><input type="checkbox" data-check="${id}" ${savedChecks[id]?'checked':''}><span><strong>${title}</strong><span>${note}</span></span></label>`).join('');
  function updateProgress(){const boxes=$$('[data-check]'),done=boxes.filter(box=>box.checked).length,pct=Math.round(done/boxes.length*100);$('#progressBar').style.width=`${pct}%`;$('#progressLabel').textContent=`${pct}%`;}
  $$('[data-check]').forEach(box=>box.addEventListener('change',()=>{savedChecks[box.dataset.check]=box.checked;store.set('china-final-checklist',savedChecks);updateProgress()})); updateProgress();

  $('#sourceList').innerHTML = `<p>Ultimo controllo: 23 luglio 2026. Meteo indicato come fascia climatica, non previsione 2027. Orari, festività, visto, voli e prezzi devono essere ricontrollati vicino alla partenza.</p><ul>${sources.map(([label,url])=>`<li><a href="${url}" target="_blank" rel="noopener">${label}</a></li>`).join('')}</ul>`;

  document.addEventListener('click', event => {
    const jump = event.target.closest('[data-jump]'); if(jump){$('#'+jump.dataset.jump)?.scrollIntoView({behavior:'smooth'});return;}
    const speak = event.target.closest('[data-cn]'); if(speak){speakChinese(speak.dataset.cn);return;}
    const show = event.target.closest('[data-show-cn]'); if(show){openSpeak(show.dataset.showCn,show.dataset.label);return;}
    const copy = event.target.closest('[data-copy]'); if(copy){copyText(copy.dataset.copy);return;}
    const placeJump = event.target.closest('[data-place-id]'); if(placeJump){const id=Number(placeJump.dataset.placeId); setTimeout(()=>{const card=$(`#place-${id}`);card?.scrollIntoView({behavior:'smooth',block:'center'}); if(map&&mapMarkers[id]){map.setView([places[id].lat,places[id].lng],15);mapMarkers[id].openPopup();}},500);}
  });

  function updateNetwork(){const online=navigator.onLine;$('#networkStatus').textContent=online?'Online':'Offline';$('#networkStatus').classList.toggle('offline',!online);} window.addEventListener('online',updateNetwork);window.addEventListener('offline',updateNetwork);updateNetwork();

  let deferredInstall;
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event;$('#installButton').hidden=false});
  $('#installButton').addEventListener('click',async()=>{if(!deferredInstall)return;deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$('#installButton').hidden=true});

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
  const offlineUrls = [location.href,'./china.css','./china-detail.js','./manifest.webmanifest','./china-icon.svg','https://unpkg.com/leaflet@1.9.4/dist/leaflet.css','https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',...Object.values(IMG),...foods.flatMap(food=>[food.image,food.fallback]),...stays.map(stay=>stay.image),...alternatives.map(alt=>alt.image)];
  $('#offlineButton').addEventListener('click',async()=>{
    if(!navigator.serviceWorker?.controller){notify('Ricarica una volta e riprova');return;}
    $('#offlineButton').textContent='0%';navigator.serviceWorker.controller.postMessage({type:'CACHE_URLS',urls:[...new Set(offlineUrls)]});
  });
  navigator.serviceWorker?.addEventListener('message',event=>{if(event.data?.type==='CACHE_PROGRESS'){$('#offlineButton').textContent=`${Math.round(event.data.done/event.data.total*100)}%`}if(event.data?.type==='CACHE_DONE'){$('#offlineButton').textContent='Offline ✓';notify('App e immagini salvate')}});
})();
