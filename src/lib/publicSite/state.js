import { clonePublicSiteContractContent } from "@/features/publicSite/content/publicSiteContractContent.js";
import { publicSiteMediaAssets as fallbackMediaAssets } from "@/features/publicSite/content/publicSiteMediaAssets.js";
import { getPayloadClient } from "@/lib/payload/client.js";
import {
  getFallbackMediaAssetDocs,
  getFallbackMediaCards,
  getFallbackPublicSiteGlobal,
  getFallbackSiteSettings,
  getFallbackSocialProfiles,
} from "@/lib/publicSite/seedData.js";
import { fetchRuntimePublicData } from "@/lib/runtime/publicData.js";

const PUBLIC_SITE_CONTRACT_VERSION = "public-site-v1";
const PUBLIC_SITE_STATE_CACHE_TTL_MS = Number(process.env.PUBLIC_SITE_STATE_CACHE_TTL_MS || 10_000);

let publicSiteStateCache = null;
let publicSiteStatePromise = null;

function getCacheAgeMs(generatedAt) {
  if (!generatedAt) {
    return null;
  }

  const generatedAtDate = new Date(generatedAt);
  return Number.isNaN(generatedAtDate.getTime()) ? null : Date.now() - generatedAtDate.getTime();
}

function isPublicSiteStateCacheFresh() {
  return (
    publicSiteStateCache &&
    PUBLIC_SITE_STATE_CACHE_TTL_MS > 0 &&
    Date.now() - publicSiteStateCache.cachedAt < PUBLIC_SITE_STATE_CACHE_TTL_MS
  );
}

function withCurrentFreshness(state) {
  const cacheAgeMs = getCacheAgeMs(state.contract.meta.generatedAt);

  return {
    ...state,
    contract: {
      ...state.contract,
      meta: {
        ...state.contract.meta,
        cacheAgeMs,
      },
    },
  };
}

function buildMediaAssets(mediaAssetDocs) {
  const byRegistryKey = new Map(mediaAssetDocs.map((asset) => [asset.registryKey, asset]));
  const urlFor = (key) => byRegistryKey.get(key)?.url || "";

  return {
    brandLogo: { ...fallbackMediaAssets.brandLogo, url: urlFor("brandLogo") },
    heroKeyArt: { ...fallbackMediaAssets.heroKeyArt, url: urlFor("heroKeyArt") },
    socialProof: {
      viralReach: {
        ...fallbackMediaAssets.socialProof.viralReach,
        url: urlFor("socialProof.viralReach"),
      },
      creatorPartnerships: {
        ...fallbackMediaAssets.socialProof.creatorPartnerships,
        url: urlFor("socialProof.creatorPartnerships"),
      },
      communityPreview: {
        ...fallbackMediaAssets.socialProof.communityPreview,
        url: urlFor("socialProof.communityPreview"),
      },
    },
    services: {
      brandIntegrations: {
        ...fallbackMediaAssets.services.brandIntegrations,
        url: urlFor("services.brandIntegrations"),
      },
      originalGames: {
        ...fallbackMediaAssets.services.originalGames,
        url: urlFor("services.originalGames"),
      },
      publishingAcquisitions: {
        ...fallbackMediaAssets.services.publishingAcquisitions,
        url: urlFor("services.publishingAcquisitions"),
      },
    },
    contact: {
      pumpkinKeyArt: {
        ...fallbackMediaAssets.contact.pumpkinKeyArt,
        url: urlFor("contact.pumpkinKeyArt"),
      },
    },
  };
}

function buildStudioContent({ studio, mediaAssets }) {
  if (!studio) {
    return studio;
  }

  return {
    ...studio,
    cards: (studio.cards || []).map((card) => ({
      ...card,
      mediaAsset: undefined,
      mediaSrc: getAssetURLFromKey(mediaAssets, card.mediaAsset),
    })),
  };
}

function getAssetURLFromKey(mediaAssets, registryKey) {
  if (!registryKey) {
    return "";
  }

  return registryKey.split(".").reduce((value, segment) => value?.[segment], mediaAssets)?.url || "";
}

