/**
 * Is text?
 * Means:
 * - `typeof === "string"`
 * - `not empty string`
 * - `not starts/ends with space`
 *
 * @param {any} str - given value
 * @return {boolean} - is text?
 * */
export function isText(str: unknown): boolean {
  if (typeof str !== "string") {
    return false;
  }
  const val = str.trim();
  return val && val === str;
}
