'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const store = {get(key,fallback){try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback}},set(key,value){localStorage.setItem(key,JSON.stringify(value))}};
const esc = (value = '') => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const amap = keyword => `https://uri.amap.com/search?keyword=${encodeURIComponent(keyword)}&src=swadyaspace&callnative=1`;
const google = (lat,lng,name) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng} ${name}`)}`;
const translate = text => `https://translate.google.com/?sl=it&tl=zh-CN&op=translate&text=${encodeURIComponent(text)}`;
const formatEuro = value => new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number(value)||0);
const {IMG,cities,categories,foods,places,days,dayGuides,budgetScenarios,routeVisuals,stays} = window.CHINA_TRIP_DATA;
const {phrases,simplePhrases,weather,periods,alternatives,transportCards,packingCards,checklist,sources} = window.CHINA_PRACTICAL_DATA;
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

function safeImg(src, alt, label = alt) { return `<img loading="lazy" src="${src}" alt="${esc(alt)}" onerror="this.parentElement.classList.add('image-missing');this.parentElement.dataset.label='${esc(label)}';this.remove()">`; }
function speakButton(cn, label) { return `<button class="speak-button" data-cn="${esc(cn)}" data-label="${esc(label)}">▶ Cinese</button>`; }
function foodLink(id) { const food = foods.find(item => item.id === id); return food ? `<a class="day-place" href="#food-${id}">🥢 ${esc(food.name)}</a>` : ''; }

$('#heroStats').innerHTML = [
  ['14','giorni'],['5','tappe'],[String(places.length),'luoghi'],['3','budget'],[String(foods.length),'piatti'],[String(phrases.length + simplePhrases.length),'frasi']
].map(([value,label]) => `<div class="stat-card"><strong>${value}</strong><span>${label}</span></div>`).join('');

$('#routeVisuals').innerHTML = routeVisuals.map(item => `<article class="route-visual" data-lightbox data-src="${item.image}" data-caption="${esc(item.city)} · ${esc(item.cn)}"><img loading="lazy" src="${item.image}" alt="${esc(item.city)}" onerror="this.parentElement.classList.add('image-missing');this.parentElement.dataset.label='${esc(item.cn)}';this.remove()"><div class="route-visual-copy"><span>${item.days} · ${item.cn}</span><h3>${item.city}</h3><p>${item.summary}</p></div></article>`).join('');

function placeDayNumbers(placeName) {
  return days.filter(day => day.links.includes(placeName)).map(day => day.n);
}

$('#dayList').innerHTML = days.map((day, index) => {
  const guide = dayGuides[day.n];
  const linkedPlaces = day.links.map(name => {
    const place = places.find(item => item.name === name);
    if (!place) return '';
    const id = places.indexOf(place);
    return `<a class="day-place" href="#map" data-place-id="${id}">📍 ${esc(place.name)} <b>${place.cn}</b></a>`;
  }).join('');
  const linkedFoods = day.food.map(id => {
    const food = foods.find(item => item.id === id);
    return food ? `<a class="day-food" href="#food-${id}" data-food-id="${id}">🥢 ${esc(food.name)}</a>` : '';
  }).join('');
  return `<details class="day-card" ${index === 1 ? 'open' : ''} id="day-${day.n}">
    <summary><span class="day-number">${day.n}</span><span class="day-summary"><strong>${day.title}</strong><span>${day.date} · ${day.city}</span></span></summary>
    <div class="day-body">
      <figure class="day-visual" data-lightbox data-src="${day.image}" data-caption="Giorno ${day.n} · ${esc(day.title)}">${safeImg(day.image,day.title,day.cn)}<figcaption class="day-caption"><span>${day.date} · ${day.cn}</span><h3>${day.title}</h3></figcaption></figure>
      <p class="day-intro">${day.lead}</p>
      <div class="day-guide"><article class="day-slot"><b>Mattina</b><p>${guide.morning}</p></article><article class="day-slot"><b>Pomeriggio</b><p>${guide.afternoon}</p></article><article class="day-slot"><b>Sera</b><p>${guide.evening}</p></article></div>
      <div class="day-logistics"><div class="day-info"><span>Spostamenti</span><strong>${guide.move}</strong></div><div class="day-info"><span>Spesa indicativa</span><strong>${guide.cost}</strong></div><div class="day-info"><span>Dove dormire</span><strong>${guide.stay}</strong></div></div>
      ${linkedPlaces ? `<h4 class="day-list-title">Luoghi di oggi</h4><div class="day-actions">${linkedPlaces}</div>` : ''}
      ${linkedFoods ? `<h4 class="day-list-title">Cosa mangiare</h4><div class="day-actions">${linkedFoods}</div>` : ''}
      <h4 class="day-list-title">Da ricordare</h4><ul>${day.tasks.map(task => `<li>${task}</li>`).join('')}</ul>
      <div class="day-phrase"><div><span>Frase utile</span><strong>${guide.phrase[1]}</strong><small>${guide.phrase[0]}</small></div>${speakButton(guide.phrase[1],guide.phrase[0])}</div>
    </div>
  </details>`;
}).join('');

$('#cityFilter').innerHTML = cities.map(city => `<option>${city}</option>`).join('');
$('#categoryFilter').innerHTML = categories.map(category => `<option>${category}</option>`).join('');
