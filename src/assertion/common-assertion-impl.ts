import {
    AssertionBuiltResult,
    AssertionCallback,
    AssertionOpt,
    CommonAssertion,
    CommonAssertionSecure
} from "./index-types";
import {Leyyo} from "../leyyo";
import {CommonIs} from "../is";
import {AssertionException} from "../error";
import {CommonCallback} from "../callback";
import {TypeOpt} from "../to";
import {Arr, Obj} from "../aliases";

export class CommonAssertionImpl implements CommonAssertion, CommonAssertionSecure {
    // region properties
    private is: CommonIs;
    private callback: CommonCallback;
    // endregion properties

    constructor() {
    }

    // region internal
    private buildMessage(v2: string | AssertionCallback | AssertionOpt, indicator: string): AssertionBuiltResult {
        if (typeof v2 === 'string') {
            return {message: v2, params: {indicator}};
        }
        if (v2 && typeof v2 === 'object' && !Array.isArray(v2)) {
            const params = v2;
            if (params.indicator !== undefined) {
                params.indicator2 = params.indicator;
                params.indicator = indicator;
            }
            return {params};
        }
        if (typeof v2 === 'function') {
            try {
                return this.buildMessage(v2(), indicator);
            } catch (e) {
                return {params: {indicator, callbackError: e.message}};
            }
        }
        if (v2 === null || v2 === undefined) {
            return {params: {indicator}};
        }
        const json = this.secureJson(v2);
        if (json && typeof json === 'object' && !Array.isArray(json)) {
            return {params: {...json, indicator}};
        }
        return {params: {json, indicator}};
    }
    _secureJson(value: unknown, level: number, set: WeakSet<Obj>): unknown {
        if ([null, undefined].includes(value)) {
            return null;
        }
        switch (typeof value) {
            case 'object':
                if (set.has(value)) {
                    return `<circular>${this.callback.fqnName(value?.constructor)}`;
                }
                if (level >= 10) {
                    return `<max-depth>${this.callback.fqnName(value?.constructor)}`;
                }
                set.add(value);
                if (Array.isArray(value)) {
                    return value.map(item => this._secureJson(item, level + 1, set));
                }
                const obj = {};
                if (value instanceof Map) {
                    for (const [k, v] of value.entries()) {
                        obj[k] = JSON.parse(JSON.stringify(this._secureJson(v, level + 1, set)));
                    }
                }
                else if (value instanceof Set) {
                    return Array.from(value).map(item => this._secureJson(item, level + 1, set));
                }
                else {
                    for (const [k, v] of Object.entries(value)) {
                        obj[k] = JSON.parse(JSON.stringify(this._secureJson(v, level + 1, set)));
                    }
                }
                return obj;
            case 'function':
                return `<function>${this.callback.fqnName(value)}`;
            case 'symbol':
                return `<symbol>${value.toString()}`;
        }
        return value;
    }
    // endregion internal

    // region raise
    raise(opt: string | AssertionOpt | AssertionCallback, value?: any, indicator?: string, def?: string): void {
        const {message, params} = this.buildMessage(opt, indicator);
        const type = typeof value;
        switch (type) {
            case "object":
                params.type = `object(${this.callback.fqnName(value.constructor)})`;
                break;
            case "function":
                params.type = `function(${this.callback.fqnName(value)})`;
                break;
            default:
                params.type = type;
                break;
        }
        def = def ?? 'Assertion error';
        throw new AssertionException(message ?? def, params);
    }
    // noinspection JSUnusedLocalSymbols
    emptyFn(...params: Arr): void {}
    secureJson<E = unknown>(value: unknown): E {
        return this._secureJson(value, 0, new WeakSet<Obj>()) as E;
    }
    realNumber(value: number, opt?: TypeOpt): number {
        if (isNaN(value) || !isFinite(value)) {
            if (!opt) {
                opt = {} as TypeOpt;
            }
            if (!opt.silent) {
                delete opt.silent;
                this.raise(opt, value, 'not.real.number', 'Not real number');
            }
            return null;
        }
        return value;
    }
    // endregion raise

    // region types
    array(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.array(value)) {
            this.raise(opt, value, 'invalid.array.value', 'Invalid array value');
        }
    }

    boolean(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.boolean(value)) {
            this.raise(opt, value, 'invalid.boolean.value', 'Invalid boolean value');
        }
    }

    clazz(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.clazz(value)) {
            this.raise(opt, value, 'invalid.class.value', 'Invalid class value');
        }
    }

    date(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!(value instanceof Date)) {
            this.raise(opt, value, 'invalid.date.value', 'Invalid date value');
        }
    }

    func(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.func(value)) {
            this.raise(opt, value, 'invalid.function.value', 'Invalid function value');
        }
    }

    integer(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.integer(value)) {
            this.raise(opt, value, 'invalid.integer.value', 'Invalid integer value');
        }
    }

    key(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.key(value)) {
            this.raise(opt, value, 'invalid.key.value', 'Invalid key value');
        }
    }

    notEmpty(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (this.is.empty(value)) {
            this.raise(opt, value, 'empty.value', 'Empty value');
        }
    }

    number(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.number(value)) {
            this.raise(opt, value, 'invalid.number.value', 'Invalid number value');
        }
    }

    object(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.object(value)) {
            this.raise(opt, value, 'invalid.object.value', 'Invalid object value');
        }
    }

    positiveInteger(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.integer(value) || ((value as number) <= 0)) {
            this.raise(opt, value, 'invalid.positive.integer.value', 'Invalid positive integer value');
        }
    }

    positiveNumber(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.number(value) || ((value as number) <= 0)) {
            this.raise(opt, value, 'invalid.positive.number.value', 'Invalid positive number value');
        }
    }

    primitive(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.primitive(value)) {
            this.raise(opt, value, 'invalid.primitive.value', 'Invalid primitive value');
        }
    }

    string(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.string(value)) {
            this.raise(opt, value, 'invalid.string.value', 'Invalid string value');
        }
    }

    text(value: unknown, opt?: string | AssertionOpt | AssertionCallback): string {
        if (!this.is.text(value)) {
            this.raise(opt, value, 'invalid.text.value', 'Invalid text value');
        }
        return (value as string).trim();
    }

    value(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.text(value)) {
            this.raise(opt, value, 'invalid.value.value', 'Invalid regular value');
        }
    }
    // endregion types


    // region secure
    get $back(): CommonAssertion {
        return this;
    }

    $init(leyyo: Leyyo): void {
        this.is = leyyo.is;
        this.callback = leyyo.callback;
    }

    get $secure(): CommonAssertionSecure {
        return this;
    }
    // endregion secure

}