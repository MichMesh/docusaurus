# Docusaurus page for MichMesh
## How to contribute
- Fork this repo
- Clone the repo `git clone git@github.com:YOUR_FORK_/docusaurus.git`
- Preview your changes as you edit:
    - Unix or Mac: run `./run-local.sh`
    - Windows (PowerShell): run `.\run-local.ps1`
    - Either one installs what's needed and starts a dev server that reloads as you save.
- Commit your changes to `docs/` (or `src/`, `static/`) and open a Pull Request (PR). Leave `build/` out of your PR: it's generated, and the check fails if a PR changes it.
- Every PR is built and checked automatically (see the **Checks** tab): broken links, broken anchors, unfilled placeholders and bad Reticulum hashes fail the check.
- Once a PR is merged, GitHub Actions builds the site and commits `build/` to `master` ("Publish build for …"). The server pulls on GitHub's webhook and michmesh.com updates within a few minutes. Nobody needs to build or deploy by hand.

## How the site is served
michmesh.com is served by nginx from `build/` in a checkout of `master` on the server. The listener in [`webhooks/`](webhooks/README.md) runs `git pull` when GitHub reports a push, which is why `build/` stays in git.
