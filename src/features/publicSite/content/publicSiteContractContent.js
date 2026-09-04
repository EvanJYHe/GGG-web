export const GROUP_URL =
  "https://www.roblox.com/communities/17206753/Glazing-Gorilla-Games#!/about";

export const CONTACT_EMAIL = "contact@glazinggorillas.com";

export const publicSiteContractContent = {
  shared: {
    missingValue: "-",
    zeroValue: "0",
  },
  site: {
    name: "Glazing Gorilla Games",
    contactEmail: CONTACT_EMAIL,
    ctaLinks: {
      partnership: `mailto:${CONTACT_EMAIL}?subject=Partnership%20Inquiry`,
      acquisition: `mailto:${CONTACT_EMAIL}?subject=Game%20Acquisition`,
      general: `mailto:${CONTACT_EMAIL}`,
    },
  },
  nav: {
    ariaLabel: "Primary navigation",
    homeAriaLabel: "Glazing Gorilla Games home",
    items: [
      { label: "Games", href: "#games" },
      { label: "Media", href: "#social" },
      { label: "Services", href: "#studio" },
      { label: "Contact", href: "#contact" },
    ],
    groupCtaLabel: "Join Group",
  },
  hero: {
    titleLines: ["Glazing", "Gorilla", "Games"],
    body:
      "A Roblox studio building stylized, high-quality experiences with in-house art, systems, and production.",
    primaryCtaLabel: "Explore Games",
    secondaryCtaLabel: "Talk to Us",
    secondaryCtaHref: "#contact",
  },
  ticker: {
    ariaLabel: "Studio recognition highlights",
    items: [
      { text: "Featured on the Roblox homepage", star: true },
      { text: "Selected for Roblox’s Easter Hatch event", star: true },
      { text: "2× Today’s Picks feature", star: true },
      { text: "Curated across Roblox discovery surfaces" },
      { text: "Platform-featured Roblox experiences" },
    ],
  },
  stats: {
    ariaLabel: "Key studio metrics",
    fallbacks: {
      totalVisits: "72M+",
      totalMembers: "457K",
      mediaViews: "150M+",
      activePlayers: "1.4K+",
    },
    cards: {
      totalVisits: {
        label: "Total Visits",
        sub: "Across all titles",
      },
      totalMembers: {
        label: "Group Members",
        sub: "Roblox community",
      },
      mediaViews: {
        label: "Media Views",
        sub: "TikTok, YouTube, Instagram",
      },
      activePlayers: {
        label: "Active Players",
        sub: "Playing right now",
      },
    },
  },
  catalog: {
    heading: "Top Titles",
    viewAllLabel: "View games",
    errorMessage:
      "Live game stats are temporarily unavailable. Showing the latest cached catalog when possible.",
  },
  social: {
    heading: "Media",
    previousAriaLabel: "Previous media case study",
    nextAriaLabel: "Next media case study",
    links: [
      {
        id: "tiktok",
        platform: "TikTok",
        href: "https://www.tiktok.com/@glazinggorillagames?lang=en",
      },
      {
        id: "youtube",
        platform: "YouTube",
        href: "https://www.youtube.com/@GlazingGorillaGames",
      },
      {
        id: "instagram",
        platform: "Instagram",
        href: "https://www.instagram.com/glazinggorillagames/",
      },
    ],
    mediaCards: [
      {
        id: "viral-reach",
        name: "Social Media",
        eyebrow: "Owned Media",
        headline: "150M+",
        subLabel: "OWNED VIEWS",
        description:
          "Our official short-form content has generated over 150M views across TikTok, Instagram, and YouTube, turning game updates, scares, and character moments into viral clips.",
        descriptionMobile:
          "Our short-form content has earned 150M+ views across TikTok, Instagram, and YouTube.",
        ctaLabel: "WATCH HIGHLIGHTS",
        ctaHref: "https://www.tiktok.com/@glazinggorillagames?lang=en",
        mediaType: "video",
        mediaAsset: "socialProof.viralReach",
        mediaAlt: "Gameplay clip from Glazing Gorilla Games.",
        mediaOverlay: {
          primary: "38.3 million views",
          icon: "instagram",
        },
      },
      {
        id: "creator-partnerships",
        name: "Collaborations",
        eyebrow: "Partnerships",
        headline: "CREATOR COLLABS",
        subLabel: "SPONSORED MEDIA",
        description:
          "We’ve partnered with numerous YouTubers, Roblox creators, and internet personalities to promote launches, create gameplay videos.",
        descriptionMobile:
          "We partner with YouTubers and Roblox creators to promote launches and produce gameplay videos.",
        ctaLabel: "VIEW VIDEO",
        ctaHref: "https://www.youtube.com/@GlazingGorillaGames",
        mediaType: "video",
        mediaAsset: "socialProof.creatorPartnerships",
        mediaAlt: "Creator partnership video featuring Glazing Gorilla Games.",
        mediaOverlay: {
          primary: "@cityboyjj",
          secondary: "430K followers on Instagram",
          icon: "instagram",
        },
      },
      {
        id: "community-engagement",
        name: "Community",
        eyebrow: "Community",
        headline: "450K+",
        metricKey: "totalMembers",
        subLabel: "COMMUNITY",
        description:
          "Our community stays active through Discord, in-game events, fan reactions, social comments, and shared moments around our games and characters.",
        descriptionMobile:
          "Our community stays active across Discord, in-game events, and social around our games.",
        ctaLabel: "JOIN COMMUNITY",
        ctaHref: GROUP_URL,
        mediaType: "image",
        mediaAsset: "socialProof.communityPreview",
        mediaAlt: "Community reactions and fan content around Glazing Gorilla Games.",
      },
    ],
  },
  studio: {
    titleLines: ["What We", "Do"],
    cards: [
      {
        id: "brands",
        title: "Brand Integrations",
        body: "Advertise your brand inside our Roblox games through billboards, teleports, custom placements, and interactive moments.",
        ctaLabel: "Pitch a brand",
        ctaHref: "/#contact",
        mediaAsset: "services.brandIntegrations",
      },
      {
        id: "studio",
        title: "Original Games",
        body: "We create and operate our own Roblox games, from the first idea to launch, updates, events, and ongoing improvements.",
        ctaLabel: "Play our games",
        ctaHref: "/games",
        mediaAsset: "services.originalGames",
      },
      {
        id: "publishing",
        title: "Publishing & Acquisitions",
        body: "We invest in, acquire, and support Roblox games with potential, helping improve the game and grow it over time.",
        ctaLabel: "Submit your game",
        ctaHref: "/#contact",
        mediaAsset: "services.publishingAcquisitions",
        mediaPosition: "left",
      },
    ],
  },
  contact: {
    titleLines: ["Let's", "Work Together"],
    body: "Have a game to build, scale, or sell? Tell us what you are working on.",
    namePlaceholder: "Jane Carver",
    emailPlaceholder: "jane@studio.gg",
    messagePlaceholder: "A Roblox link, your role, where it stands today, and what you need.",
    submitLabel: "Send Message",
    subjectPrefix: "GGG inquiry from ",
    replyPrefix: "Reply to:",
  },
  footer: {
    studioHeading: "Studio",
    followHeading: "Follow",
    links: {
      games: "Games",
      about: "Services",
      contactSection: "Contact",
      email: "Email",
      group: "Roblox Group",
    },
    copyrightTemplate: "All rights reserved.",
  },
  gameCard: {
    artworkPlaceholderSuffix: "artwork",
    playingUnitLabel: "playing",
    visitsUnitLabel: "visits",
  },
  gamesPage: {
    backLabel: "Back to home",
    titleLead: "All",
    titleAccent: "Games",
    emptyMessage: "No games to show right now. Check back soon.",
    moreCard: {
      countPrefix: "+",
      label: "more games",
      visitsUnitLabel: "combined visits",
    },
  },
};

export function clonePublicSiteContractContent() {
  return JSON.parse(JSON.stringify(publicSiteContractContent));
}
