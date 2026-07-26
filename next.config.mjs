/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdf-parse (via pdfjs-dist) ships its own worker file that Turbopack/webpack
  // shouldn't try to bundle — this tells Next.js to require() it natively at runtime instead.
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
