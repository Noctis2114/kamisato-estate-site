const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let draws=0,seq=0;const jobs=new Map(),listeners={};const gradient={addColorStop(){}};
const ctx=new Proxy({createRadialGradient:()=>gradient,createLinearGradient:()=>gradient},{get:(o,k)=>o[k]||(()=>{draws++})});
const layers=[],canvas={style:{},getContext:()=>ctx,before:el=>layers.push(el)};
const doc={hidden:false,body:{dataset:{}},getElementById:id=>id==='weather-motion'?canvas:{style:{}},createElement:()=>({style:{},classList:{contains(){return false}},getContext:()=>ctx}),querySelectorAll:()=>layers,querySelector:()=>({style:{}}),addEventListener:(k,f)=>listeners[k]=f};
const images=[];class Image{constructor(){images.push(this);this.naturalWidth=800;this.naturalHeight=400;}}
const sandbox={document:doc,window:{},Image,innerWidth:1440,innerHeight:900,devicePixelRatio:2,addEventListener(){},requestAnimationFrame:f=>{jobs.set(++seq,f);return seq},cancelAnimationFrame:i=>jobs.delete(i),rainGlass:{setVariation(){}}};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('scene-policy.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('scenes.js','utf8'),sandbox);images[0].onload();
for(const scene of Object.keys(sandbox.EstateScenePolicy.scenes))for(let mood=0;mood<3;mood++){
 sandbox.window.workspaceScenes.set(scene,true,mood);const before=draws;
 for(let frame=0;frame<3;frame++){const active=[...jobs];jobs.clear();for(const [,f]of active)f(1000+frame*40);}
 assert.ok(draws>=before);assert.ok(jobs.size<=1,scene+' duplicated RAF');
 sandbox.window.workspaceScenes.set(scene,false,mood);assert.equal(jobs.size,0,scene+' did not pause');
}
sandbox.window.workspaceScenes.set('blossom',true,0);doc.hidden=true;listeners.visibilitychange();assert.equal(jobs.size,0);
console.log('PASS: all 32 scenes / 96 moods draw without exceptions; one animation loop; pause and hidden-tab cleanup.');
