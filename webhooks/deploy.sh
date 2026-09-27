#!/bin/bash
# Pulls the latest master; nginx serves build/ from this checkout.
set -euo pipefail
cd /var/www/MichMesh

# One pull at a time: gunicorn runs two workers, and pushes can arrive
# together.
exec 9>/tmp/michmesh-deploy.lock
flock 9

# Fast-forward only: stop rather than merge if this checkout has local
# commits or edits. `git status` here shows what's in the way.
git pull --ff-only -q
