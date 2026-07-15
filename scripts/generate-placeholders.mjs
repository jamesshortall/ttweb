/**
 * Generates the placeholder artwork committed under /public/images.
 *
 * All artwork is self-authored SVG (no external photos), so the repository is
 * fully self-contained and license-clean. Each file is meant to be REPLACED
 * with a real photograph before launch — see docs/IMAGES.md.
 *
 * Re-run with:  node scripts/generate-placeholders.mjs
 * Output is deterministic, so re-running never creates churn.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function write(relPath, content) {
  const target = join(root, "public", relPath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content.trim() + "\n");
  console.log(`wrote public/${relPath}`);
}

/** Scenic placeholder: layered tropical gradient with sun, sea and hills. */
function scene({ id, w = 1600, h = 1000, sky, sea, hill, sun, label }) {
  const horizon = h * 0.62;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label} (placeholder artwork)">
  <defs>
    <linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${sky[0]}"/>
      <stop offset="1" stop-color="${sky[1]}"/>
    </linearGradient>
    <linearGradient id="${id}-sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${sea[0]}"/>
      <stop offset="1" stop-color="${sea[1]}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${horizon}" fill="url(#${id}-sky)"/>
  <circle cx="${w * 0.72}" cy="${horizon * 0.55}" r="${h * 0.11}" fill="${sun}" opacity="0.9"/>
  <circle cx="${w * 0.72}" cy="${horizon * 0.55}" r="${h * 0.16}" fill="${sun}" opacity="0.25"/>
  <rect y="${horizon}" width="${w}" height="${h - horizon}" fill="url(#${id}-sea)"/>
  <path d="M0 ${horizon} C ${w * 0.2} ${horizon - h * 0.05}, ${w * 0.32} ${horizon - h * 0.16}, ${w * 0.5} ${horizon} Z" fill="${hill}" opacity="0.85"/>
  <path d="M${w * 0.55} ${horizon} C ${w * 0.7} ${horizon - h * 0.1}, ${w * 0.85} ${horizon - h * 0.07}, ${w} ${horizon - h * 0.02} L ${w} ${horizon} Z" fill="${hill}" opacity="0.6"/>
  <path d="M0 ${horizon + 40} q ${w * 0.125} 26 ${w * 0.25} 0 t ${w * 0.25} 0 t ${w * 0.25} 0 t ${w * 0.25} 0" stroke="#ffffff" stroke-width="6" fill="none" opacity="0.35"/>
  <path d="M0 ${horizon + 110} q ${w * 0.125} 26 ${w * 0.25} 0 t ${w * 0.25} 0 t ${w * 0.25} 0 t ${w * 0.25} 0" stroke="#ffffff" stroke-width="5" fill="none" opacity="0.22"/>
  <g font-family="Arial, Helvetica, sans-serif">
    <rect x="28" y="${h - 74}" rx="10" width="${Math.min(w - 56, label.length * 11.5 + 190)}" height="46" fill="#0f2b36" opacity="0.72"/>
    <text x="48" y="${h - 44}" font-size="21" fill="#ffffff">PLACEHOLDER · ${label}</text>
  </g>
</svg>`;
}

/** Wireframe app-screenshot placeholder for CardMaster. */
function appScreen({ title, rows, label }) {
  const w = 1440;
  const h = 900;
  const rowSvg = rows
    .map(
      (r, i) => `
    <g transform="translate(72, ${268 + i * 128})">
      <rect width="${w - 144}" height="104" rx="14" fill="#ffffff" stroke="#d5e7ea"/>
      <circle cx="52" cy="52" r="24" fill="${r.dot}"/>
      <rect x="100" y="30" width="${r.a}" height="16" rx="8" fill="#22505e"/>
      <rect x="100" y="58" width="${r.b}" height="12" rx="6" fill="#b0c8cd"/>
      <rect x="${w - 144 - 190}" y="36" width="150" height="30" rx="15" fill="#eefafb" stroke="#79ced8"/>
    </g>`,
    )
    .join("");
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label} (placeholder screenshot)">
  <rect width="${w}" height="${h}" fill="#f4fafb"/>
  <rect width="${w}" height="72" fill="#0f2b36"/>
  <circle cx="40" cy="36" r="9" fill="#f95d17"/>
  <circle cx="70" cy="36" r="9" fill="#ffd166"/>
  <circle cx="100" cy="36" r="9" fill="#35ac57"/>
  <rect x="150" y="22" width="360" height="28" rx="14" fill="#204450"/>
  <text x="72" y="152" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="bold" fill="#12333c">${title}</text>
  <rect x="72" y="180" width="420" height="14" rx="7" fill="#b0c8cd"/>
  ${rowSvg}
  <g font-family="Arial, Helvetica, sans-serif">
    <rect x="28" y="${h - 74}" rx="10" width="${Math.min(w - 56, label.length * 11.5 + 260)}" height="46" fill="#0f2b36" opacity="0.72"/>
    <text x="48" y="${h - 44}" font-size="21" fill="#ffffff">PLACEHOLDER SCREENSHOT · ${label}</text>
  </g>
</svg>`;
}

