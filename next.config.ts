import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  async headers() {
    return [
      {
        source: '/wasm/:name.wasm.gz',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/wasm'
          },
          {
            key: 'Content-Encoding',
            value: 'gzip'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },
};

export default nextConfig;
