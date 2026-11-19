# Estate transfer to PC

Keep these together when transferring from the Mac:

1. `/Users/kellen/Documents/Ayaka_Estate_Complete.htm` — latest playable standalone.
2. `/Users/kellen/Documents/Codex/2026-11-18/estate-live/` — current Git repository,
   editable maintenance modules, artwork, tests and published application.
3. `/Users/kellen/Documents/Codex/2026-11-18/estate-wallpaper-preview/release/Ayaka_Estate_Complete.htm`
   — immutable packaging base. Keep it in a separate `release-base` directory on
   the PC. Never overwrite it with the generated final HTM.

The complete HTM alone is sufficient for opening the Estate, but it is not the
editable source project. Browser-local notes, tasks, money records and preferences
do not automatically travel with a copied HTML file. Export needed user data using
the Estate's export controls on the Mac and import it into the PC browser.

For development, Python 3 and Node run the maintenance build/checks described in
`ARCHITECTURE.md`. Substitute PC paths for the Mac paths; WSL is a practical option
for the historical recovery tools. Retain the Mac copy until the PC copy opens and
the required data is verified.

## Matching legacy source recovery

Source build: `da7e8c5f581c8f361219cdad84333fd68157514f` (15 November 2026).
Recovery records are under:

`/Users/kellen/Mac-to-PC-Transfer-2026-11-14/estate-ui-delivery-20261115T0900Z/`

Start with:

- `GIT-BUNDLE-VALIDATION.json`
- `final-publication/ESTATE-UI-DELIVERY-RESTORE-GUIDE.md`
- `final-publication/ESTATE-UI-DELIVERY-RECOVERY-INDEX-20261115T0900Z.json`
- `final-publication/ESTATE-UI-DELIVERY-PORTABLE-MANIFEST-20261115T0900Z.jsonl.gz`

The recorded bundle is incremental, not standalone. Its required base commit is
`935dccb01c45f3afddbd7c18b70a1d8e2680d044`. The recorded bundle SHA-256 is
`90369bc4d11897dc663bcc14f253eab8625712dd1002720b03a7da578a87a0e4`.

The guide's all-scope restore references 1,067 archives (~78.7 GB compressed).
Identify the source and base dependencies first; a full restore is not automatically
necessary. Restore into a new directory and verify manifests/hashes before use.
These records were located, not fully restored, during this follow-up.

After recovery, reconcile the November 18–19 maintenance changes into the original
source and run the room/game matrix. Do not replace the working release with an
older source build or discard the later glass/workspace/game fixes.

## Remaining known browser warning

Safari emits a CSP inline-style warning when constructing a native select, even
in the minimal reproduction under `qa/2026-11-19/estate-wide-audit/`. Keep the strict
policy intact; this is not evidence that Estate glass styles failed to load.
