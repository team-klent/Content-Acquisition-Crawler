#!/bin/bash
# Deploy script for Content Acquisition Crawler

echo "Deploying Content Acquisition Crawler..."

# Optional: define app directory


echo "📥 Pulling latest changes from Git..."
git pull

echo "🔧 Configuring Nginx..."
sudo cp /nginx/content-acquisition-crawler.conf /etc/nginx/conf.d/content-acquisition-crawler.conf
sudo systemctl reload nginx

echo "🛠 Building the app..."
npm install

# Build the application
echo "Building application..."
npm run build

# Start or restart the application with PM2
if pm2 list | grep -q "content-acquisition-crawler"; then
  echo "Restarting application with PM2..."
  pm2 restart content-acquisition-crawler
else
  echo "Starting application with PM2..."
  # Using ecosystem config file for proper environment variables including PORT
  pm2 start ecosystem.config.js --env production
fi



echo "🛑 Stopping existing PM2 process..."
pm2 stop 0

echo "🚀 Starting app with PM2..."
pm2 start npm --name "content-acquisition-crawler" -- start ecosystem.config.js --env production

echo "✅ Deployment complete."
