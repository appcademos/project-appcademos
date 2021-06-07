cd /var/www/appcademos.com/project-appcademos
git pull origin master
cd server
npm install
#pm2 reload appcademos
pm2 stop appcademos
pm2 start npm --name "appcademos-server" -- start
pm2 start --name "appcademos-client-ssr" dist/server.js
