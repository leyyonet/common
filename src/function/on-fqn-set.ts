import {KEY_ENUM_NAME, KEY_FQN_NAME, KEY_FQN_ON_SET, KEY_LITERAL_NAME} from "../const";
import {FqnOnSetLambda, FqnTarget} from "./index.types";

export function onFqnSet(target: FqnTarget, callback: FqnOnSetLambda): boolean {
    if ( !target) {
        return false;
    }
    if (typeof callback !== 'function') {
        return false;
    }
    if (typeof target === 'function') { // function, class
        return _item(target, callback);
    }
    else if (typeof target === 'object') {
        if (Array.isArray(target)) {
            if (target[KEY_LITERAL_NAME]) {
                return _item(target, callback);
            }
            return false;
        }
        if (target[KEY_ENUM_NAME]) {
            return _item(target, callback);
        }
        return target.constructor !== Object ? onFqnSet(target.constructor, callback) : false;
    }
    return false;
}

function _item(target: FqnTarget, callback: FqnOnSetLambda): boolean {
    if (target[KEY_FQN_NAME]) {
        callback(target[KEY_FQN_NAME] as string);
        return true;
    }
    if ( !target[KEY_FQN_ON_SET]) {
        target[KEY_FQN_ON_SET] = [];
    }
    (target[KEY_FQN_ON_SET] as Array<FqnOnSetLambda>).push(callback);
    return false;
}
