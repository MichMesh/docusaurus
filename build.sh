#!/bin/bash

if [ -n "$1" ] ; then
  npm run build
  git add build/* docs/*
  git commit -am "$@"
else
  echo "Please supply a commit message"
  echo "    $0 \" this is my badass change to our ballin docs\" "
fi

