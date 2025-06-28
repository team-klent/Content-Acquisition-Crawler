import type { NextConfig } from 'next';

console.log("using base path: ", process.env.USE_BASE_PATH === 'true');  
console.log("base path: ", process.env.BASE_PATH);
const nextConfig: NextConfig = {
  basePath: process.env.BASE_PATH || '/content',
   
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};
console.log(nextConfig)
export default nextConfig;
