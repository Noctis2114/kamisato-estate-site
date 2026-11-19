"""Version-checked compatibility patches for the retained legacy application.

Keep these explicit and fail closed if a later app release changes the contract.
Never silently replace arbitrary minified identifiers.
"""

import re

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
