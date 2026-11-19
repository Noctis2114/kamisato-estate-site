// Pass two: deferred city lookup, refresh races, corrupt locations, and recovery.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Element{constructor(){this.children=[];this.dataset={};this.style={};this.events={};this.value='';}append(...n){this.children.push(...n)}replaceChildren(...n){this.children=n}addEventListener(k,f){this.events[k]=f}setAttribute(){}querySelectorAll(){return this.children}querySelector(){return new Element()}focus(){}}
function harness(saved={}){
 const ids={},calls=[],ticks=[];let now=1800000000000;
 class Clock extends Date{constructor(...a){super(...(a.length?a:[now]))}static now(){return now}}
 const doc={hidden:false,querySelectorAll:()=>[],getElementById:id=>ids[id]||(ids[id]=new Element()),createElement:()=>new Element(),addEventListener(){}};
 const box={document:doc,window:{addEventListener(){}},localStorage:{getItem:()=>null},Date:Clock,Intl,URL,URLSearchParams,AbortController,setTimeout:()=>1,clearTimeout(){},setInterval:f=>ticks.push(f),fetch:url=>new Promise(resolve=>calls.push({url:String(url),reply:data=>resolve({ok:true,json:async()=>data})}))};
 vm.createContext(box);for(const file of ['scene-policy.js','scene-controls.js'])vm.runInContext(fs.readFileSync(file,'utf8'),box);
 box.window.createSceneControls({read:(k,f)=>saved[k]??f,write:(k,v)=>saved[k]=v,onScene(){}});
 return {ids,calls,saved,tick:()=>ticks.forEach(f=>f()),advance:ms=>now+=ms,submit:name=>{ids['weather-city'].value=name;return ids['city-form'].events.submit({preventDefault(){}})}};
}
const flush=()=>new Promise(r=>setImmediate(r));
const clear={current:{weather_code:0,is_day:1},timezone:'Asia/Singapore'};
async function ready(){const h=harness({scene_behaviour:'weather',match_festivals:'no'});h.calls[0].reply(clear);await flush();return h}
const tests=[];const test=(name,fn)=>tests.push({name,fn});
test('periodic refresh cannot cancel an in-flight city lookup',async()=>{
 const h=await ready();h.advance(16*60*1000);const submitted=h.submit('Tokyo');h.tick();
 assert.equal(h.calls.length,2,'refresh started while geocoding was pending');
 h.calls[1].reply({results:[{name:'Tokyo',country_code:'JP',latitude:35.68,longitude:139.69}]});await submitted;await flush();
 assert.equal(JSON.parse(h.saved.weather_city).name,'Tokyo · JP');assert.match(h.calls[2].url,/latitude=35.68/);h.calls[2].reply(clear);await flush();
});
test('malformed geocoder responses never replace a valid saved city',async()=>{
 for(const result of [{name:'Bad'},{name:'Bad',latitude:91,longitude:0},{name:'Bad',latitude:0,longitude:181},{name:'',latitude:0,longitude:0},{name:{},latitude:0,longitude:0},{name:'Bad',latitude:'1',longitude:2}]){
  const h=await ready();const submitted=h.submit('Invalid');h.calls[1].reply({results:[result]});await submitted;
  assert.equal(h.saved.weather_city,undefined,JSON.stringify(result));assert.match(h.ids['city-message'].textContent,/not found|unavailable/i);
 }
});
test('invalid persisted coordinates and names fall back to Singapore',async()=>{
 for(const city of [{name:'Bad',lat:999,lon:0},{name:'Bad',lat:0,lon:-181},{name:[],lat:0,lon:0},{name:'',lat:0,lon:0}]){
  const h=harness({scene_behaviour:'weather',weather_city:JSON.stringify(city)});assert.match(h.calls[0].url,/latitude=1.29/);h.calls[0].reply(clear);await flush();
 }
});
test('second city wins even when first lookup replies last',async()=>{
 const h=await ready(),first=h.submit('London'),second=h.submit('Tokyo');
 h.calls[2].reply({results:[{name:'Tokyo',latitude:35,longitude:139}]});await second;
 h.calls[1].reply({results:[{name:'London',latitude:51,longitude:0}]});await first;
 assert.equal(JSON.parse(h.saved.weather_city).name,'Tokyo');h.calls[3].reply(clear);await flush();
});
test('failed city search releases refresh and can be retried',async()=>{
 const h=await ready();const first=h.submit('Unknown');h.calls[1].reply({results:[]});await first;h.advance(16*60*1000);h.tick();assert.equal(h.calls.length,3);h.calls[2].reply(clear);await flush();
 const second=h.submit('Osaka');h.calls[3].reply({results:[{name:'Osaka',latitude:34.69,longitude:135.5}]});await second;assert.equal(JSON.parse(h.saved.weather_city).name,'Osaka');h.calls[4].reply(clear);await flush();
});
test('manual scene cancels lookup without leaving a stuck search message',async()=>{
 const h=await ready(),lookup=h.submit('Tokyo');h.ids.scene.events.change({target:{value:'torii'}});
 h.calls[1].reply({results:[{name:'Tokyo',latitude:35,longitude:139}]});await lookup;
 assert.equal(h.saved.weather_city,undefined);assert.equal(h.saved.workspace_scene,'torii');assert.equal(h.ids['city-message'].textContent,'');
 h.ids.behaviour.events.change({target:{value:'weather'}});assert.equal(h.calls.length,3);h.calls[2].reply(clear);await flush();
});
test('equator, prime meridian, and boundary coordinates remain valid',async()=>{
 for(const [lat,lon]of [[0,0],[90,180],[-90,-180]]){const h=await ready(),lookup=h.submit('Test');h.calls[1].reply({results:[{name:'Test',latitude:lat,longitude:lon}]});await lookup;assert.equal(JSON.parse(h.saved.weather_city).lat,lat);h.calls[2].reply(clear);await flush();}
});
(async()=>{let failed=0;for(const {name,fn}of tests){try{await fn();console.log('PASS '+name)}catch(e){failed++;console.error('FAIL '+name+' — '+e.message)}}process.exitCode=failed?1:0;})();
