/** @type {import('next').NextConfig} */

const nextConfig = {
  typedRoutes: true,
  experimental: {
    // reactCompiler: true, // Removed - requires babel-plugin-react-compiler
    optimizePackageImports: ["zvijude"],
    serverActions: {
      bodySizeLimit: "9mb",
    },
  },
  devIndicators: false,
  serverExternalPackages: ["knex"],
  poweredByHeader: false,
};

export default nextConfig;
