#!/bin/bash
# Deploy script for Content Acquisition Crawler

echo "Deploying Content Acquisition Crawler..."

# Install dependencies
echo "Installing dependencies..."
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

echo "Deployment complete!"
echo "Check application status with: pm2 status"
echo ""
echo "If this is your first deployment, don't forget to configure Nginx!"
echo "See DEPLOYMENT.md for more details."
