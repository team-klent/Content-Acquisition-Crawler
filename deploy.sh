#!/bin/bash
# Deploy script for Content Acquisition Crawler

echo "Deploying Content Acquisition Crawler..."

# Optional: define app directory


echo "📥 Pulling latest changes from Git..."
git pull

echo "🔧 Configuring Nginx..."
sudo cp nginx/content-acquisition-crawler.conf /etc/nginx/conf.d/content-acquisition-crawler.conf

sudo systemctl reload nginx
echo "🔧 Nginx reloaded"

echo "🛠 Building the app..."
npm install

# Build the application
echo "Building application..."
npm run build

# Start or restart the application with PM2

echo "🛑 Deleting existing PM2 process..."
pm2 delete all
pm2 flush



echo "🚀 Starting app with PM2..."
PORT=3000 pm2 start npm --name "content-acquisition-crawler" -- start ecosystem.config.js --env production  --update-env

echo "✅ Deployment complete."
