import type { NextConfig } from 'next';

const apiUrl = process.env.API_PROXY_URL || 'http://163.176.3.54';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
