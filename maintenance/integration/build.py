"""Estate release orchestrator. See ARCHITECTURE.md for ownership and checks."""

from pathlib import Path
import argparse, json
from buildlib.workspace import build_workspace
from buildlib.compatibility import patch_web_release
from buildlib.web import install_web
from buildlib.portable import build_portable
from buildlib.cache import stamp_cache


def main():
    root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--live-dir", type=Path, default=root.parent)
    parser.add_argument(
        "--base-htm", type=Path, default=root / "release/Ayaka_Estate_Complete.htm"
    )
    parser.add_argument(
        "--portable-output", type=Path, default=root / "build/Integrated-Estate.htm"
    )
    parser.add_argument("--web-only", action="store_true")
    args = parser.parse_args()
    work = root / "integration"
    dest = args.live_dir / "living-workspace"
    if not args.web_only and not args.base_htm.is_file():
        parser.error(
            "The immutable base HTM is missing; provide --base-htm or use --web-only"
        )
    dest.mkdir(exist_ok=True)
    if not args.web_only:
        if args.base_htm.resolve() == args.portable_output.resolve():
            parser.error("The immutable base must never be overwritten by its output")
        args.portable_output.parent.mkdir(parents=True, exist_ok=True)
    bundle = build_workspace(root, root / "preview/workspace-rain", work, dest)
    patch_web_release(args.live_dir)
    install_web(args.live_dir)
    if not args.web_only:
        report = build_portable(args.base_htm, args.portable_output, **bundle)
        (work / "build-report.json").write_text(json.dumps(report, indent=2))
        print(json.dumps(report))
    print(json.dumps(stamp_cache(args.live_dir, dest)))


if __name__ == "__main__":
    main()
