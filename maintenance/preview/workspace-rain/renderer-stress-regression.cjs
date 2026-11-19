const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
(async()=>{
 const jobs=new Map(),events={},images=[],sizes=[];let id=0,throwDraw=false;
 const gl=new Proxy({getShaderParameter:()=>true,getProgramParameter:()=>true,getParameter:()=>4096,drawArrays(){if(throwDraw)throw Error('simulated GPU failure');}},{get:(o,k)=>o[k]??(()=>({}))});
 const ctx=new Proxy({},{get:()=>()=>{}}),canvas={style:{},getContext:()=>gl,addEventListener:(n,f)=>events[n]=f};
 const doc={hidden:false,body:{dataset:{}},getElementById:()=>canvas,createElement:()=>({getContext:()=>ctx}),addEventListener:(n,f)=>events[n]=f};
 const s={window:{},document:doc,innerWidth:1440,innerHeight:900,devicePixelRatio:2,Image:class{constructor(){images.push(this);this.width=1920;this.height=1080}},EstateRaindrops:class{constructor(w,h){sizes.push([w,h]);this.options={};this.canvas={}}drawDroplet(){}addDrop(){}createDrop(v){return v}update(){}},addEventListener:(n,f)=>events[n]=f,setTimeout:f=>{f();return 1},clearTimeout(){},requestAnimationFrame:f=>{jobs.set(++id,f);return id},cancelAnimationFrame:i=>jobs.delete(i),Float32Array,Math,Promise};
 vm.createContext(s);vm.runInContext(fs.readFileSync('rain-live.js','utf8'),s);images.forEach(i=>i.onload());await new Promise(r=>setImmediate(r));
 for(const [w,h,dpr] of [[320,568,3],[390,844,3],[844,390,3],[1920,1080,2],[3440,1440,2],[7680,4320,2],[100000,100000,10],[1,100000,4],[100000,1,4]]){
  s.innerWidth=w;s.innerHeight=h;s.devicePixelRatio=dpr;events.resize();
  assert.ok(canvas.width*canvas.height<=4194304,`GPU allocation unbounded at ${w}x${h}: ${canvas.width}x${canvas.height}`);
  assert.ok(canvas.width<=4096&&canvas.height<=4096);
  const size=sizes.at(-1);assert.ok(size[0]*size[1]<=2097152&&Math.max(...size)<=2048,'simulation allocation unbounded');
 }
 for(let i=0;i<10000;i++){s.window.rainGlass.setEnabled(i%3!==0);assert.ok(jobs.size<=1)}
 s.window.rainGlass.setEnabled(true);doc.hidden=true;events.visibilitychange();assert.equal(jobs.size,0);doc.hidden=false;events.visibilitychange();
 throwDraw=true;const pending=[...jobs.values()];jobs.clear();pending.forEach(f=>f(1000));assert.equal(jobs.size,0);assert.equal(doc.body.dataset.liveRain,'unavailable');assert.equal(canvas.style.opacity,'0');
 console.log('PASS nine viewport/DPR extremes; GPU <=4MP/4096 edge; simulation <=2MP/2048 edge; 10000 enable changes; hidden cleanup and injected graphics failure fallback.');
})();
