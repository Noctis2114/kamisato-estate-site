(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const read=(key,fallback)=>{try{return localStorage.getItem('estate_preview_'+key)||fallback;}catch{return fallback;}};
  const write=(key,value)=>{try{localStorage.setItem('estate_preview_'+key,value);}catch{}};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let motion=read('rain_motion',reduced.matches?'paused':'playing')==='playing';
  let mode=read('workspace_mode','rain');
  let scene=read('workspace_scene','rain');
  if(!EstateScenePolicy.scenes[scene])scene='rain';
  let variation=0;
  if(!['rain','classic'].includes(mode))mode='rain';
  function applyMotion(){
    rainGlass.setEnabled(mode==='rain'&&scene==='rain'&&motion);
    workspaceScenes.set(scene,mode==='rain'&&motion,variation);
    $('scene').value=scene;$('scene').disabled=mode==='classic';
    const data=EstateScenePolicy.scenes[scene];
    $('scene-name').textContent=data.name;
    $('scene-icon').textContent={rain:'☂',clouds:'☁',snow:'❄',dawn:'☀',sunset:'☀',night:'✧',startrails:'✧',aurora:'≈',forest:'♧',ocean:'≈',fireflies:'✦'}[scene]||'✦';
    $('photo-credit').textContent=data.credit;$('photo-credit').href=data.url;
    $('motion-label').textContent=(motion?'Live · ':'Paused · ')+data.looks[variation];
    $('scene-settings').disabled=mode==='classic';
    $('motion').setAttribute('aria-checked',String(motion));
    $('motion').setAttribute('aria-label','Live animation');
    $('motion').title=motion?'Pause animation':'Play animation';
    $('motion').disabled=mode==='classic';
  }
  const frame=$('classic-frame');
  function skinFrame(){
    const doc=frame.contentDocument;if(!doc||!doc.head)return;
    if(!doc.getElementById('estate-workspace-glass-skin')){const link=doc.createElement('link');link.id='estate-workspace-glass-skin';link.rel='stylesheet';link.href=new URL('integrated-workspace.css?v=b5ca7ae6655a',location.href).href;doc.head.append(link);
      doc.addEventListener('pointerdown',()=>{$('scene-picker').open=false;});
      doc.addEventListener('keydown',e=>{if(e.key==='Escape')$('scene-picker').open=false;});
    }
    doc.documentElement.toggleAttribute('data-workspace-glass',mode==='rain');
  }
  frame.addEventListener('load',skinFrame);
  function applyMode(){
    document.body.dataset.mode=mode;$('mode').value=mode;
    $('layout-description').textContent=mode==='classic'?'The original Estate workspace, with its existing tools and pages.':'Your complete workspace over a living scene. Same pages and tools in both styles.';
    $('rain-workspace').hidden=mode!=='rain';
    if(!frame.getAttribute('src'))frame.src='../Approved-B.htm?home=1&notion=1';
    skinFrame();
    applyMotion();
  }
  let panelAnimations=[];
  $('mode').addEventListener('change',e=>{
    const next=e.target.value;if(next===mode)return;
    panelAnimations.forEach(a=>a.cancel());panelAnimations=[];glassTransition.cancel();
    const panels=[...(frame.contentDocument?.querySelectorAll('.n-hq-sidebar,.n-hq-main,.notion-room-page:not([hidden])')||[])];
    const bounds=()=>{const host=frame.getBoundingClientRect();return panels.map(el=>{const r=el.getBoundingClientRect();return{x:r.x+host.x,y:r.y+host.y,width:r.width,height:r.height,top:r.top+host.top,bottom:r.bottom+host.top};}).filter(r=>r.width&&r.height&&r.top<innerHeight&&r.bottom>0);};
    const previous=bounds();mode=next;write('workspace_mode',mode);applyMode();
    if(!reduced.matches){
      glassTransition.play(mode==='rain',mode==='rain'?bounds():previous);
      if(mode==='rain')panelAnimations=panels.map((el,i)=>el.animate([{opacity:0,transform:'translateY(8px) scale(.985)'},{opacity:1,transform:'none'}],{duration:620,delay:i*28,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
    }
  });

  $('motion').addEventListener('click',()=>{motion=!motion;write('rain_motion',motion?'playing':'paused');applyMotion();});
  reduced.addEventListener('change',e=>{if(e.matches){motion=false;panelAnimations.forEach(a=>a.cancel());glassTransition.cancel();applyMotion();}});
  createSceneControls({read,write,onScene:(next,look)=>{scene=next;variation=look;applyMotion();}});
  applyMode();
  const settingTabs=[...document.querySelectorAll('[data-settings-tab]')];
  function showSettingsTab(tab){settingTabs.forEach(b=>{const selected=b===tab;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;$(b.getAttribute('aria-controls')).hidden=!selected;});}
  settingTabs.forEach((b,i)=>{b.addEventListener('click',()=>showSettingsTab(b));b.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%settingTabs.length;else if(e.key==='ArrowLeft')next=(i+settingTabs.length-1)%settingTabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=settingTabs.length-1;else return;e.preventDefault();showSettingsTab(settingTabs[next]);settingTabs[next].focus();});});
  $('close-settings').addEventListener('click',()=>{$('scene-picker').open=false;$('scene-picker').querySelector('summary').focus();});
  $('hide-ui').addEventListener('click',()=>{document.body.classList.add('view-only');$('restore-ui').hidden=false;$('restore-ui').focus();});
  function restore(){document.body.classList.remove('view-only');$('restore-ui').hidden=true;$('hide-ui').focus();}
  $('restore-ui').addEventListener('click',restore);addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('view-only'))restore();});
})();
