import { PCK } from "../internal.js";
import { testCase } from "./test-case.js";
import { LeyyoLike } from "../type.js";
import { $$_get_leyyo_fn } from "./internal.js";

const where = `${PCK}.DeleteProp`;
let _leyyo: LeyyoLike;

/**
 * Delete target property
 *
 * @param {any} target - target
 * @param {string} key - key
 * @return {boolean} - is deleted?
 * */
export function deleteKey(target: unknown, key: string): boolean {
  if (typeof key !== "string") {
    return false;
  }
  return deleteProp(target, key);
}

/**
 * Delete target hidden property
 *
 * @param {any} target - target
 * @param {symbol} key - hidden key
 * @return {boolean} - is deleted?
 * */
export function deleteSymbol(target: unknown, key: symbol): boolean {
  if (typeof key !== "symbol") {
    return false;
  }
  return deleteProp(target, key);
}

/**
 * Delete target property
 *
 * @param {any} target - target
 * @param {(symbol|string)} key - key
 * @return {boolean} - is deleted?
 * */
export function deleteProp(target: unknown, key: symbol | string): boolean {
  if (!["symbol", "string"].includes(typeof key)) {
    return false;
  }
  if (!target || !["object", "function"].includes(typeof target)) {
    return false;
  }
  try {
    delete target[key];
    return true;
  } catch (e) {
    // nothing
  }
  try {
    Object.defineProperty(target, key, {
      value: undefined,
      configurable: true,
      writable: false,
      enumerable: typeof key === "string",
    });
    delete target[key];
    return true;
  } catch (e) {
    if (!_leyyo) {
      _leyyo = $$_get_leyyo_fn();
    }
    new _leyyo.developerError(
      `Unexpected error during set name [${key.toString()}]`,
      testCase(PCK, "prop", "delete-error"),
      where,
    ).log(e);
    return false;
  }
}
