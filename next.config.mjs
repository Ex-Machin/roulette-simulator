/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/34',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;