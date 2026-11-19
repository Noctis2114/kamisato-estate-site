const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path'), assets=require('../../assets.json');
const assetExists=name=>Object.hasOwn(assets,name)&&fs.existsSync(path.resolve(__dirname,'../../..',assets[name]));
const policy={};vm.createContext(policy);vm.runInContext(fs.readFileSync('scene-policy.js','utf8'),policy);const P=policy.EstateScenePolicy;
for(const [h,want] of [[0,'night'],[4,'night'],[5,'dawn'],[7,'dawn'],[8,'clouds'],[11,'forest'],[14,'forest'],[15,'ocean'],[16,'ocean'],[17,'sunset'],[19,'fireflies'],[20,'fireflies'],[21,'night'],[23,'startrails']])assert.equal(P.byHour(h),want);
for(const code of [51,61,65,80,95,99])assert.equal(P.resolve('weather','forest',12,{code,isDay:1}),'rain');
for(const code of [71,73,75,77,85,86])assert.equal(P.resolve('weather','rain',1,{code,isDay:0}),'snow');
assert.equal(P.resolve('weather','rain',12,{code:3,isDay:1}),'clouds');
assert.equal(P.resolve('weather','rain',21,{code:3,isDay:0}),'night');
assert.equal(P.resolve('weather','rain',18,null),'sunset');
for(const scene of Object.keys(P.scenes)){assert.equal(P.scenes[scene].looks.length,3);for(const hour of [0,6,12,18,23])assert.equal(P.resolve('fixed',scene,hour,{code:95,isDay:0}),scene);assert.ok(assetExists(P.scenes[scene].image));}
class Element{constructor(){this.children=[];this.dataset={};this.style={};this.events={};this.attributes={};}append(...nodes){this.children.push(...nodes)}replaceChildren(...nodes){this.children=nodes}addEventListener(k,f){this.events[k]=f}setAttribute(k,v){this.attributes[k]=v}querySelectorAll(){return this.children}querySelector(){return new Element()}contains(){return false}focus(){}}
async function controller(saved={},fetcher){const ids={};const doc={querySelectorAll:()=>[],hidden:false,getElementById:id=>ids[id]||(ids[id]=new Element()),createElement:()=>new Element(),addEventListener(){}};let callback,network=0;const ctx={EstateScenePolicy:P,document:doc,window:{addEventListener(){}},localStorage:{getItem:()=>null},Date,Intl,URL,URLSearchParams,AbortController,setTimeout,clearTimeout,setInterval(){},fetch:(...args)=>{network++;return fetcher(...args)}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('scene-controls.js','utf8'),ctx);ctx.window.createSceneControls({read:(k,f)=>saved[k]||f,write:(k,v)=>saved[k]=v,onScene:(scene,look)=>callback={scene,look}});return{ids,saved,state:()=>callback,network:()=>network};}
(async()=>{
 const a=await controller({},()=>{throw Error('Must not fetch')});assert.equal(a.state().scene,'rain');assert.equal(a.network(),0);
 a.ids['scene'].events.change({target:{value:'ocean'}});a.ids['variations'].children[2].events.click();assert.deepEqual(a.state(),{scene:'ocean',look:2});
 const b=await controller(a.saved,()=>{throw Error('Must not fetch')});assert.deepEqual(b.state(),{scene:'ocean',look:2});assert.equal(b.network(),0);
 let complete;const c=await controller({scene_behaviour:'weather'},()=>new Promise(resolve=>complete=resolve));assert.equal(c.network(),1);
 c.ids.scene.events.change({target:{value:'forest'}});complete({ok:true,json:async()=>({current:{weather_code:95,is_day:1},timezone:'Asia/Singapore'})});await new Promise(r=>setImmediate(r));assert.equal(c.state().scene,'forest');assert.equal(c.saved.scene_behaviour,'fixed');
 const d=await controller({scene_behaviour:'weather'},async()=>{throw Error('Offline')});await new Promise(r=>setImmediate(r));assert.match(d.ids['scene-status'].textContent,/Weather unavailable/);assert.equal(d.state().scene,P.byHour(new Date().getHours()));
 assert.equal(P.baseOrder.length,24);assert.equal(Object.keys(P.festivals).length,8);assert.equal(Object.keys(P.scenes).length,32);
 for(const [h,m] of [[0,2],[6.99,2],[7,0],[16.99,0],[17,1],[19.99,1],[20,2],[23.99,2]])assert.equal(P.moodAt(h),m);
 const date=new Date(2026,10,18,0),end=new Date(2026,10,18,23,59),next=new Date(2026,10,19);
 assert.equal(P.dailyScene(date),P.dailyScene(end));assert.notEqual(P.dailyScene(date),P.dailyScene(next));
 assert.equal(new Set(Array.from({length:24},(_,i)=>P.dailyScene(new Date(2026,10,18+i)))).size,24);
 for(const festival of Object.keys(P.festivals)){
  for(const behaviour of ['fixed','daily','weather'])assert.equal(P.resolve(behaviour,'rain',12,{code:95,isDay:1},{matchFestivals:true,festival,date}),'festive-'+festival);
  for(const image of P.scenes['festive-'+festival].images)assert.ok(assetExists(image));
 }
 assert.equal(P.resolve('fixed','ocean',12,null,{matchFestivals:false,festival:'christmas'}),'ocean');
 assert.equal(P.resolve('daily','rain',12,null,{matchFestivals:true,festival:'none',date}),P.dailyScene(date));
 assert.equal(P.resolve('daily','rain',23,null,{date,seasonal:true,season:'winter'}),P.dailyScene(date,'winter'));
 console.log('PASS: 24 daily scenes, 8 festivals / 24 matching paintings, 96 lighting choices, mood boundaries, daily cycle, festive priority, manual lock, weather fallback and stale-response protection.');
})();
