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
