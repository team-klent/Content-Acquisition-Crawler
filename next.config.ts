import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  basePath: process.env.IS_VERCEL ? '' : '/ca',
};

export default nextConfig;
