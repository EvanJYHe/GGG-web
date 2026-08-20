import { getPublicSiteState } from "@/lib/publicSite/state.js";
import {
  formatCompactNumber,
  getPublicSiteGamesPageData,
  splitCatalogGames,
} from "../../data/publicSiteData.js";
import FadeIn from "../../shared/FadeIn/FadeIn.jsx";
import GameCardGrid from "../../shared/GameCard/GameCardGrid.jsx";
import MoreGamesCard from "../../shared/GameCard/MoreGamesCard.jsx";
import StateCard from "../../ui/StateCard.jsx";
import { GAMES_GALLERY_GRID_CLASS } from "./GamesGallerySkeleton.jsx";

// Reserve the final slot in a four-row desktop grid for the "more games" card.
const VISIBLE_GAME_LIMIT = 15;
const FADE_DELAY_STEP_MS = 60;
const FADE_DELAY_MAX_INDEX = 7;

const fadeDelay = (index) => Math.min(index, FADE_DELAY_MAX_INDEX) * FADE_DELAY_STEP_MS;

const sumHiddenVisits = (games) =>
  games.reduce((acc, game) => acc + (game.visits || 0), 0);

export default async function GamesGrid() {
  const state = await getPublicSiteState();
  const { siteContent } = state.contract;
  const pageData = getPublicSiteGamesPageData({
    gameData: state.contract.catalog.games,
    groupData: state.contract.catalog.groups,
    gameImages: state.contract.assets.games,
    siteContent,
  });

  if (!pageData.games.length) {
    return <StateCard>{siteContent.gamesPage.emptyMessage}</StateCard>;
  }

  const { visibleGames, hiddenGames } = splitCatalogGames(
    pageData.games,
    VISIBLE_GAME_LIMIT
  );
  const hiddenVisitsLabel = formatCompactNumber(sumHiddenVisits(hiddenGames));

  return (
    <>
      {state.contract.metrics.hasRuntimeData ? null : (
        <StateCard>{siteContent.topTitles.errorMessage}</StateCard>
      )}

      <div className={GAMES_GALLERY_GRID_CLASS} aria-labelledby="games-page-heading">
        {visibleGames.map((game, index) => (
          <FadeIn key={game.universeId} variant="pop" delay={fadeDelay(index)} immediate>
            <GameCardGrid game={game} gameCard={siteContent.gameCard} />
          </FadeIn>
        ))}

        {hiddenGames.length > 0 ? (
          <FadeIn variant="pop" delay={fadeDelay(visibleGames.length)} immediate>
            <MoreGamesCard
              count={hiddenGames.length}
              totalVisitsLabel={hiddenVisitsLabel}
              brandLogoUrl={state.mediaAssets.brandLogo.url}
              content={siteContent.gamesPage.moreCard}
            />
          </FadeIn>
        ) : null}
      </div>
    </>
  );
}
