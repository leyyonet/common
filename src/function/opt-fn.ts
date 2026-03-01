import { isObj } from "./is-obj.js";
import { Opt } from "../type.js";

// noinspection JSUnusedGlobalSymbols
/**
 * It's used to easy arrow function usage for lazy evaluation of options
 *
 * @param {Opt} options - options
 * @return {Opt} - options
 * */
export function optFn<O extends Opt = Opt>(options: O | Opt): O {
  return (isObj(options) ? options : {}) as O;
}
