import {CommonToLike, CommonToSecure, ToOpt, ToOptAny, ToSubIndexFnLambda, ToSubKeyFnLambda} from "./index-types";
import {Arr, Dict, EnumAlt, EnumLiteral, EnumMap, Func, KeyValue, Obj, Pair} from "../shared";
import {LeyyoCommonHook, LeyyoLike} from "../leyyo";
import {FQN_PCK} from "../internal";
import {PrimitiveItems} from "./primitive";
import {RealValueItems} from "./real-value";
import {KeyValueItems} from "./key-value";
import {WeakTrue, WeakTrueItems} from "./weak-true";
import {WeakFalse, WeakFalseItems} from "./weak-false";
import {List} from "./list";

// noinspection JSUnusedGlobalSymbols
export class CommonTo implements CommonToLike, CommonToSecure {

    // region properties
    private readonly _EMPTY = [null, undefined];
    private readonly _EXPECTED_ANY = ['string', 'boolean', 'bigint', 'object', 'number', 'array'];
    private readonly _EXPECTED_ARRAY = ['array', 'Set', 'List'];
    private readonly _EXPECTED_BOOL = ['boolean', 'string', 'number'];
    private readonly _EXPECTED_DATE = ['string', 'number', 'date', 'moment'];
    private readonly _EXPECTED_ENUM = ['string', 'number'];
    private readonly _EXPECTED_NUMBER = ['string', 'number', 'bigint'];
    private readonly _EXPECTED_STRING = ['boolean', 'string', 'number'];
    private readonly _EXPECTED_OBJECT = ['object', 'Map'];
    private readonly _EXPECTED_FUNCTION = ['function', 'Wrap'];
    private lyy: LeyyoLike;
    // endregion properties

    // region secure
    $init(lyy: LeyyoLike): void {
        this.lyy = lyy;

        this.lyy.$secure.$lazyRun(() => {
            const enumMap = {
                Primitive: PrimitiveItems,
                RealValue: RealValueItems,
                KeyValue: KeyValueItems,
                WeakTrue: WeakTrueItems,
                WeakFalse: WeakFalseItems,
            };
            for (const [name, value] of Object.entries(enumMap)) {
                this.lyy.fqn.register(name, value, 'enum', FQN_PCK);
                this.lyy.hook.queueForCallback(LeyyoCommonHook.enumPendingRegister, value);
            }

        }).$lazyRun(() => {
            this.lyy.fqn.register(null, CommonTo, 'class', FQN_PCK);
            this.lyy.fqn.register(null, List, 'class', FQN_PCK);
        });
    }

    get $back(): CommonToLike {
        return this;
    }

    get $secure(): CommonToSecure {
        return this;
    }

    $runOpt(opt: ToOptAny): ToOpt {
        if (typeof opt === 'function') {
            try {
                return opt();
            } catch (e) {
                const key = `<error>[${Date.now()}]` as string;
                return {
                    [key]: [e.message, e.name],
                };
            }
        } else if (!this._EMPTY.includes(opt) || typeof opt !== 'object' || opt.constructor !== Object) {
            const key = `<invalid-opt>[${Date.now()}]` as string;
            return {
                [key]: this.lyy.dev.secureJson(opt, true),
            };
        } else {
            return opt;
        }
    }

    $runFn<T = any>(fn: Func, value: Func, opt?: ToOpt): T {
        try {
            return fn(value()) as T;
        } catch (e) {
            return this.$errorOrLog(opt, undefined, e);
        }
    }

    $errorOrLog(opt: ToOptAny, extra: ToOpt, e?: Error): any {
        const newOpt = this.$runOpt(opt) ?? {};
        if (!newOpt.silent) {
            delete newOpt.silent;
            if (e instanceof Error) {
                throw this.lyy.dev.nativeError(e, newOpt, extra);
            } else {
                throw this.lyy.dev.invalidError(newOpt, extra);
            }
        } else {
            if (e instanceof Error) {
                this.lyy.dev.log(e, newOpt, 'warn');
            } else {
                this.lyy.dev.log(this.lyy.dev.appendAll(newOpt, extra), 'warn');
            }
        }
        return undefined;
    }

