# Buyer Lead Bridge Delivery Checklist

- [ ] **Buyer landing page** — Provide a mobile-accessible `buyer-planning.html` with required name/email fields, buyer-intent fields, preferred email/phone/text contact method, optional unchecked email updates consent, a privacy acknowledgement, and no SMS automation/consent field.
- [ ] **Safe pre-launch configuration** — Keep the page unlinked and `noindex` until a deployed gateway endpoint, CAPTCHA site key, brokerage disclosures, and final Privacy Notice details are configured.
- [ ] **Website Lead Gateway** — Provide a separate Apps Script Web App source that accepts only valid buyer payloads, verifies CAPTCHA, rejects honeypot submissions, rate-limits per email, and sends `Website - Buyer` / `Buyer` Top Producer metadata without exposing the CRM intake address to the browser.
- [ ] **Top Producer draft workflow** — Prepare the exact source/type mapping `Website - Buyer` / `Buyer` for the future `Website Buyer - 14-Day Response` rule and `Website Buyer — 14-Day Personal Follow-Up` plan; do not enable automated outbound messages at first launch.
- [ ] **Controlled test before launch** — Verify one clearly marked dummy buyer submission creates the correct Top Producer record and task plan; then delete the test record and tasks before publishing or campaign linking.
- [ ] **Brokerage/compliance completion** — Confirm business/brokerage disclosures, Privacy Notice details, public contact information, CAPTCHA provider configuration, and the human opt-out process before merge/publish.
