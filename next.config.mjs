/** @type {import('next').NextConfig} */
const noCacheHeaders = [
  {
    key: "Cache-Control",
    value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  },
  { key: "Pragma", value: "no-cache" },
  { key: "Expires", value: "0" },
  { key: "Surrogate-Control", value: "no-store" },
];

const nextConfig = {
  images: {
    // Allow Vercel Blob URLs for image optimisation when BLOB_READ_WRITE_TOKEN is set
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async headers() {
    return [
      { source: "/api/:path*", headers: noCacheHeaders },
      { source: "/gallery/:path*", headers: noCacheHeaders },
      { source: "/pdfs/:path*", headers: noCacheHeaders },
      {
        source: "/((?!_next/static|_next/image).*)",
        headers: noCacheHeaders,
      },
    ];
  },
};

export default nextConfig;
