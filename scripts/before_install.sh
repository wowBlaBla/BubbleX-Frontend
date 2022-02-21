#!/bin/bash
cd /var/www/html
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
apt install nodejs npm