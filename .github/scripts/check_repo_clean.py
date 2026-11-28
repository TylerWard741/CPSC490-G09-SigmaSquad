#!/usr/bin/env python3
"""Run check_repo.py against a copy of the repo without installed dependencies.

Task #101. check_repo.py only skips a node_modules/ folder at the repository
root, so with packages installed it fails G4 on third-party READMEs inside
prototype/node_modules/ and prototype/web/node_modules/. CI never installs
them, so only local runs are affected.

check_repo.py is provided course tooling and is not edited. It finds the repo
root from its own location (ROOT = Path(__file__).resolve().parents[2]), so
running the copy's check_repo.py inside a copy of the repo checks the copy.

Usage (from anywhere):

    python .github/scripts/check_repo_clean.py [--strict]

Every argument is passed through to check_repo.py, the environment is
inherited (so GITHUB_TOKEN / GITHUB_REPOSITORY still enable G3, G8 and G10),
its output is printed unchanged, and this script exits with its exit code.
The working tree, including installed dependencies, is never modified.
"""
import os
import shutil
import stat
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# Folders CI never has: installed dependencies, virtual environments and
# untracked build/cache output. All are gitignored. .git is kept on purpose
# in case a check reads git state.
SKIP_DIRS = {
    "node_modules",
    ".venv",
    "venv",
    "dist",
    "build",
    "__pycache__",
    ".pytest_cache",
}


def _ignore(_directory, names):
    return [name for name in names if name in SKIP_DIRS]


def _make_writable_and_retry(func, path, *_):
    # Windows marks git pack files read-only, which makes rmtree fail.
    os.chmod(path, stat.S_IWRITE)
    func(path)


def _remove(path):
    if sys.version_info >= (3, 12):
        shutil.rmtree(path, onexc=_make_writable_and_retry)
    else:
        shutil.rmtree(path, onerror=_make_writable_and_retry)


def main() -> int:
    temp_dir = Path(tempfile.mkdtemp(prefix="check_repo_clean_"))
    try:
        copy_root = temp_dir / ROOT.name
        shutil.copytree(ROOT, copy_root, symlinks=True, ignore=_ignore)
        script = copy_root / ".github" / "scripts" / "check_repo.py"
        process = subprocess.Popen(
            [sys.executable, str(script), *sys.argv[1:]],
            cwd=copy_root,
        )
        try:
            return process.wait()
        except KeyboardInterrupt:
            # The child got the same Ctrl+C; let it finish before cleanup.
            process.wait()
            return 130
    finally:
        _remove(temp_dir)


if __name__ == "__main__":
    sys.exit(main())
