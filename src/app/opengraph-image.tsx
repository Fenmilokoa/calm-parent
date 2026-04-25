import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Calm Parent";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "hsl(45, 30%, 97%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "80px",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "hsl(152, 25%, 38%)",
            marginBottom: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "hsl(152, 35%, 55%)",
            }}
          />
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "hsl(25, 15%, 12%)",
            marginBottom: 20,
            letterSpacing: "-1px",
          }}
        >
          Calm Parent
        </div>
        <div
          style={{
            fontSize: 28,
            color: "hsl(30, 8%, 48%)",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Guidance for your hardest parenting moments
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 20,
            color: "hsl(152, 25%, 38%)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          calm-parent.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
