import type { MetadataRoute } from "next";
import { posts } from "@/content/posts";
import { isMaintenanceMode } from "@/lib/maintenance";

export const BASE_URL = "https://kynigos.law";

// One build-time constant for all static pages—regenerated on each deploy.
export const BUILD_DATE = new Date();

/** Static routes, ordered roughly by importance. */
export const STATIC_ROUTES = [
  "/",
  "/practice-areas",
  "/practice-areas/family-law",
  "/practice-areas/landlord-tenant",
  "/practice-areas/capital-markets",
  "/practice-areas/contract-review",
  "/about",
  "/how-it-works",
  "/philosophy",
  "/insights",
  "/white-papers",
  "/contact",
  "/legal/privacy",
  "/legal/disclaimer",
  "/legal/attorney-advertising",
  "/legal/cookies",
  "/accessibility",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  // Paused: every route but `/` answers 307, so listing them would advertise
  // a hundred URLs that go nowhere. Ship the one page that actually resolves.
  if (isMaintenanceMode()) {
    return [{ url: `${BASE_URL}/`, lastModified: BUILD_DATE }];
  }

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: BUILD_DATE,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticEntries, ...postEntries];
}
