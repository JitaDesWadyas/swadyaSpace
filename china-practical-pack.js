(() => {
  'use strict';
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
  Object.assign(window.CHINA_PRACTICAL_DATA,{packingCards,checklist,sources});
})();
