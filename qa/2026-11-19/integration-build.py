from pathlib import Path
from html.parser import HTMLParser
import re,json,hashlib,base64,shutil,mimetypes
ROOT=Path(__file__).resolve().parent.parent
SRC=ROOT/'preview/workspace-rain'; OUT=ROOT.parent/'estate-live'; WORK=ROOT/'integration'; DEST=OUT/'living-workspace';DEST.mkdir(exist_ok=True)
# Preserve existing compiled release and all its stored-data behavior.
class Tree(HTMLParser):
 def __init__(self):super().__init__();self.root=['fragment',{},[]];self.stack=[self.root]
 def handle_starttag(self,tag,attrs):
  node=[tag,dict((k,'' if v is None else v) for k,v in attrs),[]];self.stack[-1][2].append(node)
  if tag not in ['img','input','meta','link','br','hr','source']:self.stack.append(node)
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i][0]==tag:self.stack=self.stack[:i];return
 def handle_data(self,data):self.stack[-1][2].append(data)
html=(SRC/'index.html').read_text();body=re.search(r'<body>(.*?)<script',html,re.S)[1]
body=re.sub(r'<main id="classic-workspace">.*?</main>','',body,flags=re.S)
body=body.replace('../Header-Glass-Preview.htm?home=1','?home=1').replace('Home glass preview','Estate home')
t=Tree();t.feed(body)
assets={}
for p in SRC.rglob('*'):
 if p.suffix in ['.jpg','.png','.webp']:
  key=p.relative_to(SRC).as_posix();assets[key]=p
assets['../rain-window.jpg']=SRC.parent/'rain-window.jpg'
for key,p in assets.items():
 target=DEST/('rain-window.jpg' if key.startswith('../') else key);target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,target)
asset_names={k:('rain-window.jpg' if k.startswith('../') else k) for k in assets}
base_css=(SRC/'workspace.css').read_text().replace(':root',':host')
base_css=re.sub(r'\bbody\b','.workspace-shell',base_css)
base_css+='\n'+(WORK/'workspace-shell.css').read_text()
css=base_css.replace('../rain-window.jpg','rain-window.jpg')
(DEST/'workspace.css').write_text(css)
skin=(SRC/'integrated-workspace.css').read_text();skin='\n'.join(skin.splitlines()[4:])
skin+='\n'+(WORK/'workspace-layout.css').read_text()
(DEST/'workspace-layout.css').write_text(skin)
estate_css=(ROOT/'preview/header-clear-glass.css').read_text()+'\n'+(WORK/'estate-responsive.css').read_text()
(DEST/'estate-responsive.css').write_text(estate_css)
setup='''(()=>{ 'use strict';
const pageDocument=globalThis.document;
if(pageDocument.getElementById('estate-living-workspace'))return;
const host=pageDocument.createElement('div');host.id='estate-living-workspace';host.hidden=true;
const shadow=host.attachShadow({mode:'open'}),shell=pageDocument.createElement('div');shell.className='workspace-shell';shadow.append(shell);pageDocument.body.append(host);
let active=false;
const document={body:shell,documentElement:pageDocument.documentElement,defaultView:window,get hidden(){return pageDocument.hidden||!active;},getElementById:id=>shadow.getElementById(id),querySelector:s=>shadow.querySelector(s),querySelectorAll:s=>shadow.querySelectorAll(s),createElement:(...a)=>pageDocument.createElement(...a),addEventListener:(...a)=>pageDocument.addEventListener(...a),removeEventListener:(...a)=>pageDocument.removeEventListener(...a)};
function node(data,svg=false){if(typeof data==='string')return pageDocument.createTextNode(data);const[tag,attrs,children]=data;svg=svg||tag==='svg';const el=svg?pageDocument.createElementNS('http://www.w3.org/2000/svg',tag):pageDocument.createElement(tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);children.forEach(c=>el.append(node(c,svg)));return el;}
'''
setup+='const nodes='+json.dumps(t.root[2],ensure_ascii=True)+';nodes.forEach(n=>shell.append(node(n)));\n'
setup+='const nativeStyle=pageDocument.createElement("link");nativeStyle.rel="stylesheet";\n'
# Theme reads the same document, not the preview iframe.
parts=[]
for name in ['raindrops-sim.js','rain-live.js','scene-policy.js','scenes.js','scene-controls.js','glass-transition.js']:
 s=(SRC/name).read_text()
 if name=='rain-live.js':s=s.replace('image.src=src','image.src=asset(src)')
 if name=='scenes.js':s=s.replace("cloud.src='cloud-bank.webp'","cloud.src=asset('cloud-bank.webp')")
 if name=='scene-controls.js':s=s.replace("$('classic-frame')?.contentDocument",'pageDocument')
 parts.append(s)
 if name=='scene-policy.js':parts.append("Object.values(EstateScenePolicy.scenes).forEach(d=>{d.image=asset(d.image);if(d.images)d.images=d.images.map(asset);});")
