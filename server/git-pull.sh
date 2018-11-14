cd /var/www/appcademos.com/project-appcademos
git pull origin master
cd server
forever stop ./
forever start -c "npm start" ./
