/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: 'http://localhost:3040/admin/:path*',
      },

      {
        source: '/ticket/:path*',
        destination: 'http://localhost:4001/ticket/:path*',
      },
    ]
  },
};

module.exports = withNextIntl(nextConfig);
