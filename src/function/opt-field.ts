import { isObj } from "./is-obj.js";
import { Opt } from "./index.types.js";
import { KeyValue } from "../base/index.js";

/**
 * Add field into options
 * Note: field could not be multiple in option
 *
 * @param {Opt} options - source options
 * @param {KeyValue} field - value
 * @return {Opt} - added options
 * */
export function optField<O extends Opt = Opt>(options: O | Opt, field: KeyValue): O {
  const o = (isObj(options) ? options : {}) as O;
  const t = typeof field;
  if (!["string", "number"].includes(t)) {
    return o;
  }
  if (o.field !== undefined) {
    if (typeof o.field !== "string") {
      o.field = "";
    }
  } else {
    o.field = "";
  }

  if (!o.field) {
    o.field = t === "string" ? (field as string) : `$.[${field}]`;
  } else {
    o.field += t === "string" ? `.${field}` : `[${field}]`;
  }
  return o;
}
