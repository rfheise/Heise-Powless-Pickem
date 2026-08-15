export NEXT_USE_CACHE=true
rm -rf ./build
yarn install --frozen-lockfile
yarn run build
cp -r .next/standalone ./build
cp -r public ./build
cp -r ./.next/static ./build/.next
rm build.zip
zip -r9 build.zip ./build
