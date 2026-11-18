(()=>{ 'use strict';
const pageDocument=globalThis.document;
if(pageDocument.getElementById('estate-living-workspace'))return;
const host=pageDocument.createElement('div');host.id='estate-living-workspace';host.hidden=true;
const shadow=host.attachShadow({mode:'open'}),shell=pageDocument.createElement('div');shell.className='workspace-shell';shadow.append(shell);pageDocument.body.append(host);
let active=false;
const document={body:shell,documentElement:pageDocument.documentElement,defaultView:window,get hidden(){return pageDocument.hidden||!active;},getElementById:id=>shadow.getElementById(id),querySelector:s=>shadow.querySelector(s),querySelectorAll:s=>shadow.querySelectorAll(s),createElement:(...a)=>pageDocument.createElement(...a),addEventListener:(...a)=>pageDocument.addEventListener(...a),removeEventListener:(...a)=>pageDocument.removeEventListener(...a)};
function node(data,svg=false){if(typeof data==='string')return pageDocument.createTextNode(data);const[tag,attrs,children]=data;svg=svg||tag==='svg';const el=svg?pageDocument.createElementNS('http://www.w3.org/2000/svg',tag):pageDocument.createElement(tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);children.forEach(c=>el.append(node(c,svg)));return el;}
const nodes=["\n", ["div", {"class": "rain-scene", "aria-hidden": "true"}, [["div", {"class": "photograph"}, []], ["canvas", {"id": "rain"}, []], ["div", {"class": "alternate-scene snow-scene"}, []], ["div", {"class": "alternate-scene cloud-scene"}, []], ["canvas", {"id": "weather-motion"}, []], ["div", {"class": "scene-tone"}, []]]], "\n", ["header", {"class": "site-header"}, [["a", {"class": "brand", "href": "?home=1"}, [["span", {"class": "crest"}, ["\u7dbe"]], ["span", {}, ["Estate ", ["small", {}, ["Workspace"]]]]]], "\n", ["details", {"id": "scene-picker", "class": "scene-picker"}, ["\n", ["summary", {"class": "settings-trigger", "aria-label": "Workspace settings", "title": "Workspace settings"}, [["svg", {"viewbox": "0 0 24 24", "aria-hidden": "true"}, [["path", {"d": "m9 3-.6 2.4-2.1 1.2L4 6l-2 3.5 1.8 1.7v2.4L2 15.3 4 19l2.3-.7 2.1 1.2L9 22h4l.6-2.5 2.1-1.2 2.3.7 2-3.7-1.8-1.7v-2.4L20 9.5 18 6l-2.3.6-2.1-1.2L13 3Z", "transform": "translate(1 -1) scale(.95)"}, []], ["circle", {"cx": "11.5", "cy": "11.5", "r": "3"}, []]]]]], "\n", ["div", {"class": "scene-panel glass", "role": "region", "aria-label": "Workspace settings"}, ["\n", ["div", {"class": "settings-heading"}, [["div", {}, [["p", {"class": "settings-eyebrow"}, ["MAKE IT YOURS"]], ["h2", {}, ["Workspace settings"]]]], ["button", {"id": "close-settings", "class": "settings-close", "aria-label": "Close settings"}, [["svg", {"viewbox": "0 0 24 24", "aria-hidden": "true"}, [["path", {"d": "m6 6 12 12M18 6 6 18"}, []]]]]]]], "\n", ["div", {"class": "settings-tabs", "role": "tablist", "aria-label": "Settings sections"}, ["\n", ["button", {"id": "tab-appearance", "role": "tab", "aria-selected": "true", "aria-controls": "settings-appearance", "data-settings-tab": "appearance"}, ["Appearance"]], ["button", {"id": "tab-scenes", "role": "tab", "aria-selected": "false", "aria-controls": "settings-scenes", "tabindex": "-1", "data-settings-tab": "scenes"}, ["Scenes"]], ["button", {"id": "tab-motion", "role": "tab", "aria-selected": "false", "aria-controls": "settings-motion", "tabindex": "-1", "data-settings-tab": "motion"}, ["Motion"]]]], "\n", ["section", {"id": "settings-appearance", "role": "tabpanel", "aria-labelledby": "tab-appearance"}, [["h3", {}, ["Your workspace, your way"]], ["p", {"class": "settings-description"}, ["A living backdrop or the familiar original layout."]], ["label", {"class": "setting-row", "for": "mode"}, [["span", {}, [["strong", {}, ["Workspace style"]], ["small", {}, ["Remembered on this device"]]]], ["select", {"id": "mode"}, [["option", {"value": "rain"}, ["Glass"]], ["option", {"value": "classic"}, ["Classic"]]]]]], ["div", {"class": "appearance-preview", "aria-hidden": "true"}, [["i", {}, []], ["i", {}, []], ["i", {}, []]]], ["p", {"id": "layout-description", "class": "settings-description"}, ["Your complete workspace over a living scene. Same pages and tools in both styles."]]]], "\n", ["fieldset", {"id": "scene-settings"}, [["legend", {"class": "sr-only"}, ["Living scene controls"]], "\n", ["section", {"id": "settings-scenes", "role": "tabpanel", "aria-labelledby": "tab-scenes", "hidden": ""}, [["div", {"class": "section-heading"}, [["div", {}, [["h3", {}, ["Choose your atmosphere"]], ["p", {"class": "settings-description"}, ["24 scenes + 8 Estate festivals"]]]], ["span", {"class": "current-scene", "id": "scene-summary"}, ["Rain glass"]]]], ["label", {"class": "scene-select-label", "hidden": ""}, ["Current scene ", ["select", {"id": "scene"}, []]]], ["label", {"class": "behaviour-label mood-label"}, ["Lighting mood", ["select", {"id": "mood"}, [["option", {"value": "auto"}, ["Automatic \u00b7 follow the time"]], ["option", {"value": "0"}, ["Day"]], ["option", {"value": "1"}, ["Golden hour"]], ["option", {"value": "2"}, ["Night"]]]]]], ["p", {"id": "mood-status", "class": "scene-hint"}, []], ["div", {"id": "variations", "class": "variations", "aria-label": "Choose a lighting mood"}, []], ["div", {"class": "gallery-filters", "role": "group", "aria-label": "Scene categories"}, [["button", {"type": "button", "data-category": "all", "aria-pressed": "true"}, ["All"]], ["button", {"type": "button", "data-category": "nature", "aria-pressed": "false"}, ["Nature"]], ["button", {"type": "button", "data-category": "night", "aria-pressed": "false"}, ["After dark"]], ["button", {"type": "button", "data-category": "japan", "aria-pressed": "false"}, ["Japanese"]], ["button", {"type": "button", "data-category": "festive", "aria-pressed": "false"}, ["Festive"]]]], ["div", {"id": "scene-gallery", "class": "scene-gallery"}, []], ["p", {"class": "scene-hint"}, ["Choosing a wallpaper keeps it fixed and turns off festive matching. Lighting stays independent."]]]], "\n", ["section", {"id": "settings-motion", "role": "tabpanel", "aria-labelledby": "tab-motion", "hidden": ""}, [["h3", {}, ["Set your own rhythm"]], ["p", {"class": "settings-description"}, ["Keep a favourite, or let the day choose."]], ["div", {"class": "motion-columns"}, [["div", {"class": "motion-behaviour"}, [["div", {"class": "setting-row"}, [["span", {}, [["strong", {}, ["Live animation"]], ["small", {}, ["Movement within the scene"]]]], ["button", {"id": "motion", "class": "motion-toggle", "role": "switch", "aria-checked": "true", "aria-label": "Live animation"}, []]]], ["label", {"class": "behaviour-label"}, ["Scene changes", ["select", {"id": "behaviour"}, [["option", {"value": "fixed"}, ["Keep one scene"]], ["option", {"value": "daily"}, ["One wallpaper each day"]], ["option", {"value": "weather"}, ["Follow weather + time"]]]]]], ["p", {"id": "scene-status", "role": "status"}, []]]], ["div", {"class": "motion-context"}, [["label", {"class": "check-row"}, [["input", {"id": "match-festivals", "type": "checkbox", "checked": ""}, []], ["span", {}, [["strong", {}, ["Match Estate festivals"]], ["small", {}, ["The selected Estate festival takes priority."]]]]]], ["div", {"id": "seasonal-option", "hidden": ""}, [["label", {"class": "check-row"}, [["input", {"id": "match-season", "type": "checkbox"}, []], ["span", {}, [["strong", {}, ["Seasonal daily choices"]], ["small", {}, ["Use the Estate\u2019s season to choose each day\u2019s wallpaper."]]]]]]]], ["div", {"id": "weather-location", "hidden": ""}, [["form", {"id": "city-form"}, [["label", {"for": "weather-city"}, ["Weather city"]], ["div", {}, [["input", {"id": "weather-city", "placeholder": "City, country", "required": "", "minlength": "2"}, []], ["button", {"type": "submit"}, ["Use city"]]]]]], ["small", {"id": "city-message", "role": "status"}, []], ["a", {"href": "https://open-meteo.com/", "target": "_blank", "rel": "noreferrer"}, ["Weather by Open-Meteo"]]]]]]]], ["button", {"id": "keep-scene", "class": "keep-scene", "type": "button"}, ["Keep the current scene"]]]], "\n"]], ["p", {"class": "classic-notice"}, ["Scenes and motion are available in Glass. Switch in Appearance."]], "\n"]]]]]], "\n", ["div", {"id": "rain-workspace", "class": "workspace-atmosphere"}, [["span", {"id": "scene-icon", "aria-hidden": "true"}, ["\u2602"]], ["span", {}, [["span", {"id": "scene-name"}, ["Rain glass"]], ["small", {"id": "scene-follow-label"}, ["Kept until you change it"]]]]]], "\n\n", ["footer", {"class": "page-footer"}, [["a", {"id": "photo-credit", "href": "https://unsplash.com/s/photos/blue-rain", "target": "_blank", "rel": "noreferrer"}, ["Rain photograph \u00b7 Unsplash"]], ["span", {}, [["span", {"id": "motion-label"}, ["Live rain"]], " \u00b7 ", ["button", {"id": "hide-ui"}, ["Enjoy the view"]]]], ["a", {"href": "?home=1"}, ["Estate home"]]]], "\n", ["button", {"id": "restore-ui", "class": "glass", "hidden": ""}, ["Back to workspace"]]];nodes.forEach(n=>shell.append(node(n)));
const nativeStyle=pageDocument.createElement("link");nativeStyle.rel="stylesheet";
const base=new URL(".",pageDocument.currentScript.src);const assetNames={"desert.jpg": "desert.jpg", "torii.jpg": "torii.jpg", "wisteria.jpg": "wisteria.jpg", "blossom.jpg": "blossom.jpg", "drop-alpha.png": "drop-alpha.png", "meadow.jpg": "meadow.jpg", "city.jpg": "city.jpg", "forest.jpg": "forest.jpg", "volcano.jpg": "volcano.jpg", "startrails.jpg": "startrails.jpg", "aurora.jpg": "aurora.jpg", "cloud-sea.jpg": "cloud-sea.jpg", "lavender.jpg": "lavender.jpg", "snow-forest.jpg": "snow-forest.jpg", "cloud-bank.webp": "cloud-bank.webp", "waterfall.jpg": "waterfall.jpg", "fireflies.jpg": "fireflies.jpg", "dawn.jpg": "dawn.jpg", "lotus.jpg": "lotus.jpg", "spiderlily.jpg": "spiderlily.jpg", "lake.jpg": "lake.jpg", "drop-color.png": "drop-color.png", "autumn.jpg": "autumn.jpg", "ocean.jpg": "ocean.jpg", "night.jpg": "night.jpg", "sunset.jpg": "sunset.jpg", "festive/holy-week-night.webp": "festive/holy-week-night.webp", "festive/kingdomtide-golden.webp": "festive/kingdomtide-golden.webp", "festive/advent-day.webp": "festive/advent-day.webp", "festive/kingdomtide-day.webp": "festive/kingdomtide-day.webp", "festive/pentecost-night.webp": "festive/pentecost-night.webp", "festive/lent-day.webp": "festive/lent-day.webp", "festive/holy-week-golden.webp": "festive/holy-week-golden.webp", "festive/easter-night.webp": "festive/easter-night.webp", "festive/pentecost-golden.webp": "festive/pentecost-golden.webp", "festive/advent-golden.webp": "festive/advent-golden.webp", "festive/epiphany-night.webp": "festive/epiphany-night.webp", "festive/lent-night.webp": "festive/lent-night.webp", "festive/kingdomtide-night.webp": "festive/kingdomtide-night.webp", "festive/epiphany-golden.webp": "festive/epiphany-golden.webp", "festive/easter-day.webp": "festive/easter-day.webp", "festive/epiphany-day.webp": "festive/epiphany-day.webp", "festive/easter-golden.webp": "festive/easter-golden.webp", "festive/christmas-golden.webp": "festive/christmas-golden.webp", "festive/christmas-day.webp": "festive/christmas-day.webp", "festive/lent-golden.webp": "festive/lent-golden.webp", "festive/advent-night.webp": "festive/advent-night.webp", "festive/pentecost-day.webp": "festive/pentecost-day.webp", "festive/holy-week-day.webp": "festive/holy-week-day.webp", "festive/christmas-night.webp": "festive/christmas-night.webp", "../rain-window.jpg": "rain-window.jpg"};const asset=name=>new URL(assetNames[name]||name,base).href;nativeStyle.href=new URL("workspace.css",base).href;shadow.prepend(nativeStyle);
/* Adapted from Lucas Bebber / Codrops RainEffect (2015).
   https://github.com/codrops/RainEffect
   https://tympanus.net/codrops/licensing/
   Modified: externally owned clock, frame-rate-independent motion, radius cap. */
(()=>{
function random(from=null,to=null,interpolation=null){
  if(from==null){
    from=0;
    to=1;
  }else if(from!=null && to==null){
    to=from;
    from=0;
  }
  const delta=to-from;

  if(interpolation==null){
    interpolation=(n)=>{
      return n;
    }
  }
  return from+(interpolation(Math.random())*delta);
}
function chance(c){
  return random()<=c;
}

function times(n,f){
  for (let i = 0; i < n; i++) {
    f.call(this,i);
  }
}

function createCanvas(width,height){
  let canvas=document.createElement("canvas");
  canvas.width=width;
  canvas.height=height;
  return canvas;
}


let dropSize=64;
const Drop={
  x:0,
  y:0,
  r:0,
  spreadX:0,
  spreadY:0,
  momentum:0,
  momentumX:0,
  lastSpawn:0,
  nextSpawn:0,
  parent:null,
  isNew:true,
  killed:false,
  shrink:0,
}
const defaultOptions={
  minR:10,
  maxR:40,
  maxDrops:900,
  rainChance:0.3,
  rainLimit:3,
  dropletsRate:50,
  dropletsSize:[2,4],
  dropletsCleaningRadiusMultiplier:0.43,
  raining:true,
  globalTimeScale:1,
  trailRate:1,
  autoShrink:true,
  spawnArea:[-0.1,0.95],
  trailScaleRange:[0.2,0.5],
  collisionRadius:0.65,
  collisionRadiusIncrease:0.01,
  dropFallMultiplier:1,
  collisionBoostMultiplier:0.05,
  collisionBoost:1,
}

function Raindrops(width,height,scale,dropAlpha,dropColor,options={}){
  this.width=width;
  this.height=height;
  this.scale=scale;
  this.dropAlpha=dropAlpha;
  this.dropColor=dropColor;
  this.options=Object.assign({},defaultOptions,options);
  this.init();
}
Raindrops.prototype={
  dropColor:null,
  dropAlpha:null,
  canvas:null,
  ctx:null,
  width:0,
  height:0,
  scale:0,
  dropletsPixelDensity:1,
  droplets:null,
  dropletsCtx:null,
  dropletsCounter:0,
  drops:null,
  dropsGfx:null,
  clearDropletsGfx:null,
  textureCleaningIterations:0,
  lastRender:null,

  options:null,

  init(){
    this.canvas = createCanvas(this.width,this.height);
    this.ctx = this.canvas.getContext('2d');

    this.droplets = createCanvas(this.width*this.dropletsPixelDensity,this.height*this.dropletsPixelDensity);
    this.dropletsCtx = this.droplets.getContext('2d');

    this.drops=[];
    this.dropsGfx=[];

    this.renderDropsGfx();

    // Clock is owned by the workspace, including pause and visibility.
  },
  get deltaR(){
    return this.options.maxR-this.options.minR;
  },
  get area(){
    return (this.width*this.height)/this.scale;
  },
  get areaMultiplier(){
    return Math.sqrt(this.area/(1024*768));
  },
  drawDroplet(x,y,r){
    this.drawDrop(this.dropletsCtx,Object.assign(Object.create(Drop),{
      x:x*this.dropletsPixelDensity,
      y:y*this.dropletsPixelDensity,
      r:r*this.dropletsPixelDensity
    }));
  },

  renderDropsGfx(){
    let dropBuffer=createCanvas(dropSize,dropSize);
    let dropBufferCtx=dropBuffer.getContext('2d');
    this.dropsGfx=Array.apply(null,Array(255))
      .map((cur,i)=>{
        let drop=createCanvas(dropSize,dropSize);
        let dropCtx=drop.getContext('2d');

        dropBufferCtx.clearRect(0,0,dropSize,dropSize);

        // color
        dropBufferCtx.globalCompositeOperation="source-over";
        dropBufferCtx.drawImage(this.dropColor,0,0,dropSize,dropSize);

        // blue overlay, for depth
        dropBufferCtx.globalCompositeOperation="screen";
        dropBufferCtx.fillStyle="rgba(0,0,"+i+",1)";
        dropBufferCtx.fillRect(0,0,dropSize,dropSize);

        // alpha
        dropCtx.globalCompositeOperation="source-over";
        dropCtx.drawImage(this.dropAlpha,0,0,dropSize,dropSize);

        dropCtx.globalCompositeOperation="source-in";
        dropCtx.drawImage(dropBuffer,0,0,dropSize,dropSize);
        return drop;
    });

    // create circle that will be used as a brush to remove droplets
    this.clearDropletsGfx=createCanvas(128,128);
    let clearDropletsCtx=this.clearDropletsGfx.getContext("2d");
    clearDropletsCtx.fillStyle="#000";
    clearDropletsCtx.beginPath();
    clearDropletsCtx.arc(64,64,64,0,Math.PI*2);
    clearDropletsCtx.fill();
  },
  drawDrop(ctx,drop){
    if(this.dropsGfx.length>0){
      let x=drop.x;
      let y=drop.y;
      let r=drop.r;
      let spreadX=drop.spreadX;
      let spreadY=drop.spreadY;

      let scaleX=1;
      let scaleY=1.5;

      let d=Math.max(0,Math.min(1,((r-this.options.minR)/(this.deltaR))*0.9));
      d*=1/(((drop.spreadX+drop.spreadY)*0.5)+1);

      ctx.globalAlpha=1;
      ctx.globalCompositeOperation="source-over";

      d=Math.floor(d*(this.dropsGfx.length-1));
      ctx.drawImage(
        this.dropsGfx[d],
        (x-(r*scaleX*(spreadX+1)))*this.scale,
        (y-(r*scaleY*(spreadY+1)))*this.scale,
        (r*2*scaleX*(spreadX+1))*this.scale,
        (r*2*scaleY*(spreadY+1))*this.scale
      );
    }
  },
  clearDroplets(x,y,r=30){
    let ctx=this.dropletsCtx;
    ctx.globalCompositeOperation="destination-out";
    ctx.drawImage(
      this.clearDropletsGfx,
      (x-r)*this.dropletsPixelDensity*this.scale,
      (y-r)*this.dropletsPixelDensity*this.scale,
      (r*2)*this.dropletsPixelDensity*this.scale,
      (r*2)*this.dropletsPixelDensity*this.scale*1.5
    )
  },
  clearCanvas(){
    this.ctx.clearRect(0,0,this.width,this.height);
  },
  createDrop(options){
    if(this.drops.length >= this.options.maxDrops*this.areaMultiplier) return null;

    return Object.assign(Object.create(Drop),options);
  },
  addDrop(drop){
    if(this.drops.length >= this.options.maxDrops*this.areaMultiplier || drop==null) return false;

    this.drops.push(drop);
    return true;
  },
  updateRain(timeScale){
    let rainDrops=[];
    if(this.options.raining){
      let limit=this.options.rainLimit*timeScale*this.areaMultiplier;
      let count=0;
      while(chance(this.options.rainChance*timeScale*this.areaMultiplier) && count<limit){
        count++;
        let r=random(this.options.minR,this.options.maxR,(n)=>{
          return Math.pow(n,3);
        });
        let rainDrop=this.createDrop({
          x:random(this.width/this.scale),
          y:random((this.height/this.scale)*this.options.spawnArea[0],(this.height/this.scale)*this.options.spawnArea[1]),
          r:r,
          momentum:1+((r-this.options.minR)*0.1)+random(2),
          spreadX:1.5,
          spreadY:1.5,
        });
        if(rainDrop!=null){
          rainDrops.push(rainDrop);
        }
      }
    }
    return rainDrops;
  },
  clearDrops(){
    this.drops.forEach((drop)=>{
      setTimeout(()=>{
        drop.shrink=0.1+(random(0.5));
      },random(1200))
    })
    this.clearTexture();
  },
  clearTexture(){
    this.textureCleaningIterations=50;
  },
  updateDroplets(timeScale){
    if(this.textureCleaningIterations>0){
      this.textureCleaningIterations-=1*timeScale;
      this.dropletsCtx.globalCompositeOperation="destination-out";
      this.dropletsCtx.fillStyle="rgba(0,0,0,"+(0.05*timeScale)+")";
      this.dropletsCtx.fillRect(0,0,
        this.width*this.dropletsPixelDensity,this.height*this.dropletsPixelDensity);
    }
    if(this.options.raining){
      this.dropletsCounter+=this.options.dropletsRate*timeScale*this.areaMultiplier;
      times(this.dropletsCounter,(i)=>{
        this.dropletsCounter--;
        this.drawDroplet(
          random(this.width/this.scale),
          random(this.height/this.scale),
          random(...this.options.dropletsSize,(n)=>{
            return n*n;
          })
        )
      });
    }
    this.ctx.drawImage(this.droplets,0,0,this.width,this.height);
  },
  updateDrops(timeScale){
    let newDrops=[];

    this.updateDroplets(timeScale);
    let rainDrops=this.updateRain(timeScale);
    newDrops=newDrops.concat(rainDrops);

    this.drops.sort((a,b)=>{
      let va=(a.y*(this.width/this.scale))+a.x;
      let vb=(b.y*(this.width/this.scale))+b.x;
      return va>vb?1:va==vb?0:-1;
    });

    this.drops.forEach(function(drop,i){
      if(!drop.killed){
        // update gravity
        // (chance of drops "creeping down")
        if(chance((drop.r-(this.options.minR*this.options.dropFallMultiplier)) * (0.1/this.deltaR) * timeScale)){
          drop.momentum += random((drop.r/this.options.maxR)*4);
        }
        // clean small drops
        if(this.options.autoShrink && drop.r<=this.options.minR && chance(0.05*timeScale)){
          drop.shrink+=0.01;
        }
        //update shrinkage
        drop.r -= drop.shrink*timeScale;
        if(drop.r<=0) drop.killed=true;

        // update trails
        if(this.options.raining){
          drop.lastSpawn+=drop.momentum*timeScale*this.options.trailRate;
          if(drop.lastSpawn>drop.nextSpawn){
            let trailDrop=this.createDrop({
              x:drop.x+(random(-drop.r,drop.r)*0.1),
              y:drop.y-(drop.r*0.01),
              r:drop.r*random(...this.options.trailScaleRange),
              spreadY:drop.momentum*0.1,
              parent:drop,
            });

            if(trailDrop!=null){
              newDrops.push(trailDrop);

              drop.r*=Math.pow(0.97,timeScale);
              drop.lastSpawn=0;
              drop.nextSpawn=random(this.options.minR,this.options.maxR)-(drop.momentum*2*this.options.trailRate)+(this.options.maxR-drop.r);
            }
          }
        }

        //normalize spread
        drop.spreadX*=Math.pow(0.4,timeScale);
        drop.spreadY*=Math.pow(0.7,timeScale);

        //update position
        let moved=drop.momentum>0;
        if(moved && !drop.killed){
          drop.y+=drop.momentum*timeScale;
          drop.x+=drop.momentumX*timeScale;
          if(drop.y>(this.height/this.scale)+drop.r){
            drop.killed=true;
          }
        }

        // collision
        let checkCollision=(moved || drop.isNew) && !drop.killed;
        drop.isNew=false;

        if(checkCollision){
          this.drops.slice(i+1,i+70).forEach((drop2)=>{
            //basic check
            if(
              drop != drop2 &&
              drop.r > drop2.r &&
              drop.parent != drop2 &&
              drop2.parent != drop &&
              !drop2.killed
            ){
              let dx=drop2.x-drop.x;
              let dy=drop2.y-drop.y;
              var d=Math.sqrt((dx*dx)+(dy*dy));
              //if it's within acceptable distance
              if(d<(drop.r+drop2.r)*(this.options.collisionRadius+(drop.momentum*this.options.collisionRadiusIncrease*timeScale))){
                let pi=Math.PI;
                let r1=drop.r;
                let r2=drop2.r;
                let a1=pi*(r1*r1);
                let a2=pi*(r2*r2);
                let targetR=Math.sqrt((a1+(a2*0.8))/pi);
                if(targetR>this.options.maxR){
                  targetR=this.options.maxR;
                }
                drop.r=targetR;
                drop.momentumX+=dx*0.1;
                drop.spreadX=0;
                drop.spreadY=0;
                drop2.killed=true;
                drop.momentum=Math.max(drop2.momentum,Math.min(40,drop.momentum+(targetR*this.options.collisionBoostMultiplier)+this.options.collisionBoost));
              }
            }
          });
        }

        //slowdown momentum
        drop.momentum-=Math.max(1,(this.options.minR*0.5)-drop.momentum)*0.1*timeScale;
        if(drop.momentum<0) drop.momentum=0;
        drop.momentumX*=Math.pow(0.7,timeScale);


        if(!drop.killed){
          newDrops.push(drop);
          if(moved && this.options.dropletsRate>0) this.clearDroplets(drop.x,drop.y,drop.r*this.options.dropletsCleaningRadiusMultiplier);
          this.drawDrop(this.ctx, drop);
        }

      }
    },this);

    this.drops = newDrops;
  },
  update(timeScale=1){
    this.clearCanvas();
    this.updateDrops(Math.min(timeScale,2)*this.options.globalTimeScale);

  }
}

globalThis.EstateRaindrops=Raindrops;

})();

/* Fixed scenery + independently simulated water. No scrolling image or time-based UVs.
   Droplet normal-map approach: Lucas Bebber / Codrops RainEffect; see RAIN-CREDITS.md. */
(() => {
  'use strict';
  const canvas=document.getElementById('rain');
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
  let enabled=true,ready=false,raf=0,last=0,simulation=null,variation=0;
  function applyVariation(){if(simulation){simulation.options.rainChance=[.22,.33,.65][variation];simulation.options.rainLimit=[1,2,3][variation];simulation.options.globalTimeScale=[.6,.72,1][variation];}}
  window.rainGlass={setVariation(value){variation=value;applyVariation();},setEnabled(value){enabled=!!value;sync();},get enabled(){return enabled;}};
  function fail(message){ready=false;document.body.dataset.rainError=message;document.body.dataset.liveRain='unavailable';sync();}
  if(!gl){fail('WebGL unavailable');return;}
  const vertex='attribute vec2 position;varying vec2 uv;void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}';
  const fragment=`precision highp float;
    varying vec2 uv;
    uniform sampler2D scenery,focusScene,water;
    uniform vec2 resolution;
    void main(){
      vec2 p=vec2(uv.x,1.-uv.y);
      vec4 drop=texture2D(water,p);
      float mask=clamp(drop.a*20.-5.,0.,1.);
      vec2 normal=(drop.gr-.5)*2.;
      vec2 bend=normal*(225.+drop.b*285.)/resolution;
      vec3 bg=texture2D(scenery,p).rgb;
      vec3 lens=texture2D(focusScene,clamp(p+bend,vec2(.001),vec2(.999))).rgb;
      // A small transmitted-light lift and soft upper contact shadow.
      float shadow=clamp(texture2D(water,p-vec2(0.,drop.b*3./resolution.y)).a*20.-5.5,0.,1.);
      vec3 surface=normalize(vec3(normal*.85,sqrt(max(.02,1.-dot(normal,normal)*.5))));
      float gleam=pow(max(0.,dot(surface,normalize(vec3(.3,-.72,.65)))),36.);
      vec3 color=mix(bg*(1.-shadow*.16),lens*1.08+gleam*.19,mask);
      gl_FragColor=vec4(color,1.);
    }`;
  function compile(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
  const program=gl.createProgram();
  try{gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));}catch(e){fail(e.message);return;}
  gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const resolution=gl.getUniformLocation(program,'resolution');
  const textures=['scenery','focusScene','water'].map((name,i)=>{const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.uniform1i(gl.getUniformLocation(program,name),i);return t;});
  function upload(unit,image){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,textures[unit]);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);}
  const load=src=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('Rain asset failed: '+src));image.src=asset(src);});
  let photo,alpha,color;
  function resize(){
    const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,1.5);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(resolution,w,h);
    if(!ready)return;
    const backdrop=document.createElement('canvas');backdrop.width=Math.min(1920,w*1.25);backdrop.height=Math.round(backdrop.width*h/w);
    const ctx=backdrop.getContext('2d'),bw=backdrop.width,bh=backdrop.height,scale=Math.max(bw/photo.width,bh/photo.height)*1.1;
    // These two textures are built only on resize. They never change during rain.
    for(let unit=0;unit<2;unit++){ctx.clearRect(0,0,bw,bh);ctx.filter='blur('+(unit===0?24:8)+'px) saturate(.43) brightness(.84)';ctx.drawImage(photo,(bw-photo.width*scale)/2,(bh-photo.height*scale)*.36,photo.width*scale,photo.height*scale);upload(unit,backdrop);}
    simulation=new EstateRaindrops(w,h,1,alpha,color,{minR:6,maxR:23,maxDrops:520,rainChance:.36,rainLimit:2,dropletsRate:1.1,dropletsSize:[1.1,3.1],globalTimeScale:.72,trailRate:1,trailScaleRange:[.18,.34],collisionRadius:.65,collisionBoost:.55,dropFallMultiplier:1.1});
    for(let i=0;i<1500;i++)simulation.drawDroplet(Math.random()*w,Math.random()*h,1.1+Math.random()*2.6);
    for(let i=0;i<150;i++)simulation.addDrop(simulation.createDrop({x:Math.random()*w,y:Math.random()*h,r:3.5+Math.random()*11.5,momentum:i%4===0?2+Math.random()*4:0}));
    applyVariation();simulation.update(0);render();
  }
  function render(){if(!ready||!simulation)return;upload(2,simulation.canvas);gl.drawArrays(gl.TRIANGLES,0,6);}
  function frame(now){raf=0;if(!ready||!enabled||document.hidden)return;if(now-last>=1000/30){const dt=last?Math.min((now-last)/1000,.05):1/30;last=now;simulation.update(dt*60);render();}raf=requestAnimationFrame(frame);}
  function sync(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;if(ready&&enabled&&!document.hidden)raf=requestAnimationFrame(frame);}
  Promise.all([load('../rain-window.jpg'),load('drop-alpha.png'),load('drop-color.png')]).then(images=>{[photo,alpha,color]=images;ready=true;resize();document.body.dataset.liveRain='ready';delete document.body.dataset.rainError;sync();}).catch(e=>fail(e.message));
  let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(resize,120);});document.addEventListener('visibilitychange',sync);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fail('Graphics context lost');});resize();
})();

