// noinspection JSUnusedGlobalSymbols

import {ClassLike, EnumLiteral, EnumMap, Fnc, Obj} from "../index.types";
import {DeveloperError} from "../error";
import {FQN} from "../internal";
import {isText} from "../function";
import {LY_ENUM_NAME, LY_FQN_ANONYMOUS, LY_FQN_BASIC, LY_FQN_ON_SET} from "../const";
import {testCase} from "./test.fn";
import {setAnonymousName} from "./name.fn";

// region properties
const where = `${FQN}.FqnFn`;
let _count: number = 0;
type FqnTarget = ClassLike | Fnc | Obj | EnumMap | EnumLiteral;

// endregion properties

/**
 * Get fqn name
 *
 * @param {FqnTarget} target - target (function, class, instance, enum, literal)
 * @return {string} - fully qualified name
 * */
export function getFqn(target: FqnTarget): string {
    if ( !target) {
        return undefined;
    }
    if (typeof target === 'function') { // function, class
        return target[LY_FQN_BASIC] ? target[LY_FQN_BASIC] : target.name;
    }
    else if (typeof target === 'object') {
        if (target[LY_FQN_BASIC]) { // enum, literals
            return target[LY_FQN_BASIC];
        }
        else if ( !Array.isArray(target)) { // instance
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
 * @return {string} - full name
 * */
export function setFqn(target: FqnTarget, fqn: string, force?: boolean): string {
    if ( !isText(fqn)) {
        throw new DeveloperError('Invalid fqn name', testCase(FQN, 150), where);
    }
    if (fqn.startsWith('.') || fqn.endsWith('.')) {
        throw new DeveloperError('Invalid fqn name with dots', testCase(FQN, 'ZZZ'), where);
    }
    if (fqn.startsWith(LY_FQN_ANONYMOUS)) {
        throw new DeveloperError('Anonymous fqn is used', testCase(FQN, 'ZZZ'), where);
    }
    if ( !target) {
        throw new DeveloperError(`Empty fqn target [${fqn}]`, testCase(FQN, 151), where);
    }
    if (typeof target === 'function') { // function, class
        const existing = target[LY_FQN_BASIC] as string;
        if (existing && existing.startsWith(LY_FQN_ANONYMOUS)) {
            delete target[LY_FQN_BASIC];
        }
        if ( !target[LY_FQN_BASIC] || force) {
            let fncName = target.name;
            if ( !fncName) {
                fncName = setAnonymousName(target as Fnc);
            }
            return _set(target, fqn, fncName);
        }
        return target[LY_FQN_BASIC];
    }
    if (typeof target === 'object') {
        if (target[LY_ENUM_NAME]) {
            const existing = target[LY_FQN_BASIC] as string;
            if (existing && existing.startsWith(LY_FQN_ANONYMOUS)) {
                delete target[LY_FQN_BASIC];
            }

            if ( !target[LY_FQN_BASIC] || force) {
                return _set(target, fqn, target[LY_ENUM_NAME]);
            }
            return target[LY_FQN_BASIC];
        }
        else if ( !Array.isArray(target)) { // instance
            return setFqn(target.constructor, fqn, force);
        }
    }
    throw new DeveloperError(`Invalid fqn target [${fqn}]`, testCase(FQN, 152), where);
}

export function setAnonymousFqn(target: FqnTarget): string {
    if ( !target) {
        throw new DeveloperError(`Empty fqn target`, testCase(FQN, 'ZZZ'), where);
    }
    if (typeof target === 'function') { // function, class
        if ( !target[LY_FQN_BASIC]) {
            _count++;
            let fncName = target.name;
            if ( !fncName) {
                fncName = setAnonymousName(target as Fnc);
            }
            return _set(target, `${LY_FQN_ANONYMOUS}${_count}`, fncName);
        }
        return target[LY_FQN_BASIC];
    }
    if (typeof target === 'object') {
        if (target[LY_ENUM_NAME]) {
            if ( !target[LY_FQN_BASIC]) {
                _count++;
                return _set(target, `${LY_FQN_ANONYMOUS}${_count}`, target[LY_ENUM_NAME]);
            }
            return target[LY_FQN_BASIC];
        }
        else if ( !Array.isArray(target)) { // instance
            return setAnonymousFqn(target.constructor);
        }
    }
    throw new DeveloperError(`Invalid fqn target`, testCase(FQN, 'ZZZ'), where);
}

function _set(target: FqnTarget, name: string, fqn: string): string {
    const full = `${fqn}.${name}`;
    target[LY_FQN_BASIC] = full;
    return full;
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
    if ( !target) {
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
        else if ( !Array.isArray(target)) { // instance
            return removeFqn(target.constructor);
        }
    }
    return undefined;
}

export function onFqnSet(target: FqnTarget, callback: FqnOnSetLambda): void {
    if ( !target) {
        throw new DeveloperError(`Empty fqn target`, testCase(FQN, 'ZZZ'), where);
    }
    if (typeof callback !== 'function') {
        throw new DeveloperError(`Invalid fqn on set lambda`, testCase(FQN, 'ZZZ'), where);
    }
    if (typeof target === 'function') { // function, class
        if (target[LY_FQN_BASIC]) {
            callback(target[LY_FQN_BASIC] as string);
            return;
        }
        if ( !target[LY_FQN_ON_SET]) {
            target[LY_FQN_ON_SET] = [];
        }
        (target[LY_FQN_ON_SET] as Array<FqnOnSetLambda>).push(callback);
        return;
    }
    if (typeof target === 'object') {
        if (target[LY_ENUM_NAME]) {
            if (target[LY_FQN_BASIC]) {
                callback(target[LY_FQN_BASIC] as string);
                return;
            }
            if ( !target[LY_FQN_ON_SET]) {
                target[LY_FQN_ON_SET] = [];
            }
            (target[LY_FQN_ON_SET] as Array<FqnOnSetLambda>).push(callback);
            return;
        }
        else if ( !Array.isArray(target)) { // instance
            return onFqnSet(target.constructor, callback);
        }
    }
    throw new DeveloperError(`Invalid fqn target`, testCase(FQN, 'ZZZ'), where);

}


export type FqnOnSetLambda = (full: string) => void;
