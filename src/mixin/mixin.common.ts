import type {MixinCommonLike, MixinCommonSecure, PickPredicate} from "./index.types";
import type {LeyyoLike} from "../leyyo";
import type {Obj} from "../shared";
import type {IsCommonLike} from "../is";

import {FQN} from "../internal";

const IGNORED_PROPS = ['constructor', '__proto__', 'prototype'];
const IGNORED_TYPES = ['symbol', 'undefined'];

export class MixinCommon implements MixinCommonLike, MixinCommonSecure {
    private readonly is: IsCommonLike;
    constructor(private lyy: LeyyoLike) {
        this.is = lyy.is;
    }

    private _combine<T extends Obj = Obj>(target: Partial<T>, sources: Array<Partial<T>>, set: WeakSet<Partial<T>>, override: boolean): Partial<T> {
        const is = this.is;
        if (!is.bareObject(target)) {
            target = {} as Partial<T>;
        }
        if (set.has(target)) {
            return target;
        }
        set.add(target);

        sources.forEach(source => {
            if (is.bareObject(source) && !set.has(source)) {
                set.add(source);
                for (const [key, value] of Object.entries(source)) {
                    if (IGNORED_PROPS.includes(key) || IGNORED_TYPES.includes(typeof value)) {
                        continue;
                    }
                    if (is.bareObject(target[key]) && is.bareObject(value)) {
                        target[key] = this.merge(target[key], value);
                    } else {
                        if (override) {
                            target[key] = value;
                        } else if (target[key] === undefined) {
                            target[key] = value;
                        }
                    }
                }
            }
        });
        return target;
    }

    mergeExisting<T extends Obj = Obj>(host: Partial<T>, source: Partial<T>, ...omittedFields: Array<keyof T | string>): void {
        if (!this.is.object(host) || !this.is.object(source)) {
            return ;
        }
        for (const [k, v] of Object.entries(source)) {
            if (host[k] === undefined && !omittedFields.includes(v)) {
                host[k] = v;
            }
        }
    }
    merge<T extends Obj = Obj>(target: Partial<T>, ...sources: Array<Partial<T>>): Partial<T> {
        const set = new WeakSet<Partial<T>>();
        return this._combine(target, sources, set, false);
    }
    overrideExisting<T extends Obj = Obj>(host: Partial<T>, source: Partial<T>, ...omittedFields: Array<keyof T | string>): void {
        if (!this.is.object(host) || !this.is.object(source)) {
            return ;
        }
        for (const [k, v] of Object.entries(source)) {
            if (!omittedFields.includes(v)) {
                host[k] = v;
            }
        }
    }
    override<T extends Obj = Obj>(target: Partial<T>, ...sources: Array<Partial<T>>): Partial<T> {
        const set = new WeakSet<Partial<T>>();
        return this._combine(target, sources, set, true);
    }
    omitSymbol<T extends Obj = Obj>(object: T): Partial<T> {
        return this.omit(object, (value) => typeof value === 'symbol');
    }
    omitUndefined<T extends Obj = Obj>(object: T): Partial<T> {
        return this.omit(object, (value) => value === undefined);
    }
    omitEmpty<T extends Obj = Obj>(object: T): Partial<T> {
        return this.omit(object, (value) => value === null || value === undefined);
    }
    omit<T extends Obj = Obj>(object: T, p: Array<keyof T | string> | PickPredicate): Partial<T> {
        if (!this.is.bareObject(object)) {
            return object;
        }
        const result = {...object} as Partial<T>;
        if (typeof p === 'function') {
            const predicate: PickPredicate = p;
            Object.entries(object).forEach(([k, v]) => {
                if (predicate(v)) {
                    delete result[k];
                }
            });
        }
        else if (Array.isArray(p) && p.length > 0) {
            (p as Array<keyof T | string>).forEach((k: keyof T) => {
                if (object[k] !== undefined) {
                    delete result[k];
                }
            });
        }
        return result;
    };

    pick<T extends Obj = Obj>(object: T, p: Array<keyof T | string> | PickPredicate): Partial<T> {
        if (!this.is.bareObject(object)) {
            return object;
        }
        const result = {} as Partial<T>;
        if (typeof p === 'function') {
            const predicate: PickPredicate = p;
            Object.entries(object).forEach(([k, v]) => {
                if (predicate(v)) {
                    result[k] = v;
                }
            });
        }
        else if (Array.isArray(p) && p.length > 0) {
            (p as Array<keyof T | string>).forEach((k: keyof T) => {
                if (object[k] !== undefined) {
                    result[k] = object[k];
                }
            });
        }
        return result;
    };

    pickInverse<T extends Obj = Obj>(object: T, p: Array<keyof T | string> | PickPredicate): Partial<T> {
        if (!this.is.bareObject(object)) {
            return object;
        }
        const result = {} as Partial<T>;
        if (typeof p === 'function') {
            const predicate: PickPredicate = p;
            Object.entries(object).forEach(([k, v]) => {
                if (!predicate(v)) {
                    result[k] = v;
                }
            });
        }
        else if (Array.isArray(p)) {
            const keys: Array<keyof T | string> = p;
            Object.entries(object).forEach(([k, v]) => {
                if (!keys.includes(k)) {
                    result[k] = v;
                }
            });
        }
        return result;
    };
    // region secure

    get $secure(): MixinCommonSecure {
        return this;
    }

    get $back(): MixinCommonLike {
        return this;
    }

    $init(): void {
        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, MixinCommon, 'class', FQN);
        });
    }
    // endregion secure
}
