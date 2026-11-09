#!/usr/bin/env python3
"""Checks micron.tgz the way a NomadNet node and its visitors will use it.

    pip install -r scripts/requirements-micron.txt
    python3 scripts/check-micron.py build/micron.tgz

1. The archive is safe to unpack: plain .mu files, relative paths, and nothing
   executable, because NomadNet runs executable pages as programs.
2. Every link goes to a page and anchor that exist, and every page can be
   reached from index.mu.
3. Every page renders with NomadNet's own micron parser.
4. A real NomadNet node serves the archive and every page is fetched back over
   a Reticulum link, byte for byte.

The node and the client talk over a private TCP socket on 127.0.0.1. Nothing
here connects to, or announces on, a real network.
"""
import os
import re
import socket
import subprocess
import sys
import tarfile
import tempfile
import threading
import time
import types
from unittest import mock

LINK = re.compile(r"(?<!\\)`\[[^`\]]*`([^`\]]*)(?:`([^\]]*))?\]")
ANCHOR = re.compile(r"(?<!\\)`:([A-Za-z0-9_-]+)")
TIMEOUT_SECONDS = 60


def read_archive(path):
    pages = {}
    problems = []
    with tarfile.open(path) as tar:
        for member in tar.getmembers():
            if not member.isfile():
                problems.append(f"{member.name}: not a regular file")
            elif member.name.startswith("/") or ".." in member.name.split("/"):
                problems.append(f"{member.name}: path escapes the pages directory")
            elif not member.name.endswith(".mu"):
                problems.append(f"{member.name}: not a .mu page")
            elif member.mode & 0o111:
                problems.append(f"{member.name}: executable, so NomadNet would run it")
            else:
                pages[member.name] = tar.extractfile(member).read()
    if "index.mu" not in pages:
        problems.append("index.mu is missing")
    return pages, problems


def markup_lines(text):
    """Lines outside literal blocks, where tags mean something."""
    literal = False
    for line in text.split("\n"):
        if line == "`=":
            literal = not literal
        elif not literal:
            yield line


def check_links(pages):
    problems = []
    markup = {
        name: "\n".join(markup_lines(data.decode("utf-8"))) for name, data in pages.items()
    }
    anchors = {name: set(ANCHOR.findall(text)) for name, text in markup.items()}
    linked = {}
    for name, text in markup.items():
        linked[name] = set()
        for target, fields in LINK.findall(text):
            if target.startswith("#"):
                if target[1:] not in anchors[name]:
                    problems.append(f"{name}: no anchor {target}")
            elif target.startswith(":/page/"):
                page = target[len(":/page/"):]
                if page not in pages:
                    problems.append(f"{name}: links to missing page {page}")
                    continue
                linked[name].add(page)
                if fields.startswith("anchor=") and fields[7:] not in anchors[page]:
                    problems.append(f"{name}: {page} has no anchor {fields[7:]}")
            elif not re.match(r"lxmf@[0-9a-fA-F]{32}$|rrc://", target):
                problems.append(f"{name}: unexpected link target {target}")

    seen = set()
    queue = ["index.mu"]
    while queue:
        page = queue.pop()
        if page not in seen:
            seen.add(page)
            queue.extend(linked.get(page, ()))
    problems.extend(f"{name}: can't be reached from index.mu" for name in pages if name not in seen)
    return problems


def check_render(pages):
    import nomadnet
    from nomadnet.ui.textui import MicronParser
    from nomadnet.ui.TextUI import THEME_DARK

    # The parser only asks the running app about its terminal and theme.
    fake_app = types.SimpleNamespace(
        ui=mock.MagicMock(colormode=256),
        config={"textui": {"theme": THEME_DARK}},
    )
    nomadnet.NomadNetworkApp.get_shared_instance = staticmethod(lambda: fake_app)

    problems = []
    for name, data in pages.items():
        try:
            if not MicronParser.markup_to_attrmaps(data.decode("utf-8"), url_delegate=None):
                problems.append(f"{name}: rendered to nothing")
        except Exception as e:
            problems.append(f"{name}: parser failed: {e!r}")
    return problems


def free_port():
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def write_rns_config(path, interface):
    os.makedirs(path)
    with open(os.path.join(path, "config"), "w") as f:
        f.write(
            "[reticulum]\n  enable_transport = no\n  share_instance = no\n"
            f"[interfaces]\n  [[Loopback]]\n    enabled = yes\n{interface}"
        )


