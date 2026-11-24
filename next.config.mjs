/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remote photos used on the site (verified to load):
  // Unsplash blood-donation photos + randomuser.me testimonial portraits.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'randomuser.me' },
    ],
  },
};

export default nextConfig;
