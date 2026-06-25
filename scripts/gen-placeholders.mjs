// Ürün görselleri için basit SVG yer tutucular üretir.
// Gerçek ürün fotoğraflarınızı /public/products/ klasörüne koyup
// admin panelden görsel URL'sini güncelleyebilirsiniz.
import { promises as fs } from "fs";
import path from "path";

const root = process.cwd();
const products = JSON.parse(
  await fs.readFile(path.join(root, "data/products.json"), "utf-8"),
);
const outDir = path.join(root, "public/products");
await fs.mkdir(outDir, { recursive: true });

const palette = {
  "muayene-eldivenleri": ["#0d9488", "#134e4a"],
  "cerrahi-eldivenler": ["#0ea5e9", "#075985"],
  "maske-yuz-koruma": ["#6366f1", "#3730a3"],
  "dezenfektan-hijyen": ["#10b981", "#065f46"],
  "tibbi-sarf": ["#f59e0b", "#92400e"],
  "koruyucu-ekipman": ["#ef4444", "#991b1b"],
};

function escapeXml(s) {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]);
}

function wrap(text, max = 18) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max) {
      if (line) lines.push(line.trim());
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
  }
  if (line) lines.push(line.trim());
  return lines.slice(0, 4);
}

function svg(name, colors) {
  const [c1, c2] = colors;
  const lines = wrap(name);
  const startY = 300 - (lines.length - 1) * 16;
  const tspans = lines
    .map(
      (l, i) =>
        `<tspan x="300" y="${startY + i * 32}">${escapeXml(l)}</tspan>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#g)"/>
  <circle cx="300" cy="200" r="90" fill="rgba(255,255,255,0.18)"/>
  <text x="300" y="225" text-anchor="middle" font-size="90" fill="#ffffff">+</text>
  <text text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#ffffff">${tspans}</text>
</svg>
`;
}

for (const p of products) {
  const file = path.basename(p.image);
  const colors = palette[p.category] || ["#0d9488", "#134e4a"];
  await fs.writeFile(path.join(outDir, file), svg(p.name, colors), "utf-8");
}

// Varsayılan yer tutucu
await fs.writeFile(
  path.join(outDir, "placeholder.svg"),
  svg("Ürün Görseli", ["#64748b", "#334155"]),
  "utf-8",
);

console.log(`${products.length + 1} adet yer tutucu görsel oluşturuldu.`);
