import {FQN} from "../internal";
import {CausedError, DeveloperError, InvalidValueError} from "./index.errors";

import type {DeveloperCommonLike, DeveloperCommonSecure, DeveloperParamResult, DevOpt} from "./index.types";
import type {LeyyoLike} from "../leyyo";
import type {Arr, Describable, Obj} from "../shared";
import type {Severity} from "../log";

export class DeveloperCommon implements DeveloperCommonLike, DeveloperCommonSecure {

    constructor(private lyy: LeyyoLike) {
    }

    buildParameters(opt: DevOpt, extra?: DevOpt, e?: Error): DeveloperParamResult {
        let newOpt = this.checkParameters(opt, extra);
        if (Object.keys(newOpt).length < 1) {
            newOpt = {}
        }
        let message: string;
        if (e instanceof Error) {
            message = e.message;
            this.append(newOpt, 'error', e.name);
        } else {
            message = this.fetch(newOpt, 'message') ?? this.fetch(newOpt, 'issue');
        }
        return {message, opt: newOpt};
    }

    appendAll<O extends DevOpt = DevOpt>(opt: O, extra: DevOpt): O {
        if (extra && typeof extra === 'object' && extra.constructor === Object) {
            for (const [k, v] of Object.entries(extra)) {
                opt = this.append(opt, k, v);
            }
        }
        return opt;
    }
    opt<O extends DevOpt = DevOpt>(value: O): O {
        return value;
    }
    desc<O extends DevOpt = DevOpt>(ins: Describable, value: O): O {
        return {...value, desc: ins?.description};
    }
    fetch(opt: DevOpt, field: string): any {
        if (opt?.constructor !== Object) {
            return undefined;
        }
        const found = opt[field];
        if (found !== undefined) {
            delete opt[field];
        }
        return found;
    }
    append<O extends DevOpt = DevOpt>(opt: O, field: string, value: any): O {
        if (opt?.constructor !== Object) {
            opt = {} as O;
        }
        if (typeof field !== 'string' || value === undefined) {
            return opt;
        }
        if (opt[field] === undefined) {
            opt[field as keyof O] = value;
        } else if (opt[field] === value) {
            return opt;
        } else {
            if (field === 'issue') {
                if (Array.isArray(opt.issue)) {
                    if (!opt.issue.includes(value)) {
                        opt.issue.push(value);
                    }
                } else {
                    opt.issue = [opt.issue, value];
                }
            } else {
                const f2 = `${field}[${Date.now()}]` as keyof O;
                opt[f2] = value;
            }
        }
        return opt;
    }

    checkParameters(opt: DevOpt, extra?: DevOpt): DevOpt {
        if (extra?.constructor !== Object) {
            extra = {};
        }
        if (opt?.constructor !== Object) {
            opt = extra;
        }
        else {
            opt = {...opt, ...extra};
        }
        if (Object.keys(opt).length < 1) {
            opt = {
                issue: 'invalid.developer.option',
                value: this.secureJson(opt, true),
            };
        }
        else {
            for (const [field, value] of Object.entries(opt)) {
                if (typeof field !== 'string' || value === undefined) {
                    delete opt[field];
                }
            }
        }
        return opt;
    }

    developerError(opt: DevOpt, extra?: DevOpt): Error {
        const {opt: opt2, message} = this.buildParameters(opt, extra);
        return new DeveloperError(message, opt2);
    }

    developerError2(v1 : string, v2:number|string|DevOpt, v3?: DevOpt): Error {
        let issue: string;
        let opt: DevOpt;
        if (typeof v1 !== 'string') {
            v1 = this.secureJson(v1, true);
        }
        switch (typeof v2) {
            case "string":
            case "number":
                issue = this.lyy.test.code(v1, v2);
                if (v3?.constructor === Object) {
                    opt = v3;
                }
                break;
            case "object":
                issue = v1;
                if (v2?.constructor === Object) {
                    opt = v2;
                }
                break;
        }
        return new DeveloperError(`${issue}/${this.secureJson(opt, true)}`, opt);
    }

    invalidError(opt: DevOpt, extra?: DevOpt): Error {
        const {opt: opt2, message} = this.buildParameters(opt, extra);
        return new InvalidValueError(message, opt2);
    }


    nativeError(e: Error, opt: DevOpt, extra?: DevOpt): Error {
        const {opt: opt2, message} = this.buildParameters(opt, extra, e);
        return new CausedError(message, opt2, e);
    }
    nativeError2(pck: string, testCase:number|string, e: Error, opt?: DevOpt): Error {
        const issue = this.lyy.test.code(pck, testCase);
        return new CausedError(`${issue}/${e.message}`, opt, e);
    }

    log(v1: Error | DevOpt, v2: DevOpt|Severity, v3?: Severity): void {
        let error: Error = undefined;
        let opt: DevOpt;
        let severity: Severity;
        if (v1 instanceof Error) {
            error = v1;
            opt = v2 as DevOpt;
            severity = (typeof v3 === 'string') ? v3 : 'info';
        } else {
            opt = v1;
            severity = (typeof v2 === 'string') ? v2 : 'info';
        }
        // todo
        const {opt: opt2, message} = this.buildParameters(opt, {}, error);
        if (typeof console[severity] !== 'function') {
            severity = 'info';
        }
        console[severity](message, opt2);
    }

    get $secure(): DeveloperCommonSecure {
        return this;
    }

    get $back(): DeveloperCommonLike {
        return this;
    }

    $init(): void {
        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, DeveloperCommon, 'class', FQN);
        });
    }


    /**
     * Inner secure json function, it will be used after creating weak set
     * */
    _secureJson(value: unknown, level: number, set: WeakSet<Obj>): unknown {
        if ([null, undefined].includes(value)) {
            return null;
        }
        switch (typeof value) {
            case 'object':
                if (set.has(value)) {
                    return `<circular>${this.lyy.fqn.name(value?.constructor)}`;
                }
                if (level >= 10) {
                    return `<max-depth>${this.lyy.fqn.name(value?.constructor)}`;
                }
                set.add(value);
                if (Array.isArray(value)) {
                    return value.map(item => this._secureJson(item, level + 1, set));
                }
                if (value instanceof Set) {
                    return Array.from(value).map(item => this._secureJson(item, level + 1, set));
                }
                const obj = {};
                if (value instanceof Map) {
                    for (const [k, v] of value.entries()) {
                        if (typeof k === 'string') {
                            obj[k] = this._secureJson(v, level + 1, set);
                        }
                    }
                } else if (value?.constructor === Object) {
                    for (const [k, v] of Object.entries(value)) {
                        if (typeof k === 'string') {
                            obj[k] = this._secureJson(v, level + 1, set);
                        }
                    }
                } else {
                    try {
                        return JSON.parse(JSON.stringify(value));
                    } catch (e) {
                        return `<object>${this.lyy.fqn.name(value)} ==> [${e.name}]: ${e.message}`;
                    }
                }
                return obj;
            case 'function':
                return `<function>${this.lyy.fqn.name(value)}`;
            case 'symbol':
                return `<symbol>${value.toString()}`;
        }
        return value;
    }

    /** @inheritDoc */
    // noinspection JSUnusedLocalSymbols
    emptyFn(...params: Arr): void {
    }

    /** @inheritDoc */
    secureJson<E = unknown>(value: unknown, asString?: true): E|string {
        try {
            const json = this._secureJson(value, 0, new WeakSet<Obj>()) as E;
            return asString ? JSON.stringify(json) : json;
        } catch (e) {
            return `<error> ==> ${e.message}` as E;
        }
    }

}
