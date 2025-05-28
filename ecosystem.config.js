require('dotenv').config({ path: './.env' });
const apiToken = process.env.API_TOKEN  || '';
const config = {
  apps: [
    {
      name: 'content-acquisition-crawler',
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      port: 3000, 
      log: './logs/content-acquisition-crawler.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        USE_BASE_PATH: 'false',
        BASE_PATH: '/app1',
        NEXT_PUBLIC_URL: 'https://unifiedworkflow.innodata.com/app1',
        FAST_REFRESH: 'false',
        API_TOKEN: apiToken,
        NEXT_PUBLIC_IA_API_URL: process.env.NEXT_PUBLIC_IA_API_URL,
        NEXT_PUBLIC_PRODUCTION_BASEPATH:
          'https://unifiedworkflow.innodata.com/app1',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        USE_BASE_PATH: 'false',
        BASE_PATH: '/app1',
        NEXT_PUBLIC_URL: 'https://unifiedworkflow.innodata.com/app1',
        FAST_REFRESH: 'false',
        API_TOKEN: apiToken,
        NEXT_PUBLIC_IA_API_URL: process.env.NEXT_PUBLIC_IA_API_URL,
        NEXT_PUBLIC_PRODUCTION_BASEPATH:
          'https://unifiedworkflow.innodata.com/app1',
      },
    },
  ],
}
module.exports = config;
