#!/bin/bash
npm run build
rm -f dist/img/*
cp -r dist /Users/cocobear/code/fuxi/opt/fuxi
scp -r dist root@fuxi:/tmp
ssh root@fuxi   << remotessh
docker cp /tmp/dist 5c:/opt/fuxi
docker restart 5ce
remotessh
