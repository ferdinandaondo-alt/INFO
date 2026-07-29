import { randomBytes } from 'crypto';

/** Generates a cryptographically random, unguessable token for signed download links. */
export function generateDownloadToken(): string {
  return randomBytes(32).toString('hex');
}

/** Generates a short, human-shareable order number suffix for receipts/emails. */
export function generateOrderReference(): string {
  return randomBytes(4).toString('hex').toUpperCase();
}
