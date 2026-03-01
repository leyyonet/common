import { isObj } from "./is-obj.js";
import { Opt } from "../type.js";
import { optAdd } from "./opt-add.js";

/**
 * Merge two options
 *
 * @param {Opt} options - source options
 * @param {Opt} appended - appended options
 * @return {Opt} - merged options
 * */
export function optAppend<O extends Opt = Opt>(options: O | Opt, appended: O | Opt): O {
  const o = (isObj(options) ? options : {}) as O;
  if (!isObj(appended)) {
    return o;
  }
  for (const [k, v] of Object.entries(appended)) {
    if (o[k] === undefined) {
      o[k as keyof O] = v as O[keyof O];
    } else {
      optAdd(o, k, v);
    }
  }
  return o;
}
