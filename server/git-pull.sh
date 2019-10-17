cd /var/www/appcademos.com/project-appcademos
git pull origin master
cd server
npm install
pm2 reload appcademos
