import { ImageResponse } from "next/og";

export const alt = "Glazing Gorilla Games — Roblox game studio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "flex-start",
        background:
          "radial-gradient(circle at 75% 25%, rgba(238,76,76,0.36), transparent 42%), linear-gradient(135deg, #090909 0%, #151515 100%)",
        color: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        padding: "76px 88px",
        width: "100%",
      }}
    >
      <div
        style={{
          color: "#ee4c4c",
          display: "flex",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "0.18em",
          marginBottom: 28,
          textTransform: "uppercase",
        }}
      >
        Roblox Game Studio
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 92,
          fontWeight: 800,
          letterSpacing: "-0.035em",
          lineHeight: 0.92,
          textTransform: "uppercase",
        }}
      >
        <span>Glazing Gorilla</span>
        <span style={{ color: "#ee4c4c" }}>Games</span>
      </div>
      <div
        style={{
          color: "#b7b7b7",
          display: "flex",
          fontSize: 26,
          marginTop: 38,
          maxWidth: 820,
        }}
      >
        Original Roblox experiences, publishing, acquisitions, and brand integrations.
      </div>
    </div>,
    size,
  );
}
