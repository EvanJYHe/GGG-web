"use client";

import posthog from "posthog-js";
import { cn } from "../../../../lib/utils.js";

import GameCardLiveBadge from "./GameCardLiveBadge.jsx";
import GameCardVisits from "./GameCardVisits.jsx";

const GameCardGrid = ({ game, gameCard }) => {
  return (
    <a
      className={cn(
        "group block min-w-0 overflow-hidden rounded-ggg-md border border-white/[0.06] bg-[#111] text-inherit no-underline transition-[transform,border-color,box-shadow] duration-[220ms] hover:-translate-y-1 hover:border-ggg-border-strong hover:shadow-[0_20px_56px_rgba(0,0,0,0.52)]",
      )}
      href={game.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => posthog.capture("game_card_clicked", { game_name: game.name, game_url: game.url, source: "games_grid" })}
    >
      <div className="relative aspect-square overflow-hidden bg-[#161616]">
        {game.image ? (
          <img
            className="block h-full w-full object-cover transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            src={game.image}
            alt={game.name}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.015)_0_1px,transparent_1px_18px)] px-3 text-center font-mono text-[10.5px] leading-[1.5] text-white/[0.18]">
            [ {game.name} {gameCard.artworkPlaceholderSuffix} ]
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_20%,rgba(0,0,0,0.08)_44%,rgba(0,0,0,0.48)_70%,rgba(0,0,0,0.94)_100%)]" />
        <div className="pointer-events-none absolute inset-0 z-[2] opacity-100 mix-blend-screen bg-[radial-gradient(circle_at_24%_18%,rgba(118,215,255,0.28)_0%,transparent_36%),radial-gradient(circle_at_82%_22%,rgba(255,140,128,0.14)_0%,transparent_32%),linear-gradient(180deg,rgba(89,112,255,0.18)_0%,rgba(46,59,118,0.08)_30%,transparent_54%,rgba(0,0,0,0.18)_100%)]" />

        <GameCardLiveBadge game={game} gameCard={gameCard} />

        <div className="absolute inset-x-0 bottom-0 z-[4] flex flex-col items-start gap-1.5 p-3.5 pb-4">
          <div className="line-clamp-2 text-ggg-body-sm font-extrabold leading-[1.16] tracking-[0.01em] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.95),0_0_1px_rgba(0,0,0,0.9)] sm:text-sm">
            {game.name}
          </div>

          <GameCardVisits game={game} gameCard={gameCard} className="sm:text-[11px]" />
        </div>
      </div>
    </a>
  );
};

export default GameCardGrid;
