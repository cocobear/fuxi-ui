#!/bin/bash
npm run build
rm -f dist/img/*
cp -r dist /Users/cocobear/code/fuxi/opt/fuxi
docker restart 831d568a901a
