const $=id=>document.getElementById(id);
const read=(key,fallback)=>{try{return localStorage.getItem('estate_workspace_'+key)||localStorage.getItem('estate_preview_'+key)||fallback;}catch{return fallback;}};
const write=(key,value)=>{try{localStorage.setItem('estate_workspace_'+key,value);}catch{}};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let motion=read('rain_motion',reduced.matches?'paused':'playing')==='playing';
let mode=read('workspace_mode','rain');if(!['rain','classic'].includes(mode))mode='rain';
let scene='rain',variation=0,animations=[];
function applyMotion(){
 const playing=active&&mode==='rain'&&motion&&!reduced.matches&&pageDocument.documentElement.dataset.fx!=='still'&&!$('scene-picker').open;
 rainGlass.setEnabled(playing&&scene==='rain');workspaceScenes.set(scene,playing,variation);
 $('scene').value=scene;$('scene-settings').disabled=mode==='classic';
 const data=EstateScenePolicy.scenes[scene];$('scene-name').textContent=data.name;$('scene-icon').textContent=({rain:'☂',clouds:'☁',snow:'❄',dawn:'☀',sunset:'☀',night:'✧',startrails:'✧',aurora:'≈',forest:'♧',ocean:'≈',fireflies:'✦'})[scene]||'✦';
 $('photo-credit').textContent=data.credit;$('photo-credit').href=data.festival?'?home=1':data.url;
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
const reducedGlass=matchMedia('(prefers-reduced-transparency: reduce)'),higherContrast=matchMedia('(prefers-contrast: more)');
function syncAccessibility(){
 const root=pageDocument.documentElement;
 host.toggleAttribute('data-solid',root.hasAttribute('data-reduce-transparency')||reducedGlass.matches);
 host.toggleAttribute('data-contrast',root.hasAttribute('data-increase-contrast')||higherContrast.matches);
 applyMotion();
}
new MutationObserver(syncAccessibility).observe(pageDocument.documentElement,{attributes:true,attributeFilter:['data-reduce-transparency','data-increase-contrast','data-fx']});
reducedGlass.addEventListener('change',syncAccessibility);higherContrast.addEventListener('change',syncAccessibility);
const sceneControls=createSceneControls({read,write,onScene:(next,look)=>{scene=next;variation=look;applyMotion();}});
$('scene-picker').addEventListener('toggle',()=>{pageDocument.documentElement.toggleAttribute('data-workspace-settings',active&&$('scene-picker').open);applyMotion();});
const tabs=[...document.querySelectorAll('[data-settings-tab]')];
function showTab(b){tabs.forEach(x=>{const on=x===b;x.setAttribute('aria-selected',String(on));x.tabIndex=on?0:-1;$(x.getAttribute('aria-controls')).hidden=!on;});}
tabs.forEach((b,i)=>{b.addEventListener('click',()=>showTab(b));b.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else return;e.preventDefault();showTab(tabs[n]);tabs[n].focus();});});
$('close-settings').addEventListener('click',()=>{$('scene-picker').open=false;$('scene-picker').querySelector('summary').focus();});
$('hide-ui').addEventListener('click',()=>{pageDocument.documentElement.setAttribute('data-workspace-view-only','');$('restore-ui').hidden=false;});
$('restore-ui').addEventListener('click',()=>{pageDocument.documentElement.removeAttribute('data-workspace-view-only');$('restore-ui').hidden=true;});
pageDocument.addEventListener('pointerdown',e=>{if(!e.composedPath().includes(host))$('scene-picker').open=false;});
// Join the existing workspace focus loop to the shadow-root settings controls.
host.setAttribute('data-trap-companion','');
const focusable='button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])';
const visibleControls=root=>[...root.querySelectorAll(focusable)].filter(el=>el.tabIndex>=0&&!el.closest('[hidden],[inert]')&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
window.addEventListener('keydown',e=>{
 if(!active||e.key!=='Tab')return;
 const room=pageDocument.querySelector('.notion-room');if(!room)return;
 if([...room.querySelectorAll('[role="dialog"],[role="menu"],[aria-modal="true"]')].some(el=>el.getClientRects().length))return;
 const native=visibleControls(room),inside=e.composedPath().includes(host),summary=$('scene-picker').querySelector('summary');
 const focus=el=>{if(!el)return;e.preventDefault();e.stopImmediatePropagation();el.focus();};
 if(inside){const controls=$('scene-picker').open?visibleControls($('scene-picker')):[summary],at=controls.indexOf(shadow.activeElement);
  if(e.shiftKey&&at===0)focus($('scene-picker').open?controls.at(-1):native.at(-1));
  else if(!e.shiftKey&&at===controls.length-1)focus($('scene-picker').open?controls[0]:native[0]);
 }else if((!e.shiftKey&&pageDocument.activeElement===native.at(-1))||(e.shiftKey&&pageDocument.activeElement===native[0]))focus(summary);
},true);
window.addEventListener('keydown',e=>{if(!active)return;if(e.key==='Escape'&&($('scene-picker').open||pageDocument.documentElement.hasAttribute('data-workspace-view-only'))){e.preventDefault();e.stopImmediatePropagation();$('scene-picker').open=false;pageDocument.documentElement.removeAttribute('data-workspace-view-only');$('restore-ui').hidden=true;}},true);
// Allow target handlers (including arrow-key tabs) before isolating shell shortcuts.
shadow.addEventListener('keydown',e=>e.stopPropagation());
function syncActive(){
 const room=pageDocument.querySelector('.notion-room');
 if(room)room.setAttribute('data-trap-companions','');
 const next=!!room&&getComputedStyle(room).display!=='none'&&!pageDocument.querySelector('.estate-map:not(.is-leaving)');
 if(next===active)return;active=next;host.hidden=!active;if(!active){$('scene-picker').open=false;pageDocument.documentElement.removeAttribute('data-workspace-view-only');glassTransition.cancel();}applyMode();if(active)sceneControls.refresh();
}
new MutationObserver(syncActive).observe(pageDocument.getElementById('root')||pageDocument.body,{childList:true,subtree:true});
applyMode();syncActive();syncAccessibility();
