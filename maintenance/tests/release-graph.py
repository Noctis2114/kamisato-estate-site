"""Check the current release's reachable modules, including lazy game imports."""

from pathlib import Path
import re

root = Path(__file__).resolve().parents[2]
seen = set()
pending = [root / "assets/index-C9yL8V4g.js"]
missing = []
while pending:
    p = pending.pop()
    if p in seen:
        continue
    seen.add(p)
    if not p.is_file():
        missing.append(str(p.relative_to(root)))
        continue
    if p.suffix != ".js":
        continue
    for link in re.findall(
        r"""["'`]((?:\./|\.\./)[^"'`\s]*(?:\.js|\.css))["'`]""", p.read_text()
    ):
        pending.append((p.parent / link).resolve())
assert not missing, missing
print(
    f"PASS: {len(seen)} reachable release modules/styles, including lazy game dependencies; no missing files."
)
