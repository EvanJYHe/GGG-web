import { cn } from "../../../../lib/utils.js";

const GameCardVisits = ({ game, gameCard, className }) => (
  <div
    className={cn(
      "inline-flex items-center gap-[5px] whitespace-nowrap text-[10.5px] font-semibold text-white/[0.86] [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]",
      className,
    )}
  >
    <span className="h-0 w-0 border-b-[3px] border-l-[5px] border-t-[3px] border-b-transparent border-l-ggg-accent border-t-transparent drop-shadow-[0_0_6px_rgba(255,112,86,0.45)]" />
    <span className="font-extrabold text-white">{game.visitsCompactLabel ?? game.visitsLabel}</span>
    <span className="text-white/[0.76]">{gameCard.visitsUnitLabel}</span>
  </div>
);

export default GameCardVisits;
