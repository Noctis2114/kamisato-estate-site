"""Install integration entry points into the published HTML documents."""

import re


def install_web(OUT):
    # Existing CSP remains strict; allow only the weather-city lookup actually used.
    for name in ["index.html", "404.html", "Default.htm", "iisstart.htm"]:
        p = OUT / name
        s = p.read_text()
        s = re.sub(
            r"\s*<!-- estate-living:start -->.*?<!-- estate-living:end -->",
            "",
            s,
            flags=re.S,
        )
        s = s.replace(
            "</head>",
            '<!-- estate-living:start -->\n<link rel="stylesheet" href="./living-workspace/workspace-layout.css">\n<link rel="stylesheet" href="./living-workspace/estate-responsive.css">\n<script defer src="./living-workspace/workspace.js"></script>\n<!-- estate-living:end -->\n</head>',
            1,
        )
        if "https://geocoding-api.open-meteo.com" not in s:
            s = s.replace(
                "https://api.open-meteo.com",
                "https://api.open-meteo.com https://geocoding-api.open-meteo.com",
            )
        p.write_text(s)
