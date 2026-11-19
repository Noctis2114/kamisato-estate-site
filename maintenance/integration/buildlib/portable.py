"""Build the standalone artifact without changing embedded binary resources."""

import re, json, hashlib, base64, mimetypes
from .compatibility import old, patch_app_module


def build_portable(
    base_htm, portable_output, assets, base_css, setup, logic, skin, estate_css, web
):
    # Portable artifact: preserve binary resources byte-for-byte; patch only module JSON and append hashed integration.
    original = base_htm.read_bytes()
    m = re.search(
        rb"(<script>)(/\*ayaka-utf8:module-json\*/.*?)(</script>)", original, re.S
    )
    wrapper = m[2].decode("ascii")
    x = re.search(
        r's\.textContent=(".*?");document.head.appendChild\(s\);', wrapper, re.S
    )
    module = json.loads(x[1])
    assert old in module
    patched = patch_app_module(module)
    wrapper2 = (
        wrapper[: x.start(1)]
        + json.dumps(patched, ensure_ascii=True, separators=(",", ":")).replace(
            "<", chr(92) + "u003c"
        )
        + wrapper[x.end(1) :]
    )

    def sha(b):
        return base64.b64encode(hashlib.sha256(b).digest()).decode()

    data = original.replace(m[2], wrapper2.encode("ascii"), 1)
    for a, b in [(wrapper, wrapper2), (module, patched)]:
        oldhash = sha(a.encode())
        newhash = sha(b.encode())
        assert oldhash.encode() in data
        data = data.replace(oldhash.encode(), newhash.encode(), 1)
    packed = {
        k: "data:"
        + mimetypes.guess_type(str(p))[0]
        + ";base64,"
        + base64.b64encode(p.read_bytes()).decode()
        for k, p in assets.items()
    }
    offline_css = re.sub(
        r"url\([\'\"]?([^\)\'\"]+)[\'\"]?\)",
        lambda m: 'url("' + packed.get(m[1], m[1]) + '")',
        base_css,
    )
    portable_setup = setup.replace(
        'const nativeStyle=pageDocument.createElement("link");nativeStyle.rel="stylesheet";',
        'const nativeStyle=pageDocument.createElement("style");',
    )
    portable = (
        portable_setup
        + "const embedded="
        + json.dumps(packed)
        + ";const asset=name=>embedded[name]||name;nativeStyle.textContent="
        + json.dumps(base_css)
        + ".replace(/url\\(['\"]?([^\\)'\"]+)['\"]?\\)/g,(_,name)=>'url(\"'+asset(name)+'\")')"
        + ";shadow.prepend(nativeStyle);\n"
        + logic
    )
    # ASCII JavaScript keeps the Windows-1252 container intact.
    portable = "".join(c if ord(c) < 128 else ("\\u%04x" % ord(c)) for c in portable)
    portable = portable.replace("</script", "<\\/script")
    data = data.replace(
        b"script-src ",
        b"script-src 'sha256-" + sha(portable.encode()).encode() + b"' ",
        1,
    )
    block = (
        b'<style id="estate-living-layout">'
        + (skin + "\n" + estate_css).encode("ascii", errors="xmlcharrefreplace")
        + b"</style>"
    )
    data = data.replace(b"</head>", block + b"</head>", 1)
    # Run after the parser and original asset shim are available.
    script = b"<script>" + portable.encode() + b"</script>"
    data = data.replace(b"</body>", script + b"</body>", 1)
    portable_output.write_bytes(data)
    report = {
        "portable_bytes": len(data),
        "live_script_bytes": len(web.encode()),
        "scene_assets": len(assets),
        "map_fit_patch_count": module.count(old),
        "preserved_binary_payloads": [
            hashlib.sha256(m[0]).digest()
            for m in re.finditer(
                rb'<script type="application/x-ayaka-asset".*?</script>', original, re.S
            )
        ]
        == [
            hashlib.sha256(m[0]).digest()
            for m in re.finditer(
                rb'<script type="application/x-ayaka-asset".*?</script>', data, re.S
            )
        ],
    }
    return report
