import { EMPTY_VALUES } from "../const.js";

/**
 * Is empty?
 * Means:
 * - `not null`
 * - `not undefined`
 * - `not empty string`
 *
 * @param {any} value - given value
 * @param {boolean?} notSpace - yes: ignore empty string
 * @return {boolean} - is empty?
 * */
export function isEmpty(value: unknown, notSpace?: boolean): boolean {
  if (notSpace) {
    return EMPTY_VALUES.includes(value);
  }
  return EMPTY_VALUES.includes(value) || (typeof value === "string" && !value.trim());
}
