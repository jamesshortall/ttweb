/**
 * Renders a reviewed HTML/embed ad inside a strictly sandboxed iframe.
 *
 * Isolation (the real protection):
 *  - `sandbox` WITHOUT `allow-scripts` and WITHOUT `allow-same-origin`: the
 *    frame runs at an opaque origin, executes no JavaScript, and cannot read
 *    cookies, storage, or the parent DOM.
 *  - The markup is server-sanitized (sanitizeAdHtml) before it ever gets here.
 *  - A restrictive per-frame CSP inside the document blocks any network/script
 *    surface as further defense-in-depth.
 *  - Links open in a new top-level tab (allow-popups) with noopener.
 *
 * The parent page's CSP must allow `frame-src 'self'`, gated behind
 * AD_HTML_EMBEDS_ENABLED in next.config.ts, so this stays off by default.
 */
export function HtmlEmbedAd({ sanitizedHtml, title }: { sanitizedHtml: string; title?: string }) {
  const doc = `<!doctype html><html><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https: data:; style-src 'unsafe-inline'; font-src https:; base-uri 'none'; form-action 'none'">
<base target="_blank" rel="noopener noreferrer">
<style>html,body{margin:0;padding:0;font-family:system-ui,sans-serif;color:#0b1f30}a{color:#1c778c}</style>
</head><body>${sanitizedHtml}</body></html>`;

  return (
    <iframe
      title={title ?? "Advertisement"}
      srcDoc={doc}
      sandbox="allow-popups allow-popups-to-escape-sandbox"
      loading="lazy"
      referrerPolicy="no-referrer"
      className="h-[250px] w-full rounded-lg border-0"
    />
  );
}
