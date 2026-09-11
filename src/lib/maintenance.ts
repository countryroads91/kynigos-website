/**
 * Maintenance mode—the "pause" switch for the whole site.
 *
 * Set MAINTENANCE_MODE=1 in Vercel and every route collapses onto a single
 * holding page. Nothing is deleted: unset the var, redeploy, and the site
 * comes back exactly as it was.
 *
 * Note that Next inlines `process.env.*` into the middleware bundle at build
 * time, so flipping the var takes effect on the next deploy, not instantly.
 */

/** Internal route the holding page lives at. Never the canonical URL—`/` is. */
export const HOLDING_PATH = "/construction";

/**
 * Routes that must keep working while paused.
 *
 * /api/digest is the Monday cron. It stays reachable so Vercel doesn't log a
 * weekly failure; the route itself short-circuits under maintenance so no mail
 * goes out (see src/app/api/digest/route.ts). Leaving the cron defined in
 * vercel.json means there is nothing to remember to restore later.
 */
const PASSTHROUGH_PREFIXES = ["/_next/", "/api/digest", "/api/csp-report"];

export type MaintenanceRoute =
  | { action: "passthrough" }
  | { action: "rewrite"; target: string }
  | { action: "notFound" }
  | { action: "redirect"; target: string; status: 307 };

// Next 16 generates a strict ProcessEnv type, so the parameter is widened to
// a plain record rather than a shape literal (which has no overlap with it).
export function isMaintenanceMode(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return env.MAINTENANCE_MODE === "1";
}

/**
 * Decides what happens to one request path while the site is paused.
 *
 * `/` renders the holding page in place (200, still indexable—brand searches
 * for "Kynigos Law Firm" must keep resolving). Everything else is a 307, which
 * tells crawlers the move is temporary and leaves the original URLs' standing
 * intact. Live API routes 404 rather than redirect, so a POST doesn't get
 * bounced into an HTML page.
 */
export function resolveMaintenanceRoute(pathname: string): MaintenanceRoute {
  if (PASSTHROUGH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return { action: "passthrough" };
  }

  // Anything with a file extension is a public/ asset or a generated file
  // route (robots.txt, sitemap.xml, favicon.ico, og-image.png).
  if (/\.[a-z0-9]+$/i.test(pathname)) {
    return { action: "passthrough" };
  }

  // Keep one canonical URL: the holding page is only ever served at `/`.
  if (pathname === HOLDING_PATH) {
    return { action: "redirect", target: "/", status: 307 };
  }

  if (pathname === "/") {
    return { action: "rewrite", target: HOLDING_PATH };
  }

  if (pathname.startsWith("/api/")) {
    return { action: "notFound" };
  }

  return { action: "redirect", target: "/", status: 307 };
}
