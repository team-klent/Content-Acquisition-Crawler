module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        USE_BASE_PATH: 'false',
        NEXT_PUBLIC_URL: 'https://unifiedworkflow.innodata.com/app1',
        FAST_REFRESH: 'false',
      },
    },
  ],
};
