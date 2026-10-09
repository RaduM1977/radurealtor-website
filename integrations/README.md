# Website Lead Gateway deployment guide

This source is intentionally separate from the active **CityBlast to Top Producer Lead Router** project.

## Before deployment

1. Confirm brokerage/privacy wording and final public contact details.
2. Create a Google reCAPTCHA v2 checkbox key for `radurealtor.com` and obtain:
   - public site key (goes in `assets/lead-form-config.js`)
   - secret key (goes only in Apps Script Script Properties)
3. Have the Top Producer buyer source rule ready to match:
   - Source: `Website - Buyer`
   - Contact type: `Buyer`
   - Plan: `Website Buyer — 14-Day Personal Follow-Up`

## Apps Script setup

1. At [Google Apps Script](https://script.google.com/home), create a project named **Website Lead Gateway — Top Producer**.
2. Replace `Code.gs` with `Website_Lead_Gateway.gs`.
3. In **Project Settings → Script properties**, create:
   - `TOP_PRODUCER_LEAD_EMAIL`: the existing Top Producer `@myleads.io` intake address.
   - `RECAPTCHA_SECRET_KEY`: the secret from Google reCAPTCHA.
4. Deploy as a **Web app**: execute as the account owner; access set to the required public level for browser submissions.
5. Copy the deployed `/exec` URL into `assets/lead-form-config.js` as `endpoint`.
6. Copy the public Google reCAPTCHA site key into `assets/lead-form-config.js` as `recaptchaSiteKey`.

## Controlled test

1. Use a clearly fake email such as `website-buyer-test-YYYYMMDD@example.com` and write **CONTROLLED TEST — DO NOT CONTACT** in the message.
2. Submit through the deployed buyer page.
3. Confirm Top Producer creates the contact with:
   - Source: `Website - Buyer`
   - Type: `Buyer`
   - buyer planning details and UTM context in the note
4. Separately confirm the `Website Buyer — 14-Day Personal Follow-Up` plan attaches after its Top Producer response rule is enabled; the source/type intake test does not automatically prove plan attachment.
5. Delete the controlled test contact and all generated tasks.
6. Only then remove the `noindex` tag, link the page from relevant CTAs, and merge/publish.

## Safety notes

- The browser never receives the Top Producer intake address or reCAPTCHA secret.
- Keep the deployed endpoint blank in the public configuration until the gateway is ready.
- The browser uses a cross-origin `no-cors` request because Google Apps Script Web Apps do not provide configurable CORS headers. The success message indicates the request was submitted, not that CRM processing has completed; use the controlled test to validate delivery.
- Do not enable automatic outbound text/email messaging before reviewing actual submissions and consent fields.
