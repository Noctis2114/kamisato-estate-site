# Living workspace integration

The original Estate application owns workspace records and navigation. This layer adds scenes and a glass appearance to that same application; Classic remains available.

`workspace.js` contains the scene policy, rain simulation, animations and native-app adapter. `workspace.css` styles the isolated scene/settings shell. `workspace-layout.css` adapts the original workspace. `estate-responsive.css` fixes the home header and viewport artwork.

Rain is the initial scene; preferences support a fixed scene, daily selection, time/weather, and Estate festival matching. Scene motion holds while settings are open and resumes on close if enabled. Reduced-motion preferences are respected.

Photo attribution is stored per scene in `workspace.js` and displayed in the footer. Rain simulation attribution is in RAIN-CREDITS.md.

Map changes preserve aspect ratio, use minimum desktop cover scale, remove edge masks and permit bounded panning at the minimum scale. Portrait phones retain the overview framing for usable waypoints.
