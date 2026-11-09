import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/register", "/dashboard"],
    },
    sitemap: "https://suvidha-mocha.vercel.app/sitemap.xml",
  };
}