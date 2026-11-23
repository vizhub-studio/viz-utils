import type { VizId } from "@vizhub/viz-types";

/**
 * Browser and modern Node.js runtimes expose Web Crypto globally.
 * Avoid importing node:crypto so this package can be bundled for browsers.
 */
const getCryptoObj = (): Crypto => {
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj?.getRandomValues) {
    throw new Error(
      "Web Crypto API (crypto.getRandomValues) is required to generate Viz IDs",
    );
  }
  return cryptoObj;
};

/**
 * Generates a dash-free RFC 4122-compliant UUID v4 (32 hex chars).
 */
export const generateVizId = (): VizId => {
  const bytes = new Uint8Array(16);
  getCryptoObj().getRandomValues(bytes);

  // RFC 4122: set version (4) and variant (10xx)
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
    "",
  ) as VizId;
};
