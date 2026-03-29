#!/bin/bash

# check if nodejs is installed.
dpkg -l nodejs >/dev/null
is_nodejs_installed=$?

# check if npm is installed.
dpkg -l npm >/dev/null
is_npm_installed=$?

# install nodejs if it's not installed
if [ $is_nodejs_installed -ne 0 ]; then
 sudo apt install nodejs
fi 

# install npm if it's not installed
if [ $is_npm_installed -ne 0 ]; then
 sudo apt install npm
fi 

# if we dont have a node_modules dir, we need to install it.
if [ ! -d node_modules ] ; then
  npm run clear
  rm -rf node_modules yarn.lock package-lock.json
  npm install
fi

# finally, let's run the dev server.
npm run start


