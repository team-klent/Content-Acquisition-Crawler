#!/bin/bash

# Script to update and restart Next.js app using PM2

# Optional: define app directory
APP_DIR="/home/ubuntu/apps/Content-Aqcuisition-Crawler"

# Navigate to app directory
cd "$APP_DIR" || {
  echo "❌ Failed to change directory to $APP_DIR"
  exit 1
}

echo "📥 Pulling latest changes from Git..."
git pull

echo "🛠 Building the app..."
npm install
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
pm2 start npm --name "Content-Aqcuisition-Crawler" -- start

echo "✅ Deployment complete."
