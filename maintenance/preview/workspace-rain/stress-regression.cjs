// Estate QA, 2026-11-18. Pure policy/controller stress; no browser or real network.
// Value: rejects corrupt persisted preferences and stale network outcomes; existing
// regressions cover valid values only. No claim about GPU pixels or mobile Safari.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const box={};vm.createContext(box);vm.runInContext(fs.readFileSync('scene-policy.js','utf8'),box);const P=box.EstateScenePolicy;
let cases=0;
for(const fixed of [...Object.keys(P.scenes),'__proto__','constructor','missing',''])
 for(const behaviour of ['fixed','daily','weather'])
  for(const hour of [0,6,7,16,17,19,20,23])
   for(const festival of ['none',...Object.keys(P.festivals),'__proto__'])
    for(const code of [0,3,45,51,65,75,86,95]) {
      const result=P.resolve(behaviour,fixed,hour,{code,isDay:hour>6&&hour<20?1:0},{matchFestivals:true,festival,date:new Date(2026,10,18),seasonal:true,season:'winter'});
      assert.ok(Object.hasOwn(P.scenes,result),`Invalid scene ${result}, ${fixed}/${behaviour}/${festival}`);cases++;
    }
class Element{constructor(){this.children=[];this.dataset={};this.style={};this.events={};this.attributes={};this.value='';}append(...n){this.children.push(...n)}replaceChildren(...n){this.children=n}addEventListener(k,f){this.events[k]=f}setAttribute(k,v){this.attributes[k]=v}querySelectorAll(){return this.children}querySelector(){return new Element()}contains(){return false}focus(){}}
async function controller(saved={},season='{}',fetcher=async()=>{throw Error('Offline')}){
 const ids={},pending=[],doc={hidden:false,querySelectorAll:()=>[],getElementById:id=>ids[id]||(ids[id]=new Element()),createElement:()=>new Element(),addEventListener(){}};let state;
 const env={EstateScenePolicy:P,document:doc,window:{addEventListener(){}},localStorage:{getItem:k=>k==='ayaka_estate_seasons'?season:null},Date,Intl,URL,URLSearchParams,AbortController,setTimeout,clearTimeout,setInterval(){},fetch:(...a)=>{pending.push(a);return fetcher(...a)}};
 vm.createContext(env);vm.runInContext(fs.readFileSync('scene-controls.js','utf8'),env);
 env.window.createSceneControls({read:(k,f)=>saved[k]??f,write:(k,v)=>saved[k]=v,onScene:(scene,look)=>{assert.ok(Object.hasOwn(P.scenes,scene));assert.ok([0,1,2].includes(look));state={scene,look};}});
 return {ids,pending,saved,state:()=>state};
}
(async()=>{
 for(const scene of ['__proto__','constructor','bad','rain'])for(const season of ['null','[]','"bad"','{broken','{}'])for(const mood of ['NaN','99','-1','auto','2'])await controller({workspace_scene:scene,scene_mood:mood},season);
 const c=await controller();const names=Object.keys(P.scenes);
 for(let i=0;i<10000;i++){c.ids.scene.events.change({target:{value:names[(i*17)%names.length]}});c.ids.variations.children[i%3].events.click();assert.equal(c.state().scene,names[(i*17)%names.length]);}
 let resolve;const weather=await controller({scene_behaviour:'weather'},'{}',()=>new Promise(r=>resolve=r));
 weather.ids.scene.events.change({target:{value:'torii'}});resolve({ok:true,json:async()=>({current:{weather_code:95,is_day:1}})});await new Promise(r=>setImmediate(r));assert.equal(weather.state().scene,'torii');
 for(const response of [null,{}, {current:{weather_code:'95',is_day:1}},{current:{weather_code:95,is_day:9}}]){const c=await controller({scene_behaviour:'weather'},'{}',async()=>({ok:true,json:async()=>response}));await new Promise(r=>setImmediate(r));assert.ok(Object.hasOwn(P.scenes,c.state().scene));}
 console.log(`PASS ${cases} unique policy combinations; 100 corrupt preference combinations; 10000 alternating scene/mood actions; stale and malformed weather responses.`);
})().catch(e=>{console.error(e);process.exitCode=1});
