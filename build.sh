cd client
ng build --prod --extract-css false
cd ..
rm -R server/public/*
cp -r client/dist/* server/public
echo "Compilation done"