function getCanonicalSiteContent({ publicSiteGlobal, siteSettings, mediaCards, socialProfiles, mediaAssets }) {
  const fallback = clonePublicSiteContractContent();

  const siteContent = {
    shared: publicSiteGlobal?.shared || fallback.shared,
    site: siteSettings?.site || fallback.site,
    nav: publicSiteGlobal?.nav || fallback.nav,
    hero: publicSiteGlobal?.hero || fallback.hero,
    ticker: publicSiteGlobal?.ticker || fallback.ticker,
    stats: publicSiteGlobal?.stats || fallback.stats,
    catalog: {
      ...fallback.catalog,
      ...(publicSiteGlobal?.catalog || {}),
    },
    social: {
      ...(publicSiteGlobal?.social || fallback.social),
      links: socialProfiles,
      mediaCards: mediaCards.map((card) => ({
        ...card,
        mediaAsset: undefined,
        mediaSrc: card.mediaSrc || getAssetURLFromKey(mediaAssets, card.assetRegistryKey),
      })),
    },
    studio: buildStudioContent({
      studio: publicSiteGlobal?.studio || fallback.studio,
      mediaAssets,
    }),
    contact: publicSiteGlobal?.contact || fallback.contact,
    footer: publicSiteGlobal?.footer || fallback.footer,
    gameCard: { ...fallback.gameCard, ...(publicSiteGlobal?.gameCard || {}) },
    gamesPage: {
      ...fallback.gamesPage,
      ...(publicSiteGlobal?.gamesPage || {}),
      moreCard: {
        ...fallback.gamesPage.moreCard,
        ...(publicSiteGlobal?.gamesPage?.moreCard || {}),
      },
    },
  };

  siteContent.header = siteContent.nav;
  siteContent.proofBar = {
    ticker: siteContent.ticker,
    statsAriaLabel: siteContent.stats.ariaLabel,
    fallbacks: siteContent.stats.fallbacks,
    statCards: siteContent.stats.cards,
  };
  siteContent.topTitles = siteContent.catalog;
  siteContent.media = siteContent.social;
  siteContent.aboutGGG = siteContent.studio;
  siteContent.workTogether = {
    ...siteContent.contact,
  };

  return siteContent;
}

function toPublicGame(game, runtimeGame) {
  return {
    universeId: game.universeId,
    name: runtimeGame?.name || game.name || null,
    description: runtimeGame?.description || null,
    playing: runtimeGame?.playing || 0,
    visits: runtimeGame?.visits || 0,
    maxPlayers: runtimeGame?.maxPlayers || 0,
    created: runtimeGame?.created || null,
    updated: runtimeGame?.updated || null,
    rootPlaceId: runtimeGame?.rootPlaceId || null,
    displayOrder: game.displayOrder || 0,
    isFeatured: game.isFeatured !== false,
  };
}

function toPublicGroup(group, runtimeGroup) {
  return {
    id: group.groupId,
    name: runtimeGroup?.name || group.name || null,
    description: runtimeGroup?.description || null,
    groupDetails: {
      description: runtimeGroup?.description || null,
      memberCount: runtimeGroup?.memberCount || 0,
    },
  };
}

function toGameImage(game, runtimeImage) {
  if (runtimeImage) {
    return {
      id: runtimeImage.universeId,
      name: runtimeImage.name || game.name,
      media: runtimeImage.media || [],
    };
  }

  return {
    id: game.universeId,
    name: game.name,
    media: [],
  };
}

function buildMetrics({ games, groups, runtime }) {
  const totalPlaying =
    runtime.metrics?.totalPlaying ?? games.reduce((sum, game) => sum + (game.playing || 0), 0);
  const totalVisits =
    runtime.metrics?.totalVisits ?? games.reduce((sum, game) => sum + (game.visits || 0), 0);
  const totalMembers =
    runtime.metrics?.totalMembers ??
    groups.reduce((sum, group) => sum + (group.groupDetails?.memberCount || 0), 0);

  return {
    totalPlaying,
    totalVisits,
    totalMembers,
    totalGames: games.length,
    totalGroups: groups.length,
    runtimeSource: "roblox-analytics-cache",
    generatedAt: runtime.freshness.generatedAt,
    hasRuntimeData: Boolean(runtime.freshness.hasRuntimeData),
  };
}

const loadPayloadChromeContent = async () => {
  const payload = await getPayloadClient();

  const [
    siteSettings,
    publicSiteGlobal,
    groupsResult,
    mediaCardsResult,
    socialProfilesResult,
    mediaAssetsResult,
  ] = await Promise.all([
    payload.findGlobal({ slug: "site-settings" }).catch(() => null),
    payload.findGlobal({ slug: "public-site" }).catch(() => null),
    payload
      .find({
        collection: "groups",
        depth: 0,
        limit: 50,
        sort: "groupId",
        where: { isActive: { equals: true } },
      })
      .catch(() => ({ docs: [] })),
    payload
      .find({
        collection: "media-cards",
        depth: 1,
        limit: 50,
        sort: "displayOrder",
      })
      .catch(() => ({ docs: [] })),
    payload
      .find({
        collection: "social-profiles",
        depth: 0,
        limit: 50,
        sort: "displayOrder",
      })
      .catch(() => ({ docs: [] })),
    payload
      .find({
        collection: "media-assets",
        depth: 0,
        limit: 100,
      })
      .catch(() => ({ docs: [] })),
  ]);

  return {
    groups: groupsResult.docs.length ? groupsResult.docs : [],
    mediaAssets: mediaAssetsResult.docs.length ? mediaAssetsResult.docs : getFallbackMediaAssetDocs(),
    mediaCards: mediaCardsResult.docs.length ? mediaCardsResult.docs : getFallbackMediaCards(),
    publicSiteGlobal: publicSiteGlobal || getFallbackPublicSiteGlobal(),
    siteSettings: siteSettings || getFallbackSiteSettings(),
    socialProfiles: socialProfilesResult.docs.length ? socialProfilesResult.docs : getFallbackSocialProfiles(),
  };
};

