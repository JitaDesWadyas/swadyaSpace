const VERSION='swadya-space-v9-network-first';
const SHELL=['./china.html','./china-1.css','./china-2.css','./china-3.css','./china-data-core.js','./china-data-foods.js','./china-data-places.js','./china-data-itinerary.js','./china-data-stays.js','./china-practical-core.js','./china-practical-options.js','./china-practical-pack.js','./china-app-core.js','./china-app-map-budget.js','./china-app-content.js','./china-app-runtime.js','./manifest.webmanifest','./china-icon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==VERSION).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const request=event.request;
  const url=new URL(request.url);
  const isNavigation=request.mode==='navigate'||request.destination==='document'||url.pathname.endsWith('.html')||url.pathname.endsWith('/');
  if(isNavigation){
    event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{
      if(response&&response.ok){const copy=response.clone();caches.open(VERSION).then(cache=>cache.put(request,copy)).catch(()=>{});}
      return response;
    }).catch(()=>caches.match(request).then(hit=>hit||caches.match('./china.html'))));
    return;
  }
  event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(response=>{
    if(response&&response.ok&&url.origin===self.location.origin){const copy=response.clone();caches.open(VERSION).then(cache=>cache.put(request,copy)).catch(()=>{});}
    return response;
  })));
});
self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING'){self.skipWaiting();return;}
  if(event.data?.type!=='CACHE_URLS')return;
  const urls=event.data.urls||[];
  event.waitUntil(caches.open(VERSION).then(async cache=>{
    let done=0;
    for(const url of urls){
      try{const sameOrigin=url.startsWith(self.location.origin)||url.startsWith('./')||url.startsWith('/');const request=new Request(url,{mode:sameOrigin?'same-origin':'no-cors'});const response=await fetch(request,{cache:'reload'});await cache.put(request,response.clone())}catch{}
      done++;event.source?.postMessage({type:'CACHE_PROGRESS',done,total:urls.length});
    }
    event.source?.postMessage({type:'CACHE_DONE'});
  }));
});