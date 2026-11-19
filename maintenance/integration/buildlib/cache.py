"""Service-worker integrity and revision ownership."""

import re, json, hashlib


def stamp_cache(OUT, DEST):
    # Stamp the shell only after the final bytes exist; retain the worker's integrity checks.
    swfile = OUT / "sw.js"
    sw = swfile.read_text()

    def array(name):
        return json.loads(re.search(r"const " + name + r" = (\[.*?\])\n", sw, re.S)[1])

    shell_urls = array("SHELL")
    entries = array("PRECACHE")
    new_urls = [
        "./" + p.relative_to(OUT).as_posix()
        for p in sorted(DEST.rglob("*"))
        if p.is_file()
    ]
    for url in new_urls:
        if url not in shell_urls:
            shell_urls.append(url)
    pins = {entry["url"]: entry["hash"] for entry in entries}
    for url in list(pins) + new_urls:
        path = OUT / ("index.html" if url == "./" else url.removeprefix("./"))
        assert path.is_file(), url
        # Scheduled captures change independently of app releases. Preserve the
        # worker's explicit unpinned-snapshot contract; shell assets stay verified.
        if url.startswith("./snapshot/"):
            pins[url] = None
            continue
        pins[url] = hashlib.sha256(path.read_bytes()).hexdigest()
    critical_match = re.search(r"const CRITICAL = new Set\((\[.*?\])\)", sw)
    critical = json.loads(critical_match[1])
    for url in new_urls:
        if url.endswith((".js", ".css")) and url not in critical:
            critical.append(url)
    sw = re.sub(
        r"const SHELL = \[.*?\]\n",
        "const SHELL = " + json.dumps(shell_urls, indent=2) + "\n",
        sw,
        count=1,
        flags=re.S,
    )
    sw = re.sub(
        r"const PRECACHE = \[.*?\]\n",
        "const PRECACHE = "
        + json.dumps([{"url": u, "hash": h} for u, h in pins.items()], indent=2)
        + "\n",
        sw,
        count=1,
        flags=re.S,
    )
    sw = re.sub(
        r"const CRITICAL = new Set\(\[.*?\]\)",
        "const CRITICAL = new Set(" + json.dumps(critical) + ")",
        sw,
        count=1,
    )
    stamp = hashlib.sha256(json.dumps(pins, sort_keys=True).encode()).hexdigest()[:12]
    sw = re.sub(
        r'const CACHE = "[^"]+"',
        'const CACHE = "ayaka-living-20261118-' + stamp + '"',
        sw,
        count=1,
    )
    swfile.write_text(sw)
    return {
        "shell_files": len(shell_urls),
        "verified_hashes": sum(bool(h) for h in pins.values()),
        "dynamic_snapshots": sum(u.startswith("./snapshot/") for u in pins),
        "cache_revision": stamp,
    }
