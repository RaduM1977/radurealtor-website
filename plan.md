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
- SMS is **not enabled**: no SMS consent field or automated messaging behavior is included.
- Email updates remain optional and unchecked.
- Form sends only after a configured gateway endpoint and CAPTCHA site key are present.
- Default commit is not public-launch ready: the page has `noindex` and is not linked from the existing homepage until the brokerage/privacy details and gateway deployment are complete.

## Architecture

```
Buyer landing page (GitHub Pages)
  → Cloudflare Turnstile + honeypot + client validation
  → separate Google Apps Script Website Lead Gateway
  → HTML metadata email to Top Producer @myleads intake
  → Top Producer source rule: Website - Buyer / Buyer
```

The client never receives the Top Producer intake address or CAPTCHA secret. Gateway configuration is held in Apps Script Script Properties; the public page configuration includes only the deployed endpoint and Turnstile site key.

## Design direction

**Movement:** editorial real-estate concierge.
**Core principles:** calm authority, focused intent, generous whitespace, transparent privacy.
**Color philosophy:** deep navy signals professional judgment; muted gold marks the next action; warm off-white prevents a clinical form experience.
**Layout:** a compact editorial information column alongside a clearly bounded form panel, collapsing to a single reading flow on mobile.
**Signature elements:** a gold rule, property-line motif, and restrained navy form card.
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
| `assets/lead-form.js` | Client validation, UTM capture, Turnstile interaction, and no-CORS submission. |
| `integrations/Website_Lead_Gateway.gs` | Server-side validation, CAPTCHA verification, rate limiting, and CRM metadata email. |
| `integrations/README.md` | Deployment/configuration instructions and controlled-test checklist. |

## Constraints

The brokerage identity, mailing address, final Privacy Notice details, and public gateway/CAPTCHA values are not yet confirmed. This branch must **not** be merged or linked from campaign CTAs until those settings are complete and the controlled CRM test passes.
