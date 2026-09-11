import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { and, count, eq, gte } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { events, leads, subscribers } from "@/lib/db/schema";
import { sendNotification } from "@/lib/leads";
import { isMaintenanceMode } from "@/lib/maintenance";

export const runtime = "nodejs";

const WINDOW_DAYS = 7;

// Weekly ambient-visibility email to the attorney (Vercel Cron → Monday).
// This is the "admin dashboard": lead/download/event counts from the
// first-party store, no UI to build or maintain. Guarded by CRON_SECRET—
// Vercel sends it as a bearer token on cron invocations.
export async function GET(req: Request) {
  // Paused: the cron stays defined in vercel.json (nothing to remember to
  // restore) and the proxy lets it through, but no mail goes out while the
  // site tells visitors it is under construction. 200 so Vercel logs no
  // weekly failure.
  if (isMaintenanceMode()) {
    return NextResponse.json({ ok: true, skipped: "maintenance" });
  }

  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET not configured." },
      { status: 503 },
    );
  }
  // Constant-time comparison (hash both sides to normalize length first).
  const header = req.headers.get("authorization") ?? "";
  const given = createHash("sha256").update(header).digest();
  const want = createHash("sha256").update(`Bearer ${secret}`).digest();
  if (!timingSafeEqual(given, want)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { ok: false, error: "DATABASE_URL not configured." },
      { status: 503 },
    );
  }

  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const leadRows = await db
    .select({ source: leads.source, n: count() })
    .from(leads)
    .where(gte(leads.createdAt, since))
    .groupBy(leads.source);
  const eventRows = await db
    .select({ type: events.type, n: count() })
    .from(events)
    .where(gte(events.createdAt, since))
    .groupBy(events.type);
  // Confirmed only—pending bot-abandoned rows must not inflate the number
  // the attorney reads as real subscribers.
  const subscriberRows = await db
    .select({ n: count() })
    .from(subscribers)
    .where(
      and(
        gte(subscribers.confirmedAt, since),
        eq(subscribers.status, "confirmed"),
      ),
    );

  const totalLeads = leadRows.reduce((sum, r) => sum + Number(r.n), 0);
  const line = (label: string, n: number | string) =>
    `  ${label.padEnd(24, " ")} ${n}`;

  const text = [
    `Kynigos week in review—last ${WINDOW_DAYS} days.`,
    "",
    `Leads: ${totalLeads}`,
    ...leadRows.map((r) => line(r.source, Number(r.n))),
    "",
    "Events:",
    ...(eventRows.length
      ? eventRows.map((r) => line(r.type, Number(r.n)))
      : [line("(none)", "")]),
    "",
    `New confirmed subscribers: ${Number(subscriberRows[0]?.n ?? 0)}`,
    "",
    "Sources: Neon (leads/events), full detail in the Neon console and",
    "Vercel logs. CRM pipeline lives in Clio once Phase 2 is provisioned.",
  ].join("\n");

  try {
    const sent = await sendNotification({
      subject: `Kynigos weekly digest—${totalLeads} lead${totalLeads === 1 ? "" : "s"}`,
      replyTo: "info@kynigos.law",
      text,
    });
    if (!sent) {
      return NextResponse.json(
        { ok: false, error: "Email env not configured." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[digest] send failed:", err);
    return NextResponse.json(
      { ok: false, error: "Digest send failed." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, leads: totalLeads });
}
