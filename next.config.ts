import type { NextConfig } from 'next';

const nextConfig: NextConfig = {


  basePath: process.env.IS_VERCEL ? '' : '/ca',
};

export default nextConfig;
