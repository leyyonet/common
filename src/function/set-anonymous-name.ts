import { PCK } from "../internal.js";
import { ClassLike, Fnc, LeyyoLike } from "../type.js";
import { VAL_NAME_ANONYMOUS } from "../const.js";
import { $$_get_leyyo_fn } from "./internal.js";
import { testCase } from "./test-case.js";
import { isClass } from "./is-class.js";
import { isText } from "./is-text.js";

const _pattern = /((?:[a-zA-Z_$][a-zA-Z\d_$]*)*)([a-zA-Z_$][a-zA-Z\d_$]*)/g;
let _counter = 0;
const where = `${PCK}.nameFn`;

let _leyyo: LeyyoLike;

/**
 * Set anonymous name to a function or class
 *
 * @param {(Fnc|ClassLike)} target - function or class
 * @param {string?} prefix - option prefix
 * @return {string} - new name
 * */
export function setAnonymousName(target: Fnc | ClassLike, prefix?: string): string {
  if (typeof target !== "function") {
    if (!_leyyo) {
      _leyyo = $$_get_leyyo_fn();
    }
    throw new _leyyo.developerError(
      `Invalid target`,
      testCase(PCK, "anonymous", "invalid-target"),
      where,
    );
  }
  if (isText(prefix)) {
    if (!_pattern.test(prefix)) {
      if (!_leyyo) {
        _leyyo = $$_get_leyyo_fn();
      }
      throw new _leyyo.developerError(
        `Invalid prefix [${prefix}]`,
        testCase(PCK, "anonymous", "invalid-prefix"),
        where,
      );
    }
  } else {
    prefix = isClass(target) ? "Class" : "function";
  }
  _counter++;
  const name = VAL_NAME_ANONYMOUS + [prefix, _counter].join("$");
  _setName(target, name, false);
  return name;
}

function _setName(target: Fnc | ClassLike, name: string, checkAnonymous: boolean): boolean {
  if (!_leyyo) {
    _leyyo = $$_get_leyyo_fn();
  }
  if (!isText(name)) {
    throw new _leyyo.developerError(
      `Invalid name`,
      testCase(PCK, "anonymous", "invalid-name"),
      where,
    );
  }
  if (name.includes(".")) {
    throw new _leyyo.developerError(
      `Invalid name with dot`,
      testCase(PCK, "anonymous", "contains-dot"),
      where,
    );
  }
  if (checkAnonymous && name.startsWith(VAL_NAME_ANONYMOUS)) {
    throw new _leyyo.developerError(
      `Invalid name with anonymous`,
      testCase(PCK, "anonymous", "starts-with-anonymous"),
      where,
    );
  }
  if (typeof target !== "function") {
    throw new _leyyo.developerError(
      `Invalid target [${name}]`,
      testCase(PCK, "anonymous", "invalid-target"),
      where,
    );
  }
  try {
    Object.defineProperty(target, "name", {
      value: name,
      configurable: true,
      writable: true,
      enumerable: true,
    });
  } catch (e) {
    new _leyyo.developerError(
      `Unexpected error during set name [${name}]`,
      testCase(PCK, "anonymous", "set-error"),
      where,
    ).log(e);
    return false;
  }
  return true;
}
