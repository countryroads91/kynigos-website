// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import ConstructionPage from "./page";

afterEach(cleanup);

describe("Construction holding page", () => {
  it("states that the site is under construction", () => {
    render(<ConstructionPage />);

    expect(
      screen.getByRole("heading", {
        name: "The Kynigos Law Firm website is under construction.",
      }),
    ).toBeTruthy();
  });

  it("offers email as the only way to reach the firm", () => {
    render(<ConstructionPage />);

    const email = screen.getByRole("link", { name: "info@kynigos.law" });
    expect(email.getAttribute("href")).toBe("mailto:info@kynigos.law");

    // Email only while paused—no phone number, no contact form.
    expect(screen.queryByText(/549-1058/)).toBeNull();
    expect(document.querySelector("form")).toBeNull();
    expect(document.querySelector('a[href^="tel:"]')).toBeNull();
  });

  it("warns that contact creates no attorney-client relationship", () => {
    // DC Rule 1.18: a page inviting inquiries can make a stranger a
    // prospective client and impose confidentiality and conflict duties.
    // This warning is the only disclaimer on the page doing real work.
    render(<ConstructionPage />);

    expect(
      screen.getByText(/does\s+not\s+create\s+an\s+attorney-client/i),
    ).toBeTruthy();
    expect(
      screen.getByText(/do\s+not\s+send\s+confidential\s+information/i),
    ).toBeTruthy();
  });

  it("states the DC-only admission and never implies another jurisdiction", () => {
    render(<ConstructionPage />);

    expect(
      screen.getByText(/Admitted in the District of Columbia only/),
    ).toBeTruthy();
    expect(screen.queryByText(/Maryland|Virginia/)).toBeNull();
  });

  it("names the firm entity but no individual attorney", () => {
    // DC Rule 7.1 imposes no name requirement; the firm's preference is that
    // no individual is identified on the holding page.
    render(<ConstructionPage />);

    expect(screen.getByText(/Kynigos Law Firm, PLLC/)).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/Misaghi|Bayan/i);
  });

  it("renders the spearhead mark with its draw-in and fill paths", () => {
    const { container } = render(<ConstructionPage />);

    expect(container.querySelectorAll("path.spear-draw")).toHaveLength(2);
    expect(container.querySelectorAll("path.spear-fill")).toHaveLength(2);
    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe(
      "0 0 70 175",
    );
  });
});
