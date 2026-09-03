import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

import { clonePublicSiteContractContent } from "@/features/publicSite/content/publicSiteContractContent.js";
import { getPublicSiteChromeState } from "@/lib/publicSite/state.js";

export const alt = "Glazing Gorilla Games — Roblox game studio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const revalidate = 3600;

const FONT_DIR = path.join(process.cwd(), "src/assets/fonts");

const COLORS = {
  accent: "#e2484a",
  bg: "#090909",
  border: "rgba(255, 255, 255, 0.18)",
  muted: "rgba(240, 237, 232, 0.6)",
  text: "#f0ede8",
};

async function loadFonts() {
  const [bebas, inter] = await Promise.all([
    readFile(path.join(FONT_DIR, "BebasNeue-Regular.ttf")),
    readFile(path.join(FONT_DIR, "Inter-Regular-latin.ttf")),
  ]);

  return [
    { name: "Bebas Neue", data: bebas, weight: 400, style: "normal" },
    { name: "Inter", data: inter, weight: 400, style: "normal" },
  ];
}

async function loadHeroContent() {
  try {
    const { contract, mediaAssets } = await getPublicSiteChromeState();
    return {
      hero: contract.siteContent.hero,
      keyArtUrl: mediaAssets.heroKeyArt.url,
    };
  } catch {
    return { hero: clonePublicSiteContractContent().hero, keyArtUrl: "" };
  }
}

async function loadKeyArtDataUri(url) {
  if (!url) {
    return null;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const mimeType = response.headers.get("content-type")?.split(";")[0] || "image/png";
    const base64 = Buffer.from(await response.arrayBuffer()).toString("base64");
    return `data:${mimeType};base64,${base64}`;
  } catch {
    return null;
  }
}

const buttonStyle = {
  alignItems: "center",
  display: "flex",
  fontFamily: "Inter",
  fontSize: 15,
  letterSpacing: "0.07em",
  lineHeight: 1,
  padding: "16px 30px",
  textTransform: "uppercase",
  WebkitTextStroke: "0.5px currentColor",
};

export default async function OpenGraphImage() {
  const [fonts, { hero, keyArtUrl }] = await Promise.all([loadFonts(), loadHeroContent()]);
  const keyArt = await loadKeyArtDataUri(keyArtUrl);
  const titleLines = hero.titleLines?.length ? hero.titleLines : ["Glazing", "Gorilla", "Games"];

  return new ImageResponse(
    <div
      style={{
        background: COLORS.bg,
        color: COLORS.text,
        display: "flex",
        height: "100%",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background:
            "radial-gradient(circle at 68% 35%, rgba(92, 22, 22, 0.55) 0%, rgba(9, 9, 9, 0) 45%)",
          display: "flex",
          height: "100%",
          left: 0,
          position: "absolute",
          top: 0,
          width: "100%",
        }}
      />

      {keyArt ? (
        <img
          alt=""
          src={keyArt}
          style={{
            filter: "saturate(0.75)",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: 0.55,
            position: "absolute",
            right: 0,
            top: 0,
            width: "65%",
          }}
        />
      ) : null}

      <div
        style={{
          background:
            "linear-gradient(to right, rgba(9, 9, 9, 1) 0%, rgba(9, 9, 9, 0.98) 35%, rgba(9, 9, 9, 0.7) 50%, rgba(9, 9, 9, 0) 70%)",
          display: "flex",
          height: "100%",
          left: 0,
          position: "absolute",
          top: 0,
          width: "100%",
        }}
      />
      <div
        style={{
          background: "linear-gradient(to top, rgba(9, 9, 9, 1) 0%, rgba(9, 9, 9, 0) 40%)",
          display: "flex",
          height: "100%",
          left: 0,
          position: "absolute",
          top: 0,
          width: "100%",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "0 72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Bebas Neue",
            fontSize: 116,
            letterSpacing: "0.01em",
            lineHeight: 0.88,
            textTransform: "uppercase",
            WebkitTextStroke: "2.5px currentColor",
          }}
        >
          {titleLines.map((line, index) => (
            <span
              key={`${index}-${line}`}
              style={{
                color: index === titleLines.length - 1 ? COLORS.accent : COLORS.text,
              }}
            >
              {line}
            </span>
          ))}
        </div>

        <div
          style={{
            color: COLORS.muted,
            display: "flex",
            fontFamily: "Inter",
            fontSize: 21,
            lineHeight: 1.55,
            marginTop: 30,
            maxWidth: 620,
          }}
        >
          {hero.body}
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 36 }}>
          <div style={{ ...buttonStyle, background: COLORS.accent, color: "#ffffff" }}>
            {hero.primaryCtaLabel}
          </div>
          <div
            style={{
              ...buttonStyle,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text,
            }}
          >
            {hero.secondaryCtaLabel}
          </div>
        </div>
      </div>
    </div>,
    { ...size, fonts },
  );
}
