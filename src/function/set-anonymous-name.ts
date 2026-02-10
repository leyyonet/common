import {FQN} from "../internal";
import {ClassLike, Fnc, LeyyoLike} from "../base";
import {VAL_NAME_ANONYMOUS} from "../const";
import {$$get_leyyo_fn} from "./leyyo-fn";
import {testCase} from "./test-case";
import {isClass, isText} from "./is.fn";

const _pattern = /((?:[a-zA-Z_$][a-zA-Z\d_$]*)*)([a-zA-Z_$][a-zA-Z\d_$]*)/g;
let _counter = 0;
const where = `${FQN}.nameFn`;

let _leyyo: LeyyoLike;

export function setAnonymousName(target: Fnc | ClassLike, prefix?: string): string {
    if (typeof target !== 'function') {
        if ( !_leyyo) {
            _leyyo = $$get_leyyo_fn();
        }
        throw new _leyyo.developerError(`Invalid target`, testCase(FQN, 'ZZZ'), where);
    }
    if (isText(prefix)) {
        if ( !_pattern.test(prefix)) {
            if ( !_leyyo) {
                _leyyo = $$get_leyyo_fn();
            }
            throw new _leyyo.developerError(`Invalid anonymous name part [${prefix}]`, testCase(FQN, 'ZZZ'), where);
        }
    }
    else {
        prefix = isClass(target) ? 'Class' : 'function';
    }
    _counter++;
    const name = VAL_NAME_ANONYMOUS + [prefix, _counter].join('$');
    _setName(target, name, false);
    return name;
}

function _setName(target: Fnc | ClassLike, name: string, checkAnonymous: boolean): boolean {
    if ( !_leyyo) {
        _leyyo = $$get_leyyo_fn();
    }
    if ( !isText(name)) {
        throw new _leyyo.developerError(`Invalid name`, testCase(FQN, 'ZZZ'), where);
    }
    if (name.includes('.')) {
        throw new _leyyo.developerError(`Invalid name with dot`, testCase(FQN, 'ZZZ'), where);
    }
    if (checkAnonymous && name.startsWith(VAL_NAME_ANONYMOUS)) {
        throw new _leyyo.developerError(`Invalid name with anonymous`, testCase(FQN, 'ZZZ'), where);
    }
    if (typeof target !== 'function') {
        throw new _leyyo.developerError(`Invalid name [${name}]`, testCase(FQN, 'ZZZ'), where);
    }
    try {
        Object.defineProperty(target, 'name', {
            value: name,
            configurable: true,
            writable: true,
            enumerable: true
        });
    } catch (e) {
        new _leyyo.developerError(`Unexpected error during set name [${name}]`, testCase(FQN, 'ZZZ'), where).log(e);
        return false;
    }
    return true;
}
