# Deployment Guide for Content Acquisition Crawler

## Environment Variables

The application uses a `.env.production` file for environment variables in production. This file should already be properly configured with settings like:

```
NODE_ENV=production
PORT=3000
USE_BASE_PATH=true
BASE_PATH=/app1
NEXT_PUBLIC_URL=https://unifiedworkflow.innodata.com/app1
API_TOKEN=your_api_token_here
NEXT_PUBLIC_IA_API_URL=your_intelligent_automation_api_url_here
```

## Server Setup

1. Deploy Next.js application:

```bash
cd /path/to/Content-Acquisition-Crawler
npm install
npm run build
pm2 start npm --name "content-acquisition-crawler" -- start
```

2. Nginx Configuration:

Copy the Nginx configuration file:

```bash
sudo cp /path/to/Content-Acquisition-Crawler/nginx/content-acquisition-crawler.conf /etc/nginx/conf.d/
```

3. Test and reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

