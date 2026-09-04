import { describe, expect, it } from "vitest";

import {
  formatCompactNumber,
  getPublicSiteGamesPageData,
  getPublicSiteTopTitles,
  splitCatalogGames,
} from "../../src/features/publicSite/data/publicSiteData.js";

const game = (universeId, overrides = {}) => ({
  universeId,
  name: `Game ${universeId}`,
  visits: 0,
  ...overrides,
});

describe("public site game curation", () => {
  it("sorts active but unfeatured games behind the primary catalog", () => {
    const result = getPublicSiteGamesPageData({
      gameData: [
        game(1, { visits: 1_000_000, isFeatured: false }),
        game(2, { visits: 100, isFeatured: true }),
        game(3, { visits: 50 }),
      ],
    });

    expect(result.games.map(({ universeId }) => universeId)).toEqual([2, 3, 1]);
  });

  it("keeps unfeatured games in the Games page data for the More Games tile", () => {
    const result = getPublicSiteGamesPageData({
      gameData: [game(1, { isFeatured: false }), game(2)],
    });

    expect(result.games).toHaveLength(2);
    expect(result.games.at(-1).universeId).toBe(1);
  });

  it("keeps every unfeatured game in overflow even when the primary list has room", () => {
    const { visibleGames, hiddenGames } = splitCatalogGames(
      [game(1), game(2, { isFeatured: false }), game(3, { isFeatured: false })],
      2
    );

    expect(visibleGames.map(({ universeId }) => universeId)).toEqual([1]);
    expect(hiddenGames.map(({ universeId }) => universeId)).toEqual([2, 3]);
  });

  it("ranks games by live players before lifetime visits", () => {
    const result = getPublicSiteGamesPageData({
      gameData: [
        game(1, { visits: 1_000_000, playing: 5 }),
        game(2, { visits: 100, playing: 500 }),
        game(3, { visits: 5_000, playing: 5 }),
      ],
    });

    expect(result.games.map(({ universeId }) => universeId)).toEqual([2, 1, 3]);
  });

  it("keeps displayOrder pins above the live ranking", () => {
    const result = getPublicSiteGamesPageData({
      gameData: [game(1, { playing: 900 }), game(2, { playing: 1, displayOrder: 1 })],
    });

    expect(result.games.map(({ universeId }) => universeId)).toEqual([2, 1]);
  });

  it("formats live player counts for game cards", () => {
    const [first] = getPublicSiteGamesPageData({
      gameData: [game(1, { playing: 15_622 })],
    }).games;

    expect(first.playingCompactLabel).toBe("15.6K+");
    expect(first.playingLabel).toBe("15,622");
  });

  it("does not place unfeatured games in the home page Top Titles showcase", () => {
    const result = getPublicSiteTopTitles([
      game(1, { visits: 1_000_000, isFeatured: false }),
      game(2, { visits: 100 }),
    ]);

    expect(result.map(({ universeId }) => universeId)).toEqual([2]);
  });
});

describe("compact public metrics", () => {
  it("uses one decimal of precision for large totals", () => {
    expect(formatCompactNumber(97_180_432)).toBe("97.2M+");
    expect(formatCompactNumber(4_418)).toBe("4.4K+");
    expect(formatCompactNumber(1_293_370)).toBe("1.3M+");
  });

  it("keeps values below one thousand unabridged", () => {
    expect(formatCompactNumber(999)).toBe("999");
  });
});
