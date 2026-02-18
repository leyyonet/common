import {isObj} from "./is-obj.js";

/**
 * Is filled object?
 * Means:
 * - `constructor === "Object"`
 * - `obj.keys.length > 0`
 *
 * @param {any} obj - given value
 * @return {boolean} - is filled object?
 * */
export function isFilledObj(obj: unknown): boolean {
    return isObj(obj) && Object.keys(obj).length > 0;
}
