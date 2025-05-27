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

echo "Flushing old PM2 logs..."
pm2 flush


echo "🛑 Stopping existing PM2 process..."
pm2 stop 0

echo "🚀 Starting app with PM2..."
pm2 start npm --name "Content-Aqcuisition-Crawler" -- start

echo "✅ Deployment complete."
