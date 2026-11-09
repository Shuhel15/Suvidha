import type { MetadataRoute } from "next";

const BASE_URL = "https://suvidha-mocha.vercel.app/";

const routes = ["",  "/services"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
