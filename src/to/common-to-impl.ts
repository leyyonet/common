import {
    CommonTo,
    CommonToSecure,
    ToTypeArrayOpt,
    ToTypeChildOpt,
    ToTypeEnumOpt,
    ToTypeFnLambda,
    ToTypeObjectOpt,
    ToTypeOpt
} from "./index-types";
import {Arr, Dict, KeyValue, OneOrMore, Pair} from "../aliases";
import {WeakFalse, WeakFalseItems, WeakTrue, WeakTrueItems} from "../literals";
import {Leyyo} from "../leyyo";
import {CommonIs} from "../is";
import {DeveloperException, Exception} from "../error";
import {CommonCallback} from "../callback";
import {CommonAssertion} from "../assertion";

// noinspection JSUnusedGlobalSymbols
export class CommonToImpl implements CommonTo, CommonToSecure {

    // region properties
    private readonly _EXPECTED_ANY = ['string', 'boolean', 'bigint', 'object', 'number', 'array'];
    private readonly _EXPECTED_ARRAY = ['array'];
    private readonly _EXPECTED_BOOL = ['boolean', 'string', 'number'];
    private readonly _EXPECTED_CLASS = ['string', 'function', 'object'];
    private readonly _EXPECTED_DATE = ['string', 'number', 'date', 'moment'];
    private readonly _EXPECTED_ENUM = ['string', 'number'];
    private readonly _EXPECTED_NUMBER = ['string', 'number', 'bigint'];
    private readonly _EXPECTED_STRING = ['boolean', 'string', 'number'];
    private is: CommonIs;
    private callback: CommonCallback;
    private assertion: CommonAssertion;
    // endregion properties

    // region private
    private _enumInMap<T extends KeyValue = KeyValue>(value: unknown, map: Dict<T>): T {
        // regular, in values
        if (Object.values(map).includes(value as T)) {
            return value as T;
        }
        // ir-regular, in keys
        if (Object.keys(map).includes(value as string)) {
            return map[value as string];
        }
        if (typeof value === 'string') {
            // regular, in lower-case
            let str = value.toLowerCase();
            let v = this._enumInMap(str, map);
            if (v !== null) {
                return v;
            }
            // regular, in upper-case
            str = str.toUpperCase();
            v = this._enumInMap(str, map);
            if (v !== null) {
                return v;
            }
            if (/^[0-9]+$/.test(value)) {
                try {
                    return this._enumInMap(parseInt(value, 10), map);
                } catch (e) {
                }
            }
            return null;
        }
        return null;
    }

    private _enumInArray<T extends KeyValue = KeyValue>(value: unknown, arr: Array<T>): T {
        // regular, in values
        if (arr.includes(value as T)) {
            return value as T;
        }
        if (typeof value === 'string') {
            // regular, in lower-case
            let str = value.toLowerCase();
            let v = this._enumInArray(str, arr);
            if (v !== null) {
                return v;
            }
            // regular, in upper-case
            str = str.toUpperCase();
            v = this._enumInArray(str, arr);
            if (v !== null) {
                return v;
            }
            if (/^[0-9]+$/.test(value)) {
                try {
                    return this._enumInArray(parseInt(value, 10), arr);
                } catch (e) {
                }
            }
            return null;
        }
        return null;
    }

    // noinspection JSMethodCanBeStatic
    private _enumInAlteration<T extends KeyValue = KeyValue>(value: unknown, alt: Dict<T>): T {
        // ir-regular, in keys
        if (Object.keys(alt).includes(value as string)) {
            return alt[value as string];
        }
        if (typeof value === 'string') {
            // regular, in lower-case
            let str = value.toLowerCase();
            let v = this._enumInAlteration(str, alt);
            if (v !== null) {
                return v;
            }
            // regular, in upper-case
            str = str.toUpperCase();
            v = this._enumInAlteration(str, alt);
            if (v !== null) {
                return v;
            }
            if (/^[0-9]+$/.test(value)) {
                try {
                    return this._enumInAlteration(parseInt(value, 10), alt);
                } catch (e) {
                }
            }
            return null;
        }
        return null;
    }

    // endregion private

    // region utility
    runFn<T = unknown>(fn: Function, value: Function, opt?: ToTypeOpt): T {
        try {
            return fn(value()) as T;
        } catch (e) {
            if (!opt.silent) {
                delete opt.silent;
                let indicator: string;
                if (opt.indicator !== undefined) {
                    indicator = opt.indicator;
                } else {
                    indicator = 'assertion.error'
                }
                this.assertion.raise(opt, value.name, indicator);
            }
        }
        return null;
    }

