# CINA V3

Nuova pagina autonoma `china-v3.html`, accessibile dalla home. V1 e V2 restano inalterate. HTML/CSS/JS statici, senza build, dipendenze di runtime vendorizzate.

## Decisioni

15 giorni con partenza Italia giorno 1, 13 notti in Cina, rientro giorno 15 (arrivo Italia eventualmente 16): Chengdu 2, Chongqing 3, Wulingyuan 3, Zhangjiajie città 1, Furong 1, Changsha 1, Yangshuo 2. Tianmen ha giornata dedicata; trasferimento a Furong il giorno seguente. Nessuna corsa a Xingping prima del volo.

108 punti, micro-rotte con accessi e uscite, ricerca cinese Amap, costi/inclusioni, prenotazioni, versioni easy/rain/optional, serate e missioni facoltative. 48 fonti consultate al 06/10/2026, pubblicate nella pagina. Stime budget €1.490–2.400 per persona, €5.960–9.600 in quattro, senza extra. Non sono preventivi live.

Grand Canyon: ferrata breve prioritaria se riconfermata; fonte ufficiale ne documenta l'esistenza, resoconto 2025 descrive la linea breve e uscita intermedia. Qixing: coaster su binario, non kart libero; ferrata principale impegnativa. Chongqing: tempesta/auto/nave documentati nel 2025, terremoto nel 2026; sessioni da riconfermare. Tianmen: manutenzioni e chiusure 2026 rese visibili, percorso secondo voucher corrente. Yulong: Jinlong → Jiuxian, pickup e ritorno al noleggio prima della bici.

I pin WGS84 sono approssimativi e separati graficamente quando sovrapposti: servono a orientarsi, non a navigare. I tratti tratteggiati non sono percorsi stradali. Navigazione tramite ricerche Amap dei nomi reali; niente conversioni GCJ-02 inventate. Leaflet/OSM online, mappa SVG di punti senza rete. Link esterni richiedono rete.

Sette fotografie reali Commons, WebP locali; autori, originali e licenze pubblicati nella pagina. Leaflet BSD-2-Clause in `assets/china-v3/vendor/LICENSE.txt`. Fallback SVG esplicitamente dichiarato, non fotografia sostitutiva.

## Verifiche eseguite

- Sintassi Node per app e dati.
- DOM con jsdom: tutti i 15 giorni, completezza dei campi, 108 punti e fonti valide, filtri/categorie/ricerca cinese, sincronizzazione giorno-mappa, budget extra, persistenza missioni/checklist, stampa di tutti i giorni e ripristino, fallback immagine, anchor.
- Export HTML: CSS/dati/JS/foto incorporati, nessuna dipendenza da CDN, avvio e cambio giorno/mappa offline. Gestito anche divieto history di alcuni viewer file://.
- Decodifica PIL delle sette foto; V1/V2 nessun cambiamento nel diff.

Ripetere i controlli dalla root repository, con jsdom installato in un ambiente di test:

```sh
CHINA_V3_JSDOM=/percorso/node_modules/jsdom node docs/test-v3-dom.cjs
CHINA_V3_JSDOM=/percorso/node_modules/jsdom node docs/test-v3-offline.cjs
```

## Limiti della verifica

Non completata la prova visiva Chromium/mobile: download del browser restituisce una pagina "Site Unavailable"; il browser cloud blocca l'anteprima localhost (`ERR_BLOCKED_BY_CLIENT`). Non dichiarata superata. CSS responsive con breakpoint 720/1000/1100, touch target e overflow controllato nel codice; verificare visivamente 320/390/430/768/1440px e stampa nel browser prima del merge. Playwright non incluso come dipendenza del sito.

Tariffe, voli, hotel, treni e attività non prenotati. Aperture, accesso passaporti stranieri e procedure possono cambiare; vanno riconfermati per date effettive. Esenzione visto 2026 non estesa automaticamente al 2027. Alloggi sono zone/budget e criteri pratici, senza promettere disponibilità di strutture non verificate.
