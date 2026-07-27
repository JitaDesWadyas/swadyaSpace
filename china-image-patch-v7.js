(()=>{'use strict';const D=window.CHINA_GUIDE;if(!D)return;const wiki=(name,w=1600)=>`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=${w}`;const set=(city,group,index,file)=>{const item=D.destinations?.[city]?.visuals?.[group]?.[index];if(item)item[2]=wiki(file)};
set('chengdu','food',0,'Sichuan hotpot.jpg');
set('chengdu','food',1,'Dan Dan Noodles.jpg');
set('chengdu','food',2,'Chen Mapo Tofu.jpg');
set('chengdu','food',3,"People's Park (Chengdu) 20260513-6.jpg");
set('chengdu','activities',0,'Giant Panda at Chengdu Panda Base.jpg');
set('chengdu','activities',1,"People's Park (Chengdu) 20260513-5.jpg");
set('chengdu','activities',2,'Anshun Bridge in Chengdu.jpg');
set('chengdu','activities',3,'Sichuan Opera Face Changer (50427868601).jpg');
set('chengdu','activities',4,'Hall - Wenshu Monastery - Chengdu, China - DSC05232.jpg');
set('chongqing','food',0,'Sichuan hotpot.jpg');
set('chongqing','food',1,'Chongqing Xiaomian with fried eggs.jpg');
set('chongqing','activities',0,'Liziba Station.jpg');
set('chongqing','activities',1,'Hongyadong night lights Chongqing.jpg');
set('zhangjiajie','activities',0,'Zhangjiajie National Forest Park.jpg');
set('zhangjiajie','activities',1,'Zhangjiajie Glass Bridge.jpg');
set('zhangjiajie','activities',2,'Tianmen Mountain National Forest Park.jpg');
set('yangshuo','food',1,'Guilin mifan.jpg');
set('yangshuo','activities',0,'Yulong River Bamboo raft boatmen - panoramio.jpg');
set('yangshuo','activities',1,'YuLongRiver.jpg');
set('yangshuo','activities',2,'Li River, Yangshuo, China.jpg');
const c=D.destinations?.chongqing;if(c&&Array.isArray(c.gallery))c.gallery=c.gallery.map(x=>/Liziba%20Station(?:%20in%20Chongqing|%20Chongqing)?\.jpg/i.test(x)?wiki('Liziba Station 20180430 163101.jpg'):x);
const fallbackByTitle={
'Hotpot del Sichuan':'Sichuan hotpot.jpg','Dan dan noodles':'Dan-dan noodles, Shanghai.jpg','Mapo tofu':'Authentic Mapo Tofu.jpg','Tè al People’s Park':"People's Park (Chengdu) 20260513-5.jpg",'Panda Base':'Giant Panda at Chengdu Panda Base.jpg','People’s Park':"People's Park (Chengdu) 20260513-6.jpg",'Anshun Bridge':'Anshun Bridge in Chengdu.jpg','Opera Sichuan':'Sichuan opera (3772221986).jpg','Wenshu Monastery':'Wenshu Monastery (4110719662).jpg','Chongqing hotpot':'Sichuan hotpot.jpg','Xiaomian':'ChongQing Noodles, D Noodles, Paris 001.jpg','Liziba Station':'Liziba Station 20180430 163053.jpg','Hongyadong':'Hongyadong night lights Chongqing.jpg','Yuanjiajie':'Wulingyuan from Tianzi Mountain.jpg','Glass Bridge':'Zhangjiajie Glass Bridge.jpg','Tianmen Mountain':'Tianmen Mountain National Forest Park.jpg','Guilin rice noodles':'桂林米粉(Guilin Rice Noodle ).jpg','Bamboo rafting':'Yulong.JPG','E-bike tra i karst':'YULONG RIVER.jpg','Xingping':'Li River, Yangshuo, China.jpg'};
function bind(){document.querySelectorAll('.visual-card').forEach(card=>{const title=card.querySelector('h4')?.textContent?.trim(),img=card.querySelector('img');if(!title||!img||img.dataset.auditBound)return;img.dataset.auditBound='1';const alternate=fallbackByTitle[title];if(!alternate)return;img.addEventListener('error',()=>{if(img.dataset.auditRetry)return;img.dataset.auditRetry='1';img.src=wiki(alternate)}, {once:true})})}
new MutationObserver(bind).observe(document.body,{subtree:true,childList:true});document.addEventListener('DOMContentLoaded',bind);bind();})();