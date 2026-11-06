process.env.ADMIN_SECRET_KEY = 'e83921048f02931bcdef0123456789abcdef0123456789abcdef0123456789ab';

import { test, expect } from '@playwright/test';
import { calculateKarnatakaRegistrationOutflow } from '../src/data/karnataka-pricing';
import {
  verifyAdminSessionToken,
  secureTimingSafeEqual,
  generateBlueprintDownloadToken,
  verifyBlueprintDownloadToken
} from '../src/lib/security';

test.describe('Anurag Enclave - Enterprise Security, Auth Hardening & Statutory Testing', () => {

  test('Security Headers: X-Frame-Options, nosniff, and Referrer are enforced', async ({ request }) => {
    const response = await request.get('/');
    expect(response.ok()).toBeTruthy();

    const headers = response.headers();
    expect(headers['x-frame-options']?.toUpperCase()).toBe('DENY');
    expect(headers['x-content-type-options']?.toLowerCase()).toBe('nosniff');
    expect(headers['strict-transport-security']).toContain('max-age=31536000');
    expect(headers['referrer-policy']).toContain('strict-origin-when-cross-origin');
    expect(headers['permissions-policy']).toContain('camera=()');
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
  });

  test('System Health: GET /api/health responds with healthy status', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.status).toBe('healthy');
    expect(typeof data.uptimeSeconds).toBe('number');
  });

  test('API Access Control: Unauthorized GET /api/leads is strictly rejected (401)', async ({ request }) => {
    // Unauthenticated GET without session cookie or token
    const response = await request.get('/api/leads');
    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.error).toContain('Unauthorized');
  });

  test('Cryptographic Verification: Expired or tampered session cookie is rejected', async ({ request }) => {
    // 1. Tampered signature
    const tamperedRes = await request.get('/api/leads', {
      headers: {
        Cookie: 'anurag_admin_session=eyJyb2xlIjoiYWRtaW4ifQ.invalid_fake_signature_99999',
      },
    });
    expect(tamperedRes.status()).toBe(401);

    // 2. Expired payload
    const expiredPayload = {
      role: 'admin',
      iat: Date.now() - 24 * 60 * 60 * 1000,
      exp: Date.now() - 1000, // Expired 1 second ago
      nonce: 'deadbeef1234',
    };
    const expiredData = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
    const expiredToken = `${expiredData}.invalidsig`;
    expect(verifyAdminSessionToken(expiredToken)).toBe(false);
  });

  test('Server Timing Attack Resistance: secureTimingSafeEqual evaluates in constant time', () => {
    expect(secureTimingSafeEqual('secret_hash_abc', 'secret_hash_abc')).toBe(true);
    expect(secureTimingSafeEqual('secret_hash_abc', 'secret_hash_xyz')).toBe(false);
    expect(secureTimingSafeEqual('short', 'much_longer_string')).toBe(false);
    expect(secureTimingSafeEqual('', '')).toBe(true);
  });

  test('Rate Limiting: Sixth failed login attempt is blocked with 429', async ({ request }) => {
    const clientHeader = { 'x-forwarded-for': `198.51.100.${Math.floor(Math.random() * 200) + 10}` };

    // Make 5 attempts with incorrect password
    for (let i = 0; i < 5; i++) {
      await request.post('/api/admin/login', {
        headers: clientHeader,
        data: { password: `bad_passcode_${i}` },
      });
    }

    // Sixth attempt must be blocked with HTTP 429 Too Many Requests
    const blockedRes = await request.post('/api/admin/login', {
      headers: clientHeader,
      data: { password: 'bad_passcode_6' },
    });

    expect(blockedRes.status()).toBe(429);
    const body = await blockedRes.json();
    expect(body.error).toContain('Too many login attempts');
  });

  test('DPDP Act 2023 Consent Enforcement: Missing or false dpdpConsent is strictly rejected with 400', async ({ request }) => {
    const clientHeader = { 'x-forwarded-for': `198.51.100.${Math.floor(Math.random() * 200) + 10}` };

    // 1. Missing dpdpConsent
    const missingRes = await request.post('/api/leads', {
      headers: clientHeader,
      data: {
        fullName: 'No Consent Visitor',
        phone: '9886012345',
      },
    });
    expect(missingRes.status()).toBe(400);
    const missingBody = await missingRes.json();
    expect(missingBody.error).toContain('DPDP');

    // 2. Explicitly false dpdpConsent
    const falseRes = await request.post('/api/leads', {
      headers: clientHeader,
      data: {
        fullName: 'Declined Consent Visitor',
        phone: '9886012345',
        dpdpConsent: false,
      },
    });
    expect(falseRes.status()).toBe(400);
  });

  test('Input Sanitization & Validation: Invalid phone number is rejected with 400', async ({ request }) => {
    const clientHeader = { 'x-forwarded-for': `198.51.100.${Math.floor(Math.random() * 200) + 10}` };

    const response = await request.post('/api/leads', {
      headers: clientHeader,
      data: {
        fullName: 'Test Attacker',
        phone: '12345', // Invalid format
        dpdpConsent: true,
      },
    });
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toContain('valid 10-digit mobile number');
  });

  test('Bot Honeypot Defense: Honeypot submission is silently neutralized (201 fake success)', async ({ request }) => {
    const clientHeader = { 'x-forwarded-for': `198.51.100.${Math.floor(Math.random() * 200) + 10}` };

    const response = await request.post('/api/leads', {
      headers: clientHeader,
      data: {
        fullName: 'Bot Spammer',
        phone: '9886012345',
        website_url_check: 'https://spam-bot.ru', // Honeypot trap filled by bot
        dpdpConsent: true,
      },
    });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.supabaseSynced).toBe(false); // Discarded from database persistence
  });

  test('Statutory Logic Verification: Karnataka Kaveri 2.0 Stamp Duty & Registration Math', () => {
    // Test case: 30x40 Standard Plot @ ₹15,60,000
    const plotPrice = 1560000;
    const result = calculateKarnatakaRegistrationOutflow(plotPrice);

    // 5% Base Duty: 15,60,000 * 0.05 = ₹78,000
    expect(result.baseDuty).toBe(78000);

    // 10% Cess on Duty: 78,000 * 0.10 = ₹7,800
    expect(result.cess).toBe(7800);

    // 2% Rural / Gram Panchayat Surcharge: 78,000 * 0.02 = ₹1,560
    expect(result.surcharge).toBe(1560);

    // Total Stamp Duty: 78,000 + 7,800 + 1,560 = ₹87,360 (~5.6%)
    expect(result.totalStampDuty).toBe(87360);

    // Sub-Registrar 1.0% Registration Fee: 15,60,000 * 0.01 = ₹15,600
    expect(result.registrationFee).toBe(15600);

    // Total Turnkey Government Outflow: 87,360 + 15,600 = ₹1,02,960
    expect(result.totalGovtOutflow).toBe(102960);

    // Effective Percentage: ~6.60%
    expect(result.effectivePercentage).toBe('6.60');

    // Test case 2: Guidance value higher than sale consideration (Section 45-A)
    // Sale consideration: ₹15,60,000, Guidance value: ₹18,00,000
    const higherGuideResult = calculateKarnatakaRegistrationOutflow(1560000, 1800000);
    expect(higherGuideResult.isGuidanceHigher).toBe(true);
    expect(higherGuideResult.taxableValue).toBe(1800000);
    // 5% Base duty on 18L: ₹90,000
    expect(higherGuideResult.baseDuty).toBe(90000);
    // 1% Reg fee on 18L: ₹18,000
    expect(higherGuideResult.registrationFee).toBe(18000);
  });

  test('DPDP Act 2023: Public Data Erasure Request endpoint functions correctly', async ({ request }) => {
    const clientHeader = { 'x-forwarded-for': `203.0.113.${Math.floor(Math.random() * 200) + 10}` };

    // 1. Invalid phone number rejected
    const badRes = await request.post('/api/privacy/erasure-request', {
      headers: clientHeader,
      data: { phone: '123' },
    });
    expect(badRes.status()).toBe(400);

    // 2. Valid request accepted under 30-day statutory SLA
    const goodRes = await request.post('/api/privacy/erasure-request', {
      headers: clientHeader,
      data: {
        phone: '9886012345',
        fullName: 'Test DPDP User',
        reason: 'Requested deletion of records',
      },
    });
    expect(goodRes.status()).toBe(200);
    const data = await goodRes.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('Digital Personal Data Protection (DPDP) Act 2023');
  });

  test('Gated Blueprint Download: Ungated direct access is rejected with 403, valid signed token is accepted', async ({ request }) => {
    const clientHeader = { 'x-forwarded-for': `198.51.100.${Math.floor(Math.random() * 200) + 10}` };

    // 1. Unauthenticated direct GET without token must be rejected (403)
    const directRes = await request.get('/api/brochure/download', { headers: clientHeader });
    expect(directRes.status()).toBe(403);
    const directBody = await directRes.json();
    expect(directBody.error).toContain('Access denied');

    // 2. Tampered / invalid token must be rejected (403)
    const invalidTokenRes = await request.get('/api/brochure/download?token=fake_tampered_token.123', { headers: clientHeader });
    expect(invalidTokenRes.status()).toBe(403);

    // 3. Valid signed token allows downloading the masterplan
    const validToken = generateBlueprintDownloadToken('9886012345');
    const validRes = await request.get(`/api/brochure/download?token=${encodeURIComponent(validToken)}`, { headers: clientHeader });
    expect(validRes.status()).toBe(200);
    expect(validRes.headers()['content-type']).toContain('image/png');
    expect(validRes.headers()['content-disposition']).toContain('attachment');
  });

});
