/**
 * Is filled array?
 * Means
 * - `constructor === "Array"`
 * - `arr.length > 0`
 *
 * @param {any} arr - given value
 * @return {boolean} - is filled array?
 * */
export function isFilledArr(arr: unknown): boolean {
    return Array.isArray(arr) && arr.length > 0;
}
