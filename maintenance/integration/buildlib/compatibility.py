"""Legacy release compatibility boundary: no direct bundle edits elsewhere."""

import json
from .room_patches import patch_windchime, patch_wish_spacing

# Every map viewport starts at the minimum edge-to-edge scale, preserving aspect ratio.
old = "let r=`x`in n?{left:n.x,right:n.x,top:n.y,bottom:n.y}:n,i=Math.max(1,e.w-r.left-r.right)"
previous = "let r=e.w>640?{left:0,right:0,top:0,bottom:0}:(`x`in n?{left:n.x,right:n.x,top:n.y,bottom:n.y}:n),i=Math.max(1,e.w-r.left-r.right)"
new = "let r={left:0,right:0,top:0,bottom:0},i=Math.max(1,e.w-r.left-r.right)"
scale_old = (
    "o=Math.min(1,i/t.w,a/t.h);return{scale:o,x:r.left+(i-t.w*o)/2,y:r.top+(a-t.h*o)/2}"
)
scale_intermediate = "o=e.w>640?Math.max(i/t.w,a/t.h):Math.min(1,i/t.w,a/t.h);return{scale:o,x:r.left+(i-t.w*o)/2,y:r.top+(a-t.h*o)*(e.w>640?.25:.5)}"
scale_new = (
    "o=Math.max(i/t.w,a/t.h);return{scale:o,x:r.left+(i-t.w*o)/2,y:r.top+(a-t.h*o)*.25}"
)
scale_previous = "o=e.w>640?Math.max(i/t.w,a/t.h):Math.min(1,i/t.w,a/t.h);return{scale:o,x:r.left+(i-t.w*o)/2,y:r.top+(a-t.h*o)/2}"
clamp_old = "if(i&&a<=r+1e-8)return i;"
clamp_new = "if(i&&a<=r+1e-8&&n.w*a<=t.w+1&&n.h*a<=t.h+1)return i;"
zoom_old = "Math.min(Z,Math.max(r,e.scale))"
zoom_new = "Math.min(Math.max(Z,r),Math.max(r,e.scale))"
pinch_old = "Math.min(Z,Math.max(a,e.scale*n/t))"
pinch_new = "Math.min(Math.max(Z,a),Math.max(a,e.scale*n/t))"
arrival_old = "t.dataset.arrivalOpen=``,t.setAttribute(`aria-hidden`,`true`)"
arrival_new = "t.dataset.arrivalOpen=``,t.contains(document.activeElement)&&document.activeElement.blur(),t.setAttribute(`aria-hidden`,`true`)"


def patch_app_module(source):
    if old not in source:
        raise ValueError("Portable map contract changed")
    source = (
        source.replace(arrival_old, arrival_new)
        .replace(old, new)
        .replace(scale_old, scale_new)
        .replace(clamp_old, clamp_new)
        .replace(zoom_old, zoom_new)
        .replace(pinch_old, pinch_new)
    )
    source = source.replace(
        zoom_old.replace("Z", "wc"), zoom_new.replace("Z", "wc")
    ).replace(pinch_old.replace("Z", "wc"), pinch_new.replace("Z", "wc"))
    return patch_wish_spacing(patch_windchime(source))


def patch_web_release(OUT):
    mapfile = OUT / "assets/estate-map-C5JX19HX.js"
    s = mapfile.read_text()
    assert old in s or previous in s or new in s
    s = (
        s.replace(old, new)
        .replace(previous, new)
        .replace(scale_intermediate, scale_new)
        .replace(scale_old, scale_new)
        .replace(scale_previous, scale_new)
        .replace(clamp_old, clamp_new)
        .replace(zoom_old, zoom_new)
        .replace(pinch_old, pinch_new)
    )
    mapfile.write_text(s)
    entry = OUT / "assets/index-C9yL8V4g.js"
    entry_text = entry.read_text()
    assert arrival_old in entry_text or arrival_new in entry_text
    entry.write_text(entry_text.replace(arrival_old, arrival_new))
    windchime = OUT / "assets/windchime-garden-DRvchVed.js"
    windchime.write_text(patch_wish_spacing(patch_windchime(windchime.read_text())))
    manifest = OUT / "manifest.webmanifest"
    manifest_data = json.loads(manifest.read_text())
    manifest_data["share_target"]["enctype"] = "application/x-www-form-urlencoded"
    manifest.write_text(json.dumps(manifest_data, indent=2) + "\n")