    $unexpectedError<T = any>(value: unknown, expected: Array<string>, opt?: ToOpt): T {
        return this.$errorOrLog(opt, {expected, type: typeof value, value});
    }
    $nullError<T = any>(expected: Array<string>, opt?: ToOpt): T {
        return this.$errorOrLog(opt, {issue: 'null', expected});
    }
    $emptyError<T = any>(kind: string, opt?: ToOpt): T {
        return this.$errorOrLog(opt, {issue: kind + '.size'});
    }
    $inEnumMap<T extends KeyValue = KeyValue>(value: unknown, map: Dict<T>): T {
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
            let v = this.$inEnumMap(str, map);
            if (!this._EMPTY.includes(v)) {
                return v;
            }
            // regular, in upper-case
            str = str.toUpperCase();
            v = this.$inEnumMap(str, map);
            if (!this._EMPTY.includes(v)) {
                return v;
            }
            if (/^[0-9]+$/.test(value)) {
                try {
                    return this.$inEnumMap(parseInt(value, 10), map);
                } catch (e) {
                }
            }
            return undefined;
        }
        return undefined;
    }

    $inEnumArray<T extends KeyValue = KeyValue>(value: unknown, arr: Array<T>): T {
        // regular, in values
        if (arr.includes(value as T)) {
            return value as T;
        }
        if (typeof value === 'string') {
            // regular, in lower-case
            let str = value.toLowerCase();
            let v = this.$inEnumArray(str, arr);
            if (!this._EMPTY.includes(v)) {
                return v;
            }
            // regular, in upper-case
            str = str.toUpperCase();
            v = this.$inEnumArray(str, arr);
            if (!this._EMPTY.includes(v)) {
                return v;
            }
            if (/^[0-9]+$/.test(value)) {
                try {
                    return this.$inEnumArray(parseInt(value, 10), arr);
                } catch (e) {
                }
            }
            return undefined;
        }
        return undefined;
    }

    // noinspection JSMethodCanBeStatic
    $inEnumAlteration<T extends KeyValue = KeyValue>(value: unknown, alt: Dict<T>): T {
        // ir-regular, in keys
        if (Object.keys(alt).includes(value as string)) {
            return alt[value as string];
        }
        if (typeof value === 'string') {
            // regular, in lower-case
            let str = value.toLowerCase();
            let v = this.$inEnumAlteration(str, alt);
            if (!this._EMPTY.includes(v)) {
                return v;
            }
            // regular, in upper-case
            str = str.toUpperCase();
            v = this.$inEnumAlteration(str, alt);
            if (!this._EMPTY.includes(v)) {
                return v;
            }
            if (/^[0-9]+$/.test(value)) {
                try {
                    return this.$inEnumAlteration(parseInt(value, 10), alt);
                } catch (e) {
                }
            }
            return undefined;
        }
        return undefined;
    }

    $realNumber(value: number, opt?: ToOpt): number {
        if (isNaN(value) || !isFinite(value)) {
            return this.$errorOrLog(opt, {issue: 'invalid.real.number', value, type: typeof value});
        }
        return value;
    }

    // endregion secure

    // region types

    anyStrict<T = any>(value: any, opt?: ToOptAny): T {
        return this.any(value, opt, true);
    }
    any<T = any>(value: any, opt?: ToOptAny, notNull?: boolean): T {
        if (this._EMPTY.includes(value)) {
            if (notNull) {
                this.$nullError(this._EXPECTED_ANY, opt);
            }
            return value as T;
        }
        switch (typeof value) {
            case 'string':
            case 'boolean':
            case 'bigint':
            case 'object':
                return value;
            case 'number':
                return this.$realNumber(value, opt) as T;
            case 'function':
                return this.$runFn(v => this.any(v, opt, notNull), value, opt);
        }
        return this.$unexpectedError(value, this._EXPECTED_ANY, opt);
    }

    booleanStrict(value: any, opt?: ToOptAny): boolean {
        return this.boolean(value, opt, true);
    }
    boolean(value: any, opt?: ToOptAny, notNull?: boolean): boolean {
        if (this._EMPTY.includes(value)) {
            if (notNull) {
                this.$nullError(this._EXPECTED_BOOL, opt);
            }
            return value;
        }
        switch (typeof value) {
            case 'boolean':
                return value;
            case 'string':
                value = value.trim().toLowerCase();
                if (value === '') {
                    return undefined;
                }
                if (WeakTrueItems.includes(value as WeakTrue)) {
                    return true;
                }
                if (WeakFalseItems.includes(value as WeakFalse)) {
                    return false;
                }
                return this.$errorOrLog(opt, {issue: 'invalid.bool.text', value});
            case 'number':
                return value > 0;
            case 'object':
                if (Array.isArray(value) && value.length === 1) {
                    return this.boolean(value[0], opt, notNull);
                }
                break;
            case 'function':
                return this.$runFn(v => this.boolean(v, opt, notNull), value, opt);
        }
        return this.$unexpectedError(value, this._EXPECTED_BOOL, opt);
    }

    dateStrict(value: any, opt?: ToOptAny): Date {
        return this.date(value, opt, true);
    }
    date(value: any, opt?: ToOptAny, notNull?: boolean): Date {
        if (this._EMPTY.includes(value)) {
            if (notNull) {
                this.$nullError(this._EXPECTED_DATE, opt);
            }
            return value;
        }
        let fn: Func;
        switch (typeof value) {
            case 'object':
                if (value instanceof Date) {
                    return value;
                } else if (typeof value['toDate'] === 'function') {
                    fn = () => value['toDate']();
                    return this.$runFn(v => this.date(v, opt, notNull), fn, opt);
                }
                if (Array.isArray(value)) {
                    const arr = value as Array<number>;
                    if (arr.length === 1) {
                        return this.date(arr[0], opt, notNull);
                    }
                    if (arr.length > 1 && arr.length < 8) {
                        const [year, monthIndex, date, hours, minutes, seconds, ms] = arr;
                        fn = () => new Date(year, monthIndex, date, hours, minutes, seconds, ms);
                        return this.$runFn(v => this.date(v, opt, notNull), fn, opt);
                    }
                } else if ((value as Pair).id !== undefined) {
                    return this.date((value as Pair).id, opt, notNull);
                }
                break;
            case 'string':
                if (value.trim() === '') {
                    return undefined;
                }
                fn = () => new Date(value.trim());
                return this.$runFn(v => this.date(v, opt, notNull), fn, opt);
            case 'bigint':
                fn = () => new Date(value.toString(10));
                return this.$runFn(v => this.date(v, opt, notNull), fn, opt);
            case 'number':
                fn = () => new Date(value);
                return this.$runFn(v => this.date(v, opt, notNull), fn, opt);
            case 'function':
                return this.$runFn(v => this.date(v, opt, notNull), value, opt);
        }
        return this.$unexpectedError(value, this._EXPECTED_DATE, opt);
    }

    enumerationStrict<E extends KeyValue = KeyValue>(value: any, map: EnumMap<E>, opt?: ToOpt, alt?: EnumAlt<E>): E {
        return this.enumeration(value, map, opt, alt, true);
    }
    enumeration<E extends KeyValue = KeyValue>(value: any, map: EnumMap<E>, opt?: ToOpt, alt?: EnumAlt<E>, notNull?: boolean): E {
        if (this._EMPTY.includes(value)) {
            if (notNull) {
                this.$nullError(this._EXPECTED_ENUM, opt);
            }
            return value;
        }
        if (!this.lyy.is.bareObject(map)) {
            return this.$errorOrLog(opt, {issue: 'invalid.enum.map', type: typeof map, map});
        }
        let v: E;
        switch (typeof value) {
            case 'string':
                value = value.trim();
                if (value === '') {
                    return undefined;
                }
                v = this.$inEnumMap(value as E, map);
                if (!this._EMPTY.includes(v)) {
                    return v as E;
                }
                if (this.lyy.is.bareObject(alt)) {
                    v = this.$inEnumAlteration(value as E, alt);
                    if (!this._EMPTY.includes(v)) {
                        return v as E;
                    }
                }
                return this.$unexpectedError(value, this._EXPECTED_ENUM, opt);
            case 'number':
                const num = this.$realNumber(value, opt);
                if (!this._EMPTY.includes(num)) {
                    return null;
                }
                v = this.$inEnumMap(value as unknown as E, map);
                if (!this._EMPTY.includes(v)) {
                    return v as E;
                }
                if (this.lyy.is.bareObject(alt)) {
                    v = this.$inEnumAlteration(value as E, alt);
                    if (!this._EMPTY.includes(v)) {
                        return v as E;
                    }
                }
                return this.$unexpectedError(value, this._EXPECTED_ENUM, opt);
            case 'object':
                if (Array.isArray(value) && value.length === 1) {
                    return this.enumeration(value[0], map, opt, alt, notNull);
                }
                return this.enumeration<E>((value as Pair).id, map, opt, alt, notNull);
            case 'function':
                return this.$runFn(v => this.enumeration(v, map, opt, alt, notNull), value, opt);
        }
        return this.$unexpectedError(value, this._EXPECTED_ENUM, opt);
    }

    literalStrict<E extends KeyValue = KeyValue>(value: any, items: EnumLiteral<E> | any, opt?: ToOpt, alt?: EnumAlt<E>): E {
        return this.literal(value, items, opt, alt, true);
    }
    literal<E extends KeyValue = KeyValue>(value: any, items: EnumLiteral<E> | any, opt?: ToOpt, alt?: EnumAlt<E>, notNull?: boolean): E {
        if (this._EMPTY.includes(value)) {
            if (notNull) {
                this.$nullError(this._EXPECTED_ENUM, opt);
            }
            return value;
        }
        if (!Array.isArray(items)) {
            return this.$errorOrLog(opt, {issue: 'invalid.enum.literal', type: typeof items, items});
        }
        let v: E;
        switch (typeof value) {
            case 'string':
                value = value.trim();
                if (value === '') {
                    return undefined;
                }
                v = this.$inEnumArray(value as E, items);
                if (!this._EMPTY.includes(v)) {
                    return v as E;
                }
                if (this.lyy.is.bareObject(alt)) {
                    v = this.$inEnumAlteration(value as E, alt);
                    if (!this._EMPTY.includes(v)) {
                        return v as E;
                    }
                }
                return this.$unexpectedError(value, this._EXPECTED_ENUM, opt);
            case 'number':
                const num = this.$realNumber(value, opt);
                if (!this._EMPTY.includes(num)) {
                    return null;
                }
                v = this.$inEnumArray(value as unknown as E, items);
                if (!this._EMPTY.includes(v)) {
                    return v as E;
                }
                if (this.lyy.is.bareObject(alt)) {
                    v = this.$inEnumAlteration(value as E, alt);
                    if (!this._EMPTY.includes(v)) {
                        return v as E;
                    }
                }
                return this.$unexpectedError(value, this._EXPECTED_ENUM, opt);
            case 'object':
                if (Array.isArray(value) && value.length === 1) {
                    return this.literal(value[0], items, opt, alt, notNull);
                }
                return this.literal<E>((value as Pair).id, items, opt, alt, notNull);
            case 'function':
                return this.$runFn(v => this.literal(v, items, opt, alt, notNull), value, opt);
        }
        return this.$unexpectedError(value, this._EXPECTED_ENUM, opt);
    }

    floatStrict(value: any, opt?: ToOptAny): number {
        return this.float(value, opt, true);
    }
    float(value: any, opt?: ToOptAny, notNull?: boolean): number {
        if (this._EMPTY.includes(value)) {
            if (notNull) {
                this.$nullError(this._EXPECTED_NUMBER, opt);
            }
            return value;
        }
        let fn: Func;
        switch (typeof value) {
            case 'string':
                fn = () => parseFloat(value);
                return this.$runFn(v => this.float(v, opt, notNull), fn, opt);
            case 'number':
                return this.$realNumber(value, opt);
            case 'bigint':
                fn = () => Number(value);
                return this.$runFn(v => this.float(v, opt, notNull), fn, opt);
            case 'boolean':
                return value ? 1 : 0;
            case 'object':
                if (Array.isArray(value) && value.length === 1) {
                    return this.float(value[0], opt, notNull);
                }
                return this.float((value as Pair).id, opt, notNull);
            case 'function':
                return this.$runFn(v => this.float(v, opt, notNull), value, opt);
        }
        return this.$unexpectedError(value, this._EXPECTED_NUMBER, opt);
    }

    funcStrict<F extends Func = Func>(value: any, opt?: ToOptAny): F {
        return this.func(value, opt, true);
    }
    func<F extends Func = Func>(value: any, opt?: ToOptAny, notNull?: boolean): F {
        if (this._EMPTY.includes(value)) {
            if (notNull) {
                this.$nullError(this._EXPECTED_FUNCTION, opt);
            }
            return value;
        }
        switch (typeof value) {
            case "function":
                return value as F;
            case 'object':
                if (this.lyy.wrapper.isFunction(value)) {
                    return this.lyy.wrapper.asFunction<F>(value);
                }
                if (Array.isArray(value) && value.length === 1) {
                    return this.func(value[0], opt, notNull);
                }
                break;
        }
        return this.$unexpectedError(value, this._EXPECTED_FUNCTION, opt);
    }

    integerStrict(value: any, opt?: ToOptAny): number {
        return  this.integer(value, opt, true);
    }
    integer(value: any, opt?: ToOptAny, notNull?: boolean): number {
        if (this._EMPTY.includes(value)) {
            if (notNull) {
                this.$nullError(this._EXPECTED_NUMBER, opt);
            }
            return value;
        }
        let fn: Func;
        switch (typeof value) {
            case 'string':
                fn = () => parseInt(value);
                return this.$runFn(v => this.integer(v, opt, notNull), fn, opt);
            case 'number':
                let num = this.$realNumber(value, opt);
                if (num !== null && !Number.isSafeInteger(num)) {
                    num = Math.floor(num);
                }
                return num;
            case 'bigint':
                fn = () => Number(value);
                return this.$runFn(v => this.integer(v, opt, notNull), fn, opt);
            case 'boolean':
                return value ? 1 : 0;
            case 'object':
                if (Array.isArray(value) && value.length === 1) {
                    return this.integer(value[0], opt, notNull);
                }
                return this.integer((value as Pair).id, opt, notNull);
            case 'function':
                return this.$runFn(v => this.integer(v, opt, notNull), value, opt);
        }
        return this.$unexpectedError(value, this._EXPECTED_NUMBER, opt);
    }

    stringStrict(value: any, opt?: ToOptAny): string {
        return this.string(value, opt, true);
    }
    string(value: any, opt?: ToOptAny, notNull?: boolean): string {
        if (this._EMPTY.includes(value)) {
            if (notNull) {
                this.$nullError(this._EXPECTED_STRING, opt);
            }
            return value;
        }
        switch (typeof value) {
            case 'string':
                return value;
            case 'number':
                const num = this.$realNumber(value, opt);
                return this._EMPTY.includes(num) ? (num as undefined) : num.toString(10);
            case 'bigint':
                return value.toString();
            case 'boolean':
                return value ? 'true' : 'false';
            case 'object':
                if (Array.isArray(value) && value.length === 1) {
                    return this.string(value[0], opt, notNull);
                }
                return this.string((value as Pair).id, opt, notNull);
            case 'function':
                return this.$runFn(v => this.string(v, opt, notNull), value, opt);
        }
        return this.$unexpectedError(value, this._EXPECTED_STRING, opt);
    }

    textStrict(value: any, opt?: ToOptAny): string {
        return this.text(value, opt, true);
    }
    text(value: any, opt?: ToOptAny, notNull?: boolean): string {
        if (this._EMPTY.includes(value)) {
            if (notNull) {
                this.$nullError(this._EXPECTED_STRING, opt);
            }
            return value;
        }
        switch (typeof value) {
            case 'string':
                const str = value.trim();
                if (str === '') {
                    if (notNull) {
                        this.$nullError(this._EXPECTED_STRING, opt);
                    }
                    return undefined;
                }
                return str;
            case 'number':
                const num = this.$realNumber(value, opt);
                return this._EMPTY.includes(num) ? (num as undefined) : num.toString(10);
            case 'bigint':
                return value.toString();
            case 'boolean':
                return value ? 'true' : 'false';
            case 'object':
                if (Array.isArray(value) && value.length === 1) {
                    return this.text(value[0], opt, notNull);
                }
                return this.text((value as Pair).id, opt, notNull);
            case 'function':
                return this.$runFn(v => this.text(v, opt, notNull), value, opt);
        }
        return this.$unexpectedError(value, this._EXPECTED_STRING, opt);
    }

    // endregion types

    // region objects

    arrayStrict<V = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<V>): Array<V> {
        return this.array(value, opt, itemFn, true);
    }
    arrayStrictNotEmpty<V = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<V>): Array<V> {
        const result = this.array(value, opt, itemFn, true);
        if (result.length < 1) {
            this.$emptyError('array', opt);
        }
        return result;
    }
    arrayNotEmpty<V = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<V>): Array<V> {
        const result = this.array(value, opt, itemFn, false);
        if (result && result.length < 1) {
            this.$emptyError('array', opt);
        }
        return result;
    }
    array<V = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<V>, notNull?: boolean): Array<V> {
        if (this._EMPTY.includes(value)) {
            if (notNull) {
                this.$nullError(this._EXPECTED_ARRAY, opt);
            }
            return value;
        }
        switch (typeof value) {
            case "string":
            case "boolean":
            case "number":
            case "bigint":
                return this.array([value], opt, itemFn, notNull);
            case 'object':
                if (value instanceof Set) {
                    if (value.size < 1) {
                        return [];
                    }
                    return this.array(Array.from(value.values()), opt, itemFn, notNull);
                } else if (value instanceof List) {
                    if (value.length < 1) {
                        return [];
                    }
                    return this.array([...value], opt, itemFn, notNull);
                }
                if (Array.isArray(value)) {
                    if (typeof itemFn !== "function" || value.length < 1) {
                        return value;
                    }
                    const newOpt = this.$runOpt(opt);
                    const field = (typeof newOpt.field === 'string') ? newOpt.field : undefined;
                    const clonedOpt = {...newOpt} as ToOpt;
                    return (value as Arr).map((v, index) => {
                        clonedOpt.field = field ? `${field}#${index}` : `#${index}`;
                        try {
                            return itemFn(v, index, clonedOpt);
                        } catch (e) {
                            if (newOpt.silent) {
                                this.lyy.dev.log(e, clonedOpt, 'warn');
                            } else {
                                throw this.lyy.dev.nativeError(e, clonedOpt);
                            }
                            return v;
                        }
                    });
                }
                return this.array([value], opt, itemFn, notNull);
            case 'function':
                return this.$runFn(v => this.array(v, opt, itemFn, notNull), value, opt);
        }
        return this.$unexpectedError(value, this._EXPECTED_ARRAY, opt);
    }

    setStrict<V = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<V>): Set<V> {
        return this.set(value, opt, itemFn, true);
    }
    setStrictNotEmpty<V = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<V>): Set<V> {
        const result = this.set(value, opt, itemFn, true);
        if (result.size < 1) {
            this.$emptyError('set', opt);
        }
        return result;
    }
    setNotEmpty<V = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<V>): Set<V> {
        const result = this.set(value, opt, itemFn, false);
        if (result && result.size < 1) {
            this.$emptyError('set', opt);
        }
        return result;
    }

    set<V = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<V>, notNull?: boolean): Set<V> {
        if (this._EMPTY.includes(value)) {
            if (notNull) {
                this.$nullError(this._EXPECTED_ARRAY, opt);
            }
            return value;
        }
        switch (typeof value) {
            case "string":
            case "boolean":
            case "number":
            case "bigint":
                return this.set([value], opt, itemFn, notNull);
            case 'object':
                if (value instanceof Set) {
                    if (typeof itemFn !== "function" || value.size < 1) {
                        return value;
                    }
                    const clonedArr = this.array(Array.from(value.values()), opt, itemFn, notNull);
                    value.clear();
                    if (clonedArr) {
                        clonedArr.forEach(item => value.add(item));
                    }
                    return value;
                } else if (value instanceof List) {
                    if (value.length < 1) {
                        return new Set<V>();
                    }
                    if (typeof itemFn !== "function") {
                        return new Set<V>([...value]);
                    }
                    return new Set<V>(this.array([...value], opt, itemFn, notNull));
                }
                if (Array.isArray(value)) {
                    if (value.length < 1) {
                        return new Set<V>();
                    }
                    if (typeof itemFn !== "function") {
                        return new Set<V>(value);
                    }
                    return new Set<V>(this.array(value, opt, itemFn, notNull));
                }
                break;
            case 'function':
                return this.$runFn(v => this.set(v, opt, itemFn, notNull), value, opt);
        }
        return this.$unexpectedError(value, this._EXPECTED_ARRAY, opt);
    }

    listStrict<T = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<T>): List<T> {
        return this.list(value, opt, itemFn, true);
    }
    listStrictNotEmpty<T = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<T>): List<T> {
        const result = this.list(value, opt, itemFn, true);
        if (result.length < 1) {
            this.$emptyError('set', opt);
        }
        return result;
    }
    listNotEmpty<T = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<T>): List<T> {
        const result = this.list(value, opt, itemFn, false);
        if (result && result.length < 1) {
            this.$emptyError('set', opt);
        }
        return result;
    }
    list<T = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<T>, notNull?: boolean): List<T> {
        if (this._EMPTY.includes(value)) {
            if (notNull) {
                this.$nullError(this._EXPECTED_ARRAY, opt);
            }
            return value;
        }
        switch (typeof value) {
            case "string":
            case "boolean":
            case "number":
            case "bigint":
                return this.list([value], opt, itemFn, notNull);
            case 'object':
                if (value instanceof Set) {
                    const newList = new List<T>();
                    if (value.size < 1) {
                        return newList;
                    }
                    if (typeof itemFn !== "function") {
                        newList.push(...Array.from(value.values()));
                        return newList;
                    }
                    const clonedArr = this.array(Array.from(value.values()), opt, itemFn, notNull);
                    if (clonedArr) {
                        newList.push(...clonedArr);
                    }
                    return newList;
                } else if (value instanceof List) {
                    if (typeof itemFn !== "function" || value.length < 1) {
                        return value;
                    }
                    const clonedArr = this.array([...value], opt, itemFn, notNull);
                    value.clear();
                    if (clonedArr) {
                        value.push(...clonedArr);
                    }
                    return value;
                }
                if (Array.isArray(value)) {
                    const newList = new List<T>();
                    if (value.length < 1) {
                        return newList;
                    }
                    if (typeof itemFn !== "function") {
                        newList.push(...value);
                        return newList;
                    }
                    const clonedArr = this.array(value, opt, itemFn, notNull);
                    if (clonedArr) {
                        newList.push(...clonedArr);
                    }
                    return newList;
                }
                break;
            case 'function':
                return this.$runFn(v => this.list(v, opt, itemFn, notNull), value, opt);
        }
        return this.$unexpectedError(value, this._EXPECTED_ARRAY, opt);
    }


    objectStrict<O extends Obj = Obj>(value: any, opt?: ToOptAny): O {
        return this.object(value, opt, true);
    }
    object<O extends Obj = Obj>(value: any, opt?: ToOptAny, notNull?: boolean): O {
        return this.dict(value, opt, undefined, undefined, notNull) as O;
    }

    mapStrict<K = any, V = any>(value: any, opt?: ToOptAny, valueFn?: ToSubKeyFnLambda<V>, keyFn?: ToSubIndexFnLambda<K>): Map<K, V> {
        return this.map(value, opt, valueFn, keyFn, true);
    }
    mapStrictNotEmpty<K = any, V = any>(value: any, opt?: ToOptAny, valueFn?: ToSubKeyFnLambda<V>, keyFn?: ToSubIndexFnLambda<K>): Map<K, V> {
        const result = this.map(value, opt, valueFn, keyFn, true);
        if (result.size < 1) {
            this.$emptyError('map', opt);
        }
        return result;
    }
    mapNotEmpty<K = any, V = any>(value: any, opt?: ToOptAny, valueFn?: ToSubKeyFnLambda<V>, keyFn?: ToSubIndexFnLambda<K>): Map<K, V> {
        const result = this.map(value, opt, valueFn, keyFn, false);
        if (result && result.size < 1) {
            this.$emptyError('map', opt);
        }
        return result;
    }

    map<K = any, V = any>(value: any, opt?: ToOptAny, valueFn?: ToSubKeyFnLambda<V>, keyFn?: ToSubIndexFnLambda<K>, notNull?: boolean): Map<K, V> {
        if (this._EMPTY.includes(value)) {
            if (notNull) {
                this.$nullError(this._EXPECTED_OBJECT, opt);
            }
            return value;
        }
        switch (typeof value) {
            case 'object':
                if (value instanceof Set) {
                    if (value.size === 1) {
                        return this.map(Array.from(value.values())[0], opt, valueFn, keyFn, notNull);
                    }
                } else if (value instanceof List) {
                    if (value.length === 1) {
                        return this.map(value[0], opt, valueFn, keyFn, notNull);
                    }
                } else if (value instanceof Map) {
                    if (typeof valueFn !== "function" && typeof keyFn !== "function") {
                        return value;
                    }
                    if (value.size < 1) {
                        return value;
                    }

                    const newOpt = this.$runOpt(opt);
                    const field = (typeof newOpt.field === 'string') ? newOpt.field : undefined;
                    const clonedOpt = {...newOpt} as ToOpt;
                    const cloned = Object.fromEntries(value.entries());
                    let index = -1;
                    value.clear();
                    for (const [k, v] of Object.entries(cloned)) {
                        if (typeof k === 'symbol') {
                            continue;
                        }
                        index++;
                        let newKey = k;
                        let newValue = v;
                        if (typeof keyFn === 'function') {
                            clonedOpt.field = field ? `${field}#${index}` : `#${index}`;
                            try {
                                newKey = keyFn(k, index, clonedOpt) as string;
                            } catch (e) {
                                this.$errorOrLog(clonedOpt, undefined, e);
                            }
                            if (this._EMPTY.includes(newKey)) {
                                continue
                            }
                        }
                        if (typeof valueFn === 'function') {
                            clonedOpt.field = field ? `${field}.${k}` : k;
                            try {
                                newValue = valueFn(v, k, clonedOpt);
                            } catch (e) {
                                this.$errorOrLog(clonedOpt, undefined, e);
                            }
                        }
                        value.set(newKey, newValue);
                    }
                    return value;
                } else if (Array.isArray(value)) {
                    if (value.length === 1) {
                        return this.map(value[0], opt, valueFn, keyFn, notNull);
                    }
                } else if (this.lyy.is.bareObject(value)) {
                    const newMap = new Map<K, V>();
                    const keys = Object.keys(value);
                    if (keys.length < 1) {
                        return newMap;
                    }
                    for (const [k, v] of Object.entries(value)) {
                        newMap.set(k as K, v as V);
                    }
                    return this.map(newMap, opt, valueFn, keyFn, notNull);
                }
                break;
            case 'function':
                return this.$runFn(v => this.map(v, opt, valueFn, keyFn, notNull), value, opt);
        }
        return this.$unexpectedError(value, this._EXPECTED_OBJECT, opt);
    }

    dictStrict<V = any>(value: any, opt?: ToOptAny, valueFn?: ToSubKeyFnLambda<V>, keyFn?: ToSubIndexFnLambda<string>): Dict<V> {
        return this.dict(value, opt, valueFn, keyFn, true);
    }
    dictStrictNotEmpty<V = any>(value: any, opt?: ToOptAny, valueFn?: ToSubKeyFnLambda<V>, keyFn?: ToSubIndexFnLambda<string>): Dict<V> {
        const result = this.dict(value, opt, valueFn, keyFn, true);
        if (Object.keys(result).length < 1) {
            this.$emptyError('dict', opt);
        }
        return result;
    }
    dictNotEmpty<V = any>(value: any, opt?: ToOptAny, valueFn?: ToSubKeyFnLambda<V>, keyFn?: ToSubIndexFnLambda<string>, notNull?: boolean): Dict<V> {
        const result = this.dict(value, opt, valueFn, keyFn, false);
        if (result && Object.keys(result).length < 1) {
            this.$emptyError('dict', opt);
        }
        return result;
    }
    dict<V = any>(value: any, opt?: ToOptAny, valueFn?: ToSubKeyFnLambda<V>, keyFn?: ToSubIndexFnLambda<string>, notNull?: boolean): Dict<V> {
        if (this._EMPTY.includes(value)) {
            if (notNull) {
                this.$nullError(this._EXPECTED_OBJECT, opt);
            }
            return value;
        }
        switch (typeof value) {
            case 'object':
                if (value instanceof Set) {
                    if (value.size === 1) {
                        return this.dict(Array.from(value.values())[0], opt, valueFn, keyFn, notNull);
                    }
                } else if (value instanceof List) {
                    if (value.length === 1) {
                        return this.dict(value[0], opt, valueFn, keyFn, notNull);
                    }
                } else if (value instanceof Map) {
                    if (value.size < 1) {
                        return {};
                    }
                    return this.dict(Object.fromEntries(value.entries()), opt, valueFn, keyFn, notNull);
                } else if (Array.isArray(value)) {
                    if (value.length === 1) {
                        return this.dict(value[0], opt, valueFn, keyFn, notNull);
                    }
                } else if (this.lyy.is.bareObject(value)) {
                    if (typeof valueFn !== "function" && typeof keyFn !== "function") {
                        return value;
                    }
                    const keys = Object.keys(value);
                    if (keys.length < 1) {
                        return value;
                    }
                    const newOpt = this.$runOpt(opt);
                    const field = (typeof newOpt.field === 'string') ? newOpt.field : undefined;
                    const clonedOpt = {...newOpt} as ToOpt;
                    const cloned = {...value} as Dict<V>;
                    keys
                        .filter(k => typeof k !== 'symbol')
                        .forEach(k => {
                            try {
                                delete value[k];
                            } catch (e) {
                            }
                        });
                    let index = -1;
                    for (const [k, v] of Object.entries(cloned)) {
                        if (typeof k === 'symbol') {
                            continue;
                        }
                        index++;
                        let newKey = k;
                        let newValue = v;
                        if (typeof keyFn === 'function') {
                            clonedOpt.field = field ? `${field}#${index}` : `#${index}`;
                            try {
                                newKey = keyFn(k, index, clonedOpt);
                            } catch (e) {
                                this.$errorOrLog(clonedOpt, undefined, e);
                            }
                            if (this._EMPTY.includes(newKey)) {
                                continue
                            }
                        }
                        if (typeof valueFn === 'function') {
                            clonedOpt.field = field ? `${field}.${k}` : k;
                            try {
                                newValue = valueFn(v, k, clonedOpt);
                            } catch (e) {
                                this.$errorOrLog(clonedOpt, undefined, e);
                            }
                        }
                        try {
                            value[newKey] = newValue;
                        } catch (e) {
                        }
                    }
                    return value;
                }
                // other objects, don't toch
                return value;
            case 'function':
                return this.$runFn(v => this.dict(v, opt, valueFn, keyFn, notNull), value, opt);
        }
        return this.$unexpectedError(value, this._EXPECTED_OBJECT, opt);
    }

    // endregion objects
}
