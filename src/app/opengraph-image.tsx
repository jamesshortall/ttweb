import { ImageResponse } from "next/og";

export const alt = "Travel Technician — Turn your points into unforgettable travel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social-sharing image, generated at build time (no binary asset). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0f2b36 0%, #206072 55%, #2392a5 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "#79ced8",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 9999,
              background: "#f95d17",
              display: "flex",
            }}
          />
          TRAVEL TECHNICIAN
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 980,
          }}
        >
          Turn your points into unforgettable travel.
        </div>
        <div style={{ marginTop: 32, fontSize: 32, color: "#d5f2f4", maxWidth: 900 }}>
          Points &amp; miles education · Personal strategy · Free CardMaster tracker
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 18,
            background: "#f95d17",
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}
