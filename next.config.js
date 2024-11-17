/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "smartcampus-lilac.vercel.app",  // Frontend domain
      "ketercoder.pythonanywhere.com",  // Backend domain if it serves images
      "cdn.sanity.io",  // External image sources like sanity.io
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "smartcampus-lilac.vercel.app", // Frontend
        port: "",
      },
      {
        protocol: "https",
        hostname: "ketercoder.pythonanywhere.com", // Backend
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   images: {
//     domains: ["localhost"],
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "cdn.sanity.io",
//         port: "",
//       },
      
//     ],
//   },
// };

// module.exports = nextConfig;