/* Deterministic scene choices; manual selection always wins. */
(() => {
 const scenes={
 startrails:{name:'Star trails',description:'Visible rotating arcs above snowy pines',image:'startrails.jpg',looks:['Polar arcs','Celestial violet','Silver orbit'],credit:'Florian Schindler · Unsplash',url:'https://unsplash.com/photos/I3VWe-dSHKY'},
 aurora:{name:'Aurora',description:'Flowing curtains of northern light',image:'aurora.jpg',looks:['Emerald veil','Violet ribbons','Arctic blue'],credit:'Kalen Emsley · Unsplash',url:'https://unsplash.com/photos/0ic2ZYeDQx4'},
 rain:{name:'Rain glass',description:'Water beads, slides and merges',image:'../rain-window.jpg',looks:['Soft drizzle','Blue hour','Heavy rain'],credit:'Rain photograph · Unsplash',url:'https://unsplash.com/s/photos/blue-rain'},
 clouds:{name:'Drifting clouds',description:'Slow clouds above the mountains',image:'cloud-sea.jpg',looks:['Silver lining','Clear blue','Golden clouds'],credit:'Cloud photograph · Unsplash',url:'https://unsplash.com/s/photos/cloud-sea'},
 snow:{name:'Snowfall',description:'Soft flakes at different depths',image:'snow-forest.jpg',looks:['Winter hush','Blue dusk','Snow globe'],credit:'Vladimir Vishnyakov · Unsplash',url:'https://unsplash.com/photos/CyNylTimzAo'},
 dawn:{name:'Dawn mist',description:'Mist drifts between mountain ridges',image:'dawn.jpg',looks:['Rose dawn','Pearl morning','First gold'],credit:'Pascal Debrunner · Unsplash',url:'https://unsplash.com/photos/uskLD4MZeb8'},
 sunset:{name:'Sunset coast',description:'Warm light with a quiet ocean shimmer',image:'sunset.jpg',looks:['Peach sky','Amber evening','Afterglow'],credit:'Braden Jarvis · Unsplash',url:'https://unsplash.com/photos/ih5Kq0XowwY'},
 night:{name:'Starry night',description:'Gentle twinkling above still mountains',image:'night.jpg',looks:['Deep indigo','Violet sky','Silver night'],credit:'Marek Piwnicki · Unsplash',url:'https://unsplash.com/photos/iy2Y6TBThqI'},
 forest:{name:'Woodland',description:'Soft drifting motes in forest light',image:'forest.jpg',looks:['Fern light','Golden grove','Cool morning'],credit:'Pascal Debrunner · Unsplash',url:'https://unsplash.com/photos/o7_pjm0V9-A'},
 ocean:{name:'Quiet ocean',description:'Slow ripples and scattered reflections',image:'ocean.jpg',looks:['Sea glass','Blue hour','Moonlit water'],credit:'Alex Plesovskich · Unsplash',url:'https://unsplash.com/photos/LdNn81NlUj4'},
 fireflies:{name:'Firefly grove',description:'Small lights wander through a bamboo grove',image:'fireflies.jpg',looks:['Summer evening','Emerald dusk','Midnight garden'],credit:'Ryunosuke Kikuno · Unsplash',url:'https://unsplash.com/photos/DwDd6Fe9uoE'}
 };
 scenes["waterfall"]={"name": "Woodland falls", "description": "Drifting spray above a mossy cascade", "image": "waterfall.jpg", "effect": "mist", "credit": "\u78ca \u5468 \u00b7 Unsplash", "url": "https://unsplash.com/photos/rDnlpMQmLCQ"};
 scenes["desert"]={"name": "Desert dunes", "description": "Fine sand carried across the dunes", "image": "desert.jpg", "effect": "dust", "credit": "Alexander Psiuk \u00b7 Unsplash", "url": "https://unsplash.com/photos/cczug9CpFpU"};
 scenes["lavender"]={"name": "Lavender fields", "description": "Pollen floating over violet rows", "image": "lavender.jpg", "effect": "pollen", "credit": "Remi Antunes \u00b7 Unsplash", "url": "https://unsplash.com/photos/LBu4WQxJNMw"};
 scenes["blossom"]={"name": "Sakura stream", "description": "Petals tumble past Mount Fuji", "image": "blossom.jpg", "effect": "petals", "credit": "Gaku Suyama \u00b7 Unsplash", "url": "https://unsplash.com/photos/o8c1em1RybI"};
 scenes["autumn"]={"name": "Autumn lake", "description": "Copper leaves drift over a quiet lake", "image": "autumn.jpg", "effect": "leaves", "credit": "Denis Oliveira \u00b7 Unsplash", "url": "https://unsplash.com/photos/raJXsGEhndw"};
 scenes["volcano"]={"name": "Volcanic dusk", "description": "Embers rise into the evening air", "image": "volcano.jpg", "effect": "embers", "credit": "Erwan Hesry \u00b7 Unsplash", "url": "https://unsplash.com/photos/h-ACUrBngrw"};
 scenes["city"]={"name": "City lights", "description": "Quiet light trails along the waterfront", "image": "city.jpg", "effect": "traffic", "credit": "CHUTTERSNAP \u00b7 Unsplash", "url": "https://unsplash.com/photos/JH0wCegJsrQ"};
 scenes["lake"]={"name": "Mirror lake", "description": "Gentle rings break the reflection", "image": "lake.jpg", "effect": "ripples", "credit": "Thierry Lemaitre \u00b7 Unsplash", "url": "https://unsplash.com/photos/r-H1Jgu6dI8"};
 scenes["meadow"]={"name": "Alpine meadow", "description": "Light seeds drift above the meadow", "image": "meadow.jpg", "effect": "seeds", "credit": "Pierre Lemos \u00b7 Unsplash", "url": "https://unsplash.com/photos/wfOdYsDrxvs"};
 scenes["spiderlily"]={"name": "Higanbana grove", "description": "Red spider lilies beneath a veil of drifting mist", "effect": "mist", "image": "spiderlily.jpg", "credit": "Kouji Tsuru \u00b7 Unsplash", "url": "https://unsplash.com/photos/_kgVanQ6wsY"};
 scenes["wisteria"]={"name": "Wisteria garden", "description": "Soft violet petals drift through hanging blossoms", "effect": "petals", "image": "wisteria.jpg", "credit": "Aki \u00b7 Unsplash", "url": "https://unsplash.com/photos/UbJDIWM11yM"};
 scenes["lotus"]={"name": "Lotus pond", "description": "Quiet water rings around a pink bloom", "effect": "ripples", "image": "lotus.jpg", "credit": "Carlos de Miguel \u00b7 Unsplash", "url": "https://unsplash.com/photos/Kq2WV3WPrYU"};
 scenes["torii"]={"name": "Torii forest", "description": "Vermilion shrine gates with low drifting mist", "effect": "mist", "image": "torii.jpg", "credit": "Chrishaun Byrom \u00b7 Unsplash", "url": "https://unsplash.com/photos/BBKnW5KQEOU"};
 const baseOrder=['rain','clouds','snow','dawn','sunset','night','startrails','aurora','forest','ocean','fireflies','waterfall','desert','lavender','blossom','autumn','volcano','city','lake','meadow','spiderlily','wisteria','lotus','torii'];
 const festivals={advent:'Advent',christmas:'Christmas',epiphany:'Epiphany',lent:'Lent','holy-week':'Holy Week',easter:'Easter',pentecost:'Pentecost',kingdomtide:'Kingdomtide'};
 const festiveEffects={advent:'snow',christmas:'snow',epiphany:'sparkles',lent:'mist','holy-week':'mist',easter:'petals',pentecost:'embers',kingdomtide:'leaves'};
 for(const [id,name] of Object.entries(festivals))scenes['festive-'+id]={name,description:'The Estate’s '+name+' courtyard',image:'festive/'+id+'-day.webp',images:['day','golden','night'].map(m=>'festive/'+id+'-'+m+'.webp'),festival:id,effect:festiveEffects[id],credit:'Estate seasonal art',url:'../Header-Glass-Preview.htm?home=1'};
 for(const data of Object.values(scenes))data.looks=['Day','Golden hour','Night'];
 const ordered=Object.fromEntries([...baseOrder,...Object.keys(festivals).map(id=>'festive-'+id)].map(k=>[k,scenes[k]]));
 const byHour=h=>h>=23?'startrails':h<5||h>=21?'night':h<8?'dawn':h<11?'clouds':h<15?'forest':h<17?'ocean':h<19?'sunset':'fireflies';
 const moodAt=h=>h>=7&&h<17?0:h>=17&&h<20?1:2;
 function weatherScene(weather,hour){
  const c=weather.code;
  if([71,73,75,77,85,86].includes(c))return 'snow';
  if([51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(c))return 'rain';
  if(weather.isDay===0)return 'night';
  if([2,3,45,48].includes(c))return 'clouds';
  return byHour(hour);
 }
 const seasonalPools={spring:['blossom','wisteria','torii','meadow','rain','waterfall','lavender','dawn','forest'],summer:['lotus','ocean','lavender','desert','fireflies','meadow','lake','sunset'],autumn:['spiderlily','torii','autumn','rain','forest','city','volcano','dawn','lake'],winter:['snow','aurora','startrails','night','clouds','rain','city']};
 // UTC arithmetic on local calendar fields avoids DST shortening a rotation day.
 function dailyScene(date=new Date(),season){const pool=seasonalPools[season]||baseOrder;const day=Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000);return pool[((day%pool.length)+pool.length)%pool.length];}
 function resolve(behaviour,fixed,hour,weather,options={}){
  if(options.matchFestivals&&festivals[options.festival])return 'festive-'+options.festival;
  if(behaviour==='daily')return dailyScene(options.date,options.seasonal?options.season:null);
  if(behaviour==='fixed')return scenes[fixed]?fixed:'rain';
  return behaviour==='weather'&&weather?weatherScene(weather,hour):byHour(hour);
 }
 globalThis.EstateScenePolicy={scenes:ordered,baseOrder,festivals,moodAt,byHour,weatherScene,dailyScene,resolve};
})();

