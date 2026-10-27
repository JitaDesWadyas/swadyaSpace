# BIRIMANIA — 30 ottobre 2026

Landing cinematografica **100% statica** per SwadyaSpace. Apri `birimania/index.html`, oppure avvia `python -m http.server 8080` dalla root e visita `/birimania/`.

## Asset da aggiungere

Inserisci i seguenti file dentro `birimania/media/`. I pulsanti del lettore si attivano automaticamente soltanto se i filmati esistono e sono leggibili; fino a quel momento il layout funziona senza alcun asset:

- `trailer.mp4` — video teaser / trailer (H.264 + AAC consigliati), ideale anche crop verticale.
- `faceoff.mp4` — video ufficiale del faceoff (H.264 + AAC consigliati).
- `grb-imisaj.webp` — ritratto reale di GRB_imisaj, preferibilmente 4:5.
- `oeloves.webp` — ritratto reale di Oeloves, preferibilmente 4:5.

La sezione hero può usare il trailer come video in loop silenzioso sullo sfondo; il lettore apre il trailer completo con controlli e audio dopo il clic. Se i file non sono presenti il sito mostra una composizione tipografica definitiva, non un video rotto.

## Modifiche rapide

- `app.js`: `market` contiene le quote dimostrative. NON sono quote di un bookmaker e non è prevista alcuna transazione.
- `app.js`: data assoluta `2026-10-30T19:00:00+01:00` (Roma, dopo il cambio di ora).
- `styles.css`: font **Barlow Condensed** per titoli, **DM Sans** per UI/testi, caricati tramite Google Fonts; fallback di sistema se offline.
- `index.html`: microcopy, lineup e metadati di condivisione.

## Principi

Nessun framework, nessuna build, nessun database, nessun cookie, nessun analytics, nessuna raccolta dati. Menu e visualizzatore video personalizzati, `prefers-reduced-motion`, tastiera, accessibilità, supporto responsive. I link dell'evento non riportano un indirizzo privato. Per pubblicare: aggiungere la pagina da `main` tramite PR, dopo verifica con asset.