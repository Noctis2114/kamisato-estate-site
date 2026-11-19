const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
let listener,count=0;class Element{constructor(garden,control=false){this.garden=garden;this.control=control}closest(s){return s.includes('.is-display')?this.garden:this.control?{}:null}}
const garden={dataset:{ayaka:'windchime'},querySelector:s=>({click:()=>count++})};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../integration/windchime-controls.js'),'utf8'),{Element,document:{addEventListener:(type,fn)=>{assert.equal(type,'click');listener=fn}}});
listener({target:new Element(garden)});assert.equal(count,1);
listener({target:new Element(garden,true)});listener({target:new Element(null)});listener({target:{}});assert.equal(count,1);
garden.dataset.ayaka='windchime-preview';listener({target:new Element(garden)});assert.equal(count,1);
console.log('PASS: scenery restores controls; buttons/other rooms/preview/non-elements do not trigger reveal.');