Object.values(EstateScenePolicy.scenes).forEach(d=>{d.image=asset(d.image);if(d.images)d.images=d.images.map(asset);});
(() => {
  const canvas=document.getElementById('weather-motion'),ctx=canvas.getContext('2d');
  const cloud=new Image();cloud.src=asset('cloud-bank.webp');let cloudSprite=null;
  let active='',variation=0,enabled=true,raf=0,last=0,clock=0,w=0,h=0;
  const flakes=Array.from({length:150},()=>({x:Math.random(),y:Math.random(),z:Math.random(),phase:Math.random()*6.28}));
  const backdrops={};
  for(const key of Object.keys(EstateScenePolicy.scenes).filter(k=>!['rain','snow','clouds'].includes(k))){const layer=document.createElement('div');layer.className='alternate-scene '+key+'-scene';canvas.before(layer);backdrops[key]=layer;}
  function moodFilter(scene,look){
   if(EstateScenePolicy.scenes[scene].festival)return ['brightness(.76) saturate(.86)','brightness(.72) saturate(.92)','brightness(.75) saturate(.86)'][look];
   const dark=['night','startrails','aurora','fireflies','volcano','city'].includes(scene);
   if(scene==='startrails'||scene==='aurora')return ['brightness(.28) saturate(.6)','brightness(.24) sepia(.12) saturate(.75)','brightness(.21) saturate(.6)'][look];
   return dark?['brightness(.65) saturate(.8)','brightness(.6) sepia(.22) saturate(.9)','brightness(.46) saturate(.7)'][look]:['brightness(.79) saturate(.85)','brightness(.68) sepia(.3) saturate(1.05)','brightness(.38) saturate(.55)'][look];
  }
  function glow(x,y,r,color,alpha){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+color+','+alpha+')');g.addColorStop(.2,'rgba('+color+','+alpha*.4+')');g.addColorStop(1,'rgba('+color+',0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}
  const stars=Array.from({length:230},()=>({radius:Math.random(),angle:Math.random()*Math.PI*2,bright:.2+Math.random()*.5,width:.45+Math.random()*.9}));
  function resize(){w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw(0);}
  function draw(dt){ctx.clearRect(0,0,w,h);clock+=dt*.85;const effect=EstateScenePolicy.scenes[active]?.effect||active;
    if(effect==='snow'){
      for(const f of flakes.slice(0,[90,120,150][variation])){f.y=(f.y+dt*(.014+f.z*.04))%1;f.x=(f.x+dt*(.005+f.z*.008)+1)%1;const x=f.x*w+Math.sin(clock*.4+f.phase)*19,y=f.y*(h+20)-10,r=.7+f.z*2.3;
        const glow=ctx.createRadialGradient(x,y,0,x,y,r*2.1);glow.addColorStop(0,'rgba(248,252,255,'+(.35+f.z*.5)+')');glow.addColorStop(.4,'rgba(248,252,255,'+(.2+f.z*.35)+')');glow.addColorStop(1,'rgba(248,252,255,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,r*2.1,0,Math.PI*2);ctx.fill();}
    }else if(['clouds','dawn','mist'].includes(effect)&&cloudSprite){
      for(let i=0;i<3;i++){const wide=w*(1.2+i*.3),height=wide*cloud.naturalHeight/cloud.naturalWidth;const x=((clock*(7+i*3)+i*w*.8)%(w+wide))-wide;ctx.globalAlpha=(effect==='mist'?.12:active==='dawn'?.15:.27)-i*.035;ctx.drawImage(cloudSprite,x,h*((effect==='mist'?.56:active==='dawn'?.47:.24)+i*.15),wide,height);ctx.drawImage(cloudSprite,x+w+wide,h*((effect==='mist'?.56:active==='dawn'?.47:.24)+i*.15),wide,height);}ctx.globalAlpha=1;
    }else if(active==='startrails'){
      const cx=w*.57,cy=h*.14,scale=Math.max(w,h)*.76,rotation=clock*.032;
      ctx.save();ctx.beginPath();ctx.rect(0,0,w,h*.43);ctx.clip();
      for(const star of stars){const radius=35+star.radius*scale,head=star.angle+rotation;
       const rgb=variation===1?'216,198,255':variation===2?'229,239,249':'185,217,255';
       for(let j=0;j<14;j++){const a=head-(14-j)*.012;ctx.strokeStyle='rgba('+rgb+','+star.bright*(j+1)/20+')';ctx.lineWidth=star.width;ctx.beginPath();ctx.arc(cx,cy,radius,a,a+.0125);ctx.stroke();}
       const x=cx+Math.cos(head)*radius,y=cy+Math.sin(head)*radius;glow(x,y,1.8,rgb,star.bright);
      }ctx.restore();ctx.save();ctx.globalCompositeOperation='destination-in';const fade=ctx.createLinearGradient(0,0,0,h*.43);fade.addColorStop(0,'black');fade.addColorStop(.72,'black');fade.addColorStop(1,'transparent');ctx.fillStyle=fade;ctx.fillRect(0,0,w,h);ctx.restore();
    }else if(active==='aurora'){
      ctx.save();ctx.globalCompositeOperation='screen';
      const palette=variation===1?['192,103,242','115,177,240','225,148,232']:variation===2?['96,207,247','119,180,235','159,235,229']:['92,232,165','89,205,198','157,132,225'];
      for(let band=0;band<3;band++){
       for(let x=-8;x<w+8;x+=5){const u=x/w,shape=Math.sin(u*5.3+clock*.12+band*1.3)*.07+Math.sin(u*11-clock*.08+band)*.025;
        const base=h*(.25+band*.055+shape),height=h*(.17+.055*Math.sin(u*7+clock*.16+band));
        const edge=Math.pow(Math.max(0,Math.sin(Math.PI*u)),.7),pleat=.6+.4*Math.sin(u*94+clock*.65+band);
        const alpha=(.11+pleat*.13)*edge,g=ctx.createLinearGradient(0,base-height,0,base+8);
        g.addColorStop(0,'rgba('+palette[band]+',0)');g.addColorStop(.55,'rgba('+palette[band]+','+alpha*.35+')');g.addColorStop(.92,'rgba('+palette[band]+','+alpha+')');g.addColorStop(1,'rgba('+palette[band]+',0)');ctx.fillStyle=g;ctx.fillRect(x,base-height,6,height+8);
       }
      }ctx.restore();
    }else if(active==='night'||effect==='sparkles'){
      for(const f of flakes.slice(0,65)){const a=(.25+.2*Math.sin(clock*(.3+f.z*.4)+f.phase));glow(f.x*w,f.y*h*.36,1.3+f.z*1.4,'208,225,255',a);}
    }else if(active==='forest'||active==='fireflies'){
      const fire=active==='fireflies';for(const f of flakes.slice(0,fire?[26,40,55][variation]:38)){
       const x=(f.x*w+Math.sin(clock*.16+f.phase)*45+clock*(fire?1:2))%(w+25),y=h*(.2+f.y*.8)+Math.cos(clock*.23+f.phase)*22;
       glow(x,y,fire?3+f.z*5:1+f.z*2,fire?(variation===1?'170,255,172':'243,237,157'):'248,240,216',fire?(.18+.57*Math.pow((Math.sin(clock*.8+f.phase)+1)/2,3)):.2);
      }
    }else if(active==='ocean'||active==='sunset'||effect==='ripples'){
      const horizon=active==='sunset'?.61:.48;
      for(const f of flakes){const depth=f.y*f.y,y=h*(horizon+depth*(1-horizon)),x=f.x*w+Math.sin(clock*.24+f.phase)*12;
       const a=(.03+.07*Math.sin(clock*.8+f.phase)**2)*depth;ctx.strokeStyle='rgba(255,235,204,'+a+')';ctx.lineWidth=.4+depth*1.1;ctx.beginPath();ctx.ellipse(x,y,2+depth*26,.3+depth*1.2,0,0,Math.PI);ctx.stroke();}
    }else if(['petals','leaves','dust','pollen','seeds','embers','traffic'].includes(effect)){
      for(const f of flakes.slice(0,effect==='dust'?100:effect==='traffic'?24:48)){
       if(effect==='traffic'){
        const x=((f.x*w+clock*(22+f.z*35))%(w+80))-40,y=h*(.78+f.y*.2);
        const g=ctx.createLinearGradient(x-24,y,x,y);g.addColorStop(0,'rgba(255,211,149,0)');g.addColorStop(1,'rgba(255,221,174,.22)');ctx.fillStyle=g;ctx.fillRect(x-24,y,24,1+f.z);continue;
       }
       const rising=effect==='embers',floaty=['dust','pollen','seeds'].includes(effect);
       f.x=(f.x+dt*(effect==='dust'?.025:.004+f.z*.009))%1;
       f.y=(f.y+dt*(rising?-(.012+f.z*.025):floaty?.002:.008+f.z*.015)+1)%1;
       const x=f.x*(w+30)-15+Math.sin(clock*.5+f.phase)*18,y=f.y*(h+30)-15;
       if(floaty||rising){glow(x,y,rising?1.3+f.z*2:.7+f.z*1.5,rising?'255,164,87':effect==='dust'?'235,207,155':'248,239,214',rising?.25+.22*Math.sin(clock+f.phase)**2:.25);continue;}
       ctx.save();ctx.translate(x,y);ctx.rotate(clock*.5+f.phase);ctx.scale(Math.cos(clock*.7+f.phase)*.65+.35,1);ctx.fillStyle=effect==='leaves'?'rgba(215,145,65,.48)':active==='wisteria'?'rgba(215,194,255,.52)':'rgba(255,217,229,.52)';ctx.beginPath();ctx.ellipse(0,0,2+f.z*3,1+f.z*2,0,0,Math.PI*2);ctx.fill();ctx.restore();
      }

    }
  }
  function frame(now){raf=0;if(!enabled||document.hidden||active==='rain')return;if(now-last>=1000/30){draw(last?Math.min((now-last)/1000,.1):0);last=now;}raf=requestAnimationFrame(frame);}
  function sync(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;draw(0);if(enabled&&!document.hidden&&active!=='rain')raf=requestAnimationFrame(frame);}
  window.workspaceScenes={set(scene,motion,look=0){if(active===scene&&enabled===motion&&variation===look)return;active=scene;variation=look;enabled=motion;document.body.dataset.scene=scene;document.body.dataset.variation=look;canvas.style.filter=scene==='aurora'?'blur(2.2px)':'none';
    document.querySelectorAll('.alternate-scene').forEach(el=>el.style.opacity=el.classList.contains((scene==='clouds'?'cloud':scene)+'-scene')?'1':'0');
    const layer=scene==='rain'?document.getElementById('rain'):document.querySelector('.'+(scene==='clouds'?'cloud':scene)+'-scene');if(layer){const data=EstateScenePolicy.scenes[scene];if(backdrops[scene])layer.style.backgroundImage=`url('${data.images?.[look]||data.image}')`;layer.style.filter=moodFilter(scene,look);}
    rainGlass.setVariation?.(0);sync();}};
  addEventListener('resize',resize);document.addEventListener('visibilitychange',sync);cloud.onload=()=>{cloudSprite=document.createElement('canvas');cloudSprite.width=cloud.naturalWidth;cloudSprite.height=cloud.naturalHeight;const c=cloudSprite.getContext('2d'),cw=cloudSprite.width,ch=cloudSprite.height;c.drawImage(cloud,0,0);c.globalCompositeOperation='destination-in';let g=c.createLinearGradient(0,0,cw,0);g.addColorStop(0,'transparent');g.addColorStop(.2,'black');g.addColorStop(.8,'black');g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(0,0,cw,ch);g=c.createLinearGradient(0,0,0,ch);g.addColorStop(0,'transparent');g.addColorStop(.2,'black');g.addColorStop(.75,'black');g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(0,0,cw,ch);draw(0);};resize();
})();

(() => {
 const $=id=>document.getElementById(id),P=EstateScenePolicy;
 window.createSceneControls=({read,write,onScene})=>{
  let behaviour=read('scene_behaviour','fixed');if(behaviour==='time')behaviour='daily';if(!['fixed','daily','weather'].includes(behaviour))behaviour='fixed';
  let fixed=read('workspace_scene','rain');if(!P.scenes[fixed])fixed='rain';
  let mood=read('scene_mood','auto');if(!['auto','0','1','2'].includes(mood))mood='auto';
  let matchFestivals=read('match_festivals','yes')!=='no',seasonal=read('match_season','no')==='yes',category='all';
  let observedDoc=null,estateObserver=null;
  function estateTheme(){
   const doc=pageDocument;let stored={};
   try{stored=JSON.parse(localStorage.getItem('ayaka_estate_seasons')||'{}');if(localStorage.getItem('ayaka_festivals')==='off')return {festival:'none',season:doc?.documentElement.dataset.season||stored.season};}catch{}
   // The original Estate owns calendar/hemisphere resolution; use its resolved state.
   return {festival:doc?.documentElement.dataset.festival||stored.festival||'none',season:doc?.documentElement.dataset.season||stored.season};
  }
  let weather=null,busy=false,request=0,lastAttempt=0,current=fixed;
  let city;try{city=JSON.parse(read('weather_city','null'));}catch{}
  if(!city||!Number.isFinite(city.lat)||!Number.isFinite(city.lon))city={name:'Singapore',lat:1.29,lon:103.85};
  const names=Object.keys(P.scenes);
  $('scene').replaceChildren(...names.map(key=>{const o=document.createElement('option');o.value=key;o.textContent=P.scenes[key].name;return o;}));
  for(const key of names){const data=P.scenes[key],b=document.createElement('button');b.type='button';b.className='scene-tile';b.dataset.choice=key;b.setAttribute('aria-label',data.name+'. '+data.description);const img=document.createElement('span');img.className='scene-thumb';img.style.backgroundImage=`url("${data.image}")`;const label=document.createElement('span');label.textContent=data.name;b.append(img,label);b.addEventListener('click',()=>choose(key));$('scene-gallery').append(b);}
  function hour(){if(behaviour==='weather'&&weather?.timezone){try{return Number(new Intl.DateTimeFormat('en-GB',{hour:'numeric',hourCycle:'h23',timeZone:weather.timezone}).format(new Date()));}catch{}}return new Date().getHours();}
  function render(){
   const fresh=weather&&Date.now()-weather.at<90*60*1000?weather:null,theme=estateTheme();
   current=P.resolve(behaviour,fixed,hour(),fresh,{matchFestivals,festival:theme.festival,seasonal,season:theme.season,date:new Date()});
   const look=mood==='auto'?P.moodAt(hour()):Number(mood),festive=matchFestivals&&P.festivals[theme.festival];
   $('behaviour').value=behaviour;$('weather-location').hidden=behaviour!=='weather';$('scene').value=current;
   $('match-festivals').checked=matchFestivals;$('match-season').checked=seasonal;$('seasonal-option').hidden=behaviour!=='daily';
   $('mood').value=mood;$('mood-status').textContent=mood==='auto'?'Automatic · Day 07:00–17:00 · Golden hour 17:00–20:00 · Night 20:00–07:00.':'Keeping '+P.scenes[current].looks[look].toLowerCase()+' lighting until you change it.';
   $('scene-summary').textContent=P.scenes[current].name;
   $('scene-gallery').querySelectorAll('button').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.choice===current));const d=P.scenes[b.dataset.choice],night=['night','startrails','aurora','fireflies','volcano','city'].includes(b.dataset.choice);b.hidden=category==='japan'?!['blossom','spiderlily','wisteria','lotus','torii','fireflies'].includes(b.dataset.choice):category==='festive'?!d.festival:category==='night'?!night:category==='nature'?!!d.festival||night:false;});
   if(!$('variations').children.length){$('variations').replaceChildren(...['Day','Golden hour','Night'].map((name,i)=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.addEventListener('click',()=>{mood=String(i);write('scene_mood',mood);render();});return b;}));}
   [...$('variations').children].forEach((b,i)=>b.setAttribute('aria-pressed',String(i===look)));
   const status=festive?'Matching the Estate’s '+festive+' theme. '+(behaviour==='daily'?'Daily rotation resumes when the festival ends.':'Your regular wallpaper returns when the festival ends.'):behaviour==='fixed'?'Keeping this wallpaper until you change it.':behaviour==='daily'?'One wallpaper for the whole day. Changes at local midnight.'+(seasonal?' Seasonal choices follow the Estate.':''):fresh?`${city.name} · ${fresh.label} · updates every 15 minutes.`:busy?`Checking weather for ${city.name}…`:'Weather unavailable — following your device’s time until it returns.';
   $('scene-status').textContent=status;$('scene-follow-label').textContent=(festive?'Estate festival':behaviour==='fixed'?'Kept until you change it':behaviour==='daily'?'Today’s wallpaper':fresh?`${city.name} · ${fresh.label}`:'Following time · weather unavailable')+' · '+P.scenes[current].looks[look];
   onScene(current,look);
  }
  function choose(key){fixed=key;behaviour='fixed';matchFestivals=false;request++;busy=false;write('workspace_scene',key);write('scene_behaviour',behaviour);write('match_festivals','no');render();}
  $('mood').addEventListener('change',e=>{mood=e.target.value;write('scene_mood',mood);render();});
  $('match-festivals').addEventListener('change',e=>{matchFestivals=e.target.checked;write('match_festivals',matchFestivals?'yes':'no');render();});
  $('match-season').addEventListener('change',e=>{seasonal=e.target.checked;write('match_season',seasonal?'yes':'no');render();});
  document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;document.querySelectorAll('[data-category]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
  function observeEstate(){const doc=pageDocument;if(!doc||doc===observedDoc)return;estateObserver?.disconnect();observedDoc=doc;estateObserver=new MutationObserver(render);estateObserver.observe(doc.documentElement,{attributes:true,attributeFilter:['data-festival','data-season']});['ayaka:season-resolved','ayaka:season-style','ayaka:festivals'].forEach(event=>doc.defaultView.addEventListener(event,render));render();}
  $('classic-frame')?.addEventListener('load',observeEstate);
  window.addEventListener('storage',e=>{if(['ayaka_festivals','ayaka_estate_seasons'].includes(e.key))render();});
  async function json(url){const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),10000);try{const r=await fetch(url,{signal:abort.signal});if(!r.ok)throw Error('Unavailable');return await r.json();}finally{clearTimeout(timer);}}
  async function fetchWeather(){
   if(behaviour!=='weather'||busy||document.hidden)return;
   const id=++request;busy=true;lastAttempt=Date.now();render();
   try{const url=new URL('https://api.open-meteo.com/v1/forecast');url.search=new URLSearchParams({latitude:city.lat,longitude:city.lon,current:'weather_code,is_day',timezone:'auto'});
    const data=await json(url);if(id!==request||behaviour!=='weather')return;
    const c=data.current;if(!c||!Number.isFinite(c.weather_code)||![0,1].includes(c.is_day))throw Error('Invalid weather');
    const scene=P.weatherScene({code:c.weather_code,isDay:c.is_day},hour());
    weather={code:c.weather_code,isDay:c.is_day,at:Date.now(),timezone:data.timezone,label:scene==='rain'?'Rain or drizzle':scene==='snow'?'Snow':c.weather_code>=45?'Fog':c.weather_code>=2?'Cloudy':'Clear sky'};
   }catch{if(id===request)weather=null;}finally{if(id===request){busy=false;render();}}
  }
  $('scene').addEventListener('change',e=>choose(e.target.value));
  $('keep-scene').addEventListener('click',()=>choose(current));
  $('behaviour').addEventListener('change',e=>{request++;busy=false;behaviour=e.target.value;if(behaviour==='fixed'){fixed=current;write('workspace_scene',fixed);}write('scene_behaviour',behaviour);render();if(behaviour==='weather')fetchWeather();});
  $('weather-city').value=city.name;
  $('city-form').addEventListener('submit',async e=>{e.preventDefault();const query=$('weather-city').value.trim();if(query.length<2)return;const id=++request;busy=false;$('city-message').textContent='Finding city…';try{const data=await json('https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&name='+encodeURIComponent(query));if(id!==request)return;const found=data.results?.[0];if(!found)throw Error('No match');city={name:found.name+(found.country_code?' · '+found.country_code:''),lat:found.latitude,lon:found.longitude};write('weather_city',JSON.stringify(city));weather=null;$('weather-city').value=city.name;$('city-message').textContent='Using '+city.name;fetchWeather();}catch{if(id===request)$('city-message').textContent='City not found or connection unavailable. Try city, country.';}});
  function tick(){if(document.hidden)return;if(behaviour==='weather'&&!busy&&Date.now()-lastAttempt>=15*60*1000)fetchWeather();else render();}
  setInterval(tick,60000);document.addEventListener('visibilitychange',tick);
  document.addEventListener('click',e=>{if(!e.composedPath().includes($('scene-picker')))$('scene-picker').open=false;});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('scene-picker').open){$('scene-picker').open=false;$('scene-picker').querySelector('summary').focus();}});
  observeEstate();render();if(behaviour==='weather')fetchWeather();
  return {refresh:tick};
 };
})();

