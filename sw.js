const VERSION='swadya-space-v10-lago-mobile-fix';
const SHELL=['./china.html','./china-1.css','./china-2.css','./china-3.css','./china-data-core.js','./china-data-foods.js','./china-data-places.js','./china-data-itinerary.js','./china-data-stays.js','./china-practical-core.js','./china-practical-options.js','./china-practical-pack.js','./china-app-core.js','./china-app-map-budget.js','./china-app-content.js','./china-app-runtime.js','./manifest.webmanifest','./china-icon.svg'];
const LAGO_FIX=`<style id="lago-mobile-runtime-fix">
html,body{min-height:100%!important;background:#031716!important}
body{position:relative!important;isolation:auto!important}
.page-water{position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;min-height:100vh!important;z-index:-10!important;background-image:linear-gradient(rgba(1,15,18,.22),rgba(1,10,12,.62)),url('assets/lago/underwater-background.png')!important;background-position:center!important;background-size:cover!important;background-repeat:no-repeat!important;transform:translateZ(0)!important;pointer-events:none!important}
.fish-layer{display:block!important;position:fixed!important;inset:0!important;z-index:-1!important;overflow:hidden!important;pointer-events:none!important;contain:layout paint!important}
.fish{display:block!important;position:absolute!important;left:-220px!important;width:180px!important;opacity:.34!important;animation:lagoFishSwim 24s linear infinite!important;will-change:transform!important;transform:translate3d(0,0,0)!important}
.fish.one{display:block!important;top:36%!important}
.fish.two{display:none!important}
.fish img{display:block!important;width:100%!important;height:auto!important}
@keyframes lagoFishSwim{0%{transform:translate3d(0,0,0)}100%{transform:translate3d(calc(100vw + 440px),0,0)}}
@media(min-width:700px){.fish.two{display:block!important;top:72%!important;width:150px!important;opacity:.2!important;animation-duration:34s!important;animation-delay:-14s!important}}
</style>`;
self.addEventListener('install',event=>{event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==VERSION).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const request=event.request;
  const url=new URL(request.url);
  const isNavigation=request.mode==='navigate'||request.destination==='document'||url.pathname.endsWith('.html')||url.pathname.endsWith('/');
  if(isNavigation){
    event.respondWith(fetch(request,{cache:'no-store'}).then(async response=>{
      if(!response||!response.ok)return response;
      let finalResponse=response;
      if(url.pathname.endsWith('/lago-in-giornata.html')){
        const html=await response.clone().text();
        const patched=html.includes('lago-mobile-runtime-fix')?html:html.replace('</head>',`${LAGO_FIX}</head>`);
        finalResponse=new Response(patched,{status:response.status,statusText:response.statusText,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
      }
      const copy=finalResponse.clone();
      caches.open(VERSION).then(cache=>cache.put(request,copy)).catch(()=>{});
      return finalResponse;
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