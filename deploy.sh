sudo apt update && sudo apt install nodejs npm
sudo npm install -g pm2
pm2 stop InventoryCRUD
cd InventoryCRUD/
npm install
pm2 start server.js --name InventoryCRUD --env=production