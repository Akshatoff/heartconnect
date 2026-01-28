import { createHash } from "crypto";

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  return createHash("sha256").update(Math.random().toString()).digest("hex");
}

/**
 * Verify CSRF token
 */
export function verifyCsrfToken(token: string, storedToken: string): boolean {
  return token === storedToken;
}
