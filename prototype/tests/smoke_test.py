"""Smoke test: start the real server process and hit / and /makes over HTTP.

Unlike the other tests, this does not use Flask's test client, so it catches
a server that fails to boot or a front end that was never built.
"""
import json
import socket
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

import pytest

PROTOTYPE_DIR = Path(__file__).resolve().parents[1]
STARTUP_TIMEOUT_SECONDS = 10

# Same startup path as `python app.py`, but on a temp database and free port.
SERVER_SCRIPT = "import sys; from app import main; main(sys.argv[1], int(sys.argv[2]))"


def free_port():
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def get(url):
    with urllib.request.urlopen(url, timeout=5) as response:
        return response.status, response.headers.get_content_type(), response.read()


@pytest.fixture(scope="module")
def base_url(tmp_path_factory):
    # No database yet, as on a fresh checkout: startup must create it.
    db_path = tmp_path_factory.mktemp("smoke") / "app.db"
    port = free_port()
    server = subprocess.Popen(
        [sys.executable, "-c", SERVER_SCRIPT, str(db_path), str(port)],
        cwd=PROTOTYPE_DIR,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
    )
    url = f"http://127.0.0.1:{port}"
    deadline = time.monotonic() + STARTUP_TIMEOUT_SECONDS
    try:
        while True:
            if server.poll() is not None:
                pytest.fail(f"server exited on startup:\n{server.stderr.read().decode()}")
            try:
                socket.create_connection(("127.0.0.1", port), timeout=0.2).close()
                break
            except OSError:
                if time.monotonic() > deadline:
                    pytest.fail(f"server did not listen within {STARTUP_TIMEOUT_SECONDS}s")
                time.sleep(0.1)
        yield url
    finally:
        server.terminate()
        server.wait(timeout=5)


def test_root_serves_the_app_page(base_url):
    assert (PROTOTYPE_DIR / "web" / "dist" / "index.html").exists(), (
        "web/dist is missing: run `npm run build` in prototype/web first"
    )
    status, content_type, body = get(base_url + "/")
    assert status == 200
    assert content_type == "text/html"
    assert b'<div id="root">' in body


def test_makes_returns_the_seeded_makes(base_url):
    status, content_type, body = get(base_url + "/makes")
    assert status == 200
    assert content_type == "application/json"
    makes = json.loads(body)["makes"]
    assert [make["name"] for make in makes] == ["Honda", "Toyota"]
