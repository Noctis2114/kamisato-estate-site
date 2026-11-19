# Estate audit — 19 November 2026

Status: in progress. The game inventory is a coverage ledger, not a claim that
every match, browser, device or combination has passed.

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

## Automated proof

`python3 maintenance/verify.py` covers guarded compatibility patches, dependency
closure, cache integrity, map fitting, scene selection, weather recovery, rain
simulation, transitions and bounded rendering. See command output and individual
assertions for exact scope. The full original binary asset payloads remain intact
in the portable build.

## Remaining coverage

`games.json` records actual interaction paths and pending games. Physical phones
and external monitors are not connected test devices here. Responsive geometry
checks are not physical-device certification. Longer matches, all settings
combinations and sustained multi-hour use remain outside a finite smoke audit.

Safari emitted inline stylesheet CSP messages on the retained application. No
security policy has been weakened; source attribution remains under investigation.
The recovered older React source does not exactly match the published release;
see `maintenance/ARCHITECTURE.md` for the preserved compatibility boundary.
