/*
 * Website Lead Gateway — Top Producer
 *
 * Separate Google Apps Script Web App for buyer form submissions.
 * Configure Script Properties before deployment:
 *   TOP_PRODUCER_LEAD_EMAIL  (the existing @myleads.io intake address)
 *   TURNSTILE_SECRET_KEY     (server-side secret; never place in website files)
 *
 * Deployment: Execute as the Google account owner; access: Anyone.
 * Turnstile must be configured to allow the live website domain.
 */

var WEBSITE_SOURCE = 'Website - Buyer';
var WEBSITE_LEAD_TYPE = 'Buyer';
var RATE_LIMIT_SECONDS = 15 * 60;
var MAX_MESSAGE_LENGTH = 1500;

function doPost(e) {
  try {
    var payload = parsePayload_(e);
    validatePayload_(payload);

    if (payload.honeypot) {
      return response_({ ok: true });
    }
    if (isRateLimited_(payload.email)) {
      return response_({ ok: false, error: 'Please wait before submitting another request.' });
    }

    verifyTurnstile_(payload.turnstileToken);
    sendLeadToTopProducer_(payload);
    return response_({ ok: true });
  } catch (error) {
    console.error('Website lead rejected: ' + error.message);
    return response_({ ok: false, error: 'Unable to process this request.' });
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Missing form payload');
  }
  var payload = JSON.parse(e.postData.contents);
  return payload && typeof payload === 'object' ? payload : {};
}

function validatePayload_(lead) {
  var name = clean_(lead.name, 100);
  var email = clean_(lead.email, 254).toLowerCase();
  var contactMethod = clean_(lead.contactMethod, 16);

  if (!name) throw new Error('Missing name');
  if (!isEmail_(email)) throw new Error('Invalid email');
  if (['email', 'phone', 'text'].indexOf(contactMethod) === -1) {
    throw new Error('Invalid contact method');
  }
  if ((contactMethod === 'phone' || contactMethod === 'text') && !clean_(lead.phone, 30)) {
    throw new Error('Missing requested contact phone');
  }
  if (clean_(lead.source, 100) !== WEBSITE_SOURCE || clean_(lead.type, 20) !== WEBSITE_LEAD_TYPE) {
    throw new Error('Unexpected lead source');
  }
  if (!clean_(lead.turnstileToken, 4096)) throw new Error('Missing CAPTCHA token');
}

function verifyTurnstile_(token) {
  var secret = getRequiredProperty_('TURNSTILE_SECRET_KEY');
  var request = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    payload: { secret: secret, response: token },
    muteHttpExceptions: true
  });
  var result = JSON.parse(request.getContentText() || '{}');
  if (!result.success) {
    throw new Error('CAPTCHA validation failed');
  }
}

function isRateLimited_(email) {
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email);
  var key = 'website-lead:' + Utilities.base64EncodeWebSafe(digest);
  var cache = CacheService.getScriptCache();
  if (cache.get(key)) return true;
  cache.put(key, '1', RATE_LIMIT_SECONDS);
  return false;
}

function sendLeadToTopProducer_(lead) {
  var email = clean_(lead.email, 254).toLowerCase();
  var name = clean_(lead.name, 100);
  var phone = clean_(lead.phone, 30);
  var timeline = clean_(lead.timeline, 60);
  var financing = clean_(lead.financing, 80);
  var budget = clean_(lead.budget, 20);
  var areas = clean_(lead.areas, 160);
  var message = clean_(lead.message, MAX_MESSAGE_LENGTH);
  var metadataMessage = buildLeadMessage_(lead, areas, message);

  var html = '<!doctype html><html><head>' +
    meta_('lead_information_version', '1.0') +
    meta_('lead_source', WEBSITE_SOURCE) +
    meta_('lead_type', WEBSITE_LEAD_TYPE) +
    meta_('lead_name', name) +
    meta_('lead_email', email) +
    meta_('lead_phone', phone) +
    meta_('lead_time_frame', timeline) +
    meta_('lead_financing', financing) +
    meta_('lead_max_price', budget) +
    meta_('lead_message', metadataMessage) +
    '</head><body><p><strong>Website buyer planning request</strong></p>' +
    '<p>Name: ' + escapeHtml_(name) + '<br>Email: ' + escapeHtml_(email) + '<br>Phone: ' + escapeHtml_(phone) + '</p>' +
    '<p>' + escapeHtml_(metadataMessage).replace(/\n/g, '<br>') + '</p>' +
    '</body></html>';

  var plain = [
    'Source: ' + WEBSITE_SOURCE,
    'Name: ' + name,
    'Email: ' + email,
    'Phone: ' + phone,
    'Address: ',
    'MLS Number: ',
    'Notes: ' + metadataMessage
  ].join('\n');

  GmailApp.sendEmail(getRequiredProperty_('TOP_PRODUCER_LEAD_EMAIL'), 'Website buyer request — ' + name, plain, {
    htmlBody: html,
    name: 'Radu G. Muresan'
  });
}

function buildLeadMessage_(lead, areas, message) {
  return [
    'Form: buyer-consultation',
    'Landing page: ' + clean_(lead.landingPage, 200),
    'Campaign: ' + clean_(lead.utmCampaign, 200),
    'Channel: ' + clean_(lead.utmSource, 120) + ' / ' + clean_(lead.utmMedium, 120),
    'Creative: ' + clean_(lead.utmContent, 200),
    'Language: ' + clean_(lead.language, 20),
    'Areas of interest: ' + areas,
    'Requested contact method: ' + clean_(lead.contactMethod, 16),
    'Email updates consent: ' + clean_(lead.emailUpdates, 8),
    'SMS consent: not requested',
    'Privacy notice version: ' + clean_(lead.privacyNoticeVersion, 20),
    'Visitor message: ' + message
  ].join('\n');
}

function getRequiredProperty_(key) {
  var value = PropertiesService.getScriptProperties().getProperty(key);
  if (!value) throw new Error('Missing Script Property: ' + key);
  return value;
}

function clean_(value, limit) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, limit || 500);
}

function isEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function meta_(name, value) {
  return '<meta name="' + escapeHtml_(name) + '" content="' + escapeHtml_(value) + '">';
}

function escapeHtml_(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function response_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
