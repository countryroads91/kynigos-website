# Changelog

All notable changes to the Kynigos Law Firm site are documented here.
Versions follow a 4-digit MAJOR.MINOR.PATCH.MICRO format.

## [0.8.1.0] - 2026-09-11

### Added
- The site can now be paused behind a single under-construction holding page: the spearhead mark drawing itself in, the firm name, and one line pointing inquiries to info@kynigos.law. Set `MAINTENANCE_MODE=1` in Vercel and redeploy to pause; unset it and redeploy to bring the site back exactly as it was. Nothing is deleted or rewritten either way.
- While paused, the holding page answers at the firm's own address and stays indexable, so a search for the firm by name still finds it. Every other address temporarily redirects there, which tells search engines the move is not permanent and leaves the real pages' standing intact.
- The paused page is deliberately inert: no navigation, no forms, no analytics and no cookies, so nothing is collected from anyone who lands on it while the firm is dark. The Monday digest email also stops sending on its own, without the schedule needing to be torn down and rebuilt later.
- The holding page carries the notice that matters for a page inviting contact: contacting the firm creates no attorney-client relationship, and confidential information should not be sent until representation is confirmed in writing. It also states the District of Columbia admission and names no individual attorney.

## [0.8.0.0] - 2026-07-07

### Added
- Visitors who accept analytics cookies are now measured with Google Analytics 4 through Consent Mode v2: nothing loads before consent, the ad-signal switches follow the marketing category, and key conversions (inquiries, white-paper downloads, consultation clicks) are reported as GA4 events. Ready for ad-campaign pixels later with no rework.
- Readers can subscribe to the firm's research notes—signup forms in the footer, at the end of every article, and as an opt-in checkbox on the white-paper gates. Subscriptions are double opt-in: nothing is sent until the reader clicks a Confirm button on the emailed link's landing page (a deliberate click, so inbox security scanners can never fabricate consent), which also files them into the broadcast audience. Confirmation links expire after 7 days and are stored only as hashes. The whole feature stays hidden until it is switched on.
- The signup endpoint carries the same protections as every other form: bot challenge, per-visitor rate limit, honeypot, and cross-site rejection—and nothing a subscriber types is ever echoed into email sent from the firm's domain.
- A weekly digest email now summarizes the week's leads, downloads, and new subscribers every Monday—ambient visibility with no dashboard to check.

### Changed
- The privacy policy discloses the research-notes list and its double opt-in handling.

## [0.7.0.0] - 2026-07-07

### Added
- Every inquiry, white-paper request, and download is now stored in the firm's own database the moment it arrives—before any email is sent—so a delivery outage can never lose a lead. The store also records conversion events (downloads, future bookings and payments), laying the data foundation for CRM sync and analytics.
- All three forms (contact, homepage First Move, white-paper gates) now carry Cloudflare Turnstile bot protection: the challenge appears once configured, and the server rejects submissions that fail it.
- Form endpoints are rate-limited per visitor (5 requests per minute) to shut down abuse of the public email triggers.
- White papers are now genuinely gated: the PDFs left the public folder and are served only through expiring signed download links minted when a reader submits the form. Every download is recorded.
- The site now sends security headers on every response (HSTS, frame/content-type protections, a Content-Security-Policy in report-only mode) as a first hardening pass.

### Changed
- The white-paper lead endpoint gained the same protections the contact endpoint already had: a honeypot field, a payload size cap, and validation that the requested paper actually exists.
- Shared validation, sanitization, and email plumbing for the two lead endpoints moved into one library, ending the copy-paste drift between them.
- The privacy policy now names the firm's full processor list (Vercel, Resend, Neon, Cloudflare, Upstash) and discloses database storage of inquiries.

## [0.6.0.0] - 2026-07-06

### Added
- The firm now presents as a full-service practice. A new practice taxonomy organizes 26 kinds of matters into five groups—Family & Personal, Work & Employment, Business & Corporate, Real Estate & Housing, and Capital Markets & Finance—covering everything from wills and severance negotiations to M&A, structured finance, and private funds.
- Practice Areas is now a browsable directory: five numbered group sections with anchor chips in the hero, each service an expandable row showing what the work covers, a fee-shape badge, and a way to start the matter. The four in-depth practice pages remain the flagship destinations inside their groups.
- A reusable Fee Design module explains the four fee shapes the firm works in—flat fee, staged fixed fees, fixed + success, and quoted per matter—each with what it is and when it fits.
- How It Works is now interactive: each of the three engagement shapes opens into an illustrative matter (a divorce heading toward settlement, an executive employment agreement, an acquisition) showing the objective, the work, the fee, and why that structure fits.
- Visual depth across the site: scroll-triggered reveals per the design system's motion spec (with a no-JavaScript guard, a reduced-motion opt-out, a print override, and a failsafe so content can never stay hidden), an upright spearhead watermark behind key bands, outlined editorial numerals, and refined hover states.
- Tests: 29 new (139 total), including taxonomy policy invariants (DC-only, no invented prices, tight em dashes), full disclosure-widget ARIA coverage, a Footer suite, scroll-reveal branch coverage, and a mojibake guard pinning homepage copy.

