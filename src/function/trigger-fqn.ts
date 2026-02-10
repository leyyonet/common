import {KEY_FQN_ON_SET} from "../const";
import {FqnOnSetLambda, FqnTarget} from "./index.types";

export function triggerFqn(target: FqnTarget, full: string): boolean {
    if (target[KEY_FQN_ON_SET]) {
        const arr = target[KEY_FQN_ON_SET] as Array<FqnOnSetLambda>;
        delete target[KEY_FQN_ON_SET];
        if (Array.isArray(arr)) {
            arr.forEach(callback => {
                if (typeof callback === 'function') {
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
