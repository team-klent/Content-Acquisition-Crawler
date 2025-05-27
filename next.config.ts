import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: String(process.env.USE_BASE_PATH).toLowerCase() === 'true' ? process.env.BASE_PATH || '/app1' : '',
};

export default nextConfig;
