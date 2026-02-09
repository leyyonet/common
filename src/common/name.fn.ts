// noinspection JSUnusedGlobalSymbols

import {DeveloperError} from "../error";
import {FQN} from "../internal";
import {testCase} from "./test.fn";
import {LY_NAME_ANONYMOUS} from "../const";
import {isClass, isText} from "../function";
import {ClassLike, Fnc} from "../index.types";

const _pattern = /((?:[a-zA-Z_$][a-zA-Z\d_$]*)*)([a-zA-Z_$][a-zA-Z\d_$]*)/g;
let _counter = 0;
const where = `${FQN}.nameFn`;

export function setAnonymousName(target: Fnc | ClassLike, prefix?: string): string {
    if (typeof target !== 'function') {
        throw new DeveloperError(`Invalid target`, testCase(FQN, 'ZZZ'), where);
    }
    if (isText(prefix)) {
        if ( !_pattern.test(prefix)) {
            throw new DeveloperError(`Invalid anonymous name part [${prefix}]`, testCase(FQN, 'ZZZ'), where);
        }
    }
    else {
        prefix = isClass(target) ? 'Class' : 'function';
    }
    _counter++;
    const name = LY_NAME_ANONYMOUS + [prefix, _counter].join('$');
    _setName(target, name, false);
    return name;
}

export function isAnonymousName(name: string): boolean {
    if (typeof name === 'string') {
        return name.trim().startsWith(LY_NAME_ANONYMOUS);
    }
    return false;
}

export function setName(target: Fnc | ClassLike, name: string): boolean {
    return _setName(target, name, true);
}

export function _setName(target: Fnc | ClassLike, name: string, checkAnonymous: boolean): boolean {
    if ( !isText(name)) {
        throw new DeveloperError(`Invalid name`, testCase(FQN, 'ZZZ'), where);
    }
    if (name.includes('.')) {
        throw new DeveloperError(`Invalid name with dot`, testCase(FQN, 'ZZZ'), where);
    }
    if (checkAnonymous && name.startsWith(LY_NAME_ANONYMOUS)) {
        throw new DeveloperError(`Invalid name with anonymous`, testCase(FQN, 'ZZZ'), where);
    }
    if (typeof target !== 'function') {
        throw new DeveloperError(`Invalid name [${name}]`, testCase(FQN, 'ZZZ'), where);
    }
    try {
        Object.defineProperty(target, 'name', {
            value: name,
            configurable: true,
            writable: true,
            enumerable: true
        });
    } catch (e) {
        new DeveloperError(`Unexpected error during set name [${name}]`, testCase(FQN, 'ZZZ'), where).log(e);
        return false;
    }
    return true;
}

