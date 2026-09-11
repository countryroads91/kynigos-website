import Link from "next/link";
import { isMaintenanceMode } from "@/lib/maintenance";

export default function NotFound() {
  // Paused: every deep link 307s to `/`, so this boundary should not offer a
  // menu of routes that no longer resolve. Next also inlines this payload into
  // every page, and the holding page should not ship the site's nav in its
  // flight data.
  if (isMaintenanceMode()) {
    return (
      <section className="hold-main">
        <h1 className="hold-headline">
          The Kynigos Law Firm website is under construction.
        </h1>
        <p className="hold-inquiries">
          For inquiries, please contact{" "}
          <a href="mailto:info@kynigos.law">info@kynigos.law</a>.
        </p>
      </section>
    );
  }

  return (
    <section className="hero hero--page">
      <div className="kicker">404</div>
      <h1 className="headline-line">This page has no matter on file.</h1>
      <p className="subhead">
        The address you followed does not exist—or it has been moved.
      </p>
      <div className="cta-row">
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link href="/practice-areas" className="btn-secondary">
          Practice Areas
        </Link>
        <Link href="/insights" className="btn-secondary">
          Insights
        </Link>
        <Link href="/contact" className="btn-secondary">
          Contact
        </Link>
      </div>
    </section>
  );
}
