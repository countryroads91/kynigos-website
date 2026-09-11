import { describe, expect, it } from "vitest";
import {
  HOLDING_PATH,
  isMaintenanceMode,
  resolveMaintenanceRoute,
} from "./maintenance";

describe("isMaintenanceMode", () => {
  it("is off unless MAINTENANCE_MODE is exactly 1", () => {
    expect(isMaintenanceMode({})).toBe(false);
    expect(isMaintenanceMode({ MAINTENANCE_MODE: "" })).toBe(false);
    expect(isMaintenanceMode({ MAINTENANCE_MODE: "0" })).toBe(false);
    // Guards against a stray "false"/"true" string flipping the whole site.
    expect(isMaintenanceMode({ MAINTENANCE_MODE: "false" })).toBe(false);
    expect(isMaintenanceMode({ MAINTENANCE_MODE: "true" })).toBe(false);
  });

  it("is on when MAINTENANCE_MODE is 1", () => {
    expect(isMaintenanceMode({ MAINTENANCE_MODE: "1" })).toBe(true);
  });
});

describe("resolveMaintenanceRoute", () => {
  it("renders the holding page in place at the root", () => {
    // A rewrite, not a redirect: `/` must stay a 200 so the brand keeps
    // ranking while the rest of the site is paused.
    expect(resolveMaintenanceRoute("/")).toEqual({
      action: "rewrite",
      target: HOLDING_PATH,
    });
  });

  it("temporarily redirects every content route to the root", () => {
    for (const path of [
      "/about",
      "/contact",
      "/practice-areas",
      "/practice-areas/family-law",
      "/blog/market-for-lemons",
      "/white-papers",
      "/insights",
      "/legal/privacy",
    ]) {
      expect(resolveMaintenanceRoute(path)).toEqual({
        action: "redirect",
        target: "/",
        status: 307,
      });
    }
  });

  it("keeps one canonical URL by bouncing the holding path itself", () => {
    expect(resolveMaintenanceRoute(HOLDING_PATH)).toEqual({
      action: "redirect",
      target: "/",
      status: 307,
    });
  });

  it("404s live API routes instead of redirecting them", () => {
    // A 307 preserves the method, so a POST to /api/lead would re-POST into
    // an HTML page. 404 is the honest answer while the firm is paused.
    for (const path of ["/api/lead", "/api/contact", "/api/subscribe"]) {
      expect(resolveMaintenanceRoute(path)).toEqual({ action: "notFound" });
    }
  });

  it("lets the Monday digest cron through so Vercel logs no weekly failure", () => {
    expect(resolveMaintenanceRoute("/api/digest")).toEqual({
      action: "passthrough",
    });
  });

  it("lets build output and static assets through untouched", () => {
    for (const path of [
      "/_next/static/chunk.js",
      "/api/csp-report",
      "/robots.txt",
      "/sitemap.xml",
      "/favicon.ico",
      "/og-image.png",
      "/logo.png",
    ]) {
      expect(resolveMaintenanceRoute(path)).toEqual({ action: "passthrough" });
    }
  });
});