/* Decorative glass fragments only; page content and the camera stay intact. */
(() => {
  let stop=()=>{};
  window.glassTransition={
    cancel(){stop();},
    play(forming,rects){
      stop();
      if(matchMedia('(prefers-reduced-motion: reduce)').matches||!rects.length)return;
      const canvas=document.createElement('canvas');canvas.id='glass-transition';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);
      const ctx=canvas.getContext('2d');if(!ctx){canvas.remove();return;}
      const dpr=Math.min(devicePixelRatio||1,1.5),w=innerWidth,h=innerHeight;
      canvas.width=w*dpr;canvas.height=h*dpr;ctx.scale(dpr,dpr);
      const shards=[];
      for(const r of rects){
        const cols=3,rows=3,points=[];
        for(let y=0;y<=rows;y++){points[y]=[];for(let x=0;x<=cols;x++)points[y][x]={x:r.x+r.width*(x/cols+(x&&x<cols?(Math.random()-.5)*.12:0)),y:r.y+r.height*(y/rows+(y&&y<rows?(Math.random()-.5)*.1:0))};}
        for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
          const a=points[y][x],b=points[y][x+1],c=points[y+1][x+1],d=points[y+1][x];
          for(const p of [[a,b,c],[a,c,d]]){const cx=p.reduce((v,q)=>v+q.x,0)/3,cy=p.reduce((v,q)=>v+q.y,0)/3;shards.push({p,cx,cy,dx:(cx-r.x-r.width/2)*.32+(Math.random()-.5)*35,dy:28+Math.random()*48,spin:(Math.random()-.5)*.35,delay:Math.random()*.08});}
        }
      }
      let raf=0,start=null;
      const cleanup=()=>{cancelAnimationFrame(raf);canvas.remove();document.removeEventListener('visibilitychange',visibility);removeEventListener('resize',cleanup);if(stop===cleanup)stop=()=>{};};
      function visibility(){if(document.hidden)cleanup();}
      stop=cleanup;document.addEventListener('visibilitychange',visibility);addEventListener('resize',cleanup);
      function frame(now){
        if(start===null)start=now;const t=Math.min(1,(now-start)/(forming?700:620));ctx.clearRect(0,0,w,h);
        for(const s of shards){const p=Math.max(0,Math.min(1,(t-s.delay)/(1-s.delay))),spread=forming?Math.pow(1-p,3):p*p,opacity=forming?Math.sin(Math.PI*p)*.48:Math.pow(1-p,1.7)*.5;
          ctx.save();ctx.translate(s.cx+s.dx*spread,s.cy+s.dy*spread);ctx.rotate(s.spin*spread);ctx.beginPath();s.p.forEach((q,i)=>ctx[i?'lineTo':'moveTo'](q.x-s.cx,q.y-s.cy));ctx.closePath();
          const g=ctx.createLinearGradient(-70,-80,90,100);g.addColorStop(0,`rgba(228,249,255,${opacity})`);g.addColorStop(.42,`rgba(144,194,214,${opacity*.24})`);g.addColorStop(1,`rgba(204,234,246,${opacity*.6})`);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=`rgba(227,249,255,${opacity*.75})`;ctx.lineWidth=.7;ctx.stroke();ctx.restore();
        }
        if(t<1)raf=requestAnimationFrame(frame);else cleanup();
      }
      raf=requestAnimationFrame(frame);
    }
  };
})();