/** Portrait placeholder for Jim's photos. */
function portrait({ id, w, h, label, initials }) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label} (placeholder)">
  <defs>
    <linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#20768b"/>
      <stop offset="1" stop-color="#0f2b36"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#${id}-bg)"/>
  <circle cx="${w / 2}" cy="${h * 0.38}" r="${w * 0.19}" fill="#79ced8" opacity="0.9"/>
  <path d="M${w * 0.5} ${h * 0.56} c ${-w * 0.28} 0 ${-w * 0.34} ${h * 0.22} ${-w * 0.34} ${h * 0.34} l ${w * 0.68} 0 c 0 ${-h * 0.12} ${-w * 0.06} ${-h * 0.34} ${-w * 0.34} ${-h * 0.34} Z" fill="#79ced8" opacity="0.9"/>
  <text x="${w / 2}" y="${h * 0.42}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${w * 0.13}" font-weight="bold" fill="#0f2b36">${initials}</text>
  <g font-family="Arial, Helvetica, sans-serif">
    <rect x="20" y="${h - 66}" rx="10" width="${w - 40}" height="46" fill="#0f2b36" opacity="0.72"/>
    <text x="36" y="${h - 36}" font-size="19" fill="#ffffff">PLACEHOLDER · ${label}</text>
  </g>
</svg>`;
}

/** Brand logo placeholders (compass-rose glyph + wordmark). */
function logo({ variant }) {
  const glyph = (x, y, s, fg, accent) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <circle cx="32" cy="32" r="30" fill="none" stroke="${fg}" stroke-width="4"/>
    <path d="M32 8 L38 28 L58 32 L38 36 L32 56 L26 36 L6 32 L26 28 Z" fill="${accent}"/>
    <circle cx="32" cy="32" r="5" fill="${fg}"/>
  </g>`;
  const word = (x, y, size, fill) =>
    `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="${size}" fill="${fill}">TRAVEL TECHNICIAN</text>`;

  if (variant === "square") {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" role="img" aria-label="Travel Technician square logo (placeholder)">
  <rect width="512" height="512" rx="96" fill="#0f2b36"/>
  ${glyph(128, 96, 4, "#ffffff", "#f95d17")}
  <text x="256" y="432" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="44" fill="#79ced8">TT</text>
</svg>`;
  }
  if (variant === "horizontal") {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="120" viewBox="0 0 640 120" role="img" aria-label="Travel Technician horizontal logo (placeholder)">
  ${glyph(12, 28, 1, "#0f2b36", "#f95d17")}
  ${word(96, 74, 40, "#0f2b36")}
</svg>`;
  }
  if (variant === "light") {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="120" viewBox="0 0 640 120" role="img" aria-label="Travel Technician logo for dark backgrounds (placeholder)">
  ${glyph(12, 28, 1, "#ffffff", "#fb7d3c")}
  ${word(96, 74, 40, "#ffffff")}
</svg>`;
  }
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360" role="img" aria-label="Travel Technician primary logo (placeholder)">
  ${glyph(176, 60, 2, "#0f2b36", "#f95d17")}
  <text x="240" y="260" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="36" fill="#0f2b36">TRAVEL TECHNICIAN</text>
  <text x="240" y="300" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#20768b">POINTS · MILES · STRATEGY</text>
</svg>`;
}

