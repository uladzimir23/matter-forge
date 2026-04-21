import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  pageExtensions: ['ts', 'tsx'],
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  sassOptions: {
    includePaths: ['./src/shared/styles'],
    silenceDeprecations: ['legacy-js-api'],
  },
};

export default nextConfig;