logic='\n'.join(parts)+'\n'+(WORK/'workspace-adapter.js').read_text()+'\n})();\n'+(WORK/'estate-responsive.js').read_text()
web=setup+'const base=new URL(".",pageDocument.currentScript.src);const assetNames='+json.dumps(asset_names)+';const asset=name=>new URL(assetNames[name]||name,base).href;nativeStyle.href=new URL("workspace.css",base).href;shadow.prepend(nativeStyle);\n'+logic
(DEST/'workspace.js').write_text(web)
# Every map viewport starts at the minimum edge-to-edge scale, preserving aspect ratio.
old='let r=`x`in n?{left:n.x,right:n.x,top:n.y,bottom:n.y}:n,i=Math.max(1,e.w-r.left-r.right)'
previous='let r=e.w>640?{left:0,right:0,top:0,bottom:0}:(`x`in n?{left:n.x,right:n.x,top:n.y,bottom:n.y}:n),i=Math.max(1,e.w-r.left-r.right)'
new='let r={left:0,right:0,top:0,bottom:0},i=Math.max(1,e.w-r.left-r.right)'
scale_old='o=Math.min(1,i/t.w,a/t.h);return{scale:o,x:r.left+(i-t.w*o)/2,y:r.top+(a-t.h*o)/2}'
scale_intermediate='o=e.w>640?Math.max(i/t.w,a/t.h):Math.min(1,i/t.w,a/t.h);return{scale:o,x:r.left+(i-t.w*o)/2,y:r.top+(a-t.h*o)*(e.w>640?.25:.5)}'
scale_new='o=Math.max(i/t.w,a/t.h);return{scale:o,x:r.left+(i-t.w*o)/2,y:r.top+(a-t.h*o)*.25}'
scale_previous='o=e.w>640?Math.max(i/t.w,a/t.h):Math.min(1,i/t.w,a/t.h);return{scale:o,x:r.left+(i-t.w*o)/2,y:r.top+(a-t.h*o)/2}'
clamp_old='if(i&&a<=r+1e-8)return i;'
clamp_new='if(i&&a<=r+1e-8&&n.w*a<=t.w+1&&n.h*a<=t.h+1)return i;'
zoom_old='Math.min(Z,Math.max(r,e.scale))';zoom_new='Math.min(Math.max(Z,r),Math.max(r,e.scale))'
pinch_old='Math.min(Z,Math.max(a,e.scale*n/t))';pinch_new='Math.min(Math.max(Z,a),Math.max(a,e.scale*n/t))'
mapfile=OUT/'assets/estate-map-C5JX19HX.js';s=mapfile.read_text();assert old in s or previous in s or new in s;s=s.replace(old,new).replace(previous,new).replace(scale_intermediate,scale_new).replace(scale_old,scale_new).replace(scale_previous,scale_new).replace(clamp_old,clamp_new).replace(zoom_old,zoom_new).replace(pinch_old,pinch_new);mapfile.write_text(s)
arrival_old='t.dataset.arrivalOpen=``,t.setAttribute(`aria-hidden`,`true`)'
arrival_new='t.dataset.arrivalOpen=``,t.contains(document.activeElement)&&document.activeElement.blur(),t.setAttribute(`aria-hidden`,`true`)'
entry=OUT/'assets/index-C9yL8V4g.js';entry_text=entry.read_text();assert arrival_old in entry_text or arrival_new in entry_text;entry.write_text(entry_text.replace(arrival_old,arrival_new))
manifest=OUT/'manifest.webmanifest';manifest_data=json.loads(manifest.read_text());manifest_data['share_target']['enctype']='application/x-www-form-urlencoded';manifest.write_text(json.dumps(manifest_data,indent=2)+'\n')
# Existing CSP remains strict; allow only the weather-city lookup actually used.
for name in ['index.html','404.html','Default.htm','iisstart.htm']:
 p=OUT/name;s=p.read_text()
 s=re.sub(r'\s*<!-- estate-living:start -->.*?<!-- estate-living:end -->','',s,flags=re.S)
 s=s.replace('</head>','<!-- estate-living:start -->\n<link rel="stylesheet" href="./living-workspace/workspace-layout.css">\n<link rel="stylesheet" href="./living-workspace/estate-responsive.css">\n<script defer src="./living-workspace/workspace.js"></script>\n<!-- estate-living:end -->\n</head>',1)
 if 'https://geocoding-api.open-meteo.com' not in s:s=s.replace('https://api.open-meteo.com','https://api.open-meteo.com https://geocoding-api.open-meteo.com')
 p.write_text(s)
