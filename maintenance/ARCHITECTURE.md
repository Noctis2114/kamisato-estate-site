# Estate maintenance architecture

This is the canonical editable source for the living workspace, shared materials,
responsive integration and release packaging. Do not edit generated files under
`living-workspace/`, or hand-patch the complete HTM.

## Ownership

| Change | Source owner |
|---|---|
| Light/dark glass, text, controls, accessibility | `integration/styles/materials.css` |
| Map glass bindings | `integration/styles/map-material.css` |
| Workspace settings material inside shadow DOM | `integration/styles/workspace-settings.css` |
| Workspace native controls and layout | `preview/workspace-rain/integrated-workspace.css`, `integration/workspace-layout.css` |
| Workspace shell placement | `integration/workspace-shell.css` |
| Home/header scenery treatment | `preview/header-clear-glass.css` |
| Viewport/map layout | `integration/estate-responsive.css` and `.js` |
| Rain simulation and rendering | `preview/workspace-rain/raindrops-sim.js`, `rain-live.js` |
| Scene catalogue and deterministic selection | `scene-policy.js` |
| Animated scene drawing | `scenes.js` |
| Weather, city lookup and scene preferences | `scene-controls.js` |
| Glass transitions | `glass-transition.js` |
| Native workspace lifecycle and keyboard bridge | `integration/workspace-adapter.js` |
| Garden click-to-reveal | `integration/windchime-controls.js` |
| Pointer/keyboard focus and game motion | `integration/game-polish.js`, `integration/styles/interaction-polish.css` |
| Build orchestration | `integration/build.py` |
| Web HTML entry points | `integration/buildlib/web.py` |
| Legacy release compatibility | `integration/buildlib/compatibility.py`, `room_patches.py` |
| Standalone binary/CSP packaging | `integration/buildlib/portable.py` |
| Service-worker integrity/revision | `integration/buildlib/cache.py` |

The existing React application remains the sole data owner. The workspace adapter
adds scenery and styling; it does not duplicate tasks, money, notes or games.
Light/dark state remains on the existing document root. CSS tokens inherit into
the shadow root, so there is no second appearance preference to get out of sync.
Automatic animation budgeting changes blur cost, not the chosen glass material.
Reduce Transparency and Increase Contrast deliberately select solid surfaces.

The game polish module is presentation-only: it never owns game state, clocks,
cards, scoring or persistence. It adds bounded, short-lived effects, preserves
authored card animations and game positioning, and respects reduced/still motion.
Pointer play suppresses incidental focus outlines; Tab navigation retains them.
Word Garden's active selection owns its first Escape press, before the Courtyard
can treat Escape as a room exit. That legacy event fix is a guarded patch in
`room_patches.py`, applied consistently to both web and standalone builds.

## Rebuilding

Requires Python 3 and Node for regression checks. No new runtime dependency.
From the repository root:

```
python3 maintenance/integration/build.py --web-only
python3 maintenance/integration/build.py \
  --base-htm /path/to/immutable/release/Ayaka_Estate_Complete.htm \
  --portable-output /path/to/output/Integrated-Estate.htm
```

`assets.json` points at the existing published artwork. Images are not duplicated
in this source tree. Keep the immutable base HTM separately; never feed a generated
HTM back into the packager. The packager checks its module contract, replaces CSP
hashes and verifies that original binary payloads are unchanged. The final user
copy belongs in Documents, not Desktop.

The builder is deterministic and idempotent. The structural extraction was checked
against the former builder: identical HTM, script, CSS and service-worker bytes.
The service-worker owns hashes for immutable shell files; independently refreshed
snapshot data deliberately has no pinned hash.

## Legacy boundary and honest limits

Published application build: `da7e8c5` (15 November 2026). The available source
repository main branch is older. Its newer `feat/estate-pro-max-20261111` branch
(`b716094c`) contains readable room/game modules, but does not match this release
exactly; the published build identifier is not available as a remote commit.
Do not replace the current application with that older source and lose features.
Compatibility changes therefore live in a small, explicit, tested patch boundary.
A changed bundle contract must fail the build rather than silently skip a fix.

A future full application rebuild should first recover the exact React/TypeScript
release source, reconcile post-release integration, and pass the room/game matrix.
This maintenance extraction makes current changes editable; it does not pretend
that every legacy minified module has been reconstructed into original source.

## Rules for future changes

- One owner per behaviour. Room CSS owns spacing; shared tokens own material.
- Do not add another hard-coded light/dark palette in a room or shadow root.
- Scope room handlers to their room. Hiding controls must not own fullscreen.
- Preserve saved-data keys and the original application's storage ownership.
- Keep intentionally coloured game boards/pieces outside generic text overrides.
- Verify theme switching, accessibility, narrow screens and opening/closing paths.
- Record actual browser coverage and remaining limits; never claim all states tested.
- Validate, rebuild, inspect changes, deploy, then compare served bytes to the release.

## Verification gate

Run `python3 maintenance/verify.py` from the repository root. It checks build patch
contracts, module dependencies, cache integrity, actual map geometry, scene policy,
weather failure recovery, rain simulation, transitions and renderer budgets.
The GitHub `Verify Estate` workflow also rebuilds the web output and rejects source/
release drift. Browser coverage is recorded separately in `qa/2026-11-19/estate-wide-audit/`;
these regression gates do not imply every game or visual state has been played.