    runSave<T = unknown>(fn: Function, value: unknown, opt?: ToTypeOpt): T {
        try {
            return fn(value) as T;
        } catch (e) {
            Exception.cast(e).raise(!opt?.silent);
        }
        return null;
    }

    raiseInvalidValue<T = unknown>(value: unknown, expected: OneOrMore<string>, opt?: ToTypeOpt, params?: Dict): T {
        let indicator: string;
        if (opt.indicator !== undefined) {
            indicator = opt.indicator;
        } else {
            indicator = 'type.invalid-value';
        }
        opt = {...opt, ...params, expected, value};
        new DeveloperException(indicator, opt)
            .with(this)
            .raise(!opt?.silent);
        return null;
    }

    // endregion utility

    // region types
    any(value: unknown, opt?: ToTypeOpt): unknown {
        if (this.is.empty(value)) {
            return null;
        }
        switch (typeof value) {
            case 'string':
            case 'boolean':
            case 'bigint':
            case 'object':
                return value;
            case 'number':
                return this.assertion.realNumber(value, opt);
            case 'function':
                return this.runFn(v => this.any(v, opt), value, opt);
        }
        return this.raiseInvalidValue(value, this._EXPECTED_ANY, opt);
    }

    array<T = unknown>(value: unknown, opt?: ToTypeArrayOpt): Array<T> {
        if (this.is.empty(value)) {
            return null;
        }
        switch (typeof value) {
            case "string":
            case "boolean":
            case "number":
            case "bigint":
                return this.array([value], opt);
            case 'object':
                if (Array.isArray(value)) {
                    opt = opt ?? {} as ToTypeArrayOpt;
                    const result = [] as Array<T>;
                    const valueFn = opt?.children?.value?.fn as ToTypeFnLambda<T>;
                    if (typeof valueFn !== "function") {
                        result.push(...value);
                    } else {
                        const clonedOpt = {...opt};
                        (value as Arr).forEach((v, index) => {
                            clonedOpt.param = opt.param ? `${opt.param}#${index}` : `#${index}`;
                            try {
                                result.push(valueFn(v, clonedOpt));
                            } catch (e) {
                                Exception.cast(e).raise(!opt.silent);
                                result.push(null);
                            }
                        });
                    }
                    return result;
                }
                return this.array([value], opt);
            case 'function':
                return this.runFn<Array<T>>(v => this.array(v, opt), value, opt);
        }
        return this.raiseInvalidValue(value, this._EXPECTED_ARRAY, opt);
    }

    boolean(value: unknown, opt?: ToTypeOpt): boolean {
        if (this.is.empty(value)) {
            return null;
        }
        switch (typeof value) {
            case 'boolean':
                return value;
            case 'string':
                value = value.trim().toLowerCase();
                if (value === '') {
                    return null;
                }
                if (WeakTrueItems.includes(value as WeakTrue)) {
                    return true;
                }
                if (WeakFalseItems.includes(value as WeakFalse)) {
                    return false;
                }
                return this.raiseInvalidValue(value, this._EXPECTED_BOOL, opt);
            case 'number':
                return value > 0;
            case 'object':
                if (Array.isArray(value) && value.length === 1) {
                    return this.boolean(value[0], opt);
                }
                break;
            case 'function':
                return this.runFn(v => this.boolean(v, opt), value, opt);
        }
        return this.raiseInvalidValue(value, this._EXPECTED_BOOL, opt);
    }

    clazz(value: unknown, opt?: ToTypeOpt): string {
        if (this.is.empty(value)) {
            return null;
        }
        switch (typeof value) {
            case 'string':
                value = value.trim();
                if (value === '') {
                    return null;
                }
                return value as string;
            case 'object':
            case 'function':
                return this.callback.fqnName(value);
        }
        return this.raiseInvalidValue(value, this._EXPECTED_CLASS, opt);
    }

