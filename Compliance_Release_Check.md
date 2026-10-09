# Buyer Form Pre-Launch Disclosure Checklist

> **Status: ready for publication approval.** The technical buyer intake, broker identity, request-only email policy, and Privacy Notice retention wording are confirmed. This landing page remains unlinked and `noindex` until publication is explicitly authorized. This is an implementation checklist, not legal advice.

## What is ready

The buyer form is protected with Google reCAPTCHA and a honeypot, passes through the deployed Google Apps Script gateway, and creates a `Website - Buyer` / `Buyer` contact in Top Producer. The response rule also attaches seven **manual** follow-up tasks over 14 days. The controlled test was completed on October 9, 2026 and its contact and generated tasks were deleted.

## Required launch decisions

1. **Broker identity — verified.** The official IDFPR record identifies **Radu G. Muresan** as the active **Illinois Licensed Real Estate Managing Broker** (License #471.012113) through April 30, 2027. The record lists Radu G. Muresan as Managing Broker and no external sponsor or DBA/AKA. The approved display uses **“Independent Real Estate Broker”** only as a descriptor paired with the verified managing-broker credential; it does not claim Designated Managing Broker status.
2. **Street address — confirmed not for publication.** Do not display `5030 N Marine Dr` or any other street address on the buyer page or Privacy Notice. The public form can remain city-neutral/Chicagoland-focused.
3. **Privacy Notice — confirmed.** The notice uses reasonable-need retention wording and states that transaction records are retained for at least five years under Illinois recordkeeping rules. It names Google reCAPTCHA, Google Apps Script, and Top Producer CRM, and publishes email as the privacy-contact method without a street address.
4. **Marketing email — confirmed not for launch.** The optional email-tips checkbox has been removed. The form creates a buyer-planning request only and records `Email updates: no`. No automated email or SMS campaign is activated by this bridge.
5. **Publication authorization.** After the above is approved, remove `noindex`, link the buyer page from the relevant CTA, use the final Privacy Notice, and merge the draft pull request.

## Verified broker identity and advertising disclosure

Illinois requires advertising to include the sponsoring broker’s name for a sponsored licensee. The official IDFPR record instead identifies Radu G. Muresan as the active managing broker, with Radu G. Muresan listed as Managing Broker and no external sponsor/DBA shown. The launch copy will therefore use the verified legal identity, managing-broker title, and license number; it will not invent a separate sponsor. [1] [2]

A national REALTOR® model Internet Advertising Rule similarly calls for the licensee name, registered firm name, office city/state, and licensing jurisdiction on the home page or a clearly identified link for real-estate brokerage-service marketing. [3]

## Technical release sequence after approval

1. Use the verified managing-broker disclosure in `buyer-planning.html` and `privacy.html` without adding a street address.
2. Re-run the form’s controlled test on the real published domain if the domain, gateway, or reCAPTCHA setting changes.
3. Add the page link to the website CTA, remove `noindex`, and merge the draft PR after explicit publication approval.
4. Retain the manual task plan and response rule; no outbound messages are sent automatically.

**Prepared by:** Manus AI

## References

[1]: https://www.ilga.gov/Documents/legislation/ilcs/documents/022504540K10-30.htm "Illinois Real Estate License Act, Section 10-30 Advertising"

[2]: https://www.ilga.gov/ftp/JCAR/AdminCode/068/068014500G07150R.html "Illinois Administrative Code Section 1450.715 Advertising"

[3]: https://www.nar.realtor/legal/risk-management/nar-internet-advertising-policy "NAR Model Internet Advertising Rule"
