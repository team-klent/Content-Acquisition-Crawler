#!/bin/bash

# Script to update and restart Next.js app using PM2

# Optional: define app directory

echo "📥 Pulling latest changes from Git..."
git pull

echo "🔧 Configuring Nginx..."
sudo cp nginx/content-acquisition-crawler.conf /etc/nginx/conf.d/content-acquisition-crawler.conf
sudo cp nginx/inventory.conf /etc/nginx/conf.d/inventory.conf

sudo systemctl reload nginx
echo "🔧 Nginx reloaded"

echo "🛠 Building the app..."
npm install
npm run build

#Build docker via docker-compose
echo "🛠 Building docker images..."
docker compose --build -d

echo "✅ Deployment complete."