    date(value: unknown, opt?: ToTypeOpt): Date {
        if (this.is.empty(value)) {
            return null;
        }
        switch (typeof value) {
            case 'object':
                if (value instanceof Date) {
                    return value;
                } else if (typeof value['toDate'] === 'function') {
                    return this.date(this.runSave(v => v.toDate(), value, opt), opt);
                }
                if (Array.isArray(value)) {
                    const arr = value as Array<number>;
                    if (arr.length === 1) {
                        return this.date(arr[0], opt);
                    }
                    if (arr.length > 1 && arr.length < 8) {
                        return this.date(this.runSave(v => new Date(v[0], v[1], v[2], v[3], v[4], v[5], v[6]), value, opt), opt);
                    }
                } else if ((value as Pair).id !== undefined) {
                    return this.date((value as Pair).id, opt);
                }
                break;
            case 'string':
                if (value.trim() === '') {
                    return null;
                }
                return this.date(this.runSave(v => new Date(v), value.trim(), opt), opt);
            case 'bigint':
                return this.date(this.runSave(v => new Date(Number(v)), value, opt), opt);
            case 'number':
                return this.date(this.runSave(v => new Date(v), value, opt), opt);
            case 'function':
                return this.runFn(v => this.date(v, opt), value, opt);
        }
        return this.raiseInvalidValue(value, this._EXPECTED_DATE, opt);
    }

    enumeration<T extends KeyValue = KeyValue>(value: unknown, opt?: ToTypeEnumOpt<T>): T {
        if (this.is.empty(value)) {
            return null;
        }
        opt = opt ?? {} as ToTypeEnumOpt<T>;
        let mapType: 'object' | 'array' = null;
        if (this.is.object(opt.map)) {
            mapType = 'object';
        } else if (this.is.array(opt.map)) {
            mapType = 'array';
        }
        if (!mapType) {
            throw new DeveloperException('type.invalid-enum-items', {map: opt.map});
        }
        let v: T;
        switch (typeof value) {
            case 'string':
                value = value.trim();
                if (value === '') {
                    return null;
                }
                if (mapType === 'object') {
                    v = this._enumInMap(value as T, opt.map as Dict<T>);
                } else {
                    v = this._enumInArray(value as T, opt.map as unknown as Array<T>);
                }
                if (v !== null) {
                    return v as T;
                }
                if (this.is.object(opt.alt)) {
                    v = this._enumInAlteration(value as T, opt.alt);
                    if (v !== null) {
                        return v as T;
                    }
                }
                return this.raiseInvalidValue(value, this._EXPECTED_ENUM, opt);
            case 'number':
                const num = this.assertion.realNumber(value, opt);
                if (num === null) {
                    return null;
                }
                if (mapType === 'object') {
                    v = this._enumInMap(value as unknown as T, opt.map as Dict<T>);
                } else {
                    v = this._enumInArray(value as unknown as T, opt.map as unknown as Array<T>);
                }
                if (v !== null) {
                    return v as T;
                }
                if (this.is.object(opt.alt)) {
                    v = this._enumInAlteration(value as unknown as T, opt.alt);
                    if (v !== null) {
                        return v as T;
                    }
                }
                return this.raiseInvalidValue(value, this._EXPECTED_ENUM, opt);
            case 'object':
                if (Array.isArray(value) && value.length === 1) {
                    return this.enumeration(value[0], opt);
                }
                return this.enumeration<T>((value as Pair).id, opt);
            case 'function':
                return this.runFn(v => this.enumeration(v, opt), value, opt);
        }
        return this.raiseInvalidValue(value, this._EXPECTED_ENUM, opt);
    }

    float(value: unknown, opt?: ToTypeOpt): number | null {
        if (this.is.empty(value)) {
            return null;
        }
        switch (typeof value) {
            case 'string':
                return this.float(this.runSave(parseFloat, value.trim(), opt), opt);
            case 'number':
                return this.assertion.realNumber(value, opt);
            case 'bigint':
                return this.float(this.runSave(Number, value, opt), opt);
            case 'boolean':
                return value ? 1 : 0;
            case 'object':
                if (Array.isArray(value) && value.length === 1) {
                    return this.float(value[0], opt);
                }
                return this.float((value as Pair).id, opt);
            case 'function':
                return this.runFn(v => this.float(v, opt), value, opt);
        }
        return this.raiseInvalidValue(value, this._EXPECTED_NUMBER, opt);
    }

    func<T = Function>(value: unknown, opt?: ToTypeOpt): T | null {
        if (this.is.empty(value)) {
            return null;
        }
        switch (typeof value) {
            case "function":
                return value as unknown as T;
            case 'object':
                if (Array.isArray(value) && value.length === 1) {
                    return this.func(value[0], opt);
                }
                break;
        }
        return this.raiseInvalidValue(value, ['function'], opt);
    }

