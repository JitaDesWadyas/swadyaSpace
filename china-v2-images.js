(()=>{
'use strict';
const photos={
  mountains:'https://images.unsplash.com/photo-1596126501929-1bd88c13fb0c?auto=format&fit=crop&w=1800&q=85',
  bridge:'https://images.unsplash.com/photo-1700580180207-c7a86416b60d?auto=format&fit=crop&w=1800&q=85',
  landscape:'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=85',
  lake:'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=85',
  travel:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85',
  city:'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85',
  food:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85'
};
const route=[photos.travel,photos.city,photos.mountains,photos.bridge,photos.city,photos.lake];
const gallery=[photos.mountains,photos.city,photos.travel,photos.bridge,photos.lake,photos.landscape];
const days=[photos.city,photos.travel,photos.city,photos.city,photos.city,photos.mountains,photos.mountains,photos.bridge,photos.bridge,photos.bridge,photos.city,photos.lake,photos.landscape,photos.lake];
const activities=[photos.bridge,photos.mountains,photos.lake,photos.landscape,photos.mountains,photos.city];
const foods=[photos.food,photos.food,photos.food,photos.food,photos.food,photos.food,photos.food,photos.travel];
const setBg=(el,url)=>{if(el)el.style.backgroundImage=`linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.5)),url("${url}")`;};
const replaceAll=()=>{
  setBg(document.querySelector('.hero-bg'),photos.mountains);
  document.querySelectorAll('.route-stop').forEach((el,i)=>setBg(el,route[i%route.length]));
  document.querySelectorAll('.day-photo').forEach((el,i)=>setBg(el,days[i%days.length]));
  document.querySelectorAll('#galleryGrid img').forEach((el,i)=>{el.src=gallery[i%gallery.length];el.closest('button')?.setAttribute('data-image',gallery[i%gallery.length]);});
  document.querySelectorAll('#activityGrid img').forEach((el,i)=>el.src=activities[i%activities.length]);
  document.querySelectorAll('#foodGrid img').forEach((el,i)=>el.src=foods[i%foods.length]);
  document.querySelectorAll('img').forEach((el,i)=>{
    el.referrerPolicy='no-referrer';
    el.addEventListener('error',()=>{el.src=gallery[i%gallery.length];},{once:true});
  });
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(replaceAll));
else requestAnimationFrame(replaceAll);
setTimeout(replaceAll,700);
})();