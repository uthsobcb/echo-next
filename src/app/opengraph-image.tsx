import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "Echo — Journal Effortlessly";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/assets/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", height: 8, width: "100%", background: "linear-gradient(90deg, #3b82f6 0%, #10b981 100%)" }} />

        <div style={{ display: "flex", flex: 1 }}>
          {/* Left: copy */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              background: "white",
              padding: "0 64px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
              <img src={logoSrc} width={32} height={32} />
              <div style={{ display: "flex", fontSize: 22, fontWeight: 700, color: "#111827", marginLeft: 10 }}>
                Echo
              </div>
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontWeight: 600,
                color: "#059669",
                background: "#ecfdf5",
                padding: "8px 20px",
                borderRadius: 999,
                marginBottom: 28,
              }}
            >
              AI-Powered Journaling
            </div>

            <div
              style={{
                display: "flex",
                width: 540,
                fontSize: 54,
                fontWeight: 800,
                lineHeight: 1.15,
                color: "#111827",
                letterSpacing: -1,
              }}
            >
              Echo — Journal Effortlessly, Reflect &amp; Grow
            </div>

            <div style={{ display: "flex", width: 480, fontSize: 21, color: "#6b7280", lineHeight: 1.5, marginTop: 22 }}>
              Echo is your AI journaling companion: mood tracking, reflective prompts, and insights to build a lasting habit.
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 20,
                fontWeight: 600,
                color: "white",
                background: "#2563eb",
                padding: "16px 36px",
                borderRadius: 10,
                marginTop: 36,
              }}
            >
              Start Free
            </div>
          </div>

          {/* Right: product card */}
          <div
            style={{
              display: "flex",
              position: "relative",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              background: "#f3f4f6",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", position: "absolute", width: 300, height: 300, borderRadius: 150, background: "rgba(79,70,229,0.10)", top: 30, right: 40 }} />
            <div style={{ display: "flex", position: "absolute", width: 220, height: 220, borderRadius: 110, background: "rgba(16,185,129,0.12)", bottom: 40, left: 30 }} />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 420,
                padding: "48px 40px",
                borderRadius: 28,
                background: "linear-gradient(160deg, #4f46e5 0%, #4338ca 60%, #312e81 100%)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  background: "white",
                  marginBottom: 24,
                }}
              >
                <img src={logoSrc} width={56} height={56} />
              </div>
              <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "white" }}>Echo</div>
              <div style={{ display: "flex", fontSize: 20, color: "rgba(255,255,255,0.85)", marginTop: 8, textAlign: "center" }}>
                Journal Effortlessly. Reflect. Grow.
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#4f46e5",
                  background: "white",
                  padding: "14px 32px",
                  borderRadius: 999,
                  marginTop: 28,
                }}
              >
                Start journaling free →
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
