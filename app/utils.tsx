import React from "react";
import { AV_COLORS } from "./types";

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
export const today = () => new Date().toISOString().slice(0, 10);
export const isOv = (d: string) => !!(d && d < today());

export const fmtDate = (d: string) => {
  if (!d) return "";
  const [y, m, dd] = d.split("-");
  return `${dd}/${m}/${y.slice(2)}`;
};

export const avColor = (name: string) => {
  if (!name) return "#9ca3af";
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) % AV_COLORS.length;
  }
  return AV_COLORS[h];
};

export const avInitials = (name: string) => {
  return (name || "?").split(" ").map((w) => w[0] || "").slice(0, 2).join("").toUpperCase();
};

export const fmtTs = (ts: number) => {
  const d = new Date(ts);
  return (
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }) +
    " " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
};

// Common Avatar components
export const Avatar = ({ name, size = 20 }: { name: string; size?: number }) => {
  if (!name) {
    return <span style={{ width: size, height: size, borderRadius: "50%", background: "#e5e7eb", display: "inline-block", flexShrink: 0 }} />;
  }
  return (
    <span
      className="tc-av"
      style={{
        background: avColor(name),
        width: size,
        height: size,
        fontSize: Math.round(size * 0.42),
      }}
      title={name}
    >
      {avInitials(name)}
    </span>
  );
};
