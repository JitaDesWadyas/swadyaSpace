(() => {
  'use strict';
  const {IMG}=window.CHINA_TRIP_DATA;
  const routeVisuals = [
      {city:'Hong Kong',cn:'香港',days:'Giorni 1–3',image:IMG.hkNight,summary:'Skyline, traghetti, mercati e sentieri costieri.'},
      {city:'Shenzhen',cn:'深圳',days:'Giorni 4–5',image:IMG.shenzhen,summary:'Tecnologia, quartieri quotidiani, metro e baia.'},
      {city:'Macao',cn:'澳门',days:'Giorno 6',image:IMG.macao,summary:'Centro storico, Taipa, cibo macanese e Cotai.'},
      {city:'Xi’an',cn:'西安',days:'Giorni 7–9',image:IMG.terracotta,summary:'Quartiere Hui, mura ed Esercito di Terracotta.'},
      {city:'Pechino',cn:'北京',days:'Giorni 10–14',image:IMG.wall,summary:'Città Proibita, Muraglia, parchi e Pechino moderna.'}
    ];
  const stays = [
      {id:'hk',city:'Hong Kong',nights:2,area:'Tsuen Wan MTR / Tsuen Wan West / Kwai Hing',target:'70–120 € a notte per quattro',image:IMG.hk,why:'Più economica del waterfront di Kowloon ma ancora collegata bene. Evitare hotel che dipendono solo da navette.',move:'Tsuen Wan Line verso Mong Kok e Tsim Sha Tsui.',search:['荃湾站 酒店 四人','荃湾西站 家庭房','葵兴站 酒店'],chains:'Dorsett, Silka, Panda Hotel e strutture locali; confrontare camere familiari e due twin.'},
      {id:'sz',city:'Shenzhen',nights:2,area:'Laojie / Hubei / Guomao, distretto Luohu',target:'30–60 € a notte per quattro',image:IMG.shenzhen,why:'Inventario domestico e appartamenti possono essere molto più economici di Booking. La cifra di circa 66 € per due notti può essere plausibile, ma va verificata alla schermata finale.',move:'Linee 1 e 3; Huaqiangbei e Futian restano raggiungibili in metro.',search:['老街站 三室一厅 4人','湖贝站 酒店 外宾','国贸站 家庭房'],chains:'Hanting, Hi Inn, Home Inn, Jinjiang Inn, 7Days e Vienna; la catena non garantisce l’accettazione del passaporto.'},
      {id:'mo',city:'Macao',nights:0,area:'Gita da Shenzhen; Taipa o Outer Harbour solo se serve dormire',target:'0 € come gita; 55–100 € se necessario',image:IMG.macao,why:'I resort di Cotai falsano la media. L’opzione economica è non dormire a Macao, salvo orari o regole di reingresso.',move:'Traghetto da Shekou quando operativo; ricontrollare nel 2027.',search:['澳门 氹仔 酒店 4人','澳门 外港 酒店 家庭房'],chains:'Strutture locali a Taipa o Areia Preta; evitare di scegliere il resort solo perché compare per primo.'},
      {id:'xa',city:'Xi’an',nights:2,area:'Dachaishi / Hepingmen; Longshouyuan per il prezzo minimo',target:'25–55 € a notte per quattro',image:IMG.terracotta,why:'Non serve stare alla Bell Tower. Dachaishi è il compromesso; Longshouyuan costa meno ed è sulla Linea 2.',move:'Hotel entro 600 metri dalla metro.',search:['大差市站 酒店 外宾','和平门站 家庭房 4人','龙首原站 酒店 接待外宾'],chains:'Hanting, Ji Hotel, Home Inn, Atour Light e Jinjiang Inn.'},
      {id:'bj',city:'Pechino',nights:5,area:'Jinsong / Panjiayuan / Shilihe',target:'35–70 € a notte per quattro',image:IMG.wall,why:'Sud-est del centro: metro forte e prezzi inferiori a Wangfujing, Qianmen e hutong boutique.',move:'Linee 10 e 14. Allontanarsi ancora solo per un risparmio netto importante.',search:['劲松站 酒店 外宾 4人','潘家园站 家庭房','十里河站 酒店 接待外宾'],chains:'Hanting, Hi Inn, Home Inn, Ji Hotel, Orange, Vienna e Atour.'}
    ];
  Object.assign(window.CHINA_TRIP_DATA,{routeVisuals,stays});
})();
