import { isText } from "./is-text.js";
import { LazyDefinerLike, LeyyoLike } from "../type.js";
import { packageJson } from "../sys/index.js";
import { setFqnInstance } from "./set-fqn-instance.js";
import { $$_get_leyyo_fn } from "./internal.js";

let _leyyo: LeyyoLike;

/**
 * Define a lazy instance
 *
 * @param {string} pck - package name
 * @param {string?} postfix - optional postfix for fqn name
 * @return {LazyDefinerLike} - lazy definer
 * */
export function defineLazy(pck: string, postfix?: string): LazyDefinerLike {
  if (!isText(pck)) {
    const { PCK } = packageJson(import.meta.url);
    pck = PCK;
  }
  if (!_leyyo) {
    _leyyo = $$_get_leyyo_fn();
  }
  const ins = new _leyyo.lazyDefiner(pck);
  if (isText(postfix)) {
    postfix = "lazy_" + postfix.split(".").join("");
  } else {
    postfix = "lazy";
  }
  setFqnInstance(ins, pck, postfix);
  return ins;
}
