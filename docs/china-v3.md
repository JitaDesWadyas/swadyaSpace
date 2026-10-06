# CINA V3

Nuova pagina autonoma `china-v3.html`, accessibile dalla home. V1 e V2 restano inalterate. HTML/CSS/JS statici, senza build, dipendenze di runtime vendorizzate.

## Decisioni

15 giorni con partenza Italia giorno 1, 13 notti in Cina, rientro giorno 15 (arrivo Italia eventualmente 16): Chengdu 2, Chongqing 3, Wulingyuan 3, Zhangjiajie città 1, Furong 1, Changsha 1, Yangshuo 2. Tianmen ha giornata dedicata; trasferimento a Furong il giorno seguente. Nessuna corsa a Xingping prima del volo.

108 punti, micro-rotte con accessi e uscite, ricerca cinese Amap, costi/inclusioni, prenotazioni, versioni easy/rain/optional, serate e missioni facoltative. 48 fonti consultate al 06/10/2026, pubblicate nella pagina. Stime budget €1.490–2.400 per persona, €5.960–9.600 in quattro, senza extra. Non sono preventivi live.

Grand Canyon: ferrata breve prioritaria se riconfermata; fonte ufficiale ne documenta l'esistenza, resoconto 2025 descrive la linea breve e uscita intermedia. Qixing: coaster su binario, non kart libero; ferrata principale impegnativa. Chongqing: tempesta/auto/nave documentati nel 2025, terremoto nel 2026; sessioni da riconfermare. Tianmen: manutenzioni e chiusure 2026 rese visibili, percorso secondo voucher corrente. Yulong: Jinlong → Jiuxian, pickup e ritorno al noleggio prima della bici.

I pin WGS84 sono approssimativi e separati graficamente quando sovrapposti: servono a orientarsi, non a navigare. I tratti tratteggiati non sono percorsi stradali. Navigazione tramite ricerche Amap dei nomi reali; niente conversioni GCJ-02 inventate. Leaflet/OSM online, mappa SVG di punti senza rete. Link esterni richiedono rete.

122 fotografie reali Commons, WebP locali, immagini per tutti i 108 punti; autori, originali e licenze pubblicati nella pagina. Leaflet BSD-2-Clause in `assets/china-v3/vendor/LICENSE.txt`. Fallback SVG esplicitamente dichiarato, non fotografia sostitutiva.

## Verifiche eseguite

- Sintassi Node per app e dati.
- DOM con jsdom: tutti i 15 giorni, completezza dei campi, 108 punti e fonti valide, filtri/categorie/ricerca cinese, sincronizzazione giorno-mappa, budget extra, persistenza missioni/checklist, stampa di tutti i giorni e ripristino, fallback immagine, anchor.
- Export HTML: CSS/dati/JS/foto incorporati, nessuna dipendenza da CDN, avvio e cambio giorno/mappa offline. Gestito anche divieto history di alcuni viewer file://.
- Decodifica PIL delle 122 foto; V1/V2 nessun cambiamento nel diff.

Ripetere i controlli dalla root repository, con jsdom installato in un ambiente di test:

```sh
CHINA_V3_JSDOM=/percorso/node_modules/jsdom node docs/test-v3-dom.cjs
CHINA_V3_JSDOM=/percorso/node_modules/jsdom node docs/test-v3-offline.cjs
CHINA_V3_JSDOM=/percorso/node_modules/jsdom node docs/test-v3-media.cjs
```

## Verifica visuale e pronuncia

Prova Chromium 153 completata su 320/390/430/768/1440px: cinque giorni rappresentativi a ogni larghezza, nessun overflow orizzontale; gallerie, lightbox, scelta testo nella pagina e pannello vocale; 175 istanze immagine caricate senza fallback o file mancanti; download HTML offline aperto con rete bloccata, foto ingrandibili incorporate e pannello pronuncia disponibile; stampa 15 giorni/ripristino. Zero errori JavaScript. L'ambiente iniziale non consentiva scaricare Chromium; recuperato con runtime di test da pacchetto npm, non dipendenza del sito.

Pronuncia: Web Speech API con voci del dispositivo, lingua/voce/velocità/stop, scelta da 108 nomi e frasi oppure qualunque testo selezionato/toccato/incollato. Il pannello non legge il mandarino con una voce italiana né sostituisce Cantonese HK alla voce mandarina. Test di dispatch e stati con voci simulate, inclusa voce assente. Headless non dispone di voce mandarina: qualità audio reale dipende dalla voce installata sul dispositivo e non è stata verificata all'ascolto. Nessun microfono richiesto; le voci remote possono richiedere rete.

47 schede usano esclusivamente foto di contesto o dell'attività, esplicitamente indicate; non sono immagini certificate dell'accesso, del meeting point o del punto preciso. Non sostituite con foto di posti omonimi (Qixing Taiwan, Huanglong Hangzhou, Mount Furong Ningxiang). Didascalie, autore, fonte, licenza e modifiche in pagina. Fallback limitato alle foto della guida, senza alterare le tessere Leaflet. Foto caricate lazy; file HTML offline incorpora una volta le immagini e ricostruisce le schede, circa 23 MB.

Tariffe, voli, hotel, treni e attività non prenotati. Aperture, accesso passaporti stranieri e procedure possono cambiare; vanno riconfermati per date effettive. Esenzione visto 2026 non estesa automaticamente al 2027. Alloggi sono zone/budget e criteri pratici, senza promettere disponibilità di strutture non verificate.


Test Chromium ripetibile (runtime di test separato dal sito):

```sh
CHINA_V3_PLAYWRIGHT=/percorso/node_modules/playwright-core CHINA_V3_CHROMIUM=/percorso/chromium node docs/test-v3-browser.mjs
```

Screenshot in `docs/screenshots/`. Il runtime headless non dispone di font CJK; sui dispositivi si usano i font cinesi di sistema. Il controllo dei file include decodifica WebP, quello visuale attende anche `image.decode()` e il frame di rendering prima degli screenshot.
