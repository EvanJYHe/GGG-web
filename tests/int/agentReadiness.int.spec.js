import { describe, expect, it } from "vitest";

import { GET as getLlmsText } from "../../src/app/llms.txt/route.js";
import robots from "../../src/app/robots.js";
import sitemap from "../../src/app/sitemap.js";
import { createLlmsText } from "../../src/lib/agent/llms.js";
import { createPublicJsonResponse } from "../../src/lib/publicSite/api.js";
import {
  SITE_NAME,
  createOrganizationJsonLd,
  createPageMetadata,
  getSiteUrl,
  serializeJsonLd,
} from "../../src/lib/site.js";

const siteUrl = "https://www.glazinggorillagames.com";

function createContract() {
  return {
    catalog: {
      games: [{ universeId: 123 }],
      groups: [{ id: 17206753 }],
    },
    metrics: {
      totalPlaying: 42,
      totalVisits: 1000,
      totalMembers: 500,
    },
    meta: {
      cacheAgeMs: 1000,
      generatedAt: "2026-08-22T00:00:00.000Z",
    },
  };
}

describe("machine-readable discovery", () => {
  it("publishes concise llms.txt guidance using retained resources only", async () => {
    const body = createLlmsText(siteUrl);
    expect(body.startsWith(`# ${SITE_NAME}\n\n> `)).toBe(true);
    expect(body).toContain("When to use this site:");
    expect(body).toContain(`${siteUrl}/`);
    expect(body).toContain(`${siteUrl}/games`);
    expect(body).toContain(`${siteUrl}/api/public/site-data`);
    expect(body).toContain(`${siteUrl}/sitemap.xml`);
    expect(body).not.toContain("openapi.json");
    expect(body).not.toContain("index.md");
    expect(body).not.toContain("games.md");

    const response = getLlmsText();
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    expect(await response.text()).toContain("## Primary resources");
  });

  it("publishes only the real indexable routes", () => {
    const configuredSiteUrl = getSiteUrl().origin;
    const sitemapEntries = sitemap();
    expect(sitemapEntries.map(({ url }) => url)).toEqual([
      `${configuredSiteUrl}/`,
      `${configuredSiteUrl}/games`,
    ]);
    expect(sitemapEntries.every(({ lastModified }) => lastModified instanceof Date)).toBe(true);

    const robotsDocument = robots();
    expect(robotsDocument.rules.allow).toContain("/api/public/site-data");
    expect(robotsDocument.rules.disallow).toContain("/admin/");
    expect(robotsDocument.rules.disallow).toContain("/api/");
    expect(robotsDocument.sitemap).toBe(`${configuredSiteUrl}/sitemap.xml`);
  });
});

describe("identity and cache metadata", () => {
  it("builds canonical social metadata and accurate Organization JSON-LD", () => {
    const metadata = createPageMetadata({ path: "/games", title: "Games" });
    expect(metadata.alternates.canonical).toBe("/games");
    expect(metadata.openGraph.type).toBe("website");
    expect(metadata.twitter.card).toBe("summary_large_image");

    const organization = createOrganizationJsonLd(siteUrl);
    expect(organization["@type"]).toBe("Organization");
    expect(organization.name).toBe(SITE_NAME);
    expect(organization.url).toBe(`${siteUrl}/`);
    expect(organization.contactPoint.email).toBe("contact@glazinggorillas.com");
    expect(organization.address).toBeUndefined();
    expect(serializeJsonLd({ value: "</script>" })).not.toContain("</script>");
    expect(getSiteUrl("www.glazinggorillagames.com").origin).toBe(siteUrl);
  });

  it("honors weak and strong If-None-Match validators", async () => {
    const contract = createContract();
    const first = createPublicJsonResponse(contract, "site-data");
    const etag = first.headers.get("ETag");
    expect(first.status).toBe(200);
    expect(etag).toBeTruthy();

    const conditional = createPublicJsonResponse(
      contract,
      "site-data",
      new Request(`${siteUrl}/api/public/site-data`, {
        headers: { "If-None-Match": `W/${etag}` },
      }),
    );
    expect(conditional.status).toBe(304);
    expect(await conditional.text()).toBe("");
    expect(conditional.headers.get("ETag")).toBe(etag);
  });
});