const $=id=>document.getElementById(id);
const read=(key,fallback)=>{try{return localStorage.getItem('estate_workspace_'+key)||localStorage.getItem('estate_preview_'+key)||fallback;}catch{return fallback;}};
const write=(key,value)=>{try{localStorage.setItem('estate_workspace_'+key,value);}catch{}};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let motion=read('rain_motion',reduced.matches?'paused':'playing')==='playing';
let mode=read('workspace_mode','rain');if(!['rain','classic'].includes(mode))mode='rain';
let scene='rain',variation=0,animations=[];
function applyMotion(){
 const playing=active&&mode==='rain'&&motion&&!$('scene-picker').open;
 rainGlass.setEnabled(playing&&scene==='rain');workspaceScenes.set(scene,playing,variation);
 $('scene').value=scene;$('scene-settings').disabled=mode==='classic';
 const data=EstateScenePolicy.scenes[scene];$('scene-name').textContent=data.name;$('scene-icon').textContent=({rain:'☂',clouds:'☁',snow:'❄',dawn:'☀',sunset:'☀',night:'✧',startrails:'✧',aurora:'≈',forest:'♧',ocean:'≈',fireflies:'✦'})[scene]||'✦';
 $('photo-credit').textContent=data.credit;$('photo-credit').href=data.url;
 $('motion-label').textContent=(motion?'Live · ':'Paused · ')+data.looks[variation];
 $('motion').setAttribute('aria-checked',String(motion));$('motion').closest('.setting-row').querySelector('small').textContent=$('scene-picker').open&&motion?'Resumes when you close settings':'Movement within the scene';
}
function applyMode(){
 shell.dataset.mode=mode;$('mode').value=mode;
 pageDocument.documentElement.toggleAttribute('data-workspace-glass',active&&mode==='rain');
 pageDocument.documentElement.toggleAttribute('data-workspace-living',active);
 $('layout-description').textContent=mode==='classic'?'The original Estate workspace, with all your pages and tools.':'Your complete workspace over a living scene.';
 applyMotion();
}
$('mode').addEventListener('change',e=>{
 animations.forEach(a=>a.cancel());glassTransition.cancel();
 const panels=[...pageDocument.querySelectorAll('.n-hq-sidebar,.n-hq-main,.notion-room-page:not([hidden])')];
 const bounds=panels.map(el=>el.getBoundingClientRect()).filter(r=>r.width&&r.height);
 mode=e.target.value;write('workspace_mode',mode);applyMode();
 if(!reduced.matches){glassTransition.play(mode==='rain',bounds);if(mode==='rain')animations=panels.map((el,i)=>el.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:520,delay:i*25,easing:'ease-out'}));}
});
$('motion').addEventListener('click',()=>{motion=!motion;write('rain_motion',motion?'playing':'paused');applyMotion();});
reduced.addEventListener('change',e=>{if(e.matches){motion=false;glassTransition.cancel();applyMotion();}});
const sceneControls=createSceneControls({read,write,onScene:(next,look)=>{scene=next;variation=look;applyMotion();}});
$('scene-picker').addEventListener('toggle',()=>{pageDocument.documentElement.toggleAttribute('data-workspace-settings',active&&$('scene-picker').open);applyMotion();});
const tabs=[...document.querySelectorAll('[data-settings-tab]')];
function showTab(b){tabs.forEach(x=>{const on=x===b;x.setAttribute('aria-selected',String(on));x.tabIndex=on?0:-1;$(x.getAttribute('aria-controls')).hidden=!on;});}
tabs.forEach((b,i)=>{b.addEventListener('click',()=>showTab(b));b.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else return;e.preventDefault();showTab(tabs[n]);tabs[n].focus();});});
$('close-settings').addEventListener('click',()=>{$('scene-picker').open=false;$('scene-picker').querySelector('summary').focus();});
$('hide-ui').addEventListener('click',()=>{pageDocument.documentElement.setAttribute('data-workspace-view-only','');$('restore-ui').hidden=false;});
$('restore-ui').addEventListener('click',()=>{pageDocument.documentElement.removeAttribute('data-workspace-view-only');$('restore-ui').hidden=true;});
pageDocument.addEventListener('pointerdown',e=>{if(!e.composedPath().includes(host))$('scene-picker').open=false;});
window.addEventListener('keydown',e=>{if(!active)return;if(e.key==='Escape'&&($('scene-picker').open||pageDocument.documentElement.hasAttribute('data-workspace-view-only'))){e.preventDefault();e.stopImmediatePropagation();$('scene-picker').open=false;pageDocument.documentElement.removeAttribute('data-workspace-view-only');$('restore-ui').hidden=true;}else if(e.composedPath().includes(host))e.stopImmediatePropagation();},true);
function syncActive(){
 const room=pageDocument.querySelector('.notion-room');
 const next=!!room&&getComputedStyle(room).display!=='none'&&!pageDocument.querySelector('.estate-map:not(.is-leaving)');
 if(next===active)return;active=next;host.hidden=!active;if(!active){$('scene-picker').open=false;pageDocument.documentElement.removeAttribute('data-workspace-view-only');glassTransition.cancel();}applyMode();if(active)sceneControls.refresh();
}
new MutationObserver(syncActive).observe(pageDocument.getElementById('root')||pageDocument.body,{childList:true,subtree:true});
applyMode();syncActive();

})();
(() => {
  const seen=new WeakSet();
  function scan(){
    document.querySelectorAll('.estate-map .map-painting').forEach(img=>{
      if(seen.has(img))return;seen.add(img);
      let last='';
      function sync(){const src=img.currentSrc||img.src;if(!img.complete||!img.naturalWidth||src===last)return;last=src;const backing=img.closest('.estate-map')?.querySelector('.map-backing');if(backing)backing.style.backgroundImage=`url("${src}")`;}
      img.addEventListener('load',sync);sync();
      new MutationObserver(sync).observe(img,{attributes:true,attributeFilter:['src','srcset']});
    });
  }
  new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});scan();
})();
