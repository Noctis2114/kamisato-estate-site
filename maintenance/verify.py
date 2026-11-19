"""Run the release's bounded regression gates from one command."""

from pathlib import Path
import subprocess, sys

root = Path(__file__).resolve().parent
site = root.parent
commands = [
    ([sys.executable, str(root / "tests/build-regression.py")], site),
    ([sys.executable, str(root / "tests/release-graph.py")], site),
    (["node", str(root / "tests/windchime-controls.cjs")], site),
    (["node", str(root / "tests/wish-spacing.cjs")], site),
]
commands += [
    (["node", str(site / "qa/2026-11-18/map-regression.cjs")], site),
    ([sys.executable, str(site / "qa/2026-11-19/cache-manifest-regression.py")], site),
]
workspace = root / "preview/workspace-rain"
for name in [
    "scene-regression.cjs",
    "weather-retry-regression.cjs",
    "rain-regression.cjs",
    "transition-regression.cjs",
    "stress-regression.cjs",
    "scene-render-regression.cjs",
    "renderer-stress-regression.cjs",
]:
    commands.append((["node", name], workspace))
for args, cwd in commands:
    result = subprocess.run(args, cwd=cwd)
    if result.returncode:
        raise SystemExit(result.returncode)
for path in (root / "integration").glob("*.js"):
    subprocess.run(["node", "--check", str(path)], check=True)
print("PASS: Estate maintenance verification complete.")
