/* Deterministic scene choices; manual selection always wins. */
(() => {
 const scenes={
 startrails:{name:'Star trails',description:'Visible rotating arcs above snowy pines',image:'startrails.jpg',looks:['Polar arcs','Celestial violet','Silver orbit'],credit:'Florian Schindler · Unsplash',url:'https://unsplash.com/photos/I3VWe-dSHKY'},
 aurora:{name:'Aurora',description:'Flowing curtains of northern light',image:'aurora.jpg',looks:['Emerald veil','Violet ribbons','Arctic blue'],credit:'Kalen Emsley · Unsplash',url:'https://unsplash.com/photos/0ic2ZYeDQx4'},
 rain:{name:'Rain glass',description:'Water beads, slides and merges',image:'../rain-window.jpg',looks:['Soft drizzle','Blue hour','Heavy rain'],credit:'Rain photograph · Unsplash',url:'https://unsplash.com/s/photos/blue-rain'},
 clouds:{name:'Drifting clouds',description:'Slow clouds above the mountains',image:'cloud-sea.jpg',looks:['Silver lining','Clear blue','Golden clouds'],credit:'Cloud photograph · Unsplash',url:'https://unsplash.com/s/photos/cloud-sea'},
 snow:{name:'Snowfall',description:'Soft flakes at different depths',image:'snow-forest.jpg',looks:['Winter hush','Blue dusk','Snow globe'],credit:'Vladimir Vishnyakov · Unsplash',url:'https://unsplash.com/photos/CyNylTimzAo'},
 dawn:{name:'Dawn mist',description:'Mist drifts between mountain ridges',image:'dawn.jpg',looks:['Rose dawn','Pearl morning','First gold'],credit:'Pascal Debrunner · Unsplash',url:'https://unsplash.com/photos/uskLD4MZeb8'},
 sunset:{name:'Sunset coast',description:'Warm light with a quiet ocean shimmer',image:'sunset.jpg',looks:['Peach sky','Amber evening','Afterglow'],credit:'Braden Jarvis · Unsplash',url:'https://unsplash.com/photos/ih5Kq0XowwY'},
 night:{name:'Starry night',description:'Gentle twinkling above still mountains',image:'night.jpg',looks:['Deep indigo','Violet sky','Silver night'],credit:'Marek Piwnicki · Unsplash',url:'https://unsplash.com/photos/iy2Y6TBThqI'},
 forest:{name:'Woodland',description:'Soft drifting motes in forest light',image:'forest.jpg',looks:['Fern light','Golden grove','Cool morning'],credit:'Pascal Debrunner · Unsplash',url:'https://unsplash.com/photos/o7_pjm0V9-A'},
 ocean:{name:'Quiet ocean',description:'Slow ripples and scattered reflections',image:'ocean.jpg',looks:['Sea glass','Blue hour','Moonlit water'],credit:'Alex Plesovskich · Unsplash',url:'https://unsplash.com/photos/LdNn81NlUj4'},
 fireflies:{name:'Firefly grove',description:'Small lights wander through a bamboo grove',image:'fireflies.jpg',looks:['Summer evening','Emerald dusk','Midnight garden'],credit:'Ryunosuke Kikuno · Unsplash',url:'https://unsplash.com/photos/DwDd6Fe9uoE'}
 };
 scenes["waterfall"]={"name": "Woodland falls", "description": "Drifting spray above a mossy cascade", "image": "waterfall.jpg", "effect": "mist", "credit": "\u78ca \u5468 \u00b7 Unsplash", "url": "https://unsplash.com/photos/rDnlpMQmLCQ"};
 scenes["desert"]={"name": "Desert dunes", "description": "Fine sand carried across the dunes", "image": "desert.jpg", "effect": "dust", "credit": "Alexander Psiuk \u00b7 Unsplash", "url": "https://unsplash.com/photos/cczug9CpFpU"};
 scenes["lavender"]={"name": "Lavender fields", "description": "Pollen floating over violet rows", "image": "lavender.jpg", "effect": "pollen", "credit": "Remi Antunes \u00b7 Unsplash", "url": "https://unsplash.com/photos/LBu4WQxJNMw"};
 scenes["blossom"]={"name": "Sakura stream", "description": "Petals tumble past Mount Fuji", "image": "blossom.jpg", "effect": "petals", "credit": "Gaku Suyama \u00b7 Unsplash", "url": "https://unsplash.com/photos/o8c1em1RybI"};
 scenes["autumn"]={"name": "Autumn lake", "description": "Copper leaves drift over a quiet lake", "image": "autumn.jpg", "effect": "leaves", "credit": "Denis Oliveira \u00b7 Unsplash", "url": "https://unsplash.com/photos/raJXsGEhndw"};
 scenes["volcano"]={"name": "Volcanic dusk", "description": "Embers rise into the evening air", "image": "volcano.jpg", "effect": "embers", "credit": "Erwan Hesry \u00b7 Unsplash", "url": "https://unsplash.com/photos/h-ACUrBngrw"};
 scenes["city"]={"name": "City lights", "description": "Quiet light trails along the waterfront", "image": "city.jpg", "effect": "traffic", "credit": "CHUTTERSNAP \u00b7 Unsplash", "url": "https://unsplash.com/photos/JH0wCegJsrQ"};
 scenes["lake"]={"name": "Mirror lake", "description": "Gentle rings break the reflection", "image": "lake.jpg", "effect": "ripples", "credit": "Thierry Lemaitre \u00b7 Unsplash", "url": "https://unsplash.com/photos/r-H1Jgu6dI8"};
 scenes["meadow"]={"name": "Alpine meadow", "description": "Light seeds drift above the meadow", "image": "meadow.jpg", "effect": "seeds", "credit": "Pierre Lemos \u00b7 Unsplash", "url": "https://unsplash.com/photos/wfOdYsDrxvs"};
 scenes["spiderlily"]={"name": "Higanbana grove", "description": "Red spider lilies beneath a veil of drifting mist", "effect": "mist", "image": "spiderlily.jpg", "credit": "Kouji Tsuru \u00b7 Unsplash", "url": "https://unsplash.com/photos/_kgVanQ6wsY"};
 scenes["wisteria"]={"name": "Wisteria garden", "description": "Soft violet petals drift through hanging blossoms", "effect": "petals", "image": "wisteria.jpg", "credit": "Aki \u00b7 Unsplash", "url": "https://unsplash.com/photos/UbJDIWM11yM"};
 scenes["lotus"]={"name": "Lotus pond", "description": "Quiet water rings around a pink bloom", "effect": "ripples", "image": "lotus.jpg", "credit": "Carlos de Miguel \u00b7 Unsplash", "url": "https://unsplash.com/photos/Kq2WV3WPrYU"};
 scenes["torii"]={"name": "Torii forest", "description": "Vermilion shrine gates with low drifting mist", "effect": "mist", "image": "torii.jpg", "credit": "Chrishaun Byrom \u00b7 Unsplash", "url": "https://unsplash.com/photos/BBKnW5KQEOU"};
 const baseOrder=['rain','clouds','snow','dawn','sunset','night','startrails','aurora','forest','ocean','fireflies','waterfall','desert','lavender','blossom','autumn','volcano','city','lake','meadow','spiderlily','wisteria','lotus','torii'];
 const festivals={advent:'Advent',christmas:'Christmas',epiphany:'Epiphany',lent:'Lent','holy-week':'Holy Week',easter:'Easter',pentecost:'Pentecost',kingdomtide:'Kingdomtide'};
 const festiveEffects={advent:'snow',christmas:'snow',epiphany:'sparkles',lent:'mist','holy-week':'mist',easter:'petals',pentecost:'embers',kingdomtide:'leaves'};
 for(const [id,name] of Object.entries(festivals))scenes['festive-'+id]={name,description:'The Estate’s '+name+' courtyard',image:'festive/'+id+'-day.webp',images:['day','golden','night'].map(m=>'festive/'+id+'-'+m+'.webp'),festival:id,effect:festiveEffects[id],credit:'Estate seasonal art',url:'../Header-Glass-Preview.htm?home=1'};
 for(const data of Object.values(scenes))data.looks=['Day','Golden hour','Night'];
 const ordered=Object.fromEntries([...baseOrder,...Object.keys(festivals).map(id=>'festive-'+id)].map(k=>[k,scenes[k]]));
 const byHour=h=>h>=23?'startrails':h<5||h>=21?'night':h<8?'dawn':h<11?'clouds':h<15?'forest':h<17?'ocean':h<19?'sunset':'fireflies';
 const moodAt=h=>h>=7&&h<17?0:h>=17&&h<20?1:2;
 function weatherScene(weather,hour){
  const c=weather.code;
  if([71,73,75,77,85,86].includes(c))return 'snow';
  if([51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(c))return 'rain';
  if(weather.isDay===0)return 'night';
  if([2,3,45,48].includes(c))return 'clouds';
  return byHour(hour);
 }
 const seasonalPools={spring:['blossom','wisteria','torii','meadow','rain','waterfall','lavender','dawn','forest'],summer:['lotus','ocean','lavender','desert','fireflies','meadow','lake','sunset'],autumn:['spiderlily','torii','autumn','rain','forest','city','volcano','dawn','lake'],winter:['snow','aurora','startrails','night','clouds','rain','city']};
 // UTC arithmetic on local calendar fields avoids DST shortening a rotation day.
 function dailyScene(date=new Date(),season){const pool=Object.hasOwn(seasonalPools,season)?seasonalPools[season]:baseOrder;const day=Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000);return pool[((day%pool.length)+pool.length)%pool.length];}
 function resolve(behaviour,fixed,hour,weather,options={}){
  if(options.matchFestivals&&Object.hasOwn(festivals,options.festival))return 'festive-'+options.festival;
  if(behaviour==='daily')return dailyScene(options.date,options.seasonal?options.season:null);
  if(behaviour==='fixed')return Object.hasOwn(scenes,fixed)?fixed:'rain';
  return behaviour==='weather'&&weather?weatherScene(weather,hour):byHour(hour);
 }
 globalThis.EstateScenePolicy={scenes:ordered,baseOrder,festivals,moodAt,byHour,weatherScene,dailyScene,resolve};
})();