async function loadPayloadContent() {
  const payload = await getPayloadClient();

  const [chromeContent, gamesResult] = await Promise.all([
    loadPayloadChromeContent(),
    payload
      .find({
        collection: "games",
        depth: 0,
        limit: 200,
        sort: "displayOrder",
        where: {
          isActive: {
            equals: true,
          },
        },
      })
      .catch(() => ({ docs: [] })),
  ]);

  return {
    ...chromeContent,
    games: gamesResult.docs.length ? gamesResult.docs : [],
  };
}

function buildChromeContract({ chromeContent, mediaAssets }) {
  const mediaCards = chromeContent.mediaCards.map((card) => {
    const assetRegistryKey = card.assetRegistryKey || card.mediaAsset?.registryKey;

    return {
      id: card.id,
      eyebrow: card.eyebrow,
      headline: card.headline,
      metricKey: card.metricKey || null,
      subLabel: card.subLabel,
      description: card.description,
      descriptionMobile: card.descriptionMobile || null,
      ctaLabel: card.ctaLabel,
      ctaHref: card.ctaHref,
      mediaType: card.mediaType,
      assetRegistryKey,
      mediaAlt: card.mediaAlt,
      mediaOverlay: card.mediaOverlay || null,
      mediaPosition: card.mediaPosition || null,
      mediaSrc: card.mediaAsset?.url || getAssetURLFromKey(mediaAssets, assetRegistryKey),
    };
  });

  const socialProfiles = chromeContent.socialProfiles.map((profile) => ({
    id: profile.id,
    platform: profile.platform,
    href: profile.href,
  }));

  const siteContent = getCanonicalSiteContent({
    mediaAssets,
    mediaCards,
    publicSiteGlobal: chromeContent.publicSiteGlobal,
    siteSettings: chromeContent.siteSettings,
    socialProfiles,
  });

  return { mediaCards, socialProfiles, siteContent };
}

async function loadPublicSiteState() {
  const payloadContent = await loadPayloadContent();
  const runtime = await fetchRuntimePublicData({
    groupIds: payloadContent.groups.map((group) => group.groupId),
    universeIds: payloadContent.games.map((game) => game.universeId),
  });

  const mediaAssets = buildMediaAssets(payloadContent.mediaAssets);
  const runtimeGamesByUniverseId = new Map((runtime.games || []).map((game) => [game.universeId, game]));
  const runtimeGroupsById = new Map((runtime.groups || []).map((group) => [group.groupId, group]));
  const runtimeImagesByUniverseId = new Map(
    (runtime.gameImages || []).map((image) => [image.universeId, image])
  );

  const games = payloadContent.games.map((game) => toPublicGame(game, runtimeGamesByUniverseId.get(game.universeId)));
  const groups = payloadContent.groups.map((group) =>
    toPublicGroup(group, runtimeGroupsById.get(group.groupId))
  );
  const gameImages = payloadContent.games.map((game) =>
    toGameImage(game, runtimeImagesByUniverseId.get(game.universeId))
  );

  const { mediaCards, socialProfiles, siteContent } = buildChromeContract({
    chromeContent: payloadContent,
    mediaAssets,
  });

  const metrics = buildMetrics({ games, groups, runtime });
  const cacheAgeMs = runtime.freshness.cacheAgeMs;

  const contract = {
    siteContent,
    catalog: {
      games,
      groups,
    },
    metrics,
    mediaCards,
    socialProfiles,
    assets: {
      games: gameImages,
    },
    meta: {
      cacheAgeMs,
      contractVersion: PUBLIC_SITE_CONTRACT_VERSION,
      editorialSource: "payload-globals-and-collections",
      generatedAt: metrics.generatedAt,
      source: runtime.freshness.hasRuntimeData ? "payload+runtime-cache" : "payload-only",
    },
  };

  return {
    contract,
    mediaAssets,
  };
}

async function loadPublicSiteChromeState() {
  const chromeContent = await loadPayloadChromeContent();
  const mediaAssets = buildMediaAssets(chromeContent.mediaAssets);
  const groups = chromeContent.groups.map((group) => toPublicGroup(group, null));
  const { siteContent } = buildChromeContract({ chromeContent, mediaAssets });

  return {
    contract: {
      siteContent,
      catalog: { groups },
    },
    mediaAssets,
  };
}

export async function getPublicSiteChromeState() {
  return loadPublicSiteChromeState();
}

export async function getPublicSiteState({ bypassCache = false } = {}) {
  if (!bypassCache && isPublicSiteStateCacheFresh()) {
    return withCurrentFreshness(publicSiteStateCache.state);
  }

  if (!bypassCache && publicSiteStatePromise) {
    return withCurrentFreshness(await publicSiteStatePromise);
  }

  publicSiteStatePromise = loadPublicSiteState()
    .then((state) => {
      publicSiteStateCache = {
        cachedAt: Date.now(),
        state,
      };
      return state;
    })
    .finally(() => {
      publicSiteStatePromise = null;
    });

  return withCurrentFreshness(await publicSiteStatePromise);
}

export function clearPublicSiteStateCache() {
  publicSiteStateCache = null;
  publicSiteStatePromise = null;
}
