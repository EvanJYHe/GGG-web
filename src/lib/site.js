import {
  CONTACT_EMAIL,
  GROUP_URL,
} from "@/features/publicSite/content/publicSiteContractContent.js";

export const SITE_NAME = "Glazing Gorilla Games";
export const SITE_DESCRIPTION =
  "Glazing Gorilla Games is a Roblox game studio creating original titles, live experiences, and brand collaborations.";
export const DEFAULT_SITE_URL = "https://www.glazinggorillagames.com";
export const SITE_LAST_MODIFIED = "2026-08-22T00:00:00.000Z";

const SOCIAL_URLS = [
  GROUP_URL,
  "https://www.tiktok.com/@glazinggorillagames",
  "https://www.youtube.com/@GlazingGorillaGames",
  "https://www.instagram.com/glazinggorillagames/",
];

export function getSiteUrl(value = process.env.NEXT_PUBLIC_SITE_URL) {
  try {
    const rawValue = value instanceof URL ? value.toString() : value;
    const candidate = String(rawValue || DEFAULT_SITE_URL).trim();
    const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

export function getAbsoluteUrl(path = "/", siteUrl) {
  return new URL(path, getSiteUrl(siteUrl)).toString();
}

export function createPageMetadata({
  description = SITE_DESCRIPTION,
  path = "/",
  title = SITE_NAME,
} = {}) {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      locale: "en_US",
      siteName: SITE_NAME,
      type: "website",
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function createOrganizationJsonLd(siteUrl) {
  const baseUrl = getSiteUrl(siteUrl);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": getAbsoluteUrl("/#organization", baseUrl),
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: getAbsoluteUrl("/", baseUrl),
    logo: {
      "@type": "ImageObject",
      url: getAbsoluteUrl("/icon.png", baseUrl),
      width: 256,
      height: 256,
    },
    email: CONTACT_EMAIL,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "business inquiries",
      email: CONTACT_EMAIL,
      areaServed: "Worldwide",
      availableLanguage: ["English"],
    },
    sameAs: SOCIAL_URLS,
  };
}

export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
