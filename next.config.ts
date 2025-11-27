import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath:'',
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
