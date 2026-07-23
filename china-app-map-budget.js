let map, mapMarkers = [], userMarker;
const categoryColor = {'Dormire':'#276e5b','Cibo':'#c58b26','Attività':'#7a4595','Natura':'#3572a6','Acquisti':'#941f24','Sera':'#241915','Trasporto':'#6d5d54','Utilità':'#2f7f84'};

function markerIcon(place) {
  return L.divIcon({className:'',html:`<span style="display:grid;width:25px;height:25px;place-items:center;border:2px solid white;border-radius:50%;color:white;background:${categoryColor[place.category]};font-size:11px;font-weight:900;box-shadow:0 3px 10px #0005">${places.indexOf(place)+1}</span>`,iconSize:[25,25],iconAnchor:[12,12]});
}
function initMap() {
  if (!window.L) { $('#tripMap').innerHTML = '<p style="padding:20px">Mappa non disponibile offline. L’elenco dei punti resta utilizzabile.</p>'; return; }
  map = L.map('tripMap', {scrollWheelZoom:false, zoomControl:true});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:18,attribution:'&copy; OpenStreetMap'}).addTo(map);
  mapMarkers = places.map(place => {
    const marker = L.marker([place.lat, place.lng], {icon:markerIcon(place)}).bindPopup(`<strong>${place.name}</strong><br>${place.cn}<br>${place.why}<br><a href="${amap(place.cn)}" target="_blank" rel="noopener">Amap</a>`).addTo(map);
    marker.place = place; return marker;
  });
  const route = [[22.31,114.17],[22.54,114.1],[22.19,113.55],[34.27,108.95],[39.91,116.4]];
  L.polyline(route,{color:'#941f24',weight:4,dashArray:'9 8',opacity:.75}).addTo(map);
  map.fitBounds(L.latLngBounds(route).pad(.08));
}

function renderPlaces() {
  const city = $('#cityFilter').value;
  const category = $('#categoryFilter').value;
  const query = $('#placeSearch').value.trim().toLowerCase();
  const filtered = places.filter(place => (city === 'Tutte' || place.city === city) && (category === 'Tutte' || place.category === category) && (!query || `${place.city} ${place.name} ${place.cn} ${place.why}`.toLowerCase().includes(query)));
  const groupedCities = [...new Set(filtered.map(place => place.city))];
  $('#placeList').innerHTML = groupedCities.map(groupCity => {
    const cityPlaces = filtered.filter(place => place.city === groupCity);
    const shouldOpen = city !== 'Tutte' || query.length > 0 || category !== 'Tutte';
    return `<details class="city-place-group" data-city-group="${esc(groupCity)}" ${shouldOpen ? 'open' : ''}><summary><span></span><span><strong>${esc(groupCity)}</strong><span>${cityPlaces.length} luoghi collegati al viaggio</span></span></summary><div class="city-place-body"><div class="place-grid">${cityPlaces.map(place => {
      const id = places.indexOf(place);
      const dayNums = placeDayNumbers(place.name);
      return `<article class="place-card" id="place-${id}"><div class="place-top"><h3>${place.name}<span class="cn-line">${place.cn}</span></h3><span class="category-label">${place.category}</span></div><p>${place.why}</p><p><strong>Quando:</strong> ${place.when}${dayNums.length ? ` · <strong>Giorno ${dayNums.join(', ')}</strong>` : ''}</p><div class="link-row"><a class="mini-button" href="${amap(place.cn)}" target="_blank" rel="noopener">Amap</a><a class="mini-button" href="${google(place.lat,place.lng,place.name)}" target="_blank" rel="noopener">Mappa</a>${speakButton(place.cn, place.name)}<button class="mini-button" data-copy="${esc(place.cn)}">Copia</button></div></article>`;
    }).join('')}</div></div></details>`;
  }).join('') || '<p>Nessun punto corrisponde ai filtri.</p>';
  if (map) mapMarkers.forEach(marker => { const show = filtered.includes(marker.place); if (show && !map.hasLayer(marker)) marker.addTo(map); if (!show && map.hasLayer(marker)) map.removeLayer(marker); });
}
['change','input'].forEach(eventName => { $('#cityFilter').addEventListener(eventName, renderPlaces); $('#categoryFilter').addEventListener(eventName, renderPlaces); $('#placeSearch').addEventListener(eventName, renderPlaces); });
initMap(); renderPlaces();

function haversine(lat1,lng1,lat2,lng2) { const R=6371,toRad=v=>v*Math.PI/180; const dLat=toRad(lat2-lat1),dLng=toRad(lng2-lng1); const a=Math.sin(dLat/2)**2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2; return 2*R*Math.asin(Math.sqrt(a)); }
function locateUser() {
  if (!navigator.geolocation) { notify('GPS non disponibile'); return; }
  $('#gpsResult').hidden = false; $('#gpsResult').textContent = 'Ricerca posizione…';
  navigator.geolocation.getCurrentPosition(position => {
    const {latitude,longitude} = position.coords;
    const nearest = places.map(place => ({...place,distance:haversine(latitude,longitude,place.lat,place.lng)})).sort((a,b)=>a.distance-b.distance).slice(0,6);
    $('#gpsResult').innerHTML = `<strong>Punti più vicini</strong><div class="tag-row">${nearest.map(place => `<a class="tag" href="${amap(place.cn)}" target="_blank" rel="noopener">${place.name} · ${place.distance<1?Math.round(place.distance*1000)+' m':place.distance.toFixed(1)+' km'}</a>`).join('')}</div>`;
    if (map) { if (userMarker) map.removeLayer(userMarker); userMarker = L.circleMarker([latitude,longitude],{radius:9,color:'#fff',weight:3,fillColor:'#276e5b',fillOpacity:1}).addTo(map).bindPopup('La tua posizione approssimativa').openPopup(); map.setView([latitude,longitude],13); }
  }, error => { $('#gpsResult').textContent = `GPS non disponibile: ${error.message}`; }, {enableHighAccuracy:true,timeout:12000,maximumAge:60000});
}
$('#locateButton').addEventListener('click', locateUser); $('#nearestHero').addEventListener('click', () => { $('#map').scrollIntoView({behavior:'smooth'}); setTimeout(locateUser,400); });

$('#budgetTabs').innerHTML = Object.entries(budgetScenarios).map(([key,value]) => `<button class="budget-tab ${key === 'mid' ? 'active' : ''}" data-budget-key="${key}">${value.label}</button>`).join('');
function renderBudget(key='mid') {
  const scenario = budgetScenarios[key];
  $('#tripBudget').innerHTML = `<article class="budget-total-card"><span>Totale stimato a persona</span><strong>${formatEuro(scenario.total)}</strong><p>${scenario.note}</p></article><div class="budget-lines">${scenario.lines.map(([label,value]) => `<div class="budget-line"><span>${label}</span><strong>${formatEuro(value)}</strong></div>`).join('')}</div>`;
}
renderBudget();
$('#budgetTabs').addEventListener('click', event => { const button = event.target.closest('[data-budget-key]'); if (!button) return; $$('.budget-tab').forEach(item => item.classList.remove('active')); button.classList.add('active'); renderBudget(button.dataset.budgetKey); });

const stayCosts = store.get('china-stay-costs', {});