# Portable artifact: preserve binary resources byte-for-byte; patch only module JSON and append hashed integration.
original=(ROOT/'release/Ayaka_Estate_Complete.htm').read_bytes()
m=re.search(rb'(<script>)(/\*ayaka-utf8:module-json\*/.*?)(</script>)',original,re.S);wrapper=m[2].decode('ascii')
x=re.search(r's\.textContent=(".*?");document.head.appendChild\(s\);',wrapper,re.S);module=json.loads(x[1]);assert old in module
patched=module.replace(arrival_old,arrival_new).replace(old,new).replace(scale_old,scale_new).replace(clamp_old,clamp_new).replace(zoom_old,zoom_new).replace(pinch_old,pinch_new)
patched=patched.replace(zoom_old.replace('Z','wc'),zoom_new.replace('Z','wc')).replace(pinch_old.replace('Z','wc'),pinch_new.replace('Z','wc'))
wrapper2=wrapper[:x.start(1)]+json.dumps(patched,ensure_ascii=True,separators=(',',':')).replace('<',chr(92)+'u003c')+wrapper[x.end(1):]
def sha(b):return base64.b64encode(hashlib.sha256(b).digest()).decode()
data=original.replace(m[2],wrapper2.encode('ascii'),1)
for a,b in [(wrapper,wrapper2),(module,patched)]:
 oldhash=sha(a.encode());newhash=sha(b.encode());assert oldhash.encode() in data;data=data.replace(oldhash.encode(),newhash.encode(),1)
