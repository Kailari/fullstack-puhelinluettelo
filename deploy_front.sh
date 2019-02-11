#!/bin/sh
cd frontend
npm run build
rm -Rf ../build
cp -r build ../
cd ..
