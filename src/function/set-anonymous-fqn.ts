import {KEY_ENUM_NAME, KEY_FQN_NAME, KEY_LITERAL_NAME, VAL_FQN_ANONYMOUS} from "../const";
import {FqnTarget} from "./index.types";
import {triggerFqn} from "./trigger-fqn";

let _count = 0;

export function setAnonymousFqn(target: FqnTarget): string {
    if ( !target) {
        return undefined;
    }
    if (typeof target === 'function') { // function, class
        return _item(target, target.name);
    }
    else if (typeof target === 'object') {
        if (Array.isArray(target)) {
            if (target[KEY_LITERAL_NAME]) {
                return _item(target, target[KEY_LITERAL_NAME]);
            }
            return undefined;
        }
        if (target[KEY_ENUM_NAME]) {
            return _item(target, target[KEY_ENUM_NAME]);
        }
        return target.constructor !== Object ? setAnonymousFqn(target.constructor) : undefined;
    }
    return undefined;
}

function _item(target: FqnTarget, name: string): string {
    if ( !target[KEY_FQN_NAME]) {
        _count++;
        const full = `${VAL_FQN_ANONYMOUS}#${_count}.${name}`;
        target[KEY_FQN_NAME] = full;
        triggerFqn(target, full);
        return full;
    }
    return target[KEY_FQN_NAME];
}
