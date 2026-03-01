import { LeyyoLike } from "../type.js";
import { Opt, OptFn } from "../type.js";
import { $$_get_leyyo_fn } from "./internal.js";
import { isObj } from "./is-obj.js";
import { PCK } from "../internal.js";

let _leyyo: LeyyoLike;
const where = `${PCK}.optCheck`;

// noinspection JSUnusedGlobalSymbols
/**
 * Check option, if it's invalid, create empty options
 *
 * @param {(Opt|OptFn)} options - options or options callback
 * @return {Opt} - checked options
 * */
export function optCheck<O extends Opt = Opt>(options: O | OptFn<O> | Opt): O {
  let o = options as O;
  if (typeof options === "function") {
    try {
      o = options();
    } catch (e) {
      o = {} as O;
      if (!_leyyo) {
        _leyyo = $$_get_leyyo_fn();
      }
      new _leyyo.developerError("Raised callback run", "optCheck#01", where).log(e);
    }
  } else if (!isObj(options)) {
    o = {} as O;
  }
  return o;
}
