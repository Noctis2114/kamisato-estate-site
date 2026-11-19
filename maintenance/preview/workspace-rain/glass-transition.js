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
      const w=Math.max(1,innerWidth),h=Math.max(1,innerHeight),dpr=Math.min(devicePixelRatio||1,1.5,4096/w,4096/h,Math.sqrt(4194304/(w*h)));
      canvas.width=Math.max(1,Math.floor(w*dpr));canvas.height=Math.max(1,Math.floor(h*dpr));ctx.scale(dpr,dpr);
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
