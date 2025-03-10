import {CommonAssertion, CommonAssertionSecure} from "./index-types";
import {Leyyo} from "../leyyo";
import {CommonIs} from "../is";
import {Arr, AssertionBuiltResult, AssertionCallback, AssertionOpt, Obj, ToTypeOpt} from "../shared";
import {AssertionException} from "../exception";
import {CommonFqn} from "../fqn";

// noinspection JSUnusedGlobalSymbols
/** @inheritDoc */
export class CommonAssertionImpl implements CommonAssertion, CommonAssertionSecure {
    // region properties
    private is: CommonIs;
    private fqn: CommonFqn;

    // endregion properties

    constructor() {
    }

    // region internal

    /**
     * Build error parameters as message and params
     * */
    private buildErrorParameters(v2: string | AssertionCallback | AssertionOpt, indicator: string): AssertionBuiltResult {
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
                return this.buildErrorParameters(v2(), indicator);
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
                    return `<circular>${this.fqn.name(value?.constructor)}`;
                }
                if (level >= 10) {
                    return `<max-depth>${this.fqn.name(value?.constructor)}`;
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
                } else if (value instanceof Set) {
                    return Array.from(value).map(item => this._secureJson(item, level + 1, set));
                } else {
                    for (const [k, v] of Object.entries(value)) {
                        obj[k] = JSON.parse(JSON.stringify(this._secureJson(v, level + 1, set)));
                    }
                }
                return obj;
            case 'function':
                return `<function>${this.fqn.name(value)}`;
            case 'symbol':
                return `<symbol>${value.toString()}`;
        }
        return value;
    }

    // endregion internal

    // region raise
    /** @inheritDoc */
    raise(opt: string | AssertionOpt | AssertionCallback, value?: any, indicator?: string, def?: string): void {
        const {message, params} = this.buildErrorParameters(opt, indicator);
        const type = typeof value;
        switch (type) {
            case "object":
                params.type = `object(${this.fqn.name(value.constructor)})`;
                break;
            case "function":
                params.type = `function(${this.fqn.name(value)})`;
                break;
            default:
                params.type = type;
                break;
        }
        def = def ?? 'Assertion error';
        throw new AssertionException(message ?? def, params);
    }

    /** @inheritDoc */
    // noinspection JSUnusedLocalSymbols
    emptyFn(...params: Arr): void {
    }

    /** @inheritDoc */
    secureJson<E = unknown>(value: unknown): E {
        return this._secureJson(value, 0, new WeakSet<Obj>()) as E;
    }

    // endregion raise

    // region types
    /** @inheritDoc */
    array(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.array(value)) {
            this.raise(opt, value, 'invalid.array.value', 'Invalid array value');
        }
    }

    /** @inheritDoc */
    boolean(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.boolean(value)) {
            this.raise(opt, value, 'invalid.boolean.value', 'Invalid boolean value');
        }
    }

    /** @inheritDoc */
    clazz(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.clazz(value)) {
            this.raise(opt, value, 'invalid.class.value', 'Invalid class value');
        }
    }

    /** @inheritDoc */
    date(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!(value instanceof Date)) {
            this.raise(opt, value, 'invalid.date.value', 'Invalid date value');
        }
    }

    /** @inheritDoc */
    func(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.func(value)) {
            this.raise(opt, value, 'invalid.function.value', 'Invalid function value');
        }
    }

    /** @inheritDoc */
    integer(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.integer(value)) {
            this.raise(opt, value, 'invalid.integer.value', 'Invalid integer value');
        }
    }

    /** @inheritDoc */
    key(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.key(value)) {
            this.raise(opt, value, 'invalid.key.value', 'Invalid key value');
        }
    }

    /** @inheritDoc */
    notEmpty(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (this.is.empty(value)) {
            this.raise(opt, value, 'empty.value', 'Empty value');
        }
    }

    /** @inheritDoc */
    number(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.number(value)) {
            this.raise(opt, value, 'invalid.number.value', 'Invalid number value');
        }
    }

    /** @inheritDoc */
    realNumber(value: number, opt?: ToTypeOpt): number {
        if (isNaN(value) || !isFinite(value)) {
            if (!opt) {
                opt = {} as ToTypeOpt;
            }
            if (!opt.silent) {
                delete opt.silent;
                this.raise(opt, value, 'not.real.number', 'Not real number');
            }
            return null;
        }
        return value;
    }

    /** @inheritDoc */
    object(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.object(value)) {
            this.raise(opt, value, 'invalid.object.value', 'Invalid object value');
        }
    }

    /** @inheritDoc */
    positiveInteger(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.integer(value) || ((value as number) <= 0)) {
            this.raise(opt, value, 'invalid.positive.integer.value', 'Invalid positive integer value');
        }
    }

    /** @inheritDoc */
    safeInteger(value: any, opt?: string | AssertionCallback | AssertionOpt): void {
        if (!this.is.safeInteger(value) || ((value as number) <= 0)) {
            this.raise(opt, value, 'invalid.safe.integer.value', 'Invalid safe integer value');
        }
    }

    /** @inheritDoc */
    positiveNumber(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.number(value) || ((value as number) <= 0)) {
            this.raise(opt, value, 'invalid.positive.number.value', 'Invalid positive number value');
        }
    }

    /** @inheritDoc */
    primitive(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.primitive(value)) {
            this.raise(opt, value, 'invalid.primitive.value', 'Invalid primitive value');
        }
    }

    /** @inheritDoc */
    string(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.string(value)) {
            this.raise(opt, value, 'invalid.string.value', 'Invalid string value');
        }
    }

    /** @inheritDoc */
    text(value: unknown, opt?: string | AssertionOpt | AssertionCallback): string {
        if (!this.is.text(value)) {
            this.raise(opt, value, 'invalid.text.value', 'Invalid text value');
        }
        return (value as string).trim();
    }

    /** @inheritDoc */
    realValue(value: unknown, opt?: string | AssertionOpt | AssertionCallback): void {
        if (!this.is.text(value)) {
            this.raise(opt, value, 'invalid.value.value', 'Invalid regular value');
        }
    }

    // endregion types


    // region secure

    /** @inheritDoc */
    get $back(): CommonAssertion {
        return this;
    }

    /** @inheritDoc */
    $init(leyyo: Leyyo): void {
        this.is = leyyo.is;
        this.fqn = leyyo.fqn;
    }

    /** @inheritDoc */
    get $secure(): CommonAssertionSecure {
        return this;
    }

    // endregion secure

}