import {LeyyoLike} from "../base";
import {FQN} from "../internal";
import {$$get_leyyo_fn} from "./leyyo-fn";
import {isText} from "./is.fn";
import {testCase} from "./test-case";
import {KEY_ENUM_NAME, KEY_FQN_NAME, KEY_LITERAL_NAME, VAL_FQN_ANONYMOUS} from "../const";
import {FqnTarget} from "./index.types";
import {triggerFqn} from "./trigger-fqn";

const where = `${FQN}.FqnFn`;
let _leyyo: LeyyoLike;

/**
 * Set fqn name
 *
 * @param {FqnTarget} target - target (function, class, instance, enum, literal)
 * @param {string} fqn - fully qualified name
 * @return {string} - full name
 * */
export function setFqn(target: FqnTarget, fqn: string): string {
    if ( !_leyyo) {
        _leyyo = $$get_leyyo_fn();
    }
    if ( !isText(fqn)) {
        new _leyyo.developerError('Invalid fqn name', testCase(FQN, 150), where).log();
        return undefined;
    }
    if (fqn.startsWith('.') || fqn.endsWith('.')) {
        new _leyyo.developerError('Invalid fqn name with dots', testCase(FQN, 'ZZZ'), where).log();
        return undefined;
    }
    if (fqn.startsWith(VAL_FQN_ANONYMOUS)) {
        new _leyyo.developerError('Anonymous fqn is used', testCase(FQN, 'ZZZ'), where).log();
        return undefined;
    }
    if ( !target) {
        new _leyyo.developerError(`Empty fqn target [${fqn}]`, testCase(FQN, 151), where).log();
        return undefined;
    }

    if (typeof target === 'function') { // function, class
        return _item(target, target.name, fqn);
    }
    else if (typeof target === 'object') {
        if (Array.isArray(target)) {
            if (target[KEY_LITERAL_NAME]) {
                return _item(target, target[KEY_LITERAL_NAME], fqn);
            }
            return undefined;
        }
        if (target[KEY_ENUM_NAME]) {
            return _item(target, target[KEY_ENUM_NAME], fqn);
        }
        return target.constructor !== Object ? setFqn(target.constructor, fqn) : undefined;
    }
    new _leyyo.developerError(`Invalid fqn target [${fqn}]`, testCase(FQN, 152), where).log();
    return undefined;
}

function _item(target: FqnTarget, name: string, fqn: string): string {
    const full = `${fqn}.${name}`;
    target[KEY_FQN_NAME] = full;
    triggerFqn(target, full);
    return full;
}
