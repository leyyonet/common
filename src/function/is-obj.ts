/**
 * Is bare object?
 * Means:
 * - `constructor === "Object"`
 *
 * @param {any} obj - given value
 * @return {boolean} - is bare object?
 * */
export function isObj(obj: unknown): boolean {
    return obj && typeof obj === 'object' && !Array.isArray(obj);
}