### Changed
- The homepage hero now rotates through matters across all five groups (divorce, deal, employment, estate, M&A, custody, real estate, fund), and the services marquee spans the full practice instead of repeating flat-fee document review.
- The homepage practice section is an editorial index of the five groups—oversized numerals, service previews, and links into the directory—replacing the four-card grid.
- The Practice Areas dropdown and footer now list the five practice groups; the menu stays one level deep and hash links no longer claim to be the current page in assistive tech.
- Fee explanation was rewritten: the "shared principle" paragraph is gone, replaced by the Fee Design module and per-service fee badges.
- Touch targets on the new directory controls meet the 44px accessibility minimum, and the marquee speed was rescaled to its tuned pace for the longer service list.

### Fixed
- Repaired a wrong-encoding save that shipped corrupted characters in the homepage insights label and stylesheet comments; a regression test now guards against double-encoded text anywhere on the homepage.

## [0.5.0.0] - 2026-07-06

### Added
- New pages: a real About hub (with a "Why Kynigos Exists" section built around the founding essay), an attorney biography, an Insights hub at /insights with three visibly distinct channels (Personal Essays, Kynigos Publications, White Papers), and a full legal-information system—Privacy Policy, Website Disclaimer, Attorney Advertising, Cookie Policy, and an Accessibility Statement—plus a branded 404 page.
- Practice Areas rebuilt as real destinations: an index page and four full practice pages (Family Law, Landlord-Tenant, Capital Markets, Contract Review), each explaining the problem, the scope, how the fee works, the process, what to prepare, and FAQs. $444 remains the only posted price.
- Homepage gains a practice-area overview and a featured-insights band that visibly distinguishes a personal essay, a firm publication, and a white paper.
- SEO foundation: sitemap.xml, robots.txt, social-share image, LegalService structured data, and article structured data with correct authorship.
- Tests: 53 new (110 total) covering every new page, the menu, authorship rules, and the sitemap.

### Changed
- Navigation redesigned. On phones, the menu is now a full-screen environment with large primary destinations, grouped child links, a pinned consultation button, and quiet legal links—keyboard- and screen-reader-complete, and the page behind it is fully inactive while open. On desktop, Practice Areas, About, and Insights are each one-click destinations with a separate chevron for their children.
- The footer is now a full sitemap: brand and consultation call-to-action, practice areas, firm pages, insights channels, contact details, and a quiet legal row with an automatically current copyright year.
- Authorship is now explicit across the site: the two personal essays remain by Bayan Misaghi; the analytical articles and both white papers are attributed to Kynigos Law Firm—in bylines, page metadata, and structured data alike.
- The public contact email is now info@kynigos.law everywhere (pages, forms, error messages, footer); the blog index moved to /insights (old article links keep working; /blog redirects).
- The services band announces its list once to screen readers and pauses on hover.

## [0.4.0.0] - 2026-07-06

### Added
- "Get Started" fork on the homepage: the hero button now scrolls to a two-door choice—"I have a document" (document types, drag-and-drop upload UI with file validation, and a working email fallback while online upload and checkout are being connected) and "I have a situation" (three-step consultation path with a scheduler slot that goes live once Calendly is configured). Both doors work by keyboard and screen reader.
- "Skin in the Game" homepage section: three arenas (disputes, review, deals) each explaining the game, the skin, and the fee shape—closing with the firm rule, "Play to Win. Win to Play."
- "The First Move Is Yours" message box on the homepage: describe a document or situation in a few sentences, add name, email, and jurisdiction, and it lands in the firm inbox—with the DC-only gate and spam protection of the contact form.
- New Philosophy page (/philosophy): the meaning of "Play to Win. Win to Play.", why hourly billing misaligns incentives, the "I have been the client" origin story, and the attorney's career background. Linked from the About menu and the footer.
- How It Works rebuilt as a full visual page: a four-step flow, a game/skin/fee matrix, four worked examples across document review, transactions, family law, and disputes ($444 remains the only posted price), and a philosophy banner.
- Tests: 16 new (56 total) covering the fork's doors, keyboard navigation, file validation, the message form's success/error/network paths, and the two rebuilt pages.

