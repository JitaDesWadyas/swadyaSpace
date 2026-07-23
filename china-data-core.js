(() => {
  'use strict';
  const commons = filename => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1200`;
  const IMG = {
      hero: commons('Hong Kong Skyline viewed from Victoria Peak.jpg'),
      hk: commons('Hong Kong Skyline viewed from Victoria Peak.jpg'),
      hkNight: commons('Hong Kong Skyline at Night - Star Ferry - Flickr - Wilson Hui.jpg'),
      starFerry: commons('Star Ferry ships at Hong Kong.jpg'),
      dragonBack: commons("Dragon's Back Trail.jpg"),
      shenzhen: commons('A spectacular view of Shenzhen Skyline.jpg'),
      hqb: commons('Huaqiangbei.jpg'),
      macao: commons("Ruins of St Paul's, Macau (30843847251).jpg"),
      xian: commons("Xi'an city walls.jpg"),
      xianGate: commons("Yongningmen, Xi'an City Wall, Xi'an.jpg"),
      terracotta: commons('Terracotta Army, View of Pit 1.jpg'),
      beijing: commons('Forbidden City, Beijing - panoramio (2).jpg'),
      wall: commons('The Great Wall of China at Jinshanling.jpg'),
      summer: commons('The Summer Palace, Beijing.jpg'),
      art798: commons('798 Art Zone.jpg'),
      temple: commons('Temple of Heaven, Beijing, China - 001.jpg'),
      avatar: commons('Zhangjiajie National Forest Park.jpg'),
      yangshuo: commons('Yangshuo-Li-River-2019-Luka-Peternel.jpg'),
      shanghai: commons('Shanghai skyline from the bund.jpg'),
      sanya: commons('Sanya Bay Hainan China.jpg'),
      fallback: './china-icon.svg'
    };
  const cities = ['Tutte','Hong Kong','Shenzhen','Macao','Xi’an','Pechino'];
  const categories = ['Tutte','Dormire','Cibo','Attività','Natura','Acquisti','Sera','Trasporto','Utilità'];
  window.CHINA_TRIP_DATA={IMG,cities,categories};
})();
