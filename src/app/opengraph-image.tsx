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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <img src={logoSrc} width={140} height={140} style={{ borderRadius: 32 }} />
        <div style={{ display: "flex", fontSize: 88, fontWeight: 700, marginTop: 32 }}>
          Echo
        </div>
        <div style={{ display: "flex", fontSize: 34, opacity: 0.85, marginTop: 12 }}>
          Journal Effortlessly. Reflect. Grow.
        </div>
      </div>
    ),
    { ...size }
  );
}
