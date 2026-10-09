/*
 * Public configuration only. Do not place the Top Producer intake address,
 * CAPTCHA secret, or any other credential in this file.
 *
 * Keep endpoint and turnstileSiteKey blank until the separate Website Lead
 * Gateway has been deployed and the brokerage/compliance review is complete.
 */
window.WEBSITE_LEAD_FORM_CONFIG = Object.freeze({
  endpoint: "",
  turnstileSiteKey: "",
  leadSource: "Website - Buyer",
  leadType: "Buyer",
  privacyNoticeVersion: "2026-10-08"
});
