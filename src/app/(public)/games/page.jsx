import GamesGrid from "@/features/publicSite/routes/games/GamesGrid.jsx";
import GamesShell from "@/features/publicSite/routes/games/GamesShell.jsx";
import { getPrimaryGroupUrl } from "@/features/publicSite/data/publicSiteData.js";
import { getPublicSiteChromeState } from "@/lib/publicSite/state.js";
import { createPageMetadata } from "@/lib/site.js";

export const metadata = createPageMetadata({
  title: "Games",
  description:
    "Browse active Roblox experiences from Glazing Gorilla Games with current visits and player activity.",
  path: "/games",
});

export const revalidate = 30;

export default async function Page() {
  const chrome = await getPublicSiteChromeState();
  const groupUrl = getPrimaryGroupUrl(chrome.contract.catalog.groups);

  return (
    <GamesShell
      groupUrl={groupUrl}
      mediaAssets={chrome.mediaAssets}
      siteContent={chrome.contract.siteContent}
    >
      <GamesGrid />
    </GamesShell>
  );
}
