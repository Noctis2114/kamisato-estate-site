(() => {
 const $=id=>document.getElementById(id),P=EstateScenePolicy;
 window.createSceneControls=({read,write,onScene})=>{
  let behaviour=read('scene_behaviour','fixed');if(behaviour==='time')behaviour='daily';if(!['fixed','daily','weather'].includes(behaviour))behaviour='fixed';
  let fixed=read('workspace_scene','rain');if(!Object.hasOwn(P.scenes,fixed))fixed='rain';
  let mood=read('scene_mood','auto');if(!['auto','0','1','2'].includes(mood))mood='auto';
  let matchFestivals=read('match_festivals','yes')!=='no',seasonal=read('match_season','no')==='yes',category='all';
  let observedDoc=null,estateObserver=null;
  function estateTheme(){
   const doc=$('classic-frame')?.contentDocument;let stored={};
   try{const parsed=JSON.parse(localStorage.getItem('ayaka_estate_seasons')||'{}');if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))stored=parsed;if(localStorage.getItem('ayaka_festivals')==='off')return {festival:'none',season:doc?.documentElement.dataset.season||stored.season};}catch{}
   // The original Estate owns calendar/hemisphere resolution; use its resolved state.
   return {festival:doc?.documentElement.dataset.festival||stored.festival||'none',season:doc?.documentElement.dataset.season||stored.season};
  }
  let weather=null,busy=false,cityBusy=false,request=0,lastAttempt=0,current=fixed;
  const validCity=c=>c&&typeof c.name==='string'&&c.name.trim().length>0&&Number.isFinite(c.lat)&&Math.abs(c.lat)<=90&&Number.isFinite(c.lon)&&Math.abs(c.lon)<=180;
  let city;try{city=JSON.parse(read('weather_city','null'));}catch{}
  if(!validCity(city))city={name:'Singapore',lat:1.29,lon:103.85};
  const names=Object.keys(P.scenes);
  $('scene').replaceChildren(...names.map(key=>{const o=document.createElement('option');o.value=key;o.textContent=P.scenes[key].name;return o;}));
  for(const key of names){const data=P.scenes[key],b=document.createElement('button');b.type='button';b.className='scene-tile';b.dataset.choice=key;b.setAttribute('aria-label',data.name+'. '+data.description);const img=document.createElement('span');img.className='scene-thumb';img.style.backgroundImage=`url("${data.image}")`;const label=document.createElement('span');label.textContent=data.name;b.append(img,label);b.addEventListener('click',()=>choose(key));$('scene-gallery').append(b);}
  function hour(){if(behaviour==='weather'&&weather?.timezone){try{return Number(new Intl.DateTimeFormat('en-GB',{hour:'numeric',hourCycle:'h23',timeZone:weather.timezone}).format(new Date()));}catch{}}return new Date().getHours();}
  function render(){
   const fresh=weather&&Date.now()-weather.at<90*60*1000?weather:null,theme=estateTheme();
   current=P.resolve(behaviour,fixed,hour(),fresh,{matchFestivals,festival:theme.festival,seasonal,season:theme.season,date:new Date()});
   const look=mood==='auto'?P.moodAt(hour()):Number(mood),festive=matchFestivals&&P.festivals[theme.festival];
   $('behaviour').value=behaviour;$('weather-location').hidden=behaviour!=='weather';$('scene').value=current;
   $('match-festivals').checked=matchFestivals;$('match-season').checked=seasonal;$('seasonal-option').hidden=behaviour!=='daily';
   $('mood').value=mood;$('mood-status').textContent=mood==='auto'?'Automatic · Day 07:00–17:00 · Golden hour 17:00–20:00 · Night 20:00–07:00.':'Keeping '+P.scenes[current].looks[look].toLowerCase()+' lighting until you change it.';
   $('scene-summary').textContent=P.scenes[current].name;
   $('scene-gallery').querySelectorAll('button').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.choice===current));const d=P.scenes[b.dataset.choice],night=['night','startrails','aurora','fireflies','volcano','city'].includes(b.dataset.choice);b.hidden=category==='japan'?!['blossom','spiderlily','wisteria','lotus','torii','fireflies'].includes(b.dataset.choice):category==='festive'?!d.festival:category==='night'?!night:category==='nature'?!!d.festival||night:false;});
   if(!$('variations').children.length){$('variations').replaceChildren(...['Day','Golden hour','Night'].map((name,i)=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.addEventListener('click',()=>{mood=String(i);write('scene_mood',mood);render();});return b;}));}
   [...$('variations').children].forEach((b,i)=>b.setAttribute('aria-pressed',String(i===look)));
   const status=festive?'Matching the Estate’s '+festive+' theme. '+(behaviour==='daily'?'Daily rotation resumes when the festival ends.':'Your regular wallpaper returns when the festival ends.'):behaviour==='fixed'?'Keeping this wallpaper until you change it.':behaviour==='daily'?'One wallpaper for the whole day. Changes at local midnight.'+(seasonal?' Seasonal choices follow the Estate.':''):fresh?`${city.name} · ${fresh.label} · updates every 15 minutes.`:busy?`Checking weather for ${city.name}…`:'Weather unavailable — following your device’s time until it returns.';
   $('scene-status').textContent=status;$('scene-follow-label').textContent=(festive?'Estate festival':behaviour==='fixed'?'Kept until you change it':behaviour==='daily'?'Today’s wallpaper':fresh?`${city.name} · ${fresh.label}`:'Following time · weather unavailable')+' · '+P.scenes[current].looks[look];
   onScene(current,look);
  }
  function cancelRequests(){request++;busy=false;cityBusy=false;$('city-message').textContent='';}
  function choose(key){fixed=key;behaviour='fixed';matchFestivals=false;cancelRequests();write('workspace_scene',key);write('scene_behaviour',behaviour);write('match_festivals','no');render();}
  $('mood').addEventListener('change',e=>{mood=e.target.value;write('scene_mood',mood);render();});
  $('match-festivals').addEventListener('change',e=>{matchFestivals=e.target.checked;write('match_festivals',matchFestivals?'yes':'no');render();});
  $('match-season').addEventListener('change',e=>{seasonal=e.target.checked;write('match_season',seasonal?'yes':'no');render();});
  document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;document.querySelectorAll('[data-category]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
  function observeEstate(){const doc=$('classic-frame')?.contentDocument;if(!doc||doc===observedDoc)return;estateObserver?.disconnect();observedDoc=doc;estateObserver=new MutationObserver(render);estateObserver.observe(doc.documentElement,{attributes:true,attributeFilter:['data-festival','data-season']});['ayaka:season-resolved','ayaka:season-style','ayaka:festivals'].forEach(event=>doc.defaultView.addEventListener(event,render));render();}
  $('classic-frame')?.addEventListener('load',observeEstate);
  window.addEventListener('storage',e=>{if(['ayaka_festivals','ayaka_estate_seasons'].includes(e.key))render();});
  async function json(url){const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),10000);try{const r=await fetch(url,{signal:abort.signal});if(!r.ok)throw Error('Unavailable');return await r.json();}finally{clearTimeout(timer);}}
  async function fetchWeather(){
   if(behaviour!=='weather'||busy||cityBusy||document.hidden)return;
   const id=++request;busy=true;lastAttempt=Date.now();render();
   try{const url=new URL('https://api.open-meteo.com/v1/forecast');url.search=new URLSearchParams({latitude:city.lat,longitude:city.lon,current:'weather_code,is_day',timezone:'auto'});
    const data=await json(url);if(id!==request||behaviour!=='weather')return;
    const c=data.current;if(!c||!Number.isFinite(c.weather_code)||![0,1].includes(c.is_day))throw Error('Invalid weather');
    const scene=P.weatherScene({code:c.weather_code,isDay:c.is_day},hour());
    weather={code:c.weather_code,isDay:c.is_day,at:Date.now(),timezone:data.timezone,label:scene==='rain'?'Rain or drizzle':scene==='snow'?'Snow':c.weather_code>=45?'Fog':c.weather_code>=2?'Cloudy':'Clear sky'};
   }catch{if(id===request)weather=null;}finally{if(id===request){busy=false;render();}}
  }
  $('scene').addEventListener('change',e=>choose(e.target.value));
  $('keep-scene').addEventListener('click',()=>choose(current));
  $('behaviour').addEventListener('change',e=>{cancelRequests();behaviour=e.target.value;if(behaviour==='fixed'){fixed=current;write('workspace_scene',fixed);}write('scene_behaviour',behaviour);render();if(behaviour==='weather')fetchWeather();});
  $('weather-city').value=city.name;
  $('city-form').addEventListener('submit',async e=>{
   e.preventDefault();const query=$('weather-city').value.trim();if(query.length<2)return;
   const id=++request;busy=false;cityBusy=true;$('city-message').textContent='Finding city…';
   try{
    const data=await json('https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&name='+encodeURIComponent(query));if(id!==request)return;
    const found=data?.results?.[0],next=found&&{name:found.name,lat:found.latitude,lon:found.longitude};if(!validCity(next))throw Error('Invalid city');
    next.name=next.name.trim()+(typeof found.country_code==='string'&&/^[A-Z]{2}$/.test(found.country_code)?' · '+found.country_code:'');
    city=next;write('weather_city',JSON.stringify(city));weather=null;$('weather-city').value=city.name;$('city-message').textContent='Using '+city.name;
    cityBusy=false;fetchWeather();
   }catch{if(id===request)$('city-message').textContent='City not found or connection unavailable. Try city, country.';}
   finally{if(id===request){cityBusy=false;render();}}
  });
  function tick(){if(document.hidden)return;if(behaviour==='weather'&&!busy&&Date.now()-lastAttempt>=15*60*1000)fetchWeather();else render();}
  setInterval(tick,60000);document.addEventListener('visibilitychange',tick);
  document.addEventListener('click',e=>{if(!e.composedPath().includes($('scene-picker')))$('scene-picker').open=false;});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('scene-picker').open){$('scene-picker').open=false;$('scene-picker').querySelector('summary').focus();}});
  observeEstate();render();if(behaviour==='weather')fetchWeather();
  return {refresh:tick};
 };
})();
