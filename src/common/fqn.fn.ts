// noinspection JSUnusedGlobalSymbols

import {ClassLike, EnumLiteral, EnumMap, Fnc, Obj} from "../index.types";
import {DeveloperError} from "../error";
import {FQN} from "../internal";
import {isText} from "../function";
import {LY_ENUM_NAME, LY_FQN_BASIC} from "../const";

// region properties
const where = `${FQN}.FqnFn`;
type FqnTarget = ClassLike|Fnc|Obj|EnumMap|EnumLiteral;
// endregion properties

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
    if (typeof target === 'function') { // function, class
        return target[LY_FQN_BASIC] ? target[LY_FQN_BASIC] : target.name;
    }
    else if (typeof target === 'object') {
        if (target[LY_FQN_BASIC]) { // enum, literals
            return target[LY_FQN_BASIC];
        }
        else if (!Array.isArray(target)) { // instance
            return getFqn(target.constructor);
        }
        return undefined;
    }
}

/**
 * Set fqn name
 *
 * @param {FqnTarget} target - target (function, class, instance, enum, literal)
 * @param {string} fqn - fully qualified name
 * @param {boolean?} force - yes: `it overwrites`
 * */
export function setFqn(target: FqnTarget, fqn: string, force?: boolean): void {
    if (!target) {
        throw new DeveloperError('Invalid fqn target', 'setFqn#01', where);
    }
    if (!isText(fqn)) {
        throw new DeveloperError('Invalid fqn value', 'setFqn#02', where);
    }
    if (typeof target === 'function') { // function, class
        if (!target[LY_FQN_BASIC] || force) {
            target[LY_FQN_BASIC] = fqn;
        }
        return;
    }
    if (typeof target === 'object') {
        if (target[LY_ENUM_NAME]) {
            if (!target[LY_FQN_BASIC] || force) {
                target[LY_FQN_BASIC] = fqn;
            }
            return;
        }
        else if (!Array.isArray(target)) { // instance
            setFqn(target.constructor, fqn, force);
            return;
        }
    }
    throw new DeveloperError('Invalid fqn target', 'setFqn#03', where);
}

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
        return undefined;
    }
    if (typeof target === 'function') { // function, class
        if (target[LY_FQN_BASIC]) {
            delete target[LY_FQN_BASIC];
            return true;
        }
        return false;
    }
    if (typeof target === 'object') {
        if (target[LY_ENUM_NAME]) {
            if (target[LY_FQN_BASIC]) {
                delete target[LY_FQN_BASIC];
                return true;
            }
            return false;
        }
        else if (!Array.isArray(target)) { // instance
            return removeFqn(target.constructor);
        }
    }
    return undefined;
}
