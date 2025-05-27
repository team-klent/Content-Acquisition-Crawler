module.exports = {
  apps: [
    {
      name: "content-acquisition-crawler",
      script: "npm",
      args: "start",
      env_development: {
        NODE_ENV: "development",
        PORT: 3000,
        USE_BASE_PATH: "false",
        FAST_REFRESH: true
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        USE_BASE_PATH: "true",
        BASE_PATH: "/app1",
        NEXT_PUBLIC_URL: "https://unifiedworkflow.innodata.com/app1",
        FAST_REFRESH: false
      },
      watch: false,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      exp_backoff_restart_delay: 100
    }
  ]
};
