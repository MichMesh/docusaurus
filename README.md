# Docusaurus page for MichMesh
## How to contribute
- Fork this repo
- Clone the repo `git clone git@github.com:YOUR_FORK_/docusaurus.git`
- Preview your changes as you edit:
    - Unix or Mac: run `./run-local.sh`
    - Windows (PowerShell): run `.\run-local.ps1`
    - Either one installs what's needed and starts a dev server that reloads as you save.
- Commit your changes to `docs/` (or `src/`, `static/`) and open a Pull Request (PR).
- Every PR is built and checked automatically (see the **Checks** tab): broken links, broken anchors, unfilled placeholders and bad Reticulum hashes fail the check.
- Once a PR is merged, GitHub Actions builds the site and deploys it to GitHub Pages, and michmesh.com updates within a few minutes. Nobody needs to build or deploy by hand.

## How the site is served
michmesh.com is served by [GitHub Pages](https://docs.github.com/en/pages). The [publish workflow](.github/workflows/deploy.yml) builds the site on every push to `master`, deploys it, then checks that michmesh.com serves the new build (`/version.txt` holds the commit it was built from). The build output isn't kept in git; `npm run build` makes it locally in `build/` if you want to look at it.

The custom domain is set in the repo's **Settings → Pages**. DNS for michmesh.com points the apex at GitHub's Pages addresses and `www` at `michmesh.github.io`; GitHub redirects `www` to the apex.
