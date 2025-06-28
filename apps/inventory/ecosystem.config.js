require('dotenv').config({ path: './.env' });
const apiToken = process.env.API_TOKEN || '';
const config = {
  apps: [
    {
      name: 'qualification',
      script: 'pnpm',
      args: 'start',
      interpreter: 'none',     
      exec_mode: 'fork',
      cwd : 'apps/qualification',
      port: 3002,
      log: './logs/qualification.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      env_development: {
        NODE_ENV: 'development',
        PORT: 3002,
        USE_BASE_PATH: 'false',
        BASE_PATH: '/qualification',
        NEXT_PUBLIC_URL: 'https://unifiedworkflow.innodata.com/qualification',
        FAST_REFRESH: 'false',
        API_TOKEN: apiToken,
        NEXT_PUBLIC_IA_API_URL: process.env.NEXT_PUBLIC_IA_API_URL,
        NEXT_PUBLIC_PRODUCTION_BASEPATH:
          'https://unifiedworkflow.innodata.com/qualification',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3002,
        USE_BASE_PATH: 'true',
        BASE_PATH: '/qualification',
        NEXT_PUBLIC_URL: 'https://unifiedworkflow.innodata.com/qualification',
        FAST_REFRESH: 'false',
        API_TOKEN: apiToken,
        NEXT_PUBLIC_IA_API_URL: process.env.NEXT_PUBLIC_IA_API_URL,
        NEXT_PUBLIC_PRODUCTION_BASEPATH:
          'https://unifiedworkflow.innodata.com/qualification',
      },
    },
  ],
}
module.exports = config;
