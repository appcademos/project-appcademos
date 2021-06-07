cd client
ng build --prod --extract-css false && ng run client:server:production
cd ..
rm -R server/public/*
cp -r client/dist/* server/public
echo "Compilation done"
