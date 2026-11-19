const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../../assets/windchime-garden-DRvchVed.js'),'utf8');
const match=source.match(/function \w+\(e,t\)\{let n=Array.from\(e\),r=n.length>16[\s\S]*?\/\*fit-wish-glyphs\*\/\}/);
assert(match,'Actual release wish layout must be fitted');
const layout=vm.runInNewContext('('+match[0]+')');
let checks=0;
for(const length of [48,52,60,72,90]) for(let count=1;count<=64;count++){
 const result=layout('秋'.repeat(count),length);
 assert.equal(result.letters.length,count);
 assert(result.fontSize>0 && Number.isFinite(result.fontSize));
 for(const [i,a] of result.letters.entries()){
  assert(a.y-result.fontSize/2>=20 && a.y+result.fontSize/2<=length-5);
  for(const b of result.letters.slice(i+1)){
   assert(Math.abs(a.x-b.x)>=result.fontSize || Math.abs(a.y-b.y)>=result.fontSize,'Glyph boxes must not overlap');
  }
 }
 checks++;
}
console.log(`PASS ${checks} actual wish layouts: glyphs fit paper and do not overlap across lengths and columns.`);
