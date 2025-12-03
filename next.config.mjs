// next.config.mjs (Pastikan ini sudah ada dan di-restart)

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // ✅ Ini adalah rewrite yang menangani GET dan POST ke /api/products
      {
        source: '/api/products',
        destination: 'https://course.summitglobal.id/products', 
      },
      // Rewrite ini menangani query parameter/path dinamis (untuk GET Detail/PUT)
      {
        source: '/api/products/:path*',
        destination: 'https://course.summitglobal.id/products/:path*', 
      },
    ];
  },
};

export default nextConfig;