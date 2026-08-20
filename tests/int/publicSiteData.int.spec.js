import { describe, expect, it } from "vitest";

import {
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

  it("does not place unfeatured games in the home page Top Titles showcase", () => {
    const result = getPublicSiteTopTitles([
      game(1, { visits: 1_000_000, isFeatured: false }),
      game(2, { visits: 100 }),
    ]);

    expect(result.map(({ universeId }) => universeId)).toEqual([2]);
  });
});
