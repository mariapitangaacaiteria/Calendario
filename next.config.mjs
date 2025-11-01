/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      // adicione outros domínios de avatar aqui, se precisar
    ],
  },
};

export default nextConfig;
