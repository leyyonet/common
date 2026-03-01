import { Fnc, LeyyoLike } from "../type.js";
import { PCK } from "../internal.js";
import { $$_get_leyyo_fn } from "./internal.js";
import { isClass } from "./is-class.js";
import { isText } from "./is-text.js";
import { testCase } from "./test-case.js";
import { KEY_ENUM_NAME, KEY_FQN_NAME, KEY_LITERAL_NAME, VAL_FQN_ANONYMOUS } from "../const.js";
import { FqnTarget } from "../type.js";
import { triggerFqn } from "./trigger-fqn.js";
import { setAnonymousName } from "./set-anonymous-name.js";
import { getFqn } from "./get-fqn.js";

const where = `${PCK}.FqnFn`;
let _leyyo: LeyyoLike;

/**
 * Set fqn name
 *
 * @param {FqnTarget} target - target (function, class, instance, enum, literal)
 * @param {string} pck - package name
 * @return {string} - full name
 * */
export function setFqn(target: FqnTarget, pck: string): string {
  if (!_leyyo) {
    _leyyo = $$_get_leyyo_fn();
  }
  if (!isText(pck)) {
    new _leyyo.developerError("Invalid package name", testCase(PCK, 150), where).log();
    return undefined;
  }
  if (pck.startsWith(".") || pck.endsWith(".")) {
    new _leyyo.developerError("Invalid package name with dots", testCase(PCK, "ZZZ"), where).log();
    return undefined;
  }
  if (pck.startsWith(VAL_FQN_ANONYMOUS)) {
    new _leyyo.developerError("Anonymous package is used", testCase(PCK, "ZZZ"), where).log();
    return undefined;
  }
  if (!target) {
    new _leyyo.developerError(`Empty target [${pck}]`, testCase(PCK, 151), where).log();
    return undefined;
  }

  if (typeof target === "function") {
    // function, class
    if (!target.name) {
      setAnonymousName(target as Fnc, isClass(target) ? "Class" : "function");
    }
    return _item(target, target.name, pck);
  } else if (typeof target === "object") {
    if (Array.isArray(target)) {
      if (target[KEY_LITERAL_NAME]) {
        return _item(target, target[KEY_LITERAL_NAME], pck);
      }
      return undefined;
    }
    if (target[KEY_ENUM_NAME]) {
      return _item(target, target[KEY_ENUM_NAME], pck);
    }
    new _leyyo.developerError(`Instance could not be set`, testCase(PCK, 152), where).log();
    return getFqn(target.constructor);
  }
  new _leyyo.developerError(`Invalid target [${pck}]`, testCase(PCK, 152), where).log();
  return undefined;
}

function _item(target: FqnTarget, name: string, fqn: string): string {
  const full = `${fqn}.${name}`;
  target[KEY_FQN_NAME] = full;
  triggerFqn(target, full);
  return full;
}
