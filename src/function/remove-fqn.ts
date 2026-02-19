import { KEY_ENUM_NAME, KEY_FQN_NAME, KEY_LITERAL_NAME } from "../const/index.js";
import { FqnTarget } from "./index.types.js";
import { triggerFqn } from "./trigger-fqn.js";

/**
 * Remove fqn name
 *
 * @param {FqnTarget} target - target (function, class, instance, enum, literal)
 * @return {boolean?} - is removed
 *
 * Note: if it returns `undefined`, means that it could not find valid target
 * */
export function removeFqn(target: FqnTarget): boolean {
  if (!target) {
    return false;
  }
  if (typeof target === "function") {
    // function, class
    return _item(target, target.name);
  } else if (typeof target === "object") {
    if (Array.isArray(target)) {
      if (target[KEY_LITERAL_NAME]) {
        return _item(target, target[KEY_LITERAL_NAME]);
      }
      return false; // normal array
    }
    if (target[KEY_ENUM_NAME]) {
      return _item(target, target[KEY_ENUM_NAME]);
    }
    // instance
    return false;
  }
  return false;
}

function _item(target: FqnTarget, name: string): boolean {
  if (target[KEY_FQN_NAME]) {
    delete target[KEY_FQN_NAME];
    triggerFqn(target, name);
    return true;
  }
  return false;
}
