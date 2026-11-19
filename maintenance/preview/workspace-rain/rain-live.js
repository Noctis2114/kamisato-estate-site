/* Fixed scenery + independently simulated water. No scrolling image or time-based UVs.
   Droplet normal-map approach: Lucas Bebber / Codrops RainEffect; see RAIN-CREDITS.md. */
(() => {
  'use strict';
  const canvas=document.getElementById('rain');
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
  let enabled=true,ready=false,raf=0,last=0,simulation=null,variation=0;
  function applyVariation(){if(simulation){simulation.options.rainChance=[.22,.33,.65][variation];simulation.options.rainLimit=[1,2,3][variation];simulation.options.globalTimeScale=[.6,.72,1][variation];}}
  window.rainGlass={setVariation(value){variation=value;applyVariation();},setEnabled(value){enabled=!!value;sync();},get enabled(){return enabled;}};
  function fail(message){ready=false;canvas.style.opacity='0';document.body.dataset.rainError=message;document.body.dataset.liveRain='unavailable';sync();}
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
  const load=src=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('Rain asset failed: '+src));image.src=src;});
  let photo,alpha,color;
  function resize(){
    const viewportW=Math.max(1,innerWidth),viewportH=Math.max(1,innerHeight);
    const dpr=Math.min(devicePixelRatio||1,1.5,4096/viewportW,4096/viewportH,Math.sqrt(4194304/(viewportW*viewportH)));
    const simScale=Math.min(1,2048/viewportW,2048/viewportH,Math.sqrt(2097152/(viewportW*viewportH)));
    const w=Math.max(1,Math.floor(viewportW*simScale)),h=Math.max(1,Math.floor(viewportH*simScale));
    canvas.width=Math.max(1,Math.floor(viewportW*dpr));canvas.height=Math.max(1,Math.floor(viewportH*dpr));gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(resolution,w,h);
    if(!ready)return;
    const backdrop=document.createElement('canvas');backdrop.width=w;backdrop.height=h;
    const ctx=backdrop.getContext('2d'),bw=backdrop.width,bh=backdrop.height,scale=Math.max(bw/photo.width,bh/photo.height)*1.1;
    // These two textures are built only on resize. They never change during rain.
    for(let unit=0;unit<2;unit++){ctx.clearRect(0,0,bw,bh);ctx.filter='blur('+(unit===0?24:8)+'px) saturate(.43) brightness(.84)';ctx.drawImage(photo,(bw-photo.width*scale)/2,(bh-photo.height*scale)*.36,photo.width*scale,photo.height*scale);upload(unit,backdrop);}
    simulation=new EstateRaindrops(w,h,1,alpha,color,{minR:6,maxR:23,maxDrops:520,rainChance:.36,rainLimit:2,dropletsRate:1.1,dropletsSize:[1.1,3.1],globalTimeScale:.72,trailRate:1,trailScaleRange:[.18,.34],collisionRadius:.65,collisionBoost:.55,dropFallMultiplier:1.1});
    for(let i=0;i<1500;i++)simulation.drawDroplet(Math.random()*w,Math.random()*h,1.1+Math.random()*2.6);
    for(let i=0;i<150;i++)simulation.addDrop(simulation.createDrop({x:Math.random()*w,y:Math.random()*h,r:3.5+Math.random()*11.5,momentum:i%4===0?2+Math.random()*4:0}));
    applyVariation();simulation.update(0);render();
  }
  function render(){if(!ready||!simulation)return;upload(2,simulation.canvas);gl.drawArrays(gl.TRIANGLES,0,6);}
  function frame(now){raf=0;if(!ready||!enabled||document.hidden)return;if(now-last>=1000/30){const dt=last?Math.min((now-last)/1000,.05):1/30;last=now;try{simulation.update(dt*60);render();}catch(e){fail(e.message);return;}}raf=requestAnimationFrame(frame);}
  function sync(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;if(ready&&enabled&&!document.hidden)raf=requestAnimationFrame(frame);}
  Promise.all([load('../rain-window.jpg'),load('drop-alpha.png'),load('drop-color.png')]).then(images=>{[photo,alpha,color]=images;ready=true;resize();document.body.dataset.liveRain='ready';delete document.body.dataset.rainError;sync();}).catch(e=>fail(e.message));
  let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{try{resize();}catch(e){fail(e.message);}},120);});document.addEventListener('visibilitychange',sync);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fail('Graphics context lost');});resize();
})();
