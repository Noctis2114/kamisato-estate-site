"""Assemble the workspace UI, scenes and shared styles for both outputs."""

from html.parser import HTMLParser
import re, json, shutil


def build_workspace(ROOT, SRC, WORK, DEST):
    # Preserve existing compiled release and all its stored-data behavior.
    class Tree(HTMLParser):
        def __init__(self):
            super().__init__()
            self.root = ["fragment", {}, []]
            self.stack = [self.root]

        def handle_starttag(self, tag, attrs):
            node = [tag, dict((k, "" if v is None else v) for k, v in attrs), []]
            self.stack[-1][2].append(node)
            if tag not in ["img", "input", "meta", "link", "br", "hr", "source"]:
                self.stack.append(node)

        def handle_endtag(self, tag):
            for i in range(len(self.stack) - 1, 0, -1):
                if self.stack[i][0] == tag:
                    self.stack = self.stack[:i]
                    return

        def handle_data(self, data):
            self.stack[-1][2].append(data)

    html = (SRC / "index.html").read_text()
    body = re.search(r"<body>(.*?)<script", html, re.S)[1]
    body = re.sub(r'<main id="classic-workspace">.*?</main>', "", body, flags=re.S)
    body = body.replace("../Header-Glass-Preview.htm?home=1", "?home=1").replace(
        "Home glass preview", "Estate home"
    )
    t = Tree()
    t.feed(body)
    manifest = json.loads((ROOT / "assets.json").read_text())
    assets = {key: DEST.parent / path for key, path in manifest.items()}
    for key, p in assets.items():
        if not p.is_file():
            raise FileNotFoundError(f"Missing scene asset: {p}")
    asset_names = {k: ("rain-window.jpg" if k.startswith("../") else k) for k in assets}
    base_css = (SRC / "workspace.css").read_text().replace(":root", ":host")
    base_css = re.sub(r"\bbody\b", ".workspace-shell", base_css)
    base_css += (
        "\n"
        + (WORK / "workspace-shell.css").read_text()
        + "\n"
        + (WORK / "styles/workspace-settings.css").read_text()
    )
    css = base_css.replace("../rain-window.jpg", "rain-window.jpg")
    (DEST / "workspace.css").write_text(css)
    skin = (SRC / "integrated-workspace.css").read_text()
    skin = "\n".join(skin.splitlines()[4:])
    skin += "\n" + (WORK / "workspace-layout.css").read_text()
    (DEST / "workspace-layout.css").write_text(skin)
    estate_css = (
        (ROOT / "preview/header-clear-glass.css").read_text()
        + "\n"
        + (WORK / "estate-responsive.css").read_text()
        + "\n"
        + (WORK / "styles/materials.css").read_text()
        + "\n"
        + (WORK / "styles/map-material.css").read_text()
    )
    (DEST / "estate-responsive.css").write_text(estate_css)
    setup = """(()=>{ 'use strict';
    const pageDocument=globalThis.document;
    if(pageDocument.getElementById('estate-living-workspace'))return;
    const host=pageDocument.createElement('div');host.id='estate-living-workspace';host.hidden=true;
    const shadow=host.attachShadow({mode:'open'}),shell=pageDocument.createElement('div');shell.className='workspace-shell';shadow.append(shell);pageDocument.body.append(host);
    let active=false;
    const document={body:shell,documentElement:pageDocument.documentElement,defaultView:window,get hidden(){return pageDocument.hidden||!active;},getElementById:id=>shadow.getElementById(id),querySelector:s=>shadow.querySelector(s),querySelectorAll:s=>shadow.querySelectorAll(s),createElement:(...a)=>pageDocument.createElement(...a),addEventListener:(...a)=>pageDocument.addEventListener(...a),removeEventListener:(...a)=>pageDocument.removeEventListener(...a)};
    function node(data,svg=false){if(typeof data==='string')return pageDocument.createTextNode(data);const[tag,attrs,children]=data;svg=svg||tag==='svg';const el=svg?pageDocument.createElementNS('http://www.w3.org/2000/svg',tag):pageDocument.createElement(tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);children.forEach(c=>el.append(node(c,svg)));return el;}
    """
    setup = setup.replace("\n    ", "\n")
    setup += (
        "const nodes="
        + json.dumps(t.root[2], ensure_ascii=True)
        + ";nodes.forEach(n=>shell.append(node(n)));\n"
    )
    setup += 'const nativeStyle=pageDocument.createElement("link");nativeStyle.rel="stylesheet";\n'
    # Theme reads the same document, not the preview iframe.
    parts = []
    for name in [
        "raindrops-sim.js",
        "rain-live.js",
        "scene-policy.js",
        "scenes.js",
        "scene-controls.js",
        "glass-transition.js",
    ]:
        s = (SRC / name).read_text()
        if name == "rain-live.js":
            s = s.replace("image.src=src", "image.src=asset(src)")
        if name == "scenes.js":
            s = s.replace(
                "cloud.src='cloud-bank.webp'", "cloud.src=asset('cloud-bank.webp')"
            )
        if name == "scene-controls.js":
            s = s.replace("$('classic-frame')?.contentDocument", "pageDocument")
        parts.append(s)
        if name == "scene-policy.js":
            parts.append(
                "Object.values(EstateScenePolicy.scenes).forEach(d=>{d.image=asset(d.image);if(d.images)d.images=d.images.map(asset);});"
            )
    logic = (
        "\n".join(parts)
        + "\n"
        + (WORK / "workspace-adapter.js").read_text()
        + "\n})();\n"
        + (WORK / "estate-responsive.js").read_text()
        + "\n"
        + (WORK / "windchime-controls.js").read_text()
    )
    web = (
        setup
        + 'const base=new URL(".",pageDocument.currentScript.src);const assetNames='
        + json.dumps(asset_names)
        + ';const asset=name=>new URL(assetNames[name]||name,base).href;nativeStyle.href=new URL("workspace.css",base).href;shadow.prepend(nativeStyle);\n'
        + logic
    )
    (DEST / "workspace.js").write_text(web)
    return dict(
        assets=assets,
        base_css=base_css,
        setup=setup,
        logic=logic,
        skin=skin,
        estate_css=estate_css,
        web=web,
    )
