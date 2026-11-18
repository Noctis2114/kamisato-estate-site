const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../../assets/estate-map-C5JX19HX.js'),'utf8');
function extract(name){const start=source.indexOf('function '+name+'(');assert(start>=0);let brace=source.indexOf('{',start),depth=0; // Default object parameters require scanning from function body after ')'.
 brace=source.indexOf('{',source.indexOf('){',start));
 for(let i=brace;i<source.length;i++){if(source[i]==='{')depth++;if(source[i]==='}'&&!--depth)return source.slice(start,i+1);}
 throw Error('Unclosed function');}
const env={};vm.createContext(env);vm.runInContext('var Z=3.2;'+['$','Q','be'].map(extract).join(';'),env);
let count=0;
for(const view of [{w:320,h:568},{w:390,h:844},{w:844,h:390},{w:1024,h:1366},{w:1920,h:1080},{w:3440,h:1440},{w:3840,h:2160},{w:7680,h:4320},{w:100000,h:100000}]){
 for(const image of [{w:1920,h:1080},{w:1600,h:1200},{w:1080,h:1920}]){
  const fit=env.$(view,image);assert(fit.scale>0);assert(fit.x<=.001&&fit.y<=.001);
  for(const zoom of [.01,1,2,10])for(const offset of [-1e6,0,1e6]){
   const p=env.Q({scale:fit.scale*zoom,x:offset,y:offset},view,image,fit.scale,fit);
   assert(p.scale>=fit.scale);assert(p.x<=.001&&p.y<=.001);assert(p.x+image.w*p.scale>=view.w-.001);assert(p.y+image.h*p.scale>=view.h-.001);
   const pinch=env.be({wx:0,wy:0,scale:fit.scale},100,1,0,0,fit.scale);assert(pinch.scale>=fit.scale);count++;
  }
 }
}
console.log(`PASS ${count} map viewport/aspect/zoom/pan combinations from phone to 100000px; cover bounds and minimum pinch scale preserved.`);
