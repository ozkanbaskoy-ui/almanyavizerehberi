import crypto from 'crypto';

// Basit PBKDF2 tabanli sifre hash fonksiyonlari.
// Bu fonksiyonlar sadece sunucu tarafinda (Node.js runtime) kullanilmalidir.

const ITERATIONS = 120_000;
const KEY_LEN = 64;
const DIGEST = 'sha512';

export function hashPassword(plain: string): {
  salt: string;
  hash: string;
} {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(plain, salt, ITERATIONS, KEY_LEN, DIGEST)
    .toString('hex');

  return { salt, hash };
}

export function verifyPassword(
  plain: string,
  salt: string,
  hash: string,
): boolean {
  const derived = crypto
    .pbkdf2Sync(plain, salt, ITERATIONS, KEY_LEN, DIGEST)
    .toString('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(derived, 'hex'),
    );
  } catch {
    return false;
  }
}

