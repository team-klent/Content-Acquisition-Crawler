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
## Rules for adding environment variables

*   The `NEXT_PUBLIC_URL` variable does not need to be wrapped with quotes. This is because the `NEXT_PUBLIC_URL` variable is used in the `next.config.js` file, which is a JavaScript file, and the value will be automatically wrapped with quotes.
*   The `API_TOKEN` and `NEXT_PUBLIC_IA_API_URL` variables should be wrapped with single quotes. This is because these environment variables are used in the `ecosystem.config.js` file, which is a JSON file, and the values need to be wrapped with quotes to be properly interpreted as strings.

*   The above variables are examples. You should replace `your_api_token_here` and `your_intelligent_automation_api_url_here` with the actual values from your environment.
## Server Setup

1. Deploy Next.js application:

```bash
cd /path/to/Content-Acquisition-Crawler
git pull
npm install
npm run build
pm2 flush // Removed previous logs as this will fill up the storage Believe me, it already happened - JP
pm2 start ecosystem.config.js
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

