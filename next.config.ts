import type { NextConfig } from "next";

const nextConfig: NextConfig = {
allowedDevOrigins: ['10.165.23.236'],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
