#!/bin/sh

set -e

#pnpm i --frozen-lockfile
#pnpm update:version
cd ..

pnpm run build:design

cd packages/design/dist/myprint-design

pwd

npm config set registry https://registry.npmjs.org/
npm publish
npm config set registry=http://registry.npm.taobao.org/

cd -
#
#cd internal/eslint-config
#npm publish
#cd -
#
#cd internal/metadata
#pnpm build
#npm publish
#cd -
#
#echo "✅ Publish completed"
