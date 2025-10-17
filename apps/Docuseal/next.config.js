//@ts-check

// Standalone Next.js config for Docker/standalone usage
// This config doesn't depend on Nx and can be used in Docker containers

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },
  
  // Transpile packages if needed
  transpilePackages: [],
  
  // Output configuration for standalone builds
  output: 'standalone',
  
  // Environment variables
  env: {
    // Add any custom environment variables here
  },
  
  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add any custom webpack configuration here
    return config;
  },
};

module.exports = nextConfig;
 