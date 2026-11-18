# Estate resilience and visual QA — 18 November 2026

This release repairs reproduced defects in the map and living workspace. The numbers below describe automated logic/simulation checks, not tens of thousands of real browser journeys. No finite test establishes that a site is unbreakable.

## Repairs

- Map: transparent neutral glass controls, destination labels, menus and cards; full viewport coverage on phones and monitors; pan remains available when a cover-fitted picture extends beyond the viewport. All six destinations remain reachable from the mobile destination panel.
- Map zoom: the minimum cover scale now takes priority over the old fixed maximum, including exceptionally large viewport sizes. Aspect ratio and waypoint coordinates are preserved; differing screen ratios necessarily crop some scenery, accessible by panning.
- Home: uniform header treatment also applies to alternate Home layouts. Settings scrim covers the header rather than beginning below it.
- Workspace: mobile search becomes a compact accessible icon; landscape sidebar scrolls; brand and action labels no longer crowd or wrap awkwardly. Glass responds to reduced transparency and increased contrast preferences.
- Keyboard: native workspace and shadow-root settings share a Tab loop; settings tabs receive arrow keys; closing settings returns focus to its icon.
- Scene selection: invalid/prototype-key persisted values cannot select nonexistent scenes or festivals. Invalid season storage falls back safely. Stale weather replies cannot replace a manual scene.
- Rendering: bounded canvas allocations (4 megapixels / 4096px edge, simulation 2 megapixels / 2048px edge), cancellation on hide/disable, and static wallpaper fallback after graphics failure. Context loss intentionally falls back until reload rather than looping on a broken renderer.
- Arrival overlay releases focus before becoming hidden. Share-target manifest declares its encoding. Festival credit links return to Estate home.

## Automated evidence

Run each `*regression.cjs` with Node from this directory. `results.txt` contains the successful run.

| Suite | Coverage |
|---|---|
| Scene policy | 69,120 distinct scene / behaviour / hour / festival / weather combinations |
| Corrupt preferences | 100 combinations including prototype names, missing/invalid values |
| Scene switching | 10,000 alternating scene/mood changes; malformed and stale weather replies |
| Scene drawing | 32 scenes × 3 lighting moods, bounded frame loop and hidden-tab cleanup |
| Rain physics | Pinned beads, independent falling drops, collision merging, bounded radius, stationary scenery |
| Transitions | 10,000 alternating forming/shattering transitions; cancellation and reduced motion |
| Renderer extremes | Nine viewport/DPR cases, including 100,000px dimensions; 10,000 enable changes; injected draw failure |
| Map geometry | 324 viewport/aspect/zoom/pan combinations, phone through 100,000px dimensions |

Canvas/graphics tests use mocks to verify bounds, lifecycle and fallback. They do not measure a real GPU's sustained performance. Map tests extract the actual published bundle functions. Other fixtures are the matching source snapshot used to build this release.

## Browser paths actually observed

Brave native UI and responsive-device emulation:

1. Desktop Home → Light → reduced transparency/contrast → night scenery → winter/Christmas → workspace → matching festival → manual star trails/night → reload.
2. Phone 390×844 → Tasks → empty form validation → Unicode task with Personal area → save → Appearance/Motion/Scenes → rotation 844×390 → map.
3. Phone map → glass destination list → Wind-chime Garden → teleport; appearance access toggles off → Dark → random doors.
4. Tablet 1024×1366 → map pan → Tea Room → password boundary; workspace → Money.
5. Ultrawide 3440×1440 → Tasks → Money → map; edge coverage and six waypoints observed.
6. Desktop 1920×1080 → settings by mouse → arrow-key tab navigation → rain → Classic → Glass → close → Tab to native map → Shift-Tab back to settings. Landscape spacing rechecked after repair.

Safari on macOS, independent local origin state:

7. Home → General Study preset → workspace; automatic Kingdomtide/golden-hour scene and glass settings rendered.
8. Home → alternate Frosted Ink layout → Soft sound → in-app notification test → quiet hours → Connections/live cards off → Phrases/no line → Advanced/Battery Saver → Baseline. Notification appeared; rendering ceiling changed to 1080p/30fps in Battery Saver.

## Boundaries and follow-up

- Responsive emulation is not physical iPhone/iPad or external-monitor hardware certification. Safari desktop adds a second engine, not an iOS-device test.
- No multi-day soak, complete financial workflow, authenticated private-room traversal, microphone, external sync, or notification-permission grant was performed. Existing account data and credentials were not used for those tests.
- Native browser DevTools reported advisory issues; no claim of a zero-warning browser is made. A third-party IP lookup returned HTTP 429 during navigation; the Estate remained usable with cached/fallback weather.
- One local Brave QA task named `QA spacing — 長い名前 🌧️ 1234567890` remains as a clearly marked test record. Production records were not changed. Test-only local settings were changed throughout the matrix.
- The portable HTM is approximately 313 MB because it embeds scenery and existing assets; large-file startup remains a resource cost.
- Repeated paths were used intentionally for defect reproduction and verification. Unique policy combinations and distinct exploratory paths are not a claim that every possible application state was tested.

## Build verification

JavaScript syntax checked for the entry bundle, map, living workspace and service worker. Builder verified all 1,061 service-worker shell hashes and preservation of original embedded binary payloads. Desktop portable and live publication are recorded separately after deployment verification.
