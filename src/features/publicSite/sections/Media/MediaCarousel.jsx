"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Instagram,
} from "lucide-react";
import posthog from "posthog-js";

import { cn } from "../../../../lib/utils.js";

const slotClass = {
  center:
    "[transition-delay:0s,0s,0s,0s] z-[3] visible cursor-default opacity-100 [filter:brightness(1)] [transform:translateX(0)] xl:[transform:translate3d(0,0,0)_scale(1)]",
  left:
    "[transition-delay:0s,0s,0s,450ms] z-[1] invisible pointer-events-none cursor-pointer opacity-0 [filter:brightness(0.84)_saturate(0.96)] [transform:translateX(-100%)] hover:opacity-[0.96] hover:[filter:brightness(0.9)_saturate(0.96)] xl:visible xl:pointer-events-auto xl:opacity-90 xl:[transform:translate3d(calc(-1_*_clamp(180px,31vw,340px)),0,-96px)_scale(0.88)]",
  right:
    "[transition-delay:0s,0s,0s,450ms] z-[1] invisible pointer-events-none cursor-pointer opacity-0 [filter:brightness(0.84)_saturate(0.96)] [transform:translateX(100%)] hover:opacity-[0.96] hover:[filter:brightness(0.9)_saturate(0.96)] xl:visible xl:pointer-events-auto xl:opacity-90 xl:[transform:translate3d(clamp(180px,31vw,340px),0,-96px)_scale(0.88)]",
};

const centerCardShadow =
  "shadow-[0_28px_56px_rgba(0,0,0,0.58),0_0_0_1px_rgba(255,255,255,0.09),inset_0_1px_0_rgba(255,255,255,0.07)]";
const sideCardShadow =
  "shadow-[0_20px_40px_rgba(0,0,0,0.48),0_0_0_1px_rgba(255,255,255,0.06)]";

const navButtonClass =
  "inline-flex size-10 items-center justify-center rounded-full border border-white/[0.14] bg-[rgba(14,14,14,0.94)] p-0 text-[#f5f3ef] shadow-[0_6px_28px_rgba(0,0,0,0.55)] transition-[border-color,background,color,box-shadow,transform] duration-200 ease-out hover:scale-[1.04] hover:border-white/[0.22] hover:bg-[rgba(26,26,26,0.98)] hover:text-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ggg-accent sm:size-12";

function MediaNavButton({ direction, onClick, label }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button type="button" className={navButtonClass} aria-label={label} onClick={onClick}>
      <Icon size={24} strokeWidth={2} aria-hidden />
    </button>
  );
}

function slideSlot(index, active, len) {
  const delta = ((index - active + len) % len + len) % len;
  if (delta === 0) return "center";
  if (delta === 1) return "right";
  return "left";
}

function MediaLoopVideo({ src, caption, isActive }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const tryPlay = () => {
      if (!isActive) return;
      element.muted = true;
      element.play().catch(() => {});
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !isActive) {
          element.pause();
          return;
        }
        tryPlay();
      },
      { threshold: 0.12, rootMargin: "48px" },
    );

    observer.observe(element);

    if (!isActive) element.pause();
    else tryPlay();

    return () => observer.disconnect();
  }, [isActive, src]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 block h-full w-full object-cover object-top"
      src={src}
      muted
      playsInline
      loop
      preload="metadata"
      tabIndex={-1}
      aria-label={caption}
    />
  );
}

