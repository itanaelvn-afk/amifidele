import { ImageResponse } from "next/og";

export const alt = "AmiFidele — comparateur de produits pour animaux";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          background: "linear-gradient(135deg, #FFF8F0 0%, #FFCCBC 45%, #FFE0B2 100%)",
          color: "#3E2723",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 999,
              background: "rgba(255, 138, 101, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
            }}
          >
            🐾
          </div>
          <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -1 }}>
            AmiFidele
          </div>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#6D4C41",
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          Comparez les meilleurs produits pour vos compagnons
        </div>
      </div>
    ),
    { ...size }
  );
}
