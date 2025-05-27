module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        USE_BASE_PATH: 'true',
        BASE_PATH: '/app1',
        NEXT_PUBLIC_URL: 'https://unifiedworkflow.innodata.com/app1',
        FAST_REFRESH: 'false',
        API_TOKEN: process.env.API_TOKEN || '',
        NEXT_PUBLIC_IA_API_URL: process.env.NEXT_PUBLIC_IA_API_URL || '',
        NEXT_PUBLIC_PRODUCTION_BASEPATH:
          'https://unifiedworkflow.innodata.com/app1',
      },
    },
  ],
};