function MediaPanel({ card, isActive, className }) {
  const hasOverlay = Boolean(card.mediaOverlay?.primary);

  return (
    <div className={cn("flex min-w-0 flex-col justify-center", className)}>
      <div className="relative m-0 aspect-[8/9] w-full overflow-hidden rounded-ggg-lg bg-[#0a0a0a] shadow-[0_18px_38px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06)] sm:aspect-[9/16] sm:max-h-[390px]">
        {card.mediaType === "video" ? (
          <MediaLoopVideo src={card.mediaSrc} caption={card.mediaAlt} isActive={isActive} />
        ) : (
          <img
            className="absolute inset-0 block h-full w-full object-cover object-center"
            src={card.mediaSrc}
            alt={card.mediaAlt}
            loading="lazy"
            decoding="async"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.18)_100%)]" />
        {hasOverlay ? (
          <div className="absolute inset-x-0 bottom-0 z-[2] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.42)_100%)] px-3.5 pb-3 pt-[30px]">
            <div className="inline-flex max-w-full flex-col gap-0.5 rounded-[8px] bg-black/[0.18] px-2.5 py-1.5 backdrop-blur-[5px]">
              <div className="flex items-center gap-1.5">
                {card.mediaOverlay.icon === "instagram" ? (
                  <Instagram size={10} strokeWidth={1.8} aria-hidden className="shrink-0 text-white/[0.58]" />
                ) : null}
                <div className="truncate text-ggg-eyebrow font-semibold uppercase tracking-[0.1em] text-white/[0.72]">
                  {card.mediaOverlay.primary}
                </div>
              </div>
              {card.mediaOverlay.secondary ? (
                <div className="flex items-center gap-1.5 text-[10px] font-medium leading-[1.3] text-white/[0.5]">
                  <span>{card.mediaOverlay.secondary}</span>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const ctaClass =
  "inline-flex self-start items-center gap-2 rounded-none border border-[rgba(240,237,232,0.2)] bg-transparent px-5.5 py-[11px] text-xs font-bold uppercase tracking-[0.12em] text-ggg-text no-underline transition-[border-color,background] duration-200";

function MediaCta({ card, isActive, className }) {
  if (isActive) {
    return (
      <a
        className={cn(ctaClass, "hover:border-[rgba(240,237,232,0.5)] hover:bg-[rgba(240,237,232,0.05)]", className)}
        href={card.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => posthog.capture("media_cta_clicked", { cta_label: card.ctaLabel, cta_href: card.ctaHref, card_headline: card.headline })}
      >
        <span>{card.ctaLabel}</span>
        <ArrowUpRight size={16} strokeWidth={1.9} aria-hidden />
      </a>
    );
  }
  return (
    <span className={cn(ctaClass, "opacity-60 pointer-events-none", className)} aria-hidden>
      <span>{card.ctaLabel}</span>
      <ArrowUpRight size={16} strokeWidth={1.9} />
    </span>
  );
}

function MediaContent({ card }) {
  const mobileDescription = card.descriptionMobile;
  return (
    <aside className="flex min-w-0 flex-col items-stretch justify-start bg-transparent p-0 shadow-none sm:pt-2">
      <div className="mb-3 text-ggg-eyebrow font-bold uppercase text-ggg-accent">
        {card.eyebrow ?? card.subLabel}
      </div>
      <div className="mb-2 whitespace-pre-line font-bebas font-bold text-4xl leading-[0.88] text-ggg-text sm:text-5xl md:text-6xl lg:text-[84px] [font-synthesis:weight_style]">
        {card.headline}
      </div>
      <div className="mb-5 text-ggg-eyebrow font-bold uppercase text-ggg-dim">
        {card.subLabel}
      </div>
      {mobileDescription ? (
        <p className="max-w-[400px] text-sm font-normal leading-[1.65] text-ggg-muted sm:hidden">
          {mobileDescription}
        </p>
      ) : null}
      <p
        className={cn(
          "max-w-[400px] text-sm font-normal leading-[1.65] text-ggg-muted",
          mobileDescription && "hidden sm:block",
        )}
      >
        {card.description}
      </p>
    </aside>
  );
}

function MediaCardArticle({ card, isActive, isCenter }) {
  return (
    <article
      className={cn(
        "h-full w-full overflow-hidden rounded-[20px] border border-white/[0.08] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--ggg-bg)_88%,white)_0%,color-mix(in_oklab,var(--ggg-bg)_95%,white)_100%)] isolate transition-[border-color,box-shadow] duration-[350ms] [transition-timing-function:cubic-bezier(0.22,1,0.32,1)] hover:border-white/[0.14]",
        isCenter ? centerCardShadow : sideCardShadow,
      )}
    >
      <div className="grid grid-cols-1 items-stretch gap-5 p-5 sm:grid-cols-[200px_1fr] md:grid-cols-[260px_1fr] lg:grid-cols-[320px_1fr] lg:gap-7 lg:p-6 xl:grid-cols-[232px_1fr]">
        <MediaPanel
          card={card}
          isActive={isActive}
          className="order-2 sm:order-none"
        />
        <div className="order-1 flex min-w-0 flex-col sm:order-none">
          <MediaContent card={card} />
          <MediaCta
            card={card}
            isActive={isActive}
            className="mt-[30px] hidden sm:inline-flex"
          />
        </div>
        <MediaCta
          card={card}
          isActive={isActive}
          className="order-3 w-full justify-center sm:hidden"
        />
      </div>
    </article>
  );
}

function MediaCard({ card, slot, isActive, onActivate }) {
  const isSide = slot !== "center";

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[420px] sm:max-w-none xl:max-w-[660px] [grid-area:1/1] isolate transition-[transform,opacity,filter,visibility] duration-[550ms,450ms,450ms,0s] ease-[cubic-bezier(0.22,1,0.32,1),ease,ease,ease] will-change-transform xl:[transform-style:preserve-3d]",
        slotClass[slot],
      )}
      role={isSide ? "button" : undefined}
      tabIndex={isSide ? 0 : undefined}
      onClick={isSide ? onActivate : undefined}
      onKeyDown={
        isSide
          ? event => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onActivate();
              }
            }
          : undefined
      }
      aria-label={isSide ? `Show ${card.headline} card` : undefined}
    >
      <MediaCardArticle card={card} isActive={isActive} isCenter={slot === "center"} />
    </div>
  );
}