    integer(value: unknown, opt?: ToTypeOpt): number | null {
        if (this.is.empty(value)) {
            return null;
        }
        switch (typeof value) {
            case 'string':
                return this.integer(this.runSave(parseFloat, value.trim(), opt), opt);
            case 'number':
                let num = this.assertion.realNumber(value, opt);
                if (num !== null && !Number.isSafeInteger(num)) {
                    num = Math.floor(num);
                }
                return num;
            case 'bigint':
                return this.integer(this.runSave(Number, value, opt), opt);
            case 'boolean':
                return value ? 1 : 0;
            case 'object':
                if (Array.isArray(value) && value.length === 1) {
                    return this.integer(value[0], opt);
                }
                return this.integer((value as Pair).id, opt);
            case 'function':
                return this.runFn(v => this.integer(v, opt), value, opt);
        }
        return this.raiseInvalidValue(value, this._EXPECTED_NUMBER, opt);
    }

    object<T = unknown>(value: unknown, opt?: ToTypeObjectOpt): Dict<T> {
        return this.dict(value, opt);
    }

    dict<T = unknown>(value: unknown, opt?: ToTypeObjectOpt): Dict<T> {
        if (this.is.empty(value)) {
            return null;
        }
        switch (typeof value) {
            case 'object':
                if (Array.isArray(value)) {
                    if (value.length === 1) {
                        return this.object(value[0], opt);
                    }
                } else {
                    opt = opt ?? {} as ToTypeObjectOpt;
                    const keyOpt = {...(opt?.children?.key ?? {}), ...opt} as ToTypeChildOpt<KeyValue>;
                    if (typeof keyOpt.fn !== 'function') {
                        keyOpt.fn = (k, o) => {
                            if (!this.is.key(k)) {
                                this.raiseInvalidValue(k, ['string', 'number'], o, {key: k});
                            }
                            return k as KeyValue;
                        }
                    }
                    const valueOpt = {...(opt?.children?.value ?? {}), ...opt} as ToTypeChildOpt<T>;
                    if (typeof valueOpt.fn !== 'function') {
                        valueOpt.fn = (v) => {
                            return v as T;
                        }
                    }
                    const result = {} as Dict<T>;
                    for (const [k, v] of Object.entries(value)) {
                        keyOpt.param = opt.param ? `${opt.param}.${k}` : `${k}`;
                        valueOpt.param = opt.param ? `${opt.param}.${k}` : `${k}`;
                        try {
                            result[keyOpt.fn(k, keyOpt)] = valueOpt.fn(v, valueOpt);
                        } catch (e) {
                            Exception.cast(e).raise(!opt.silent);
                            result[k] = null;
                        }
                    }
                    return result;
                }
                break;
            case 'function':
                return this.runFn<Dict<T>>(v => this.object(v, opt), value, opt);
        }
        return this.raiseInvalidValue(value, ['object'], opt);
    }

    string(value: unknown, opt?: ToTypeOpt): string {
        if (this.is.empty(value)) {
            return null;
        }
        switch (typeof value) {
            case 'string':
                return value;
            case 'number':
                const num = this.assertion.realNumber(value, opt);
                return num !== null ? num.toString(10) : null;
            case 'bigint':
                return value.toString();
            case 'boolean':
                return value ? 'true' : 'false';
            case 'object':
                if (Array.isArray(value) && value.length === 1) {
                    return this.string(value[0], opt);
                }
                return this.string((value as Pair).id, opt);
            case 'function':
                return this.runFn(v => this.string(v, opt), value, opt);
        }
        return this.raiseInvalidValue(value, this._EXPECTED_STRING, opt);
    }

    text(value: unknown, opt?: ToTypeOpt): string {
        if (this.is.empty(value)) {
            return null;
        }
        switch (typeof value) {
            case 'string':
                const str = value.trim();
                return str ? str : null;
            case 'number':
                const num = this.assertion.realNumber(value, opt);
                return num !== null ? num.toString(10) : null;
            case 'bigint':
                return value.toString();
            case 'boolean':
                return value ? 'true' : 'false';
            case 'object':
                if (Array.isArray(value) && value.length === 1) {
                    return this.text(value[0], opt);
                }
                return this.text((value as Pair).id, opt);
            case 'function':
                return this.runFn(v => this.text(v, opt), value, opt);
        }
        return this.raiseInvalidValue(value, this._EXPECTED_STRING, opt);
    }

    // endregion types

    // region secure
    $init(leyyo: Leyyo): void {
        this.is = leyyo.is;
        this.callback = leyyo.callback;
        this.assertion = leyyo.assertion;
    }

    get $back(): CommonTo {
        return this;
    }

    get $secure(): CommonToSecure {
        return this;
    }

    // endregion secure

}