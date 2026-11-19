# Estate audit — 19 November 2026

Status: 48/48 games have recorded interactive smoke paths, including the four
Tea Room games after the user unlocked that room. The inventory is a coverage
ledger, not a claim that every match, browser, device or combination has passed.

## Implemented and checked

- Hide controls no longer invokes Estate view/fullscreen. Scenery click restores
  controls through the room’s own action and restores keyboard focus.
- Safari: local web build hide/reveal and explicit Full screen/Escape paths passed.
- Safari: complete file HTM hide/reveal passed; browser toolbar remains present.
- Shared glass tokens follow existing light/dark state across rooms and workspace
  settings; inspected Garden and Appearance settings in both schemes.
- Automatic low-effects budgeting retains transparent glass instead of silently
  replacing it with an opaque surface. Explicit accessibility solid modes remain.
- Long Japanese wish glyphs previously overlapped; fit their size to line/column
  pitch. Regression checks use the actual published layout function.
- Maintenance build split into clear owners; structural extraction initially
  matched HTM, scripts, CSS and worker byte-for-byte. Python formatting retained
  the same web cache revision. No user storage keys changed.
- Word Garden: Escape cancelled the whole game before its selection handler ran.
  Active selection now owns the first Escape. Safari retest cleared the selection,
  stayed in the game, then selected DAWN successfully (1/10 found).
- Safari: Stone Garden no longer draws a focus frame around its title during
  pointer play. Tab still provides a visible keyboard focus indicator.
- Shared press/selection feedback, fallback card dealing and result/piece arrivals
  add small motion details across games. Original dealing is preserved. Effects
  retain game-owned transforms, are bounded to 32 active elements, and respect
  reduced/still motion and hidden tabs. This is not a replacement physics engine.
- Final Safari visual pass: Appearance light/dark, workspace Motion/Scenes tabs,
  festival-to-rain selection and manual golden-hour mood. Controls were spaced
  without clipping; Motion fitted the tested desktop viewport without scrolling.
  The wallpaper gallery deliberately scrolls. Standalone Garden wish text was
  legible without overlapping, and scenery-click restored hidden controls.

## Automated proof

`python3 maintenance/verify.py` covers guarded compatibility patches, dependency
closure, cache integrity, map fitting, scene selection, weather recovery, rain
simulation, transitions and bounded rendering. See command output and individual
assertions for exact scope. The full original binary asset payloads remain intact
in the portable build.

The gates include 69,120 unique scene-policy combinations, 10,000 alternating
scene/mood actions, all 32 scenes and 96 moods drawing, nine viewport/DPR extremes,
and 1,000 rapid game interactions with bounded effect cleanup. These are simulated
regression cases, separately recorded from the real Safari click-through.

## Remaining coverage

`games.json` records the actual interaction path for each game. Physical phones
and external monitors are not connected test devices here. Responsive geometry
checks are not physical-device certification. Longer matches, all settings
combinations and sustained multi-hour use remain outside a finite smoke audit.

Safari emitted inline stylesheet CSP messages on the retained application. No
security policy has been weakened; source attribution remains under investigation.
The recovered older React source does not exactly match the published release;
see `maintenance/ARCHITECTURE.md` for the preserved compatibility boundary.

Minor retained issue: Solitaire's undo announcement can omit its action label
(“Undone: . Waste: Empty”); the observed undo action itself worked.
