# Estate second stress pass — 19 November 2026

New failure-injection paths reproduced and fixed:
- A periodic weather refresh interrupted a pending city search after the refresh interval, discarding its response and leaving Finding city stuck. City search now holds its own busy state; cancellation clears the message.
- Malformed geocoder coordinates/names were saved. Both stored and fetched city data now require a nonempty string name and finite coordinates within geographic bounds. A bad search keeps the prior valid city.

Seven new regression scenarios cover the refresh race, six malformed responses, four corrupt stored locations, out-of-order searches, failed-search retry, manual-scene cancellation and valid zero/boundary coordinates. The first three scenarios failed before the repair and all seven passed afterward. Run `node weather-retry-regression.cjs` from this folder.

Existing suites rerun against current source: 69,120 policy combinations, 100 corrupt preference combinations, 10,000 scene/mood switches, 10,000 transitions, renderer size/failure cases, rain physics, 32 scenes × 3 moods, and 324 extracted map geometry combinations. See results.txt. These are simulated logic/render lifecycle tests, not unique real-browser sessions.

Browser check: the rebuilt standalone HTM served locally loaded in Brave. Home → Workspace/Money → Motion/weather → nonexistent city produced a readable error while keeping Singapore weather → retry Tokyo successfully showed Tokyo · JP and Clear sky → restored Singapore → manual Rain/night → map. Settings controls and message spacing fit without scrolling at the observed desktop viewport. Map covered all edges with glass controls and destination labels. No data records created. No new physical-phone or external-monitor test this pass.

Build: 313,204,672 bytes; 1,055 immutable shell hashes plus six dynamically refreshed snapshots; original embedded binary payloads preserved. SHA-256 d673ddd6c5a587865673c5d8668013e71008b3debdbb8a7ef10745b63e216edb. MD5 a3945bb4771d91529ee261707419dcf3. The live cache revision is recorded in build-report.json.

Portable startup used roughly 1.2 GB in Brave; the 313 MB embedded artifact remains heavy. No claim of infinite stress resistance or exhaustive hardware certification.

Final deployment check found another reproduced regression: the integration builder pinned all six snapshot JSON files despite their independent scheduled updates. This could abort worker installation after a data refresh. The builder now preserves the worker’s pre-existing unpinned-snapshot contract. Script/style/asset hashes remain enforced. `python3 cache-manifest-regression.py` checks every current immutable hash and all six mutable entries. It failed before correction and passed afterward.

Drive upload: connector rejected the 313 MB file at its 100 MiB upload limit; normal browser upload completed 100%. Connector metadata independently confirmed the new private My Drive file and exact 313,204,672-byte size. Raw download verification was unavailable because the connector has a 256 MiB download limit; no remote checksum claim is made. Existing backup was untouched.
