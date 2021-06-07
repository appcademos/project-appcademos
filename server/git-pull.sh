cd /var/www/appcademos.com/project-appcademos
git pull origin master
cd server
npm install
pm2 reload appcademos-server
pm2 reload appcademos-client-ssr
#pm2 start npm --name "appcademos-server" -- start
#pm2 start dist/server/main.js --name "appcademos-client-ssr"
