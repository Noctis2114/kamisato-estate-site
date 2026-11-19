"""Behaviour checks for release boundaries, without a browser or private data."""

from pathlib import Path
import sys, tempfile, json, subprocess

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "integration"))
from buildlib.room_patches import patch_windchime, patch_word_selection, patch_courtyard_escape
from buildlib.cache import stamp_cache

original = (
    "show=()=>{focus.current=`reveal`,enterEstateView?enterEstateView():setHidden(!0)}"
)
patched = patch_windchime(original)
assert patch_windchime(patched) == patched
subprocess.run(
    [
        "node",
        "-e",
        "let calls=0,hidden=false,focus={};let enterEstateView=()=>{calls++},setHidden=x=>hidden=x,show;"
        + patched
        + ';show();if(calls!==0||!hidden||focus.current!=="reveal")process.exit(1)',
    ],
    check=True,
)
for source in ["", original + ";" + original]:
    try:
        patch_windchime(source)
    except ValueError:
        pass
    else:
        raise AssertionError("Unknown/ambiguous release must fail closed")

site = Path(__file__).resolve().parents[2]
word = (site / 'assets/game-BCmGJzHf.js').read_text()
court = (site / 'assets/courtyard-BnX_zMGo.js').read_text()
assert patch_word_selection(word) == word
assert patch_courtyard_escape(court) == court
for patch in (patch_word_selection, patch_courtyard_escape):
    try:
        patch('unexpected release')
    except ValueError:
        pass
    else:
        raise AssertionError('Unknown game contract must fail closed')
import re
guard = re.search(r'if\(t.key===`Escape`&&t.target\?\.closest\?\.\(`\[data-estate-escape-owned="true"\]`\)\)return;', court).group()
subprocess.run(['node', '-e', 'const assert=require("node:assert/strict");let roomCalls=0;function handler(t){' + guard + 'roomCalls++} for(const owned of [true,false]){let before=roomCalls;handler({key:"Escape",target:{closest:()=>owned}});assert.equal(roomCalls-before,owned?0:1)}handler({key:"Escape",target:null});assert.equal(roomCalls,2);'], check=True)
with tempfile.TemporaryDirectory() as tmp:
    out = Path(tmp)
    dest = out / "living-workspace"
    dest.mkdir()
    (out / "snapshot").mkdir()
    (out / "index.html").write_text("app")
    (dest / "workspace.css").write_text("body{}")
    (out / "snapshot/status.json").write_text("{}")
    (out / "sw.js").write_text(
        'const CACHE = "old"\nconst SHELL = ["./"]\nconst PRECACHE = [{"url":"./","hash":"old"},{"url":"./snapshot/status.json","hash":"old"}]\nconst CRITICAL = new Set(["./"])\n'
    )
    first = stamp_cache(out, dest)
    a = (out / "sw.js").read_bytes()
    assert stamp_cache(out, dest) == first and (out / "sw.js").read_bytes() == a
    (out / "snapshot/status.json").write_text('{"asOf":"later"}')
    assert stamp_cache(out, dest) == first
    (dest / "workspace.css").write_text("body{color:red}")
    assert stamp_cache(out, dest)["cache_revision"] != first["cache_revision"]
print(
    "PASS: hide never enters Estate view; patch idempotent; unknown release fails closed; cache deterministic; dynamic snapshots independent; CSS change revises cache."
)