def wait_for(condition, what):
    deadline = time.time() + TIMEOUT_SECONDS
    while not condition():
        if time.time() > deadline:
            raise TimeoutError(f"timed out waiting for {what}")
        time.sleep(0.05)


def fetch_all(link, pages):
    problems = []
    for name, expected in sorted(pages.items()):
        done = threading.Event()
        result = {}

        def on_response(receipt):
            result["body"] = receipt.response
            done.set()

        def on_failed(receipt):
            done.set()

        link.request(
            f"/page/{name}",
            response_callback=on_response,
            failed_callback=on_failed,
            timeout=TIMEOUT_SECONDS,
        )
        if not done.wait(TIMEOUT_SECONDS + 5) or "body" not in result:
            problems.append(f"{name}: the node didn't serve it")
        elif result["body"] != expected:
            problems.append(f"{name}: the node served different bytes")
    return problems


def check_served(pages):
    import RNS

    with tempfile.TemporaryDirectory() as work:
        port = free_port()
        node_rns = os.path.join(work, "node-rns")
        client_rns = os.path.join(work, "client-rns")
        node_config = os.path.join(work, "node")
        write_rns_config(
            node_rns,
            f"    type = TCPServerInterface\n    listen_ip = 127.0.0.1\n    listen_port = {port}\n",
        )
        write_rns_config(
            client_rns,
            f"    type = TCPClientInterface\n    target_host = 127.0.0.1\n    target_port = {port}\n",
        )
        for name, data in pages.items():
            path = os.path.join(node_config, "storage", "pages", name)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "wb") as f:
                f.write(data)
        with open(os.path.join(node_config, "config"), "w") as f:
            f.write("[node]\nenable_node = yes\nnode_name = Micron check\nannounce_at_start = yes\n")

        log_path = os.path.join(work, "node.log")
        with open(log_path, "w") as log:
            node = subprocess.Popen(
                [sys.executable, "-m", "nomadnet.nomadnet", "--daemon", "--config", node_config, "--rnsconfig", node_rns],
                stdin=subprocess.DEVNULL, stdout=log, stderr=subprocess.STDOUT,
            )
        try:
            identity_path = os.path.join(node_config, "storage", "identity")
            wait_for(lambda: os.path.exists(identity_path) or node.poll() is not None, "the node to start")
            if node.poll() is not None:
                raise RuntimeError(f"the node exited with code {node.returncode}")
            time.sleep(2)  # Let the node bind its port and register its pages.

            RNS.Reticulum(client_rns, loglevel=RNS.LOG_WARNING)
            identity = RNS.Identity.from_file(identity_path)
            dest_hash = RNS.Destination.hash(identity, "nomadnetwork", "node")

            def has_path():
                if not RNS.Transport.has_path(dest_hash):
                    RNS.Transport.request_path(dest_hash)
                    time.sleep(0.5)
                return RNS.Transport.has_path(dest_hash)

            wait_for(has_path, "a path to the node")
            destination = RNS.Destination(
                identity, RNS.Destination.OUT, RNS.Destination.SINGLE, "nomadnetwork", "node"
            )
            link = RNS.Link(destination)
            wait_for(lambda: link.status == RNS.Link.ACTIVE, "the link to the node")
            problems = fetch_all(link, pages)
            link.teardown()
            return problems
        except Exception:
            with open(log_path) as f:
                sys.stderr.write(f.read())
            raise
        finally:
            node.terminate()
            node.wait(timeout=15)


def main():
    if len(sys.argv) != 2:
        sys.exit("usage: check-micron.py <micron.tgz>")
    pages, problems = read_archive(sys.argv[1])
    if not problems:
        problems = check_links(pages) + check_render(pages)
    if not problems:
        problems = check_served(pages)
    if problems:
        print("\n".join(problems), f"\n{len(problems)} problem(s) found.", sep="\n", file=sys.stderr)
    else:
        print(f"check-micron: OK ({len(pages)} pages)")
    # RNS leaves threads and exit handlers running, so leave without them.
    sys.stdout.flush()
    sys.stderr.flush()
    os._exit(1 if problems else 0)


if __name__ == "__main__":
    main()
