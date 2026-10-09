# Website Buyer Lead Bridge — Implementation Plan

## Scope

Create a **buyer-only** capture path for `radurealtor.com` that is safe to review before publication. It is deliberately separate from the active CityBlast Gmail router.

The implementation includes:

- `buyer-planning.html`: an accessible, mobile-first buyer consultation landing page.
- `privacy.html`: a plain-language Privacy Notice draft for the form path.
- `assets/lead-form.*`: presentation, client validation, UTM collection, and a configuration gate.
- `integrations/Website_Lead_Gateway.gs`: a separate Google Apps Script Web App source that validates, rate-limits, verifies CAPTCHA, and emits Top Producer metadata emails.

## Required behavior

- Exact CRM source: `Website - Buyer`.
- Exact Top Producer type: `Buyer`.
- Email and name required; phone optional unless visitor selects phone/text as their preferred contact method.
- Phone input uses an explicit 10-digit U.S. example, formats the entry as the visitor types, and becomes required only when phone/text is selected.
- SMS is **not enabled**: no SMS consent field or automated messaging behavior is included.
- The launch form does not request consent for general marketing or newsletter emails; every submission is recorded as `Email updates: no`.
- Form sends only after a configured gateway endpoint and CAPTCHA site key are present.
- A visible, in-context success or error panel appears immediately above the submit button. A successful browser handoff confirms that the request was sent for processing; CAPTCHA expiry tells the visitor to check the box again.
- Default commit is not public-launch ready: the page has `noindex` and is not linked from the existing homepage until publication is explicitly authorized. The buyer page uses the approved two-line identity block — “Radu G. Muresan | Independent Real Estate Broker” paired with “Illinois Licensed Real Estate Managing Broker · Lic. #471.012113” — without a street address or a marketing-email opt-in, and its Privacy Notice uses approved reasonable-need retention wording.

## Architecture

```
Buyer landing page (GitHub Pages)
  → Google reCAPTCHA v2 checkbox + honeypot + client validation
  → separate Google Apps Script Website Lead Gateway
  → HTML metadata email to Top Producer @myleads intake
  → Top Producer source rule: Website - Buyer / Buyer
```

The client never receives the Top Producer intake address or CAPTCHA secret. Gateway configuration is held in Apps Script Script Properties; the public page configuration includes only the deployed endpoint and Google reCAPTCHA site key.

## Design direction

**Movement:** editorial real-estate concierge.
**Core principles:** calm authority, focused intent, generous whitespace, transparent privacy.
**Color philosophy:** deep navy signals professional judgment; muted gold marks the next action; warm off-white prevents a clinical form experience.
**Layout:** a compact editorial information column alongside a clearly bounded form panel, collapsing to a single reading flow on mobile.
**Signature elements:** the existing `radu-muresan-mark.png` logo beside the broker name, a gold rule, property-line motif, and restrained navy form card.
**Interaction:** no distracting animation; visible focus states and concise inline validation.
**Typography:** DM Serif Display for headings; Source Sans 3 for readable form controls and body copy.
**Brand essence:** personal Chicago-area buyer guidance that starts with a practical next step.
**Voice:** informed, approachable, unhurried. Example: “Start with a clear next step.” / “Tell me what would make your search easier.”

## Structure

| Path | Responsibility |
|---|---|
| `buyer-planning.html` | Static buyer landing page and semantic form fields. |
| `privacy.html` | Form-path Privacy Notice draft. |
| `assets/lead-form.css` | Page-specific responsive styles. |
| `assets/lead-form-config.js` | Public, non-secret gateway configuration; blank values keep submission disabled. |
| `assets/lead-form.js` | Client validation, UTM capture, Google reCAPTCHA interaction, and no-CORS submission. |
| `integrations/Website_Lead_Gateway.gs` | Server-side validation, CAPTCHA verification, rate limiting, and CRM metadata email. |
| `integrations/README.md` | Deployment/configuration instructions and controlled-test checklist. |

## Constraints

The deployed gateway and Google reCAPTCHA configuration have passed controlled end-to-end testing. On October 9, 2026, the source/type mapping and the seven-task response plan were also verified; the test contact and its generated tasks were deleted. IDFPR also verifies Radu G. Muresan as an active Licensed Real Estate Managing Broker (License #471.012113) through April 30, 2027. The approved identity block uses “Independent Real Estate Broker” only as a descriptor paired with the verified managing-broker credential. No street address is to be displayed and no marketing-email opt-in is included. The Privacy Notice uses approved reasonable-need retention wording and includes a five-year transaction-record statement. This branch must **not** be merged or linked from campaign CTAs until publication is explicitly authorized. See `Compliance_Release_Check.md` for the specific publication decisions.
