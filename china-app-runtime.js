async function translateItalian() {
  const source = italianInput.value.trim();
  if (!source) { setTranslation('', 'Scrivi una frase in italiano.'); return; }
  fallbackLink.href = translate(source);
  translationNote.textContent = navigator.onLine ? 'Traduzione in corso…' : 'Offline: cerco tra le frasi salvate…';
  if (navigator.onLine) {
    try {
      const endpoint = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=it&tl=zh-CN&dt=t&q=${encodeURIComponent(source)}`;
      const response = await fetch(endpoint, {cache:'no-store'});
      if (!response.ok) throw new Error('translate');
      const data = await response.json();
      const translated = Array.isArray(data?.[0]) ? data[0].map(item => item?.[0] || '').join('') : '';
      if (!translated) throw new Error('empty');
      setTranslation(translated, 'Traduzione online. Mostrala grande o falla pronunciare.');
      return;
    } catch {}
  }
  const match = bestOfflinePhrase(source);
  if (match) setTranslation(match.cn, `Offline/fallback: frase salvata più vicina — ${match.it}`);
  else setTranslation('', 'Non ho una frase offline abbastanza vicina. Apri Google Translate quando torna la rete.');
}

$('#translateNow').addEventListener('click', translateItalian);
italianInput.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') translateItalian(); });
italianInput.addEventListener('input', () => { fallbackLink.href = translate(italianInput.value.trim()); });
$('#speakTranslation').addEventListener('click', () => speakChinese(currentTranslation));
$('#showTranslation').addEventListener('click', () => { if (currentTranslation) openSpeak(currentTranslation, italianInput.value.trim() || 'Traduzione'); });
$('#copyTranslation').addEventListener('click', () => { if (currentTranslation) copyText(currentTranslation); });
$('#clearTranslation').addEventListener('click', () => { italianInput.value=''; setTranslation('', 'La traduzione apparirà qui.'); italianInput.focus(); });
fallbackLink.href = translate('');

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const dictateButton = $('#dictateItalian');
if (Recognition) {
  dictateButton.addEventListener('click', () => {
    const recognition = new Recognition();
    recognition.lang = 'it-IT'; recognition.interimResults = false; recognition.maxAlternatives = 1;
    dictateButton.textContent = '🎙 Ascolto…';
    recognition.onresult = event => { italianInput.value = event.results[0][0].transcript; fallbackLink.href = translate(italianInput.value); translateItalian(); };
    recognition.onerror = () => notify('Dettatura non disponibile');
    recognition.onend = () => { dictateButton.textContent = '🎙 Dettatura'; };
    recognition.start();
  });
} else {
  dictateButton.disabled = true;
  dictateButton.title = 'Dettatura non supportata su questo browser';
}

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

const imageDialog=$('#imageDialog'),imageDialogImage=$('#imageDialogImage'),imageDialogCaption=$('#imageDialogCaption');
$('#closeImage').addEventListener('click',()=>imageDialog.close());
imageDialog.addEventListener('click',event=>{if(event.target===imageDialog)imageDialog.close();});

document.addEventListener('click', event => {
  const lightbox=event.target.closest('[data-lightbox]'); if(lightbox){const img=lightbox.querySelector('img');if(img){imageDialogImage.src=img.currentSrc||img.src;imageDialogImage.alt=img.alt;imageDialogCaption.textContent=lightbox.dataset.caption||img.alt;imageDialog.showModal();}return;}
  const jump = event.target.closest('[data-jump]'); if(jump){$('#'+jump.dataset.jump)?.scrollIntoView({behavior:'smooth'});return;}
  const speak = event.target.closest('[data-cn]'); if(speak){speakChinese(speak.dataset.cn);return;}
  const show = event.target.closest('[data-show-cn]'); if(show){openSpeak(show.dataset.showCn,show.dataset.label);return;}
  const copy = event.target.closest('[data-copy]'); if(copy){copyText(copy.dataset.copy);return;}
  const placeJump = event.target.closest('[data-place-id]'); if(placeJump){event.preventDefault();const id=Number(placeJump.dataset.placeId);const place=places[id];$('#cityFilter').value=place.city;$('#categoryFilter').value='Tutte';$('#placeSearch').value='';renderPlaces();$('#map').scrollIntoView({behavior:'smooth'});setTimeout(()=>{const group=[...$$('[data-city-group]')].find(item=>item.dataset.cityGroup===place.city);if(group)group.open=true;const card=$(`#place-${id}`);card?.classList.add('highlight-place');card?.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>card?.classList.remove('highlight-place'),2200);if(map&&mapMarkers[id]){map.setView([place.lat,place.lng],15);mapMarkers[id].openPopup();}},650);}
});

function updateNetwork(){const online=navigator.onLine;$('#networkStatus').textContent=online?'Online':'Offline';$('#networkStatus').classList.toggle('offline',!online);} window.addEventListener('online',updateNetwork);window.addEventListener('offline',updateNetwork);updateNetwork();

let deferredInstall;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event;$('#installButton').hidden=false});
$('#installButton').addEventListener('click',async()=>{if(!deferredInstall)return;deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$('#installButton').hidden=true});

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
const offlineUrls = [location.href,'./china-1.css','./china-2.css','./china-3.css','./china-data-core.js','./china-data-foods.js','./china-data-places.js','./china-data-itinerary.js','./china-data-stays.js','./china-practical-core.js','./china-practical-options.js','./china-practical-pack.js','./china-app-core.js','./china-app-map-budget.js','./china-app-content.js','./china-app-runtime.js','./manifest.webmanifest','./china-icon.svg','https://unpkg.com/leaflet@1.9.4/dist/leaflet.css','https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',...Object.values(IMG),...foods.map(food=>food.image),...stays.map(stay=>stay.image),...alternatives.map(alt=>alt.image),...days.map(day=>day.image),...routeVisuals.map(item=>item.image)];
$('#offlineButton').addEventListener('click',async()=>{
  if(!navigator.serviceWorker?.controller){notify('Ricarica una volta e riprova');return;}
  $('#offlineButton').textContent='0%';navigator.serviceWorker.controller.postMessage({type:'CACHE_URLS',urls:[...new Set(offlineUrls)]});
});
navigator.serviceWorker?.addEventListener('message',event=>{if(event.data?.type==='CACHE_PROGRESS'){$('#offlineButton').textContent=`${Math.round(event.data.done/event.data.total*100)}%`}if(event.data?.type==='CACHE_DONE'){$('#offlineButton').textContent='Offline ✓';notify('App e immagini salvate')}});
