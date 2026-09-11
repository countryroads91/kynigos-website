import type { Metadata } from "next";
import "./construction.css";

/**
 * The holding page shown while MAINTENANCE_MODE is on.
 *
 * Reached only as an internal rewrite of `/` (see src/middleware.ts), so the
 * canonical URL stays https://www.kynigos.law/ and the page answers 200.
 *
 * Deliberately inert: no nav, no footer, no forms, no analytics, no cookies.
 * The root layout drops all of that under maintenance, which is what keeps
 * this page free of any privacy-notice obligation.
 */

export const metadata: Metadata = {
  title: { absolute: "Kynigos Law Firm, PLLC" },
  description:
    "The Kynigos Law Firm website is under construction. For inquiries, please contact info@kynigos.law.",
};

// The spearhead, identical to the homepage hero mark.
const SPEAR_HEAD =
  "M35,0 L33,10 L31,25 L29,38 L27,50 L25,60 L22,75 L19,90 L16,102 L14,112 L12,120 L10,127 L9,132 L13,137 L18,143 L24,150 L27,155 L28,148 L29,138 L30,125 L31,110 L32,92 L33,72 L34,48 L35,42 L36,48 L37,72 L38,92 L39,110 L40,125 L41,138 L42,148 L43,155 L46,150 L52,143 L57,137 L61,132 L60,127 L58,120 L56,112 L54,102 L51,90 L48,75 L45,60 L43,50 L41,38 L39,25 L37,10 Z";
const SPEAR_BASE = "M6,163 L8,169 L62,169 L64,163 Z";

export default function ConstructionPage() {
  return (
    <div className="hold-page">
      <main className="hold-main">
        <svg
          className="hold-spear"
          viewBox="0 0 70 175"
          role="img"
          aria-label="Kynigos spearhead mark"
        >
          <path className="spear-draw" d={SPEAR_HEAD} />
          <path className="spear-draw spear-draw-base" d={SPEAR_BASE} />
          <path className="spear-fill" d={SPEAR_HEAD} />
          <path className="spear-fill" d={SPEAR_BASE} />
        </svg>

        <div className="hold-wordmark hold-reveal hold-d1">Kynigos</div>
        <hr className="hold-rule hold-reveal hold-d2" />

        <h1 className="hold-headline hold-reveal hold-d3">
          The Kynigos Law Firm website is under construction.
        </h1>

        <p className="hold-inquiries hold-reveal hold-d4">
          For inquiries, please contact{" "}
          <a href="mailto:info@kynigos.law">info@kynigos.law</a>.
        </p>
      </main>

      <footer className="hold-fineprint hold-reveal hold-d5">
        <hr className="hold-fineprint-divider" />
        {/* Explicit {" "} after the expression: JSX strips the indentation
            whitespace on the next line, which would render "2026Kynigos". */}
        <p className="hold-colophon">
          &copy; {new Date().getFullYear()}{" "}
          Kynigos Law Firm, PLLC &middot; Washington, DC
        </p>
        <p>
          Admitted in the District of Columbia only. Contacting the firm does
          not create an attorney-client relationship; please do not send
          confidential information until representation is confirmed in
          writing.
        </p>
      </footer>
    </div>
  );
}
