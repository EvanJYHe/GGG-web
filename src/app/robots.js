import { getAbsoluteUrl, getSiteUrl } from "@/lib/site.js";

export default function robots() {
  return {
    host: getSiteUrl().origin,
    rules: {
      userAgent: "*",
      allow: ["/", "/api/public/site-data"],
      disallow: ["/admin/", "/api/"],
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  };
}
