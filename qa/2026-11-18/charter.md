# Estate exhaustive QA — 18 November 2026

User requests thorough mixed-path, combination and extreme stress testing, including visual spacing. This explicit scope exceeds the QA skill's default short exploration window.

Target: local integrated Estate at http://127.0.0.1:43158/integrated-site/, portable build, then published GitHub Pages. Browser control through CUA; source and native Node regressions through terminal. Main branch clean at baseline f6df2ea. Local server is a static-file server, no production write proxy. Existing user records must remain unchanged; temporary local fixtures only. No account/security changes, purchases, emails or destructive tools.

## Distinct scenario families

1. Desktop: home → Appearance light → Scenery/night → map zoom/pan/reset → workspace → settings → reload.
2. Phone portrait: home → workspace → Tasks → form → cancel → settings Appearance/Motion/Scenes → landscape → map.
3. Tablet: map → courtyard → home → festivals → workspace automatic scene → manual override → return.
4. Ultrawide: workspace → Money → search → Classic/Glass → animations → map → window resize.
5. Settings: every reachable general category; combinations of mode, scene, season, festival and language; closing/reopening and persistence.
6. Motion stress: rapid scene/variation/mode transitions, paused/hidden/reduced motion, bounded frame loops and cleanup.
7. Policy stress: all scene × behaviour × mood × festival × weather combinations; corrupt/missing preferences, failed/stale weather responses, midnight and seasonal boundaries.
8. Visual audit: control spacing, focus, dropdown gutters, text clipping, modal bounds, overflow, backgrounds, desktop/mobile navigation.
9. Release: relevant native regressions, syntax, integrity, portable asset preservation, local browser rechecks, production deployment checks.

Each scenario uses a distinct path. Repeated paths are intentional defect reproduction and repair verification. Report distinguishes logic tests, browser emulation and real hardware; emulation does not establish actual iOS Safari compatibility. Findings and untested areas remain explicit.
