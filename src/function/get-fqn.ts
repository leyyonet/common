import { KEY_ENUM_NAME, KEY_FQN_NAME, KEY_LITERAL_NAME } from "../const/index.js";
import { FqnTarget } from "./index.types.js";

/**
 * Get fqn name
 *
 * @param {FqnTarget} target - target (function, class, instance, enum, literal)
 * @return {string} - fully qualified name
 * */
export function getFqn(target: FqnTarget): string {
  if (!target) {
    return undefined;
  }
  if (typeof target === "function") {
    // function, class
    return target[KEY_FQN_NAME] ?? target.name;
  } else if (typeof target === "object") {
    if (Array.isArray(target)) {
      if (target[KEY_LITERAL_NAME]) {
        return target[KEY_FQN_NAME] ?? target[KEY_LITERAL_NAME];
      }
      return undefined;
    }
    if (target[KEY_ENUM_NAME]) {
      return target[KEY_FQN_NAME] ?? target[KEY_ENUM_NAME];
    }
    return target.constructor !== Object ? getFqn(target.constructor) : undefined;
  }
  return undefined;
}
