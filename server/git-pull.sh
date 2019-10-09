cd /var/www/appcademos.com/project-appcademos
git pull origin master
cd server
forever stop ./
npm install
forever start -c "npm start" ./
