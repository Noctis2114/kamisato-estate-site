(() => {
  const canvas=document.getElementById('weather-motion'),ctx=canvas.getContext('2d');
  const cloud=new Image();cloud.src='cloud-bank.webp';let cloudSprite=null;
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
  function resize(){w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5,4096/Math.max(1,w),4096/Math.max(1,h),Math.sqrt(4194304/Math.max(1,w*h)));canvas.width=Math.max(1,Math.floor(w*dpr));canvas.height=Math.max(1,Math.floor(h*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);draw(0);}
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
