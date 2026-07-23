function renderStayTotal() { const total = Object.values(stayCosts).reduce((sum,value)=>sum+(Number(value)||0),0); $('#stayTotal').textContent=formatEuro(total); $('#stayPerPerson').textContent=formatEuro(total/4); }
const stayLow = 425, stayMid = 650, stayHigh = 920;
$('#staySummary').innerHTML = `<article class="stay-summary-card"><span>Obiettivo tirato · 4 persone</span><strong>${formatEuro(stayLow)}</strong></article><article class="stay-summary-card"><span>Obiettivo realistico · 4 persone</span><strong>${formatEuro(stayMid)}</strong></article><article class="stay-summary-card"><span>Realistico a persona</span><strong>${formatEuro(stayMid/4)}</strong></article>`;
$('#stayList').innerHTML = stays.map((stay,index) => `<details class="fold-card" ${index===1?'open':''}>
  <summary><span></span><span class="fold-title"><strong>${stay.city} · ${stay.nights} notti</strong><span>${stay.area}</span></span></summary>
  <div class="fold-body"><div class="stay-layout"><figure class="media-frame" data-lightbox data-src="${stay.image}" data-caption="${esc(stay.city)}">${safeImg(stay.image,stay.city,stay.city)}</figure><div>
    <div class="price-grid"><div class="price-box"><span>Fascia per quattro</span><strong>${stay.target}</strong></div><div class="price-box"><span>Zona</span><strong>${stay.area}</strong></div></div>
    <p>${stay.why}</p><p><strong>Collegamenti:</strong> ${stay.move}</p><p><strong>Catene/formato:</strong> ${stay.chains}</p>
    <div class="tag-row">${stay.search.map(term=>`<button class="tag" data-copy="${term}">${term}</button>`).join('')}</div>
    <div class="link-row"><a class="mini-button" href="${amap(stay.area)}" target="_blank" rel="noopener">Amap zona</a>${speakButton('我们是四名意大利游客，持意大利护照。酒店可以为我们办理入住和住宿登记吗？','Check-in hotel')}</div>
  </div></div></div>
</details>`).join('');
$('#stayCostInputs').className = 'cost-list';
$('#stayCostInputs').innerHTML = stays.filter(stay => stay.nights > 0).map(stay => `<div class="cost-row"><label for="cost-${stay.id}">${stay.city} · totale trovato per ${stay.nights} notti</label><input class="cost-input" id="cost-${stay.id}" data-stay-cost="${stay.id}" type="number" min="0" step="1" value="${stayCosts[stay.id]||''}" placeholder="€"></div>`).join('');
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
  $('#foodGrid').innerHTML = foods.filter(food=>city==='Tutti'||food.city===city).map(food=>`<article class="food-card" id="food-${food.id}"><figure data-lightbox data-src="${food.image}" data-caption="${esc(food.name)} · ${food.cn}">${safeImg(food.image,food.name,food.cn)}</figure><div class="food-card-body"><h3>${food.name}<span class="cn-line">${food.cn}</span></h3><div class="tag-row">${food.tags.map(tag=>`<span class="tag">${tag}</span>`).join('')}</div><span class="food-label">Cosa contiene</span><p>${food.contains}</p><span class="food-label">Preparazione</span><p>${food.how}</p><span class="food-label">Dove e quando</span><p>${food.where}</p><div class="link-row"><a class="mini-button" href="${amap(`${food.city} ${food.cn}`)}" target="_blank" rel="noopener">Amap</a>${speakButton(food.cn,food.name)}<button class="mini-button" data-show-cn="${esc(food.cn)}" data-label="${esc(food.name)}">Mostra</button></div></div></article>`).join('');
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
$('#alternativeList').innerHTML = alternatives.map(alt=>`<article class="alternative-card"><figure data-lightbox data-src="${alt.image}" data-caption="${esc(alt.name)}">${safeImg(alt.image,alt.name,alt.name)}</figure><div class="alternative-body"><h3>${alt.name}</h3><p><strong>${alt.nights}</strong></p><p>${alt.why}</p><p><strong>Quando sceglierla:</strong> ${alt.choose}</p><div class="swap-box">${alt.swap}</div></div></article>`).join('');

$('#simplePhrases').innerHTML = simplePhrases.map(([it,cn]) => `<article class="simple-phrase"><div><strong>${esc(it)}</strong><span>${esc(cn)}</span></div><button data-cn="${esc(cn)}" aria-label="Pronuncia ${esc(it)}">▶</button></article>`).join('');

const phraseGroups = [...new Set(phrases.map(phrase => phrase.group))];
$('#phraseGrid').innerHTML = phraseGroups.map(group => {
  const items = phrases.filter(phrase => phrase.group === group);
  return `<section class="phrase-group"><h3>${esc(group)}</h3><div class="phrase-list">${items.map(phrase => `<article class="phrase-row"><div><strong>${esc(phrase.it)}</strong><span>${esc(phrase.cn)}</span></div><div class="phrase-row-actions">${speakButton(phrase.cn,phrase.it)}<button class="mini-button" data-show-cn="${esc(phrase.cn)}" data-label="${esc(phrase.it)}">Grande</button><button class="mini-button" data-copy="${esc(phrase.cn)}">Copia</button></div></article>`).join('')}</div></section>`;
}).join('');

const italianInput = $('#italianInput');
const translationOutput = $('#translationOutput');
const translationNote = $('#translationNote');
const fallbackLink = $('#translateFallback');
let currentTranslation = '';

function normalizeWords(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(word => word.length > 2);
}

function bestOfflinePhrase(query) {
  const queryWords = normalizeWords(query);
  if (!queryWords.length) return null;
  let best = null;
  let bestScore = 0;
  for (const phrase of phrases) {
    const phraseWords = new Set(normalizeWords(`${phrase.it} ${phrase.group}`));
    const score = queryWords.reduce((sum, word) => sum + (phraseWords.has(word) ? 2 : [...phraseWords].some(candidate => candidate.includes(word) || word.includes(candidate)) ? 1 : 0), 0);
    if (score > bestScore) { best = phrase; bestScore = score; }
  }
  return bestScore > 0 ? best : null;
}

function setTranslation(text, note) {
  currentTranslation = text || '';
  translationOutput.textContent = currentTranslation || '译文';
  translationNote.textContent = note;
  fallbackLink.href = translate(italianInput.value.trim());
}
