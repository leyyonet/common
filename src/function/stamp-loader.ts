import { LeyyoStampEmpty, LeyyoStampLambda } from "../type.js";
import { KEY_LOADER_EMPTY, KEY_LOADER_STAMP } from "../const.js";

// noinspection JSUnusedGlobalSymbols
/**
 * Stamp an instance for loader
 *
 * @param {function} fn - callback function to save
 * @return {(LeyyoStampLambda | LeyyoStampEmpty)} - stamped function
 * */
export function stampLoader(fn: LeyyoStampLambda): LeyyoStampLambda | LeyyoStampEmpty {
  if (typeof fn === "function") {
    fn[KEY_LOADER_STAMP] = true;
    return fn;
  }
  return (() => KEY_LOADER_EMPTY) as LeyyoStampEmpty;
}
