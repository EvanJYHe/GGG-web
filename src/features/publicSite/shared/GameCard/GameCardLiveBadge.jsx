import { cn } from "../../../../lib/utils.js";

const GameCardLiveBadge = ({ game, gameCard, className }) => {
  if (!(game.playing > 0)) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute left-2 top-2 z-[4] inline-flex items-baseline gap-[4px] rounded bg-black/65 px-[7px] py-1 text-[10px] font-semibold leading-none text-white backdrop-blur-[2px]",
        className,
      )}
    >
      <span className="font-extrabold">{game.playingCompactLabel ?? game.playingLabel}</span>
      <span className="text-white/[0.65]">{gameCard.playingUnitLabel}</span>
    </div>
  );
};

export default GameCardLiveBadge;