### Changed
- The scrolling services band now lists the full flat-fee catalog (divorce, staged-fee divorce, opinion letters, eviction defense, prenuptial agreements, contract review and negotiation, lease, employment-agreement, NDA, loan-document, business-agreement, demand-letter, settlement, and privacy-policy work), with scroll speed unchanged.
- The hero's "Book A Free Consultation" button is replaced by "Get Started"; consultation booking now lives inside the fork, the contact page, and the navigation button.

### Fixed
- Dropping a file anywhere outside the upload box no longer navigates the browser away from the page (which could discard a typed message).
- When several files fail validation at once, every problem is reported—not just the last one.
- The scheduler embed loads only when the "I have a situation" door is open, so visitors who never open it don't download it.
- Small accessibility fixes: 44px touch targets on the upload controls, the "integration pending" chip meets the minimum type size, and the drag highlight no longer flickers while moving across the box.

## [0.3.0.0] - 2026-07-06

### Added
- "How It Works" section on the homepage: a three-step explanation of the pricing model (free consultation, one price in writing, aligned outcome) with the DC-only jurisdiction note. A new "How It Works" button next to "Book A Free Consultation" smooth-scrolls to it; on phones the two buttons stack full-width.
- Homepage tests (5 new, 40 total) covering the new section, the anchor button, and the ticker placement, plus new mobile-menu tests for link-tap close, desktop-resize close, and the Tab focus trap.

### Changed
- Mobile menu redesigned: one tap on the menu button now shows every page as a direct link (grouped under small About / Practice Areas / Insights labels)—no more expanding sections. The page dims behind the menu and tapping anywhere outside closes it. Links are larger and easier to read, and the consultation button sits at the bottom of the list.
- The scrolling services banner now appears only on the homepage, as a normal band between the hero and the How It Works section that scrolls with the page—it no longer sticks to the bottom of every screen.
- Slimmer mobile header: the wordmark and menu button take less vertical space, leaving more room for content.
- Smooth in-page scrolling for anchor links, while switching pages still snaps instantly (Next 16 data-scroll-behavior).

### Fixed
- Screen readers no longer announce two identical "Close menu" buttons when the menu is open; the menu is announced as a dialog and the menu button points at it (aria-controls).
- Anchor scrolling now clears the fixed header on desktop (scroll-margin), and the menu sheet has a max-height fallback for older browsers without dvh support.

## [0.2.1.0] - 2026-07-01

### Fixed
- Keyboard and screen-reader users can no longer Tab out of the open mobile menu into hidden page content; closing the menu returns focus to the menu button, and Escape now fully resets the menu.
- Cleared all pre-existing lint errors (typographic quotes in the white-papers copy; modernized the headline reel's reduced-motion handling).

### Added
- Component regression tests (8 new, 33 total): the mobile-menu close-on-navigation fix, Escape/focus behavior, the contact form's DC jurisdiction gate and submit states, and the white-paper form id fix are now locked in by tests.

## [0.2.0.0] - 2026-07-01

### Added
- Contact form on /contact: prospective clients can now send an inquiry (name, email, optional phone, message) directly from the site instead of only calling or emailing. A required jurisdiction dropdown screens DC vs other matters—non-DC selections see a referral note and cannot submit, and the API enforces the same rule.
- If the inquiry email cannot be delivered, the form now says so and shows the firm's phone and email instead of a false success message.
- Test suite (vitest): 25 tests covering the contact and lead APIs—validation, the DC jurisdiction gate, email send success/failure, spam honeypot, and input boundaries. CI runs typecheck + tests on every push and PR.

### Fixed
- Mobile menu can now be closed: the open menu panel was covering the close button, trapping visitors on phones. The logo and close button now stay visible and tappable above the panel, the tap target meets the 44px minimum, and the menu also closes automatically on any page change.
- White-paper download forms no longer cross-wire: tapping the second paper's Name/Email labels used to jump focus to the first paper's form.
- Form fields no longer trigger the iOS zoom-on-focus, keyboards match the field type (email/phone), and browsers can autofill name, email, and phone.
- Keyboard users get a visible focus ring on form fields; disabled buttons now look disabled; inline links in form notes are underlined.

### Changed
- Hero reel words trimmed to offered practice areas; practice pages no longer show "page in progress" placeholder copy; canonical contact email (bayan@kynigos.law) everywhere.
- Contact and lead APIs neutralize control characters in user input and silently drop bot submissions (honeypot), protecting the firm inbox and logs.
