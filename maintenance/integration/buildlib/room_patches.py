"""Version-checked compatibility patches for the retained legacy application.

Keep these explicit and fail closed if a later app release changes the contract.
Never silently replace arbitrary minified identifiers.
"""

import re


def patch_solitaire_announcement(source):
    """Do not announce an empty card-list prefix after Undo or a stock recycle."""
    marker = '/*sol-announcement-punctuation*/'
    if source.count(marker) == 1:
        return source
    contract = re.compile(
        r'(children:\[(\w+)\[(\w+)\]\[(\w+)\.kind\],)`: `(,\4\.cards\.map\()'
    )
    if len(contract.findall(source)) != 1:
        raise ValueError('Solitaire announcement contract changed')
    return contract.sub(
        lambda m: m[1] + m[4] + '.cards.length?`: `:``' + marker + m[5], source
    )


def patch_word_selection(source):
    """Expose active keyboard selection so the room yields Escape to the board."""
    if '/*word-selection-escape*/' in source:
        return source
    selection = re.findall(r'e.key===`Escape`&&(\w+)!==null&&\(e.preventDefault\(\),\w+\(null\)\)', source)
    grid = 'className:`ws-grid`,lang:'
    if len(selection) != 1 or source.count(grid) != 1:
        raise ValueError('Word Garden selection contract changed')
    return source.replace(grid, 'className:`ws-grid`,"data-estate-escape-owned":' + selection[0] + '!==null/*word-selection-escape*/,lang:')


def patch_courtyard_escape(source):
    """Keep normal room Escape while allowing active child selections to cancel."""
    if '/*child-escape-first*/' in source:
        return source
    contract = re.compile(r'let (\w+)=\1=>\{if\((\w+)\(\1,(\w+)\)\|\|\1.key===`Escape`&&document.querySelector\(`\[data-ayaka="library-sheet"\]`\)\)return;')
    matches = list(contract.finditer(source))
    if len(matches) != 1:
        raise ValueError('Courtyard Escape contract changed')
    m = matches[0]
    prefix = f'let {m[1]}={m[1]}=>{{if({m[1]}.key===`Escape`&&{m[1]}.target?.closest?.(`[data-estate-escape-owned="true"]`))return;/*child-escape-first*/'
    return source[:m.start()] + prefix + m[0].split('{', 1)[1] + source[m.end():]

HIDE_CONTROLS = re.compile(
    r"(\w+)=\(\)=>\{(\w+)\.current=`reveal`,(\w+)\?\3\(\):(\w+)\(!0\)\}"
)
LOCAL_HIDE_CONTROLS = re.compile(
    r"(\w+)=\(\)=>\{(\w+)\.current=`reveal`,(\w+)\(!0\)/\*local-controls-only\*/\}"
)

WISH_FONT = "return{fontSize:a,letters:n.map((e,t)=>({text:e,x:(r-1)*3-Math.floor(t/i)*6,y:c+t%i*s}))}"
FITTED_WISH_FONT = "return{fontSize:Math.min(a,s*.85,r>1?5.1:a),letters:n.map((e,t)=>({text:e,x:(r-1)*3-Math.floor(t/i)*6,y:c+t%i*s}))}/*fit-wish-glyphs*/"


def patch_wish_spacing(source):
    """Fit glyphs within the existing line/column pitch, preserving the paper art."""
    if source.count(FITTED_WISH_FONT) == 1 and WISH_FONT not in source:
        return source
    if source.count(WISH_FONT) != 1:
        raise ValueError("Wind-chime wish layout contract changed")
    return source.replace(WISH_FONT, FITTED_WISH_FONT)


def patch_windchime(source):
    """Hide UI locally, without calling the Estate display/fullscreen callback."""
    matches = list(HIDE_CONTROLS.finditer(source))
    if not matches:
        if len(LOCAL_HIDE_CONTROLS.findall(source)) != 1:
            raise ValueError(
                "Wind-chime controls contract changed; inspect before rebuilding"
            )
        return source
    if len(matches) != 1:
        raise ValueError("Ambiguous Wind-chime controls patch")
    return HIDE_CONTROLS.sub(
        lambda m: f"{m[1]}=()=>{{{m[2]}.current=`reveal`,{m[4]}(!0)/*local-controls-only*/}}",
        source,
    )
