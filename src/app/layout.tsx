import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, DM_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import AnalyticsGate from "@/components/AnalyticsGate";
import ConsentModeBridge from "@/components/ConsentModeBridge";
import ScrollReveal from "@/components/ScrollReveal";
import { PRACTICE_GROUPS } from "@/content/practices";
import { isMaintenanceMode } from "@/lib/maintenance";

// Evaluated once at build. When on, the shell below drops to a bare document
// and every route resolves to src/app/construction (see src/proxy.ts).
const MAINTENANCE = isMaintenanceMode();

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// While paused the site makes no claim about services, so the marketing
// description, keywords and OG copy are withheld. `/` stays indexable on
// purpose: a brand search for "Kynigos Law Firm" must still find the firm.
const maintenanceMetadata: Metadata = {
  metadataBase: new URL("https://kynigos.law"),
  title: { absolute: "Kynigos Law Firm, PLLC" },
  description:
    "The Kynigos Law Firm website is under construction. For inquiries, please contact info@kynigos.law.",
  applicationName: "Kynigos Law Firm",
  authors: [{ name: "Kynigos Law Firm, PLLC" }],
  openGraph: {
    type: "website",
    siteName: "Kynigos Law Firm",
    locale: "en_US",
    title: "Kynigos Law Firm, PLLC",
    description: "The Kynigos Law Firm website is under construction.",
    images: [{ url: "/og-image.png", width: 2400, height: 1260 }],
  },
  robots: { index: true, follow: true },
};

const siteMetadata: Metadata = {
  metadataBase: new URL("https://kynigos.law"),
  title: {
    default: "Kynigos Law Firm—Your attorney should have skin in the game.",
    template: "%s · Kynigos Law Firm",
  },
  description:
    "Flat-fee and contingency representation from a finance-trained attorney in Washington, DC. Family, employment, business, real estate, and capital markets matters—priced by outcome, not hours.",
  applicationName: "Kynigos Law Firm",
  authors: [{ name: "Kynigos Law Firm, PLLC" }],
  keywords: [
    "Washington DC attorney",
    "flat fee lawyer",
    "contingency attorney",
    "DC family law",
    "DC landlord tenant",
    "legal opinion letter",
    "physician contract review",
    "Kynigos Law Firm",
  ],
  openGraph: {
    type: "website",
    siteName: "Kynigos Law Firm",
    locale: "en_US",
    title: "Kynigos Law Firm",
    description: "Flat-fee and contingency representation. Washington, DC.",
    images: [{ url: "/og-image.png", width: 2400, height: 1260 }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const metadata: Metadata = MAINTENANCE
  ? maintenanceMetadata
  : siteMetadata;

// Organization structured data—only claims supported by page content.
// Under maintenance the page advertises no practice areas and no fee model,
// and routes inquiries to email alone, so knowsAbout, priceRange and telephone
// are all dropped rather than left asserting more than the visible page does.
const legalServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Kynigos Law Firm, PLLC",
  url: "https://kynigos.law",
  logo: "https://kynigos.law/logo.png",
  image: "https://kynigos.law/og-image.png",
  email: "info@kynigos.law",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Washington",
    addressRegion: "DC",
    addressCountry: "US",
  },
  areaServed: "District of Columbia",
  ...(MAINTENANCE
    ? {}
    : {
        telephone: "+1-304-549-1058",
        priceRange: "Flat fee and contingency",
        knowsAbout: PRACTICE_GROUPS.map((group) => group.name),
      }),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Next 16: data-scroll-behavior lets the router snap scroll-to-top during
    // SPA navigation while CSS scroll-behavior:smooth animates in-page anchors.
    // suppressHydrationWarning: the inline script below adds the `js` class to
    // <html> before hydration (by design—it gates scroll-reveal hiding), so
    // the server markup and hydrated class list intentionally differ here.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${sourceSerif.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: browser extensions (password managers,
          shopping assistants) stamp attributes onto <body> before React
          hydrates; that mismatch is theirs, not ours. Applies one level
          deep only—real child mismatches still surface. */}
      <body suppressHydrationWarning>
        {/* Runs synchronously before any content paints: the `js` class gates
            the scroll-reveal hidden state so content is never invisible when
            JavaScript is off (see [data-reveal] in globals.css). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(legalServiceJsonLd),
          }}
        />
        {MAINTENANCE ? (
          // Paused: the holding page renders alone. No nav, no footer, no
          // forms, no analytics and therefore no cookies—which is what keeps
          // the page free of any privacy-notice obligation.
          children
        ) : (
          <>
            <Nav />
            <main>{children}</main>
            <Footer />
            <CookieConsent />
            <ScrollReveal />
            {/* Loads only after analytics consent—see AnalyticsGate. */}
            <AnalyticsGate />
            {/* GA4 via Consent Mode v2—also gated on analytics consent. */}
            <ConsentModeBridge />
          </>
        )}
      </body>
    </html>
  );
}
