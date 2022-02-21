#!/bin/bash
cd /var/www/html
npm start
pm2 start npm --name "SLAMCoinWallet" -- start
pm2 startup
pm2 save
pm2 restart all