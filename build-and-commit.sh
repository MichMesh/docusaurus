#!/bin/bash

# check if nodejs is installed.
dpkg -l nodejs >/dev/null
is_nodejs_installed=$?

# check if npm is installed.
dpkg -l npm >/dev/null
is_npm_installed=$?

# exit if nodejs is not installed
if [ $is_nodejs_installed -ne 0 ]; then
  echo "Node.js is not installed. Please install Node.js from https://nodejs.org/"
  exit 1
fi

# exit if npm is not installed
if [ $is_npm_installed -ne 0 ]; then
  echo "npm is not installed. Please install npm."
  exit 1
fi

# if we dont have a node_modules dir, we need to install it.
if [ ! -d node_modules ] ; then
  npm install
fi

if [ -n "$1" ] ; then
  npm run build
  git add build/* docs/*
  git commit -am "$@"
  git push
else
  echo "Please supply a commit message"
  echo "    $0 \" this is my badass change to our ballin docs\" "
fi



