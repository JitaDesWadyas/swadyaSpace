(() => {
  'use strict';
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
  const simplePhrases = [
      ['Una birra','一瓶啤酒'],['Quattro birre','四瓶啤酒'],['Salute!','干杯！'],['Acqua','水'],
      ['Il conto','买单'],['Quanto costa?','多少钱？'],['Bagno','洗手间'],['Grazie','谢谢'],
      ['Non piccante','不要辣'],['Niente verdure','不要蔬菜'],['Questo, per favore','请给我这个'],['Aiuto','请帮帮我']
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
  window.CHINA_PRACTICAL_DATA={phrases,simplePhrases,weather,periods};
})();
