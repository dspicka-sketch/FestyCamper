# FestyCamper Production Build Backlog

## P0 — First-booking blockers

### FC-001 — Apply and verify payment-lifecycle migration
Status: Ready for execution  
Owner: Daniel/Cursor  
Acceptance: `prisma migrate deploy`, `prisma generate`, and production build pass against the canonical database.

### FC-002 — Configure and test Stripe webhook
Status: Code complete; configuration pending  
Acceptance: Signed `checkout.session.completed` webhook marks exactly one booking `PAID`, persists payment IDs and amount, and safely accepts duplicate Stripe delivery.

### FC-003 — End-to-end booking test
Status: Pending  
Acceptance: Active RV → booking request → checkout → webhook → verified confirmation → admin view succeeds in a production-like environment.

### FC-004 — Transactional email
Status: Not started  
Acceptance: Automated messages for request received, owner notification, approval/decline, verified deposit, cancellation, and failure alerts. Delivery failures are logged.

### FC-005 — Production observability
Status: Not started  
Acceptance: Error tracking is installed for browser and server; payment/webhook errors include correlation IDs without exposing secrets or personal payment data.

### FC-006 — Availability integrity
Status: Partial  
Acceptance: Database-backed blocked date ranges, server-side overlap validation, owner calendar UI, and concurrency-safe prevention of double booking.

## P1 — Controlled beta readiness

### FC-007 — Admin lifecycle expansion
Add cancellation reason, internal notes, refund workflow, immutable status history, and support escalation.

### FC-008 — Automated test suite
Add unit tests for pricing and validation, integration tests for booking/payment state, and Playwright coverage for the critical booking journey.

### FC-009 — Security hardening
Add rate limits to public mutation endpoints, security headers, dependency scanning, secrets review, input-size limits, and authorization tests.

### FC-010 — Image pipeline verification
Verify Supabase Storage policies, authenticated upload, file type/size enforcement, image deletion, and broken-image handling.

### FC-011 — Legal and support foundation
Publish Terms, Privacy, cancellation/refund policy, owner terms, support contact, and emergency escalation procedures.

### FC-012 — Analytics baseline
Track festival views, RV views, booking starts, request completion, checkout starts, verified payments, owner signup, and listing activation.

## P2 — Public launch quality

- FC-013 Mobile usability and accessibility pass.
- FC-014 Search/filter quality and empty-state improvements.
- FC-015 Reviews and post-trip feedback.
- FC-016 Favorites and saved trips.
- FC-017 SEO metadata, sitemap, structured data, and index controls.
- FC-018 Customer and owner dashboards for booking lifecycle visibility.

## P3 — Differentiation and growth

- AI festival travel concierge.
- Personalized festival/RV recommendations.
- Route, fuel, packing, and campground planning.
- Referral and loyalty programs.
- Calendar integrations and dynamic pricing.
- Community and caravan features.
