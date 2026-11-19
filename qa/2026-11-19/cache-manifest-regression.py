"""Check actual release pins, including the independently refreshed data contract."""
from pathlib import Path
import hashlib,json,re
root=Path(__file__).resolve().parents[2]
sw=(root/'sw.js').read_text()
entries=json.loads(re.search(r'const PRECACHE = (\[.*?\])\n',sw,re.S)[1])
static=dynamic=0
for entry in entries:
    url=entry['url']
    if url.startswith('./snapshot/'):
        assert not entry['hash'], f'Mutable data must not freeze worker installation: {url}'
        dynamic+=1
    else:
        path=root/('index.html' if url=='./' else url.removeprefix('./'))
        assert entry['hash']==hashlib.sha256(path.read_bytes()).hexdigest(),url
        static+=1
assert dynamic==6 and static>1000
print(f'PASS {static} immutable shell hashes match; {dynamic} independently updated snapshots remain unpinned.')
