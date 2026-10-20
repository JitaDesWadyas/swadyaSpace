#!/usr/bin/env python3
"""Build a versioned, local Chile photo catalogue from Wikimedia Commons.

Only include successfully downloaded images. Captions and source URLs are retained
in photos.json. Run in CI: no unreliable client-side MediaWiki queries.
"""
import io, json, os, pathlib, time, urllib.parse, urllib.request
from PIL import Image, ImageOps

BASE=pathlib.Path("assets/chile")
BASE.mkdir(parents=True, exist_ok=True)
CATEGORIES=[
 ("Santiago","Santiago Chile city skyline"),("Lastarria","Barrio Lastarria Santiago Chile"),
 ("Providencia","Providencia Santiago Chile"),("Cerro Santa Lucía","Cerro Santa Lucia Santiago"),
 ("La Vega Central","La Vega Central Santiago"),("Cerro San Cristóbal","Cerro San Cristobal Santiago"),
 ("Barrio Italia","Barrio Italia Santiago"),
 ("Villarrica","Villarrica Chile city lake"),("Lago Villarrica","Lago Villarrica Chile"),
 ("Volcán Villarrica","Volcan Villarrica Chile"),("Playa Pucará","Playa Pucara Villarrica"),
 ("Mercado Fritz","Mercado Fritz Villarrica"),
 ("Pucón","Pucon Chile town"),("Playa Pucón","Playa Grande Pucon Chile"),
 ("Trancura","Trancura river Chile rafting"),("Huerquehue","Huerquehue National Park Chile"),
 ("Licán Ray","Lican Ray Lago Calafquen"),("Puerto Varas","Puerto Varas Chile town"),
 ("Llanquihue","Lago Llanquihue Chile"),("Frutillar","Frutillar Chile Teatro Lago"),
 ("Petrohué","Saltos del Petrohue Chile"),("Volcán Osorno","Volcan Osorno Chile"),
 ("Castro","Castro Chiloe palafitos"),("Chiloé","Chiloe Chile island"),
 ("Dalcahue","Dalcahue Chiloe Chile"),
]
UA="SwadyaSpacePhotoBuilder/1.0 (noncommercial illustrated travel guide; github.com/JitaDesWadyas/swadyaSpace)"
def get(url):
 req=urllib.request.Request(url,headers={"User-Agent":UA,"Accept":"application/json,image/*"})
 for attempt in range(3):
  try:
   with urllib.request.urlopen(req,timeout=23) as res:return res.read()
  except Exception as ex:
   print("Retry",attempt,url[:110],ex,flush=True)
   time.sleep(2*(attempt+1))
 return None

data=[];seen=set()
for place,term in CATEGORIES:
 qs=urllib.parse.urlencode(dict(action="query",generator="search",gsrsearch="filetype:bitmap "+term,gsrnamespace=6,gsrlimit=12,prop="imageinfo",iiprop="url|size|mime",iiurlwidth=800,format="json"))
 body=get("https://commons.wikimedia.org/w/api.php?"+qs)
 if not body:continue
 try:pages=list(json.loads(body).get("query",{}).get("pages",{}).values())
 except Exception as ex:print("Invalid JSON",ex);continue
 downloaded=0
 for page in pages:
  if downloaded>=5:break
  title=page.get("title","");info=(page.get("imageinfo") or [{}])[0]
  uri=info.get("thumburl") or info.get("url")
  if not uri or title in seen or not title.lower().endswith((".jpg",".jpeg",".png",".webp")):continue
  if info.get("size",0)>22_000_000:continue
  payload=get(uri)
  if not payload:continue
  try:
   im=Image.open(io.BytesIO(payload));im=ImageOps.exif_transpose(im)
   if min(im.size)<380:continue
   im.thumbnail((850,650),Image.Resampling.LANCZOS)
   im=im.convert("RGB")
   dest=BASE/("photo-%03d.jpg"%(len(data)+1))
   im.save(dest,"JPEG",quality=76,optimize=True,progressive=True)
  except Exception as ex:print("Invalid image",title,ex);continue
  seen.add(title);downloaded+=1
  source=info.get("descriptionurl") or "https://commons.wikimedia.org/wiki/"+urllib.parse.quote(title.replace(" ","_"))
  data.append(dict(place=place,title=title,src=str(dest).replace(os.sep,"/"),source=source))
 print(place,downloaded,"total",len(data),flush=True)
 (BASE/"photos.json").write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding="utf-8")
print("DONE",len(data),"photos",flush=True)
if len(data)<12:
 raise SystemExit("Insufficient usable photos: do not commit an empty gallery")