// ── Destination / travel scenes ──────────────────────────────────────────────
const scenes = [
  [
    "travel/hero-lagoon.svg",
    {
      sky: ["#7dd3e0", "#eefafb"],
      sea: ["#2392a5", "#0f2b36"],
      hill: "#1b492a",
      sun: "#ffd166",
      label: "Tropical lagoon at midday",
    },
  ],
  [
    "travel/hero-sunset.svg",
    {
      sky: ["#fb7d3c", "#ffd166"],
      sea: ["#c2300d", "#430f07"],
      hill: "#5b4e43",
      sun: "#fff5ed",
      label: "Island sunset over the water",
    },
  ],
  [
    "travel/hero-palms.svg",
    {
      sky: ["#3fafbf", "#d5f2f4"],
      sea: ["#268d44", "#0a2814"],
      hill: "#216f38",
      sun: "#ffd166",
      label: "Palm-lined beach cove",
    },
  ],
  [
    "travel/hero-overwater.svg",
    {
      sky: ["#79ced8", "#eefafb"],
      sea: ["#20768b", "#204450"],
      hill: "#22505e",
      sun: "#fff5ed",
      label: "Overwater bungalows at dawn",
    },
  ],
  [
    "destinations/dest-maldives.svg",
    {
      sky: ["#7dd3e0", "#eefafb"],
      sea: ["#2392a5", "#204450"],
      hill: "#1f5931",
      sun: "#ffd166",
      label: "Maldives-style atoll",
    },
  ],
  [
    "destinations/dest-santorini.svg",
    {
      sky: ["#3fafbf", "#d5f2f4"],
      sea: ["#20768b", "#0f2b36"],
      hill: "#b0c8cd",
      sun: "#fff5ed",
      label: "Cliffside village by the sea",
    },
  ],
  [
    "destinations/dest-singapore.svg",
    {
      sky: ["#fb7d3c", "#ffe8d5"],
      sea: ["#204450", "#0f2b36"],
      hill: "#22505e",
      sun: "#ffd166",
      label: "City skyline at dusk",
    },
  ],
  [
    "destinations/dest-alps.svg",
    {
      sky: ["#b0e4e9", "#eefafb"],
      sea: ["#79ced8", "#2392a5"],
      hill: "#5b4e43",
      sun: "#fff5ed",
      label: "Alpine lake and peaks",
    },
  ],
  [
    "destinations/dest-doha.svg",
    {
      sky: ["#ffd166", "#fff5ed"],
      sea: ["#c0b294", "#88745e"],
      hill: "#a38d6f",
      sun: "#fb7d3c",
      label: "Desert skyline at golden hour",
    },
  ],
  [
    "destinations/dest-caribbean.svg",
    {
      sky: ["#7dd3e0", "#d5f2f4"],
      sea: ["#35ac57", "#20768b"],
      hill: "#1b492a",
      sun: "#ffd166",
      label: "Caribbean bay with sailboats",
    },
  ],
  [
    "success-stories/qsuites-boston-singapore.svg",
    {
      sky: ["#204450", "#20768b"],
      sea: ["#0f2b36", "#0f2b36"],
      hill: "#22505e",
      sun: "#ffd166",
      label: "Night flight — business class cabin",
    },
  ],
  [
    "success-stories/austrian-boston-vienna.svg",
    {
      sky: ["#79ced8", "#eefafb"],
      sea: ["#2392a5", "#204450"],
      hill: "#5b4e43",
      sun: "#fff5ed",
      label: "Vienna skyline from above",
    },
  ],
  [
    "jim/jim-travel-1.svg",
    {
      sky: ["#7dd3e0", "#eefafb"],
      sea: ["#2392a5", "#0f2b36"],
      hill: "#216f38",
      sun: "#ffd166",
      label: "Jim's travel photo — beach walk",
    },
  ],
  [
    "jim/jim-travel-2.svg",
    {
      sky: ["#fb7d3c", "#ffd166"],
      sea: ["#9a2812", "#430f07"],
      hill: "#5b4e43",
      sun: "#fff5ed",
      label: "Jim's travel photo — sunset lookout",
    },
  ],
  [
    "jim/jim-travel-3.svg",
    {
      sky: ["#b0e4e9", "#eefafb"],
      sea: ["#79ced8", "#20768b"],
      hill: "#88745e",
      sun: "#ffd166",
      label: "Jim's travel photo — mountain vista",
    },
  ],
];

let n = 0;
for (const [path, cfg] of scenes) {
  write(`images/${path}`, scene({ id: `s${n++}`, ...cfg }));
}

write(
  "images/jim/jim-portrait.svg",
  portrait({
    id: "p1",
    w: 800,
    h: 1000,
    label: "Professional photo of Jim Shortall",
    initials: "JS",
  }),
);

write(
  "images/cardmaster/screenshot-dashboard.svg",
  appScreen({
    id: "cm1",
    title: "CardMaster — Points Dashboard",
    label: "CardMaster points dashboard",
    rows: [
      { dot: "#2392a5", a: 420, b: 260 },
      { dot: "#f95d17", a: 380, b: 300 },
      { dot: "#35ac57", a: 440, b: 240 },
      { dot: "#20768b", a: 360, b: 280 },
    ],
  }),
);
write(
  "images/cardmaster/screenshot-benefits.svg",
  appScreen({
    id: "cm2",
    title: "CardMaster — Benefits & Credits",
    label: "CardMaster benefits and statement credit tracking",
    rows: [
      { dot: "#f95d17", a: 460, b: 240 },
      { dot: "#2392a5", a: 400, b: 300 },
      { dot: "#ffd166", a: 420, b: 260 },
      { dot: "#35ac57", a: 380, b: 280 },
    ],
  }),
);
write(
  "images/cardmaster/screenshot-household.svg",
  appScreen({
    id: "cm3",
    title: "CardMaster — Household Cards",
    label: "CardMaster household card management",
    rows: [
      { dot: "#20768b", a: 400, b: 280 },
      { dot: "#f95d17", a: 440, b: 240 },
      { dot: "#2392a5", a: 380, b: 300 },
      { dot: "#35ac57", a: 420, b: 260 },
    ],
  }),
);

write("images/brand/logo-primary.svg", logo({ variant: "primary" }));
write("images/brand/logo-horizontal.svg", logo({ variant: "horizontal" }));
write("images/brand/logo-square.svg", logo({ variant: "square" }));
write("images/brand/logo-light.svg", logo({ variant: "light" }));

console.log("Done.");
