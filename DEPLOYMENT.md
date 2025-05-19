# Deployment Guide for Content Acquisition Crawler

## Environment Variables

Make sure to set these environment variables in your production environment:

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
pm2 start ecosystem.config.js
```

2. Nginx Configuration:

Copy the Nginx configuration file:

```bash
sudo cp /path/to/Content-Acquisition-Crawler/nginx/content-acquisition-crawler.conf /etc/nginx/conf.d/
```

Or add the configuration to your existing Nginx site configuration.

3. Test and reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Troubleshooting

If you still encounter 404 errors:

1. Check the browser console for the full URL of failing requests
2. Ensure the Next.js server is running: `pm2 status`
3. Check Next.js logs: `pm2 logs nextjs-app`
4. Verify Nginx is forwarding requests correctly: `sudo tail -f /var/log/nginx/error.log`
