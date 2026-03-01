import { isText } from "./is-text.js";
import { LeyyoLike, PredictorDefinerLike } from "../type.js";
import { packageJson } from "../sys/index.js";
import { setFqnObject } from "./set-fqn-object.js";
import { $$_get_leyyo_fn } from "./internal.js";

let _leyyo: LeyyoLike;

/**
 * Define a predictor instance
 *
 * @param {string} pck - package name
 * @param {string} postfix - optional postfix for fqn name
 * @return {PredictorDefinerLike} - predictor definer
 * */
export function definePredictor(pck: string, postfix?: string): PredictorDefinerLike {
  if (!isText(pck)) {
    const { PCK } = packageJson(import.meta.url);
    pck = PCK;
  }
  if (!_leyyo) {
    _leyyo = $$_get_leyyo_fn();
  }
  const ins = new _leyyo.predictorDefiner(pck);
  if (isText(postfix)) {
    postfix = "predictor_" + postfix.split(".").join("");
  } else {
    postfix = "predictor";
  }
  setFqnObject(ins, pck, postfix);
  return ins;
}
