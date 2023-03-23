sudo apt update && sudo apt install nodejs npm
sudo npm install -g pm2
pm2 stop InventoryCRUD
cd InventoryCRUD/
npm install
npm uninstall sqlite3
npm install --save sqlite3
pm2 start server.js --name InventoryCRUD --env=production