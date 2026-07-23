const VERSION='china-app-v8-ordered-days';
const SHELL=['./china.html','./china-1.css','./china-2.css','./china-3.css','./china-data-core.js','./china-data-foods.js','./china-data-places.js','./china-data-itinerary.js','./china-data-stays.js','./china-practical-core.js','./china-practical-options.js','./china-practical-pack.js','./china-app-core.js','./china-app-map-budget.js','./china-app-content.js','./china-app-runtime.js','./manifest.webmanifest','./china-icon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==VERSION).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{
    if(response&&response.ok){const copy=response.clone();caches.open(VERSION).then(cache=>cache.put(event.request,copy)).catch(()=>{});}
    return response;
  }).catch(()=>event.request.mode==='navigate'?caches.match('./china.html'):Response.error())));
});
self.addEventListener('message',event=>{
  if(event.data?.type!=='CACHE_URLS')return;
  const urls=event.data.urls||[];
  event.waitUntil(caches.open(VERSION).then(async cache=>{
    let done=0;
    for(const url of urls){
      try{const sameOrigin=url.startsWith(self.location.origin)||url.startsWith('./')||url.startsWith('/');const request=new Request(url,{mode:sameOrigin?'same-origin':'no-cors'});const response=await fetch(request);await cache.put(request,response.clone())}catch{}
      done++;event.source?.postMessage({type:'CACHE_PROGRESS',done,total:urls.length});
    }
    event.source?.postMessage({type:'CACHE_DONE'});
  }));
});
