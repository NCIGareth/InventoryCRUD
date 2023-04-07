sudo apt update && sudo apt install nodejs npm
sudo npm install -g pm2
pm2 stop InventoryCRUD
cd InventoryCRUD/
npm install
echo $PRIVATE_KEY > privatekey.pem
echo $SERVER > server.crt
npm uninstall sqlite3
npm install --save sqlite3
pm2 start ./bin/www --name InventoryCRUD --env=production