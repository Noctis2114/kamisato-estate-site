"""Exercise the actual release's localized status expression, not a duplicate."""
from pathlib import Path
import re, subprocess, sys

root = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(root / 'maintenance/integration'))
from buildlib.room_patches import patch_solitaire_announcement

source = (root / 'assets/game-cP7gSXPs.js').read_text()
patched = patch_solitaire_announcement(source)
assert patch_solitaire_announcement(patched) == patched
for invalid in ['', source + source]:
    try:
        patch_solitaire_announcement(invalid)
    except ValueError:
        pass
    else:
        raise AssertionError('Unknown or ambiguous bundle must fail closed')

expr = re.search(r'children:(\[Ae\[e\]\[R.kind\].*?\])\},R.serial', patched)[1]
labels = re.search(r'Ae=(\{.*?\});function O', patched)[1]
script = r'''
const assert = require('node:assert/strict');
const Ae = LABELS;
const O = card => `card ${card}`;
function announcement(e, R) { return EXPR.join(''); }
for (const lang of Object.keys(Ae)) {
  for (const kind of ['undone', 'drawn', 'moved']) {
    assert.equal(announcement(lang,{kind,cards:[]}), Ae[lang][kind]+'. ');
    assert.equal(announcement(lang,{kind,cards:[3,8]}), Ae[lang][kind]+': card 3, card 8. ');
  }
}
console.log('PASS: actual Solitaire status expression; eight languages; empty and populated card lists; strict, idempotent patch.');
'''.replace('LABELS', labels).replace('EXPR', expr)
subprocess.run(['node', '-e', script], check=True)
