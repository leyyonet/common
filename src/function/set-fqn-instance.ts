import { Arr, LeyyoLike, Obj } from "../type.js";
import { PCK } from "../internal.js";
import { $$_get_leyyo_fn } from "./internal.js";
import { isText } from "./is-text.js";
import { testCase } from "./test-case.js";
import { KEY_ENUM_NAME, KEY_FQN_NAME, KEY_LITERAL_NAME, VAL_FQN_ANONYMOUS } from "../const.js";
import { triggerFqn } from "./trigger-fqn.js";

const where = `${PCK}.setFqnObject`;
let _leyyo: LeyyoLike;

/**
 * Set fqn name to an instance
 *
 * @param {(Obj|Arr)} target - target (object or array)
 * @param {string} pck - package name
 * @param {string} name - name
 * @return {string} - full name
 * */
export function setFqnInstance<T = Obj | Arr>(target: T, pck: string, name: string): string {
  if (!_leyyo) {
    _leyyo = $$_get_leyyo_fn();
  }
  if (!isText(pck)) {
    new _leyyo.developerError(
      `Invalid package name`,
      testCase(PCK, "fqn", "invalid-package-name"),
      where,
    ).log();
    return undefined;
  }
  if (!isText(name)) {
    new _leyyo.developerError(`Invalid name`, testCase(PCK, "fqn", "invalid-name"), where).log();
    return undefined;
  }

  [
    ["package", pck],
    ["name", name],
  ].forEach((tuple) => {
    const [field, value] = tuple;
    if (value.startsWith(".") || value.endsWith(".")) {
      new _leyyo.developerError(
        `Invalid ${field} with dots`,
        testCase(PCK, "fqn", "contains-dot"),
        where,
      ).log();
      return undefined;
    }
    if (field === "package" && value.startsWith(VAL_FQN_ANONYMOUS)) {
      new _leyyo.developerError(
        "Anonymous package is used",
        testCase(PCK, "fqn", "starts-with-anonymous"),
        where,
      ).log();
      return undefined;
    }
  });
  if (!target || typeof target !== "object") {
    new _leyyo.developerError(
      `Invalid target [${pck}, ${name}]`,
      testCase(PCK, "fqn", "invalid-target"),
      where,
    ).log();
    return undefined;
  }

  if (Array.isArray(target) && target[KEY_LITERAL_NAME]) {
    new _leyyo.developerError(
      `Already literal [${target[KEY_LITERAL_NAME]}, ${pck}, ${name}]`,
      testCase(PCK, "fqn", "already-literal"),
      where,
    ).log();
    return undefined;
  }
  if (target[KEY_ENUM_NAME]) {
    new _leyyo.developerError(
      `Already enum [${target[KEY_ENUM_NAME]}, ${pck}, ${name}]`,
      testCase(PCK, "fqn", "already-enum"),
      where,
    ).log();
    return undefined;
  }
  const full = `${pck}.${name}`;
  target[KEY_FQN_NAME] = full;
  triggerFqn(target, full);
  return full;
}
