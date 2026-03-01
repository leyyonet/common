import { KEY_FQN_ON_SET } from "../const.js";
import { FqnOnSetLambda, FqnTarget } from "../type.js";

/**
 * Trigger a callback when target has fqn name
 *
 * - {@link onFqnSet} - callback should be set
 * - {@link setFqn} - callback will be triggered with `full` name
 * - {@link removeFqn} - callback will be triggered with `empty` name
 *
 * @param {FqnTarget} target
 * @param {string?} full - fqn name, it will be undefined when fqn is deleted
 * @return {boolean} - is success?
 * */
export function triggerFqn(target: FqnTarget, full?: string): boolean {
  if (target[KEY_FQN_ON_SET]) {
    const arr = target[KEY_FQN_ON_SET] as Array<FqnOnSetLambda>;
    delete target[KEY_FQN_ON_SET];
    if (Array.isArray(arr)) {
      arr.forEach((callback) => {
        if (typeof callback === "function") {
          try {
            callback(full);
          } catch (_e) {
            // nothing
          }
        }
      });
      return true;
    }
  }
  return false;
}
