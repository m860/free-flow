#!/usr/bin/env bash
npm run build
rm -f sign.log
scp -P 29993 -r ./dist/ root@104.194.65.249:/opt/freeflow
