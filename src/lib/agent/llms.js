import {
  SITE_DESCRIPTION,
  SITE_NAME,
  getAbsoluteUrl,
} from "@/lib/site.js";

export function createLlmsText(siteUrl) {
  const url = (path) => getAbsoluteUrl(path, siteUrl);

  return [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION} The site publishes a read-only catalog and current aggregate Roblox metrics.`,
    "",
    "When to use this site:",
    "",
    "- Use it to identify the studio, discover its public games and services, retrieve current public metrics, find official social profiles, or prepare a partnership, publishing, acquisition, or creator inquiry.",
    "- Use the public JSON endpoint when structured data or freshness metadata matters. Preserve generatedAt when quoting changing metrics.",
    "- Do not use this site for account actions, purchases, game administration, or private CMS data; no public interface provides those capabilities.",
    "",
    "## Primary resources",
    "",
    `- [Homepage](${url("/")}): Studio overview, featured games, services, media reach, and contact information.`,
    `- [Games catalog](${url("/games")}): Active public games with Roblox links and current metrics.`,
    `- [Public site data](${url("/api/public/site-data")}): The unauthenticated public-site-v1 JSON contract with source and freshness metadata.`,
    "",
    "## Optional",
    "",
    `- [XML sitemap](${url("/sitemap.xml")}): Indexable public URLs and last-modified dates.`,
    `- [Robots policy](${url("/robots.txt")}): Crawler directives for the public website.`,
    `- [Contact section](${url("/#contact")}): Business inquiry form and direct studio email.`,
    "",
  ].join("\n");
}
