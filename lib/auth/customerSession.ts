import crypto from 'crypto';

// Musteri oturum cookie'si icin basit HMAC tabanli token olusturma / dogrulama.
// Buradaki token, cookie icine yaziliyor; gercek kimlik dogrulama yine
// veritabanindan ilgili musteri kaydini cekerken yapiliyor.

const SESSION_SECRET =
  process.env.CUSTOMER_SESSION_SECRET ||
  process.env.ADMIN_PASSWORD ||
  'change-me-in-production';

export function createCustomerSessionToken(customerId: string): string {
  const timestamp = Date.now().toString();
  const payload = `${customerId}|${timestamp}`;

  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');

  return `${payload}|${signature}`;
}

export function verifyCustomerSessionToken(
  token: string,
): { ok: boolean; customerId?: string } {
  const parts = token.split('|');
  if (parts.length !== 3) return { ok: false };

  const [customerId, timestamp, signature] = parts;
  const payload = `${customerId}|${timestamp}`;

  const expected = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');

  try {
    const a = Buffer.from(signature, 'hex');
    const b = Buffer.from(expected, 'hex');
    if (!crypto.timingSafeEqual(a, b)) return { ok: false };
  } catch {
    return { ok: false };
  }

  return { ok: true, customerId };
}

