"use client";

import Link from "next/link";
import posthog from "posthog-js";

import FadeIn from "../../shared/FadeIn/FadeIn.jsx";
import Parallax from "../../shared/Parallax/Parallax.jsx";
import SplitText from "../../shared/SplitText/SplitText.jsx";
import Button from "../../ui/Button.jsx";
import PageContainer from "../../ui/PageContainer.jsx";

const Hero = ({ hero, heroKeyArtUrl }) => {
  const secondaryHref = hero.secondaryCtaHref || "#contact";
  const isExternalSecondary = secondaryHref.startsWith("http");

  return (
    <section
      id="hero"
      className="relative flex flex-col overflow-hidden pb-20 pt-[120px] max-sm:min-h-screen max-sm:justify-end max-sm:pb-10 max-sm:pt-[60px] lg:landscape:min-h-screen lg:landscape:justify-end lg:landscape:pb-[72px] lg:landscape:pt-[60px]"
    >
      <Parallax
        speed={0.12}
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_55%_at_65%_35%,oklch(18%_0.09_24_/_0.55)_0%,transparent_65%),radial-gradient(ellipse_45%_45%_at_15%_75%,oklch(14%_0.06_200_/_0.22)_0%,transparent_60%)]"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
        <FadeIn variant="soft" immediate delay={150} className="absolute inset-0">
          <Parallax speed={0.4} className="absolute inset-0">
            <img
              className="absolute right-0 top-12 block h-full w-full max-w-none object-cover object-center opacity-30 saturate-75 [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.6)_15%,black_40%)] [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.6)_15%,black_40%)] lg:landscape:top-[60px] lg:landscape:w-[65%] lg:landscape:opacity-[0.42]"
              src={heroKeyArtUrl}
              alt=""
              decoding="async"
              loading="eager"
              fetchPriority="high"
            />
          </Parallax>
        </FadeIn>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(9,9,9,1)_0%,rgba(9,9,9,0.98)_35%,rgba(9,9,9,0.7)_50%,rgba(9,9,9,0)_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(9,9,9,1)_0%,transparent_40%)]" />
      </div>

      <PageContainer className="relative z-[3] flex flex-col items-start">
        <h1 className="mb-8 mt-2 font-bebas font-bold leading-[0.88] tracking-[0.01em] text-[clamp(84px,26vw,140px)] uppercase text-ggg-text [font-synthesis:weight_style] sm:mt-6 sm:text-ggg-hero lg:mb-8 lg:mt-10">
          <SplitText as="span" text={hero.titleLines[0]} immediate startDelay={250} stagger={60} />
          <br />
          <SplitText as="span" text={hero.titleLines[1]} immediate startDelay={550} stagger={60} />
          <br />
          <SplitText
            as="span"
            text={hero.titleLines[2]}
            className="text-ggg-accent"
            immediate
            startDelay={850}
            stagger={60}
          />
        </h1>

        <FadeIn
          as="p"
          immediate
          delay={1200}
          className="mb-10 max-w-[480px] font-inter text-[clamp(17px,1.55vw,19px)] font-normal leading-[1.55] text-ggg-muted sm:mb-10 xl:text-[clamp(15px,1.3vw,17px)] xl:leading-[1.7]"
        >
          {hero.body}
        </FadeIn>

        <FadeIn
          immediate
          delay={1450}
          className="mb-2 flex flex-wrap gap-3 sm:inline-grid sm:auto-cols-fr sm:grid-flow-col lg:mb-16"
        >
          <Button
            as={Link}
            href="/games"
            variant="primary"
            className="sm:w-full max-[640px]:py-[18px] max-[640px]:text-[15px] max-[400px]:px-4 max-[400px]:text-[13px]"
            onClick={() => posthog.capture("hero_cta_clicked", { cta: "primary", label: hero.primaryCtaLabel })}
          >
            {hero.primaryCtaLabel}
          </Button>
          <Button
            as="a"
            href={secondaryHref}
            {...(isExternalSecondary
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            variant="ghost"
            className="sm:w-full max-[640px]:py-[18px] max-[640px]:text-[15px] max-[400px]:px-4 max-[400px]:text-[13px]"
            onClick={() => posthog.capture("hero_cta_clicked", { cta: "secondary", label: hero.secondaryCtaLabel })}
          >
            {hero.secondaryCtaLabel}
          </Button>
        </FadeIn>
      </PageContainer>
    </section>
  );
};

export default Hero;
