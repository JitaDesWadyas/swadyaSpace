const VERSION='china-app-v1';
const SHELL=['./china.html','./china.css','./china-detail.js','./manifest.webmanifest','./china-icon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{
    const copy=response.clone();
    caches.open(VERSION).then(cache=>cache.put(event.request,copy)).catch(()=>{});
    return response;
  }).catch(()=>caches.match('./china.html'))));
});
self.addEventListener('message',event=>{
  if(event.data?.type!=='CACHE_URLS')return;
  const urls=event.data.urls||[];
  event.waitUntil(caches.open(VERSION).then(async cache=>{
    let done=0;
    for(const url of urls){
      try{const request=new Request(url,{mode:url.startsWith(self.location.origin)?'same-origin':'no-cors'});const response=await fetch(request);await cache.put(request,response.clone())}catch{}
      done++;event.source?.postMessage({type:'CACHE_PROGRESS',done,total:urls.length});
    }
    event.source?.postMessage({type:'CACHE_DONE'});
  }));
});
