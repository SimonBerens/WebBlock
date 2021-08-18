npx tsc
cp -R src/* built/
rm built/*.ts
npx postcss src/*.css --base src --dir built