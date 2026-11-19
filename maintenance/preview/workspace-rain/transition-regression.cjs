const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let reduced=false,next=0,draws=0;const frames=new Map(),canvases=new Set(),events={};
const ctx2d=new Proxy({createLinearGradient:()=>({addColorStop(){}}),fill(){draws++;}},{get:(o,k)=>o[k]||(()=>{})});
const document={hidden:false,body:{append(c){canvases.add(c)}},createElement(){return{setAttribute(){},getContext:()=>ctx2d,remove(){canvases.delete(this)}}},addEventListener(k,f){events[k]=f},removeEventListener(k){delete events[k]}};
const ctx={window:{},document,matchMedia:()=>({matches:reduced}),devicePixelRatio:2,innerWidth:1000,innerHeight:800,requestAnimationFrame:f=>{frames.set(++next,f);return next},cancelAnimationFrame:id=>frames.delete(id),addEventListener:(k,f)=>events[k]=f,removeEventListener:k=>delete events[k],Math};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('glass-transition.js','utf8'),ctx);const transition=ctx.window.glassTransition,rects=[{x:40,y:80,width:600,height:400}];
function tick(t){const pending=[...frames.values()];frames.clear();pending.forEach(f=>f(t));}
transition.play(true,rects);tick(0);tick(350);assert.ok(draws>0);tick(701);assert.equal(canvases.size,0);assert.equal(frames.size,0);
transition.play(false,rects);tick(0);transition.play(true,rects);assert.equal(canvases.size,1);assert.equal(frames.size,1);transition.cancel();assert.equal(canvases.size,0);assert.equal(frames.size,0);
reduced=true;transition.play(true,rects);assert.equal(canvases.size,0);reduced=false;
transition.play(false,rects);document.hidden=true;events.visibilitychange();assert.equal(canvases.size,0);assert.equal(frames.size,0);
document.hidden=false;for(let i=0;i<10000;i++){transition.play(i%2===0,rects);assert.ok(canvases.size<=1);assert.ok(frames.size<=1);if(i%7===0)transition.cancel();}transition.cancel();assert.equal(canvases.size,0);assert.equal(frames.size,0);
console.log('PASS: 10000 alternating transitions bounded; forming/shattering draws, completes and cleans up; rapid switches cancel; reduced motion skips effects; hidden tabs cancel.');
