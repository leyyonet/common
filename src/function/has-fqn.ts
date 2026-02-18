import {KEY_ENUM_NAME, KEY_FQN_NAME, KEY_LITERAL_NAME} from "../const/index.js";
import {FqnTarget} from "./index.types.js";

/**
 * Get fqn name
 *
 * @param {FqnTarget} target - target (function, class, instance, enum, literal)
 * @return {string} - fully qualified name
 * */
export function hasFqn(target: FqnTarget): boolean {
    if ( !target) {
        return false;
    }
    if (typeof target === 'function') { // function, class
        return !!target[KEY_FQN_NAME];
    }
    else if (typeof target === 'object') {
        if (Array.isArray(target)) {
            if (target[KEY_LITERAL_NAME]) {
                return !!target[KEY_FQN_NAME];
            }
            return false;
        }
        if (target[KEY_ENUM_NAME]) {
            return !!target[KEY_FQN_NAME];
        }
        return target.constructor !== Object ? hasFqn(target.constructor) : false;
    }
    return false;
}