packed={k:'data:'+mimetypes.guess_type(str(p))[0]+';base64,'+base64.b64encode(p.read_bytes()).decode() for k,p in assets.items()}
offline_css=re.sub(r'url\([\'\"]?([^\)\'\"]+)[\'\"]?\)',lambda m:'url("'+packed.get(m[1],m[1])+'")',base_css)
portable_setup=setup.replace('const nativeStyle=pageDocument.createElement("link");nativeStyle.rel="stylesheet";','const nativeStyle=pageDocument.createElement("style");')
portable=portable_setup+'const embedded='+json.dumps(packed)+';const asset=name=>embedded[name]||name;nativeStyle.textContent='+json.dumps(base_css)+'.replace(/url\\([\'\"]?([^\\)\'\"]+)[\'\"]?\\)/g,(_,name)=>\'url(\"\'+asset(name)+\'\")\')'+';shadow.prepend(nativeStyle);\n'+logic
# ASCII JavaScript keeps the Windows-1252 container intact.
portable=''.join(c if ord(c)<128 else ('\\u%04x'%ord(c)) for c in portable)
portable=portable.replace('</script','<\\/script')
data=data.replace(b"script-src ",b"script-src 'sha256-"+sha(portable.encode()).encode()+b"' ",1)
block=b'<style id="estate-living-layout">'+(skin+'\n'+estate_css).encode('ascii',errors='xmlcharrefreplace')+b'</style>'
data=data.replace(b'</head>',block+b'</head>',1)
# Run after the parser and original asset shim are available.
script=b'<script>'+portable.encode()+b'</script>'
data=data.replace(b'</body>',script+b'</body>',1)
(ROOT/'preview/Integrated-Estate.htm').write_bytes(data)
report={'portable_bytes':len(data),'live_script_bytes':len(web.encode()),'scene_assets':len(assets),'map_fit_patch_count':module.count(old),'preserved_binary_payloads':[hashlib.sha256(m[0]).digest() for m in re.finditer(rb'<script type="application/x-ayaka-asset".*?</script>',original,re.S)]==[hashlib.sha256(m[0]).digest() for m in re.finditer(rb'<script type="application/x-ayaka-asset".*?</script>',data,re.S)]}
(WORK/'build-report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
# Stamp the shell only after the final bytes exist; retain the worker's integrity checks.
swfile=OUT/'sw.js';sw=swfile.read_text()
def array(name):
 return json.loads(re.search(r'const '+name+r' = (\[.*?\])\n',sw,re.S)[1])
shell_urls=array('SHELL');entries=array('PRECACHE')
new_urls=['./'+p.relative_to(OUT).as_posix() for p in sorted(DEST.rglob('*')) if p.is_file()]
for url in new_urls:
 if url not in shell_urls:shell_urls.append(url)
pins={entry['url']:entry['hash'] for entry in entries}
for url in list(pins)+new_urls:
 path=OUT/('index.html' if url=='./' else url.removeprefix('./'))
 assert path.is_file(),url
 # Scheduled captures change independently of app releases. Preserve the
 # worker's explicit unpinned-snapshot contract; shell assets stay verified.
 if url.startswith('./snapshot/'):
  pins[url]=None
  continue
 pins[url]=hashlib.sha256(path.read_bytes()).hexdigest()
critical_match=re.search(r'const CRITICAL = new Set\((\[.*?\])\)',sw)
critical=json.loads(critical_match[1])
for url in new_urls:
 if url.endswith(('.js','.css')) and url not in critical:critical.append(url)
sw=re.sub(r'const SHELL = \[.*?\]\n','const SHELL = '+json.dumps(shell_urls,indent=2)+'\n',sw,count=1,flags=re.S)
sw=re.sub(r'const PRECACHE = \[.*?\]\n','const PRECACHE = '+json.dumps([{'url':u,'hash':h} for u,h in pins.items()],indent=2)+'\n',sw,count=1,flags=re.S)
sw=re.sub(r'const CRITICAL = new Set\(\[.*?\]\)','const CRITICAL = new Set('+json.dumps(critical)+')',sw,count=1)
stamp=hashlib.sha256(json.dumps(pins,sort_keys=True).encode()).hexdigest()[:12]
sw=re.sub(r'const CACHE = "[^"]+"','const CACHE = "ayaka-living-20261118-'+stamp+'"',sw,count=1)
swfile.write_text(sw)
print(json.dumps({'shell_files':len(shell_urls),'verified_hashes':sum(bool(h) for h in pins.values()),'dynamic_snapshots':sum(u.startswith('./snapshot/') for u in pins),'cache_revision':stamp}))
