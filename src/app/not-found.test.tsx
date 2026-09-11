// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: React.ComponentProps<"a"> & { href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import NotFound from "./not-found";

afterEach(cleanup);

describe("404 page under maintenance", () => {
  beforeEach(() => {
    vi.stubEnv("MAINTENANCE_MODE", "1");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("offers no links into a paused site", () => {
    // Every deep link 307s to `/` while paused, and Next inlines this
    // boundary's payload into the holding page, so it must carry no nav.
    render(<NotFound />);

    expect(screen.queryByRole("link", { name: "Practice Areas" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Insights" })).toBeNull();
    expect(screen.queryByText("404")).toBeNull();
  });

  it("falls back to the holding-page message and email", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", {
        name: "The Kynigos Law Firm website is under construction.",
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "info@kynigos.law" }).getAttribute(
        "href",
      ),
    ).toBe("mailto:info@kynigos.law");
  });
});

describe("404 page", () => {
  it("shows the branded headline and the 404 kicker", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", { name: "This page has no matter on file." }),
    ).toBeTruthy();
    expect(screen.getByText("404")).toBeTruthy();
  });

  it("links back to the main sections of the site", () => {
    render(<NotFound />);

    const links: Array<[string, string]> = [
      ["Back to Home", "/"],
      ["Practice Areas", "/practice-areas"],
      ["Insights", "/insights"],
      ["Contact", "/contact"],
    ];
    for (const [name, href] of links) {
      expect(screen.getByRole("link", { name }).getAttribute("href")).toBe(
        href,
      );
    }
  });
});
