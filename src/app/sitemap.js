import {
  SITE_LAST_MODIFIED,
  getAbsoluteUrl,
} from "@/lib/site.js";

const routes = [
  { changeFrequency: "weekly", path: "/", priority: 1 },
  { changeFrequency: "daily", path: "/games", priority: 0.9 },
];

export default function sitemap() {
  return routes.map(({ path, ...entry }) => ({
    ...entry,
    lastModified: new Date(SITE_LAST_MODIFIED),
    url: getAbsoluteUrl(path),
  }));
}
