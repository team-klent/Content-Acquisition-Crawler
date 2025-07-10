require('dotenv').config({ path: './.env' });
const apiToken = process.env.API_TOKEN || '';
const config = {
  apps: [
    {
      name: 'content-acquisition',
      script: 'npx',
      args: 'next start --port 3000',
      interpreter: 'none',
      exec_mode: 'fork',
      port: 3000,
      log: './logs/content-acquisition.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_URL: 'https://unifiedworkflow.innodata.com',
        FAST_REFRESH: 'false',
        API_TOKEN: apiToken,
        NEXT_PUBLIC_IA_API_URL: process.env.NEXT_PUBLIC_IA_API_URL,
        NEXT_PUBLIC_PRODUCTION_BASEPATH:
          'https://unifiedworkflow.innodata.com',
      },
    },
  ],
};
module.exports = config;
