import type { NextConfig } from "next";

const nextConfig: NextConfig = {
allowedDevOrigins: ['10.66.18.236'],
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