const MediaScrollCarousel = ({ cards, active, setActive, ref }) => {
  const trackRef = useRef(null);
  const programmaticRef = useRef(false);
  const programmaticTimerRef = useRef(null);

  const clearProgrammatic = useCallback(() => {
    programmaticRef.current = false;
    if (programmaticTimerRef.current) {
      clearTimeout(programmaticTimerRef.current);
      programmaticTimerRef.current = null;
    }
  }, []);

  const scrollToIndex = useCallback(nextIndex => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[nextIndex];
    if (!child) return;
    const target = child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2;
    if (Math.abs(el.scrollLeft - target) < 2) return;

    programmaticRef.current = true;
    el.scrollTo({ left: target, behavior: "smooth" });

    if (programmaticTimerRef.current) clearTimeout(programmaticTimerRef.current);
    programmaticTimerRef.current = setTimeout(clearProgrammatic, 600);
  }, [clearProgrammatic]);

  useImperativeHandle(ref, () => ({ scrollToIndex }), [scrollToIndex]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (programmaticRef.current) return;
        const center = el.scrollLeft + el.clientWidth / 2;
        let bestIndex = 0;
        let bestDist = Infinity;
        for (let i = 0; i < el.children.length; i += 1) {
          const c = el.children[i];
          const cCenter = c.offsetLeft + c.offsetWidth / 2;
          const dist = Math.abs(center - cCenter);
          if (dist < bestDist) {
            bestDist = dist;
            bestIndex = i;
          }
        }
        setActive(bestIndex);
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("scrollend", clearProgrammatic);
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", clearProgrammatic);
      cancelAnimationFrame(raf);
      if (programmaticTimerRef.current) clearTimeout(programmaticTimerRef.current);
    };
  }, [setActive, clearProgrammatic]);

  return (
    <div
      ref={trackRef}
      className="-mx-ggg flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-ggg pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="flex shrink-0 snap-center basis-[88%] sm:basis-[78%] md:basis-[68%] lg:basis-[58%]"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${cards.length}`}
          aria-hidden={index !== active ? "true" : undefined}
        >
          <MediaCardArticle card={card} isActive={index === active} isCenter />
        </div>
      ))}
    </div>
  );
};

const MediaLayeredScene = ({ cards, active, setActive }) => {
  const length = cards.length;
  return (
    <div className="relative mx-auto overflow-hidden pb-2 pt-1 [perspective:1280px] sm:pb-4 xl:overflow-visible">
      <div className="relative grid grid-cols-1 xl:[transform-style:preserve-3d]">
        {cards.map((card, index) => (
          <MediaCard
            key={card.id}
            card={card}
            slot={slideSlot(index, active, length)}
            isActive={index === active}
            onActivate={() => setActive(index)}
          />
        ))}
      </div>
    </div>
  );
};

const MediaCarouselIsland = ({ cards, media, heading }) => {
  const [active, setActive] = useState(0);
  const length = cards.length;
  const carouselRef = useRef(null);

  const go = useCallback(
    delta => {
      const next = (active + delta + length) % length;
      setActive(next);
      carouselRef.current?.scrollToIndex(next);
    },
    [active, length],
  );

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-6 sm:mb-6">
        {heading}
        <div className="flex items-center gap-3">
          <MediaNavButton direction="prev" label={media.previousAriaLabel} onClick={() => go(-1)} />
          <MediaNavButton direction="next" label={media.nextAriaLabel} onClick={() => go(1)} />
        </div>
      </div>

      <div className="pb-1.5" aria-roledescription="carousel" aria-labelledby="social-media-heading">
        <div className="sm:hidden">
          <MediaScrollCarousel ref={carouselRef} cards={cards} active={active} setActive={setActive} />
        </div>
        <div className="relative mx-auto hidden max-w-[min(1160px,100%)] sm:block">
          <MediaLayeredScene cards={cards} active={active} setActive={setActive} />
        </div>
      </div>
    </>
  );
};

export default MediaCarouselIsland;
