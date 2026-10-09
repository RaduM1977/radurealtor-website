# Buyer Lead Bridge Delivery Checklist

- [x] **Buyer landing page** — `buyer-planning.html` provides the validated form experience, conditional 10-digit phone requirement, existing brand mark, optional email updates consent, privacy acknowledgement, and no SMS automation/consent field.
- [ ] **Safe pre-launch configuration** — Keep the page unlinked and `noindex` until a deployed gateway endpoint, CAPTCHA site key, brokerage disclosures, and final Privacy Notice details are configured.
- [x] **Website Lead Gateway** — The separate Apps Script Web App validated CAPTCHA, rejected invalid payloads during safeguard tests, and created `Website - Buyer` / `Buyer` Top Producer records without exposing the CRM intake address to the browser.
- [x] **Top Producer workflow** — The `Website Buyer - 14-Day Response` rule now maps `Website - Buyer` / `Buyer` to the manual `Website Buyer — 14-Day Personal Follow-Up` plan. No automated outbound messages are enabled.
- [x] **Controlled intake test** — A clearly marked dummy buyer submission created the expected `Website - Buyer` / `Buyer` Top Producer record with buyer details and UTM context on October 8, 2026; the test record was deleted after verification.
- [x] **Controlled response-plan test** — On October 9, 2026, a clearly marked dummy buyer received all seven manual tasks in the intended 14-day sequence. The test contact was deleted immediately after verification, and Top Producer showed no remaining incomplete test tasks.
- [ ] **Brokerage/compliance completion** — Confirm business/brokerage disclosures, Privacy Notice details, public contact information, CAPTCHA provider configuration, and the human opt-out process before merge/publish.
