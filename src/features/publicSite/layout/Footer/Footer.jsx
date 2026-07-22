"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { SiInstagram, SiRoblox, SiTiktok, SiX, SiYoutube } from "react-icons/si";

import BrandLogo from "../../shared/BrandLogo/BrandLogo.jsx";
import PageContainer from "../../ui/PageContainer.jsx";

const SOCIAL_ICONS = {
  x: SiX,
  tiktok: SiTiktok,
  youtube: SiYoutube,
  instagram: SiInstagram,
};

const iconButtonClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-ggg-panel-strong text-ggg-text transition-colors hover:bg-ggg-accent hover:text-white";

const navLinkClass =
  "font-mono text-[12px] font-bold uppercase tracking-[0.22em] text-ggg-text transition-colors hover:text-ggg-accent";

const Footer = ({ brandLogoUrl, footer, groupUrl, media, site }) => (
  <PageContainer
    as="footer"
    className="border-t border-ggg-border pb-20 pt-12 text-center"
  >
    <div className="flex flex-wrap items-center justify-center gap-3">
      {media.links.map(link => {
        const Icon = SOCIAL_ICONS[link.id];
        if (!Icon) return null;
        return (
          <a
            key={link.id}
            aria-label={link.platform}
            className={iconButtonClass}
            href={link.href}
            rel="noopener noreferrer"
            target="_blank"
            onClick={() => posthog.capture("social_link_clicked", { platform: link.platform, href: link.href })}
          >
            <Icon className="h-[17px] w-[17px]" />
          </a>
        );
      })}
      <a
        aria-label={footer.links.group}
        className={iconButtonClass}
        href={groupUrl}
        rel="noopener noreferrer"
        target="_blank"
        onClick={() => posthog.capture("social_link_clicked", { platform: "roblox", href: groupUrl })}
      >
        <SiRoblox className="h-[17px] w-[17px]" />
      </a>
    </div>

    <Link
      className="mt-12 inline-flex items-center gap-3 text-ggg-text no-underline"
      href="/"
    >
      <BrandLogo src={brandLogoUrl} variant="footer" />
      <span className="font-bebas text-2xl font-normal uppercase leading-none tracking-[0.12em] [font-synthesis:none]">
        {site.name}
      </span>
    </Link>

    <p className="mx-auto mt-4 max-w-[560px] text-ggg-body-xs leading-[1.7] text-ggg-muted">
      © {new Date().getFullYear()} {site.name}. {footer.copyrightTemplate}
    </p>

    <nav className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
      <Link className={navLinkClass} href="/games">
        {footer.links.games}
      </Link>
      <Link className={navLinkClass} href="/#studio">
        {footer.links.about}
      </Link>
      <Link className={navLinkClass} href="/#contact">
        {footer.links.contactSection}
      </Link>
    </nav>
  </PageContainer>
);

export default Footer;
