import { Bebas_Neue, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "../globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "block",
  variable: "--font-bebas",
});

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata = {
  title: "Glazing Gorilla Games",
  description:
    "Glazing Gorillas is a Roblox game studio creating original titles, live experiences, and brand collaborations inside one of gaming’s biggest platforms.",
};

export default function PublicRootLayout({ children }) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable} ${mono.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
