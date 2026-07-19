/**
 * Allowlist sanitizer for HTML/embed advertisements.
 *
 * IMPORTANT: the *primary* isolation for HTML ads is the sandboxed iframe that
 * renders them — no `allow-scripts`, no `allow-same-origin`, so nothing can
 * execute, read cookies, or touch the parent page (see HtmlEmbedAd.tsx). This
 * sanitizer is defense-in-depth: it strips scripts, event handlers, and unsafe
 * URLs before the markup ever reaches that iframe. Script-based third-party
 * widgets are intentionally NOT supported here — those belong to the network
 * ad layer (Phase 4). HTML ads are for reviewed, trusted-partner rich content.
 */

const ALLOWED_TAGS = new Set([
  "a",
  "b",
  "br",
  "div",
  "em",
  "h3",
  "h4",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "picture",
  "small",
  "source",
  "span",
  "strong",
  "u",
  "ul",
]);

// Attributes allowed per tag (plus the global ones below).
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title"]),
  img: new Set(["src", "alt", "width", "height", "loading"]),
  source: new Set(["srcset", "src", "type", "media"]),
};
const GLOBAL_ATTRS = new Set(["title"]);

const URL_ATTRS = new Set(["href", "src", "srcset"]);

function isSafeUrlValue(value: string): boolean {
  const trimmed = value.trim();
  // Allow relative and protocol-relative to safe schemes; block dangerous ones.
  if (/^\s*(javascript|data|vbscript|file):/i.test(trimmed)) return false;
  return true;
}

function sanitizeAttributes(tag: string, attrString: string): string {
  const allowed = ALLOWED_ATTRS[tag];
  const kept: string[] = [];
  // Match name="value" | name='value' | name=value | name
  const attrRe = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g;
  let match: RegExpExecArray | null;
  while ((match = attrRe.exec(attrString)) !== null) {
    const name = match[1]?.toLowerCase();
    if (!name) continue;
    // Never allow event handlers or style/script-ish attributes.
    if (name.startsWith("on")) continue;
    if (name === "style") continue;
    const isAllowed = allowed?.has(name) || GLOBAL_ATTRS.has(name);
    if (!isAllowed) continue;

    const raw = match[2] ?? "";
    const quoted = raw.startsWith('"') || raw.startsWith("'");
    const value = quoted ? raw.slice(1, -1) : raw;
    if (URL_ATTRS.has(name) && !isSafeUrlValue(value)) continue;

    kept.push(value === "" && raw === "" ? name : `${name}="${value.replace(/"/g, "&quot;")}"`);
  }
  return kept.length ? " " + kept.join(" ") : "";
}

export function sanitizeAdHtml(raw: string | undefined | null): string {
  if (!raw) return "";
  let html = raw;

  // Remove script/style/iframe/object/embed blocks entirely (content included).
  html = html.replace(/<\s*(script|style|iframe|object|embed|svg|math)[\s\S]*?<\s*\/\s*\1\s*>/gi, "");
  // Remove any lone opening/closing of those tags left behind.
  html = html.replace(/<\s*\/?\s*(script|style|iframe|object|embed|svg|math)\b[^>]*>/gi, "");
  // Strip HTML comments (can hide conditional/IE payloads).
  html = html.replace(/<!--[\s\S]*?-->/g, "");

  // Walk remaining tags: keep allowlisted ones with sanitized attributes,
  // drop the tag markup (but keep inner text) for everything else.
  html = html.replace(/<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (_full, slash, name, attrs) => {
    const tag = String(name).toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return "";
    if (slash === "/") return `</${tag}>`;
    const selfClose = /\/\s*$/.test(attrs) && (tag === "img" || tag === "br" || tag === "source");
    return `<${tag}${sanitizeAttributes(tag, attrs)}${selfClose ? " /" : ""}>`;
  });

  return html.trim();
}
