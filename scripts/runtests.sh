#!/usr/bin/env bash
if [[ "$PWD" =~ "scripts" ]]; then
  cd ..
fi

# $1 can be "mock"
./node_modules/.bin/mocha --require ts-node/register --exit -env local $1 ./dist/test/*.test.js