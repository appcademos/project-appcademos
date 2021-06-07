cd client
ng build --prod --extract-css false && ng run client:server:production
cd ..
rm -R server/dist/*
cp -r client/dist/* server/dist
echo "Compilation done"
