// noinspection JSUnusedGlobalSymbols
/**
 * Generate next delay time with exponential & randomized manner
 *
 * @param {number} tryCount - try count
 * @param {number} baseDelay - starting delay interval
 * @param {number} maxDelay - maximum delay interval
 * @param {number} maxTryCount - max try count, if `tryCount` excess it, it returns undefined
 * @return {number} - next interval time if (maxTryCount && `tryCount` >= `maxTryCount`)
 * */
export function jitterInterval(
  tryCount: number,
  baseDelay: number,
  maxDelay: number,
  maxTryCount?: number,
): number {
  if ([tryCount, baseDelay, maxDelay].some((v) => !isValid(v))) {
    return undefined;
  }
  if (isValid(maxTryCount) && tryCount >= maxTryCount) {
    return undefined;
  }
  const exp = Math.min(baseDelay * 2 ** tryCount, maxDelay);
  const result = Math.floor(exp / 2 + Math.random() * (exp / 2));
  return Number.isSafeInteger(result) ? result : undefined;
}

/**
 * Check value is expected interval value
 *
 * @param {any} value - given value, possible number
 * @return {boolean} - is it expected?
 * */
function isValid(value: unknown): boolean {
  return (
    typeof value === "number" && value > 0 && Number.isInteger(value) && Number.isSafeInteger(value)
  );
}
