cd /var/www/appcademos.com/project-appcademos
git pull origin master
cd server
pm2 stop appcademos
npm install
pm2 start npm --name "appcademos" -- start
