import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath:
    process.env.USE_BASE_PATH === 'true'
      ? process.env.BASE_PATH || '/app1'
      : '',
 webpack: (config) => {
   config.resolve.alias.canvas = false;

   return config;
 },
};

export default nextConfig;
