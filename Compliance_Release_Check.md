# Buyer Form Pre-Launch Disclosure Checklist

> **Status: hold for brokerage review.** The technical buyer intake is working, but this landing page must remain unlinked and `noindex` until the items below are confirmed. This is an implementation checklist, not legal advice.

## What is ready

The buyer form is protected with Google reCAPTCHA and a honeypot, passes through the deployed Google Apps Script gateway, and creates a `Website - Buyer` / `Buyer` contact in Top Producer. The response rule also attaches seven **manual** follow-up tasks over 14 days. The controlled test was completed on October 9, 2026 and its contact and generated tasks were deleted.

## Required launch decisions

1. **Sponsoring broker identity.** Provide the sponsoring broker’s exact registered business name. If it is a franchise, include both the franchise affiliation and individual firm name. This name must appear with Radu G. Muresan on the buyer page and be at least as prominent as his name.
2. **Broker identity and office location.** Confirm the public name/title to show, whether `5030 N Marine Dr, Chicago, IL 60640` is the approved office or mailing address, and the public office city/state. The existing website metadata uses that address, the phone number `(773) 860-7617`, and `radu.realtor@yahoo.com`; do not carry those values into the final disclosure without confirming them.
3. **License information.** Confirm the license number and whether Radu is a sponsored broker, managing broker, or designated managing broker. The page should use only the accurate role/title.
4. **Privacy Notice ownership.** Approve the final address, contact details, retention/deletion practice, and provider disclosure. The draft must name the launch providers: Google reCAPTCHA, Google Apps Script, and Top Producer CRM.
5. **Optional email updates.** Decide who maintains the opt-out process. The checkbox is optional and unchecked; no automated email or SMS campaign is activated by this bridge. If updates will be sent later, the sender must preserve the consent and honor unsubscribe requests.
6. **Publication authorization.** After the above is approved, remove `noindex`, link the buyer page from the relevant CTA, use the final Privacy Notice, and merge the draft pull request.

## Why the sponsoring-broker detail is a blocker

Illinois requires advertising to include the sponsoring broker’s name. When both the broker’s and individual licensee’s names are displayed, the sponsoring broker’s name must be at least equal in size or prominence. The statute also says a sponsored licensee advertises under the sponsoring broker’s business name and that the sponsoring broker’s business name and the licensee’s name must appear in all advertisements. [1] [2]

A national REALTOR® model Internet Advertising Rule similarly calls for the licensee name, registered firm name, office city/state, and licensing jurisdiction on the home page or a clearly identified link for real-estate brokerage-service marketing. [3]

## Technical release sequence after approval

1. Add the confirmed sponsoring-broker disclosure to `buyer-planning.html` and `privacy.html`.
2. Replace the Privacy Notice’s draft language and provider placeholders with approved text.
3. Re-run the form’s controlled test on the real published domain if the domain, gateway, or reCAPTCHA setting changes.
4. Add the page link to the website CTA, remove `noindex`, and merge the draft PR.
5. Retain the manual task plan and response rule; no outbound messages are sent automatically.

**Prepared by:** Manus AI

## References

[1]: https://www.ilga.gov/Documents/legislation/ilcs/documents/022504540K10-30.htm "Illinois Real Estate License Act, Section 10-30 Advertising"

[2]: https://www.ilga.gov/ftp/JCAR/AdminCode/068/068014500G07150R.html "Illinois Administrative Code Section 1450.715 Advertising"

[3]: https://www.nar.realtor/legal/risk-management/nar-internet-advertising-policy "NAR Model Internet Advertising Rule"
