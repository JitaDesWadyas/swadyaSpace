(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const esc = (value='') => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[char]));
  const googleUrl = text => `https://translate.google.com/?sl=it&tl=zh-CN&op=translate&text=${encodeURIComponent(text)}`;
  const phrases = [
    ['Hotel','Siamo quattro turisti italiani. Potete registrarci?','我们是四名意大利游客。酒店可以为我们办理入住和住宿登记吗？'],
    ['Hotel','Mostri questo indirizzo al tassista.','请把这个地址给司机看。'],
    ['Cibo','Niente verdure, coriandolo né cipollotto.','不要蔬菜，不要香菜，也不要葱。'],
    ['Cibo','Non piccante, per favore.','请不要辣。'],
    ['Cibo','Siamo in quattro. Possiamo sederci qui?','我们四个人，可以坐这里吗？'],
    ['Cibo','Il conto, per favore.','请买单。'],
    ['Trasporto','Vogliamo andare qui. È il mezzo giusto?','我们要去这里。这趟车对吗？'],
    ['Trasporto','Ci porti a questo hotel, per favore.','请带我们去这家酒店。'],
    ['SIM','Vorrei una SIM breve soprattutto per Internet.','我持外国护照，想办理一张短期手机卡，主要需要流量。'],
    ['Acquisti','Quanto costa? Possiamo provarlo prima?','多少钱？我们可以先试一下吗？'],
    ['Aiuto','Ci siamo persi. Può aiutarci?','我们迷路了。可以帮帮我们吗？'],
    ['Aiuto','Ho bisogno di un medico.','我需要医生。'],
    ['Aiuto','Chiami la polizia, per favore.','请帮我报警。'],
    ['Aiuto','Dov’è il bagno?','洗手间在哪里？'],
    ['Bagagli','Possiamo spedire questa valigia al prossimo hotel?','可以用顺丰把这个行李箱寄到下一家酒店吗？'],
    ['Lavanderia','Dov’è una lavanderia self-service vicina?','附近有自助洗衣店吗？']
  ];

  const grid = $('#phraseGrid');
  if (grid) {
    const groups = [...new Set(phrases.map(item=>item[0]))];
    grid.innerHTML = groups.map(group=>`<section class="phrase-group"><h3>${esc(group)}</h3><div class="phrase-list">${phrases.filter(item=>item[0]===group).map(([,it,cn])=>`<article class="phrase-row"><div><strong>${esc(it)}</strong><span>${cn}</span></div><div class="phrase-row-actions"><button class="speak-button" data-cn="${cn}" data-label="${esc(it)}">▶ Cinese</button><button class="mini-button" data-show-cn="${cn}" data-label="${esc(it)}">Grande</button><button class="mini-button" data-copy="${cn}">Copia</button></div></article>`).join('')}</div></section>`).join('');
  }

  const input=$('#italianInput'), output=$('#translationOutput'), note=$('#translationNote'), fallback=$('#translateFallback');
  if (!input || !output || !note || !fallback) return;
  let current='';
  let voices=[];const refresh=()=>voices=window.speechSynthesis?.getVoices?.()||[];refresh();if('speechSynthesis'in window)window.speechSynthesis.onvoiceschanged=refresh;
  const speak=text=>{if(!text)return;if(!('speechSynthesis'in window)){window.open(`https://translate.google.com/?sl=zh-CN&tl=it&op=translate&text=${encodeURIComponent(text)}`,'_blank');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=.78;u.voice=voices.find(v=>v.lang.toLowerCase()==='zh-cn')||voices.find(v=>v.lang.toLowerCase().startsWith('zh'))||null;speechSynthesis.speak(u)};
  const copy=async text=>{if(!text)return;try{await navigator.clipboard.writeText(text)}catch{const area=document.createElement('textarea');area.value=text;document.body.appendChild(area);area.select();document.execCommand('copy');area.remove()}};
  const words=value=>value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(word=>word.length>2);
  function offlineMatch(query){const queryWords=words(query);let best=null,bestScore=0;for(const item of phrases){const candidates=new Set(words(item[0]+' '+item[1]));const score=queryWords.reduce((sum,word)=>sum+(candidates.has(word)?2:[...candidates].some(candidate=>candidate.includes(word)||word.includes(candidate))?1:0),0);if(score>bestScore){best=item;bestScore=score}}return bestScore?best:null}
  function setResult(text,message){current=text||'';output.textContent=current||'译文';note.textContent=message;fallback.href=googleUrl(input.value.trim())}
  async function translate(){const source=input.value.trim();if(!source){setResult('','Scrivi una frase in italiano.');return}note.textContent=navigator.onLine?'Traduzione in corso…':'Offline: cerco tra le frasi salvate…';fallback.href=googleUrl(source);if(navigator.onLine){try{const response=await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=it&tl=zh-CN&dt=t&q=${encodeURIComponent(source)}`,{cache:'no-store'});if(!response.ok)throw new Error();const data=await response.json();const translated=data?.[0]?.map(item=>item?.[0]||'').join('');if(translated){setResult(translated,'Traduzione online pronta: pronunciala o mostrala grande.');return}}catch{}}const match=offlineMatch(source);if(match)setResult(match[2],`Frase offline più vicina: ${match[1]}`);else setResult('','Nessuna frase offline adatta. Usa Google Translate quando torna la rete.')}

  $('#translateNow')?.addEventListener('click',translate);
  input.addEventListener('input',()=>fallback.href=googleUrl(input.value.trim()));
  input.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter')translate()});
  $('#speakTranslation')?.addEventListener('click',()=>speak(current));
  $('#copyTranslation')?.addEventListener('click',()=>copy(current));
  $('#clearTranslation')?.addEventListener('click',()=>{input.value='';setResult('','La traduzione apparirà qui.');input.focus()});
  $('#showTranslation')?.addEventListener('click',()=>{if(!current)return;const dialog=$('#speakDialog');if(dialog){$('#speakLabel').textContent=input.value.trim()||'Traduzione';$('#speakText').textContent=current;dialog.showModal()}});
  fallback.href=googleUrl('');

  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;const dictate=$('#dictateItalian');
  if(Recognition&&dictate){dictate.addEventListener('click',()=>{const recognition=new Recognition();recognition.lang='it-IT';recognition.interimResults=false;dictate.textContent='🎙 Ascolto…';recognition.onresult=event=>{input.value=event.results[0][0].transcript;translate()};recognition.onend=()=>dictate.textContent='🎙 Dettatura';recognition.onerror=()=>dictate.textContent='🎙 Dettatura';recognition.start()})}else if(dictate){dictate.disabled=true;dictate.title='Dettatura non supportata dal browser'}
})();
