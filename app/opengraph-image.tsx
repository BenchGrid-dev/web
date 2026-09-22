import { ImageResponse } from "next/og";
export const alt = "BenchGrid — Open-model deployment intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#fafafa", padding: "64px 72px", color: "#18181b", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", fontSize: 36, fontWeight: 700 }}><svg width="42" height="42" viewBox="0 0 40 40" style={{ marginRight: 14 }}><rect width="40" height="40" rx="11" fill="#ea580c"/><g fill="#ffffff"><rect x="9" y="9" width="9" height="9" rx="1.5"/><rect x="22" y="9" width="9" height="9" rx="1.5"/><rect x="9" y="22" width="9" height="9" rx="1.5"/><rect x="22" y="22" width="9" height="9" rx="1.5" opacity=".45"/></g></svg>benchgrid.</div>
      <div style={{ display: "flex", flexDirection: "column" }}><div style={{ display: "flex", flexDirection: "column", fontSize: 66, fontWeight: 700, letterSpacing: -3, lineHeight: 1.1, maxWidth: 1000 }}><span>Know what it takes</span><span>to run a model.</span></div><div style={{ marginTop: 28, color: "#71717a", fontSize: 28 }}>Model specs. GPU memory. Deployment field notes.</div></div>
      <div style={{ display: "flex", borderTop: "1px solid #e4e4e7", paddingTop: 24, justifyContent: "space-between", fontSize: 20, color: "#71717a" }}><span>Independent. Sourced. Transparent.</span><span style={{ color: "#c2410c" }}>benchgrid.dev</span></div>
    </div>, size,
  );
}
