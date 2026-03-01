import { PCK } from "../internal.js";
import { testCase } from "./test-case.js";
import { LeyyoLike } from "../type.js";
import { $$_get_leyyo_fn } from "./internal.js";

const where = `${PCK}.setKey`;
let _leyyo: LeyyoLike;

/**
 * Set target property
 *
 * @param {any} target - target
 * @param {string} key - key
 * @param {any} value
 * @return {boolean} - is set?
 * */
export function setKey(target: unknown, key: string, value: unknown): boolean {
  if (typeof key !== "string") {
    return false;
  }
  return setProp(target, key, value);
}

/**
 * Set target hidden property
 *
 * @param {any} target - target
 * @param {symbol} key - hidden key
 * @param {any} value
 * @return {boolean} - is set?
 * */
export function setSymbol(target: unknown, key: symbol, value: unknown): boolean {
  if (typeof key !== "symbol") {
    return false;
  }
  return setProp(target, key, value);
}

/**
 * Set target property
 *
 * @param {any} target - target
 * @param {(symbol|string)} key - key
 * @param {any} value
 * @return {boolean} - is set?
 * */
export function setProp(target: unknown, key: symbol | string, value: unknown): boolean {
  if (!["symbol", "string"].includes(typeof key)) {
    return false;
  }
  if (!target || !["object", "function"].includes(typeof target)) {
    return false;
  }
  try {
    Object.defineProperty(target, key, {
      value,
      configurable: false,
      writable: false,
      enumerable: typeof key === "string",
    });
    return true;
  } catch (e) {
    if (!_leyyo) {
      _leyyo = $$_get_leyyo_fn();
    }
    new _leyyo.developerError(
      `Unexpected error during set name [${key.toString()}]`,
      testCase(PCK, "ZZZ"),
      where,
    ).log(e);
    return false;
  }
}
