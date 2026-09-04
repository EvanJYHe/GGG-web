import { content, GROUP_URL } from "../content/publicSiteContent.js";

const formatter = new Intl.NumberFormat("en-US");
const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

function getResolvedContent(siteContent = content) {
  return {
    shared: siteContent.shared,
    stats: siteContent.stats,
  };
}

export function formatCompactNumber(
  value,
  fallback = getResolvedContent().shared.missingValue
) {
  if (value == null || !Number.isFinite(Number(value))) return fallback;

  const numeric = Number(value);
  if (numeric >= 1_000) {
    return `${compactFormatter.format(numeric)}+`;
  }

  return formatter.format(numeric);
}

export function formatFullNumber(value, fallback = getResolvedContent().shared.missingValue) {
  if (value == null || Number.isNaN(Number(value))) return fallback;
  return formatter.format(Number(value));
}

export function slugify(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getGameImage(game, gameImages = []) {
  const imageRecord = gameImages?.find((image) => image.id === game.universeId);
  return imageRecord?.media?.[0]?.imageUrl || "";
}

export function getGameUrl(game) {
  if (!game?.rootPlaceId) return "https://www.roblox.com/games";
  return `https://www.roblox.com/games/${game.rootPlaceId}/${slugify(game.name)}`;
}

export function getPrimaryGroup(groupData = []) {
  const groups = Array.isArray(groupData) ? groupData : [];
  return [...groups].sort(
    (a, b) => (b.groupDetails?.memberCount || 0) - (a.groupDetails?.memberCount || 0)
  )[0];
}

export function getPrimaryGroupUrl(groupData = []) {
  const primaryGroup = getPrimaryGroup(groupData);
  return primaryGroup?.id ? `https://www.roblox.com/groups/${primaryGroup.id}` : GROUP_URL;
}

export function isMainCatalogGame(game) {
  return game?.isFeatured !== false;
}

export function splitCatalogGames(games = [], visibleLimit = Infinity) {
  const catalogGames = Array.isArray(games) ? games : [];
  const visibleGames = catalogGames
    .filter(isMainCatalogGame)
    .slice(0, visibleLimit);
  const visibleUniverseIds = new Set(visibleGames.map((game) => game.universeId));

  return {
    visibleGames,
    hiddenGames: catalogGames.filter(
      (game) => !visibleUniverseIds.has(game.universeId)
    ),
  };
}

export function getLandingMetricValues({
  totalData,
  gameData,
  siteContent = content,
}) {
  const { stats } = getResolvedContent(siteContent);
  const fallback = stats.fallbacks;
  const games = Array.isArray(gameData) ? gameData : [];
  const totalPlaying =
    totalData?.totalPlaying != null
      ? totalData.totalPlaying
      : games.reduce((sum, game) => sum + (game?.playing || 0), 0);

  return {
    totalVisits: formatCompactNumber(totalData?.totalVisits, fallback.totalVisits),
    totalMembers: formatCompactNumber(totalData?.totalMembers, fallback.totalMembers),
    mediaViews: fallback.mediaViews,
    activePlayers: formatCompactNumber(totalPlaying, fallback.activePlayers),
  };
}

export function getDisplayStats({ totalData, gameData, siteContent = content }) {
  const { stats } = getResolvedContent(siteContent);
  const statCards = stats.cards;
  const metricValues = getLandingMetricValues({ totalData, gameData, siteContent });

  return [
    {
      key: "totalVisits",
      value: metricValues.totalVisits,
      label: statCards.totalVisits.label,
      sub: statCards.totalVisits.sub,
    },
    {
      key: "totalMembers",
      value: metricValues.totalMembers,
      label: statCards.totalMembers.label,
      sub: statCards.totalMembers.sub,
    },
    {
      key: "activePlayers",
      value: metricValues.activePlayers,
      label: statCards.activePlayers.label,
      sub: statCards.activePlayers.sub,
    },
    {
      key: "mediaViews",
      value: metricValues.mediaViews,
      label: statCards.mediaViews.label,
      sub: statCards.mediaViews.sub,
    },
  ];
}

export function getResolvedMediaCards({
  totalData,
  gameData,
  siteContent = content,
}) {
  const metricValues = getLandingMetricValues({ totalData, gameData, siteContent });

  return (siteContent.social.mediaCards || []).map((card) => ({
    ...card,
    headline: card.metricKey ? metricValues[card.metricKey] ?? card.headline : card.headline,
  }));
}

export function getCatalogGames(gameData = [], gameImages = [], siteContent = content) {
  const { shared } = getResolvedContent(siteContent);
  const games = Array.isArray(gameData) ? gameData : [];

  return [...games]
    .sort((a, b) => {
      if (isMainCatalogGame(a) !== isMainCatalogGame(b)) {
        return Number(isMainCatalogGame(b)) - Number(isMainCatalogGame(a));
      }
      if ((a.displayOrder || 0) !== (b.displayOrder || 0)) {
        return (b.displayOrder || 0) - (a.displayOrder || 0);
      }
      if ((a.playing || 0) !== (b.playing || 0)) {
        return (b.playing || 0) - (a.playing || 0);
      }
      return (b.visits || 0) - (a.visits || 0);
    })
    .map((game, index) => ({
      ...game,
      image: getGameImage(game, gameImages),
      url: getGameUrl(game),
      heroCard: index === 0,
      playingLabel: formatFullNumber(game.playing, shared.zeroValue),
      playingCompactLabel: formatCompactNumber(game.playing, shared.zeroValue),
      visitsLabel: formatFullNumber(game.visits, shared.zeroValue),
      visitsCompactLabel: formatCompactNumber(game.visits, shared.zeroValue),
    }));
}

export function getPublicSiteTopTitles(
  gameData = [],
  gameImages = [],
  siteContent = content
) {
  return getCatalogGames(gameData, gameImages, siteContent)
    .filter(isMainCatalogGame)
    .slice(0, 5)
    .map((game) => ({ ...game, heroCard: false }));
}

export function getPublicSiteHomePageData({
  gameData,
  groupData,
  totalData,
  gameImages,
  siteContent = content,
}) {
  const catalogGames = getCatalogGames(gameData, gameImages, siteContent);

  return {
    games: getPublicSiteTopTitles(gameData, gameImages, siteContent),
    totalGames: catalogGames.length,
    stats: getDisplayStats({ totalData, gameData, siteContent }),
    mediaCards: getResolvedMediaCards({ totalData, gameData, siteContent }),
    groupUrl: getPrimaryGroupUrl(groupData),
  };
}

export function getPublicSiteGamesPageData({
  gameData,
  groupData,
  gameImages,
  siteContent = content,
}) {
  const games = getCatalogGames(gameData, gameImages, siteContent).map((game) => ({
    ...game,
    heroCard: false,
  }));

  return {
    games,
    groupUrl: getPrimaryGroupUrl(groupData),
  };
}
