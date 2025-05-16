import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: process.env.USE_BASE_PATH === 'true' ? '/ca' : '',
};

export default nextConfig;
