import {FQN} from "../internal";

import type {
    AssertionCallback,
    AssertionCommonLike,
    AssertionTuple,
    AssertionTupleDuals,
    AssertionTupleValue,
    AssertionCommonSecure
} from "./index.types";
import type {LeyyoLike} from "../leyyo";
import type {DevOpt} from "../developer";
import type {ClassLike, EnumLiteral, EnumMap, Fnc, KeyValue} from "../shared";

// noinspection JSUnusedGlobalSymbols
/** @inheritDoc */
export class AssertionCommon implements AssertionCommonLike, AssertionCommonSecure {
    // region properties
    private readonly _EMPTY = [null, undefined];

    // endregion properties

    constructor(private lyy: LeyyoLike) {
    }

    // region internal
    private _run(opt: string | AssertionCallback | DevOpt): DevOpt {
        if (typeof opt === 'string') {
            return {issue: opt};
        }
        else if (typeof opt === 'function') {
            try {
                const values = opt();
                if (Array.isArray(values)) {
                    let [pck, testCase, opt2] = values;
                    if ( !opt2) {
                        opt2 = {} as DevOpt;
                    }
                    opt2['message'] = this.lyy.test.code(pck, testCase);
                    return opt2;
                }
                else if (typeof values === 'string') {
                    return {issue: values};
                }
                else {
                    return (values && values.contructor === Object) ? values as DevOpt : {};
                }
            } catch (e) {
                const now = Date.now();
                return {
                    message: e.message,
                    [`e-${now}-name`]: e.name,
                };
            }
        }
        else {
            return (opt?.contructor === Object) ? opt as DevOpt : {};
        }
    }

    private _optional(value: unknown, fn: Fnc): void {
        if (this._EMPTY.includes(value)) {
            return;
        }
        fn();
    }

    private _array(value: any, opt: string | AssertionCallback | DevOpt, issue: string, fn: Fnc): void {
        if ( !Array.isArray(value)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue, reason: 'type', type: typeof value});
        }
        const arr = value as Array<unknown>;
        if (arr.length < 1) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue, reason: 'size', size: 0});
        }
        const wrongIndexes = arr.filter(item => !fn(item)).map((_v, index) => index);
        if (wrongIndexes.length > 0) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue, reason: 'items', wrongIndexes});
        }
    }

    private _is(value: any, opt: string | AssertionCallback | DevOpt, issue: string, fn: Fnc, extra: DevOpt): void {
        if ( !fn(value)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue, value, type: typeof value, ...extra});
        }
    }

    private _replaceMethod(method: string): string {
        if (method.endsWith('?')) {
            method = method.slice(0, -1) + 'Optional';
        }
        else if (method.endsWith('[]')) {
            method = method.slice(0, -2) + 'Array';
        }
        return method;
    }
    private _execLambda(value: unknown, method: string, opt: string | AssertionCallback | DevOpt, isDual: boolean, throwable: boolean, another?: unknown): string {
        if (typeof method !== 'string') {
            if (throwable) {
                throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.method.name', value: method})
            }
            return 'invalid.method.name';
        }
        method = this._replaceMethod(method);
        const fn = this[method] as Fnc;
        if (typeof fn !== 'function') {
            if (throwable) {
                throw this.lyy.dev.invalidError(this._run(opt), {issue: 'unknown.assertion.method', value: method})
            }
            return 'unknown.assertion.method';
        }
        try {
            if (isDual) {
                fn(value, another, opt);
            }
            else {
                fn(value, opt);
            }
        } catch (e) {
            if (throwable) {
                throw e;
            }
            return e.message;
        }
        return undefined;
    }

    private _isTupleReason(value: any, setting: AssertionTuple): string {
        if ( !Array.isArray(setting)) {
            return 'invalid.tuple.setting';
        }
        if ( !Array.isArray(value)) {
            return 'tuple.should.be.array';
        }
        const arr = value as Array<any>;
        if (arr.length < 1) {
            return 'tuple.empty.array';
        }
        if (arr.length !== setting.length) {
            return 'tuple.size.conflict';
        }
        let index = -1;
        for (const set of setting) {
            index++;
            let method: string;
            let another: any
            let isDual: boolean;
            if (Array.isArray(set)) {
                if (set[0] === 'or') {
                    const orCase = set as ['or', Array<AssertionTupleValue>];
                    if (!this._isOrCase(arr[index], orCase[1])) {
                        return 'invalid-or-case';
                    }
                    break;
                }
                const dualCase = set as [AssertionTupleDuals, any];
                method = dualCase[0];
                another = dualCase[1];
                isDual = true;
                if (another === undefined) {
                    return 'invalid.tuple.setting';
                }
            }
            else if (typeof set === 'string') {
                method = set as string;
            }
            const issue = this._execLambda(arr[index], method, {}, isDual, false, another);
            if (issue) {
                return issue;
            }
        }
        return undefined;
    }

    private _isTuple(value: any, setting: AssertionTuple): boolean {
        return !this._isTupleReason(value, setting);
    }
    private _isOrCase(value: any, types: Array<AssertionTupleValue>): boolean {
        for (const type of types) {
            let method: string;
            let another: any;
            let isDual: boolean;
            if (typeof type === 'string') {
                method = type;
            }
            else if (Array.isArray(type) && type.length === 2) {
                method = type[0];
                another = type[1];
                isDual = true;
            }
            const issue = this._execLambda(value, method, {}, isDual, false, another);
            if (!issue) {
                return true;
            }
        }
        return false;
    }

    // endregion internal

    // region general
    /** @inheritDoc */
    notEmpty<T = any>(value: any, opt?: string | AssertionCallback | DevOpt): T {
        if (this._EMPTY.includes(value)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'empty', value, type: typeof value});
        }
        return value as T;
    }

    // endregion general

    // region or
    orCase(value: any, types: Array<AssertionTupleValue>, opt?: string | AssertionCallback | DevOpt) {
        let firstError: Error;
        for (const type of types) {
            let method: string;
            let another: any
            let isDual: boolean;
            let errorOccurred: boolean;
            if (Array.isArray(type)) {
                const dualCase = type as [AssertionTupleDuals, any];
                method = dualCase[0];
                another = dualCase[1];
                isDual = true;
                if (another === undefined) {
                    if (!firstError) {
                        firstError = this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.tuple.setting', value: method});
                    }
                    errorOccurred = true;
                }
            }
            else if (typeof type === 'string') {
                method = type as string;
            }
            if (!errorOccurred) {
                const issue = this._execLambda(value, method, opt, isDual, false, another);
                if (!issue) {
                    return;
                }
                if (!firstError) {
                    firstError = this.lyy.dev.invalidError(this._run(opt), {issue, value: method});
                }
            }
        }
        if (firstError) {
            throw firstError;
        }
    }
    /** @inheritDoc */
    orCaseOptional(value: any, types: Array<AssertionTupleValue>, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.orCase(value, types, opt));
    }

    /** @inheritDoc */
    orCaseArray(value: any, types: Array<AssertionTupleValue>, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.orCase.array', (v) => this._isOrCase(v, types));
    }
    // endregion or

    // region realValue
    /** @inheritDoc */
    realValue(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.realValue', v => this.lyy.is.realValue(v), {});
    }

    /** @inheritDoc */
    realValueOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.realValue(value, opt));
    }

    /** @inheritDoc */
    realValueArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.realValue.array', (v) => this.lyy.is.realValue(v));
    }

    // endregion realValue


    // region object
    /** @inheritDoc */
    object(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.object', v => this.lyy.is.object(v), {});
    }

    /** @inheritDoc */
    objectOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.object(value, opt));
    }

    objectArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.object.array', (v) => this.lyy.is.object(v));
    }

    // endregion object


    // region bareObject
    /** @inheritDoc */
    bareObject(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.bareObject', v => this.lyy.is.bareObject(v), {});
    }

    /** @inheritDoc */
    bareObjectOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.bareObject(value, opt));
    }

    bareObjectArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.bareObject.array', (v) => this.lyy.is.bareObject(v));
    }

    // endregion bareObject

    // region anotherObject
    /** @inheritDoc */
    anotherObject(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.anotherObject', v => this.lyy.is.anotherObject(v), {});
    }

    /** @inheritDoc */
    anotherObjectOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.anotherObject(value, opt));
    }

    /** @inheritDoc */
    anotherObjectArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.anotherObject.array', (v) => this.lyy.is.anotherObject(v));
    }

    // endregion anotherObject

    // region array
    /** @inheritDoc */
    array(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.array', v => Array.isArray(v) && v.length > 0, {});
    }

    /** @inheritDoc */
    arrayOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.array(value, opt));
    }

    /** @inheritDoc */
    arrayArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.array.array', (v) => Array.isArray(v));
    }
    // endregion array

    // region instanceOf
    /** @inheritDoc */
    instanceOf<T>(value: any, clazz: ClassLike<T>, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.instanceOf', v => this.lyy.is.instanceOf(v, clazz), {clazz});
    }

    /** @inheritDoc */
    instanceOfOptional<T>(value: any, clazz: ClassLike<T>, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.instanceOf(value, clazz, opt));
    }

    /** @inheritDoc */
    instanceOfArray<T>(value: any, clazz: ClassLike<T>, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.instanceOf.array', (v) => this.lyy.is.instanceOf(v, clazz));
    }
    // endregion instanceOf

    // region tuple
    /** @inheritDoc */
    tuple(value: any, setting: AssertionTuple, opt?: string | AssertionCallback | DevOpt): void {
        if ( !Array.isArray(setting)) {
            throw this.lyy.dev.invalidError(this._run(opt), {
                issue: 'invalid.tuple.setting',
                value: setting,
                type: typeof setting
            });
        }
        if ( !Array.isArray(value)) {
            throw this.lyy.dev.invalidError(this._run(opt), {
                issue: 'tuple.should.be.array',
                value: setting,
                type: typeof setting
            });
        }
        const arr = value as Array<any>;
        if (arr.length !== setting.length) {
            throw this.lyy.dev.invalidError(this._run(opt), {
                issue: 'tuple.size.conflict',
                value: arr.length,
                setting: setting.length
            });
        }
        setting.forEach((set, index) => {
            let method: string;
            let another: any;
            let isDual: boolean;
            if (Array.isArray(set)) {
                if (set[0] === 'or') {
                    const orCase = set as ['or', Array<AssertionTupleValue>];
                    this.orCase(arr[index], orCase[1], opt);
                    return;
                }
                const dualCase = set as [AssertionTupleDuals, any];
                method = dualCase[0];
                another = dualCase[1];
                isDual = true;
                if (another === undefined) {
                    throw this.lyy.dev.invalidError(this._run(opt), {
                        issue: 'invalid.tuple.setting',
                        index,
                        value: setting,
                        type: typeof setting
                    });
                }
            }
            else if (typeof set === 'string') {
                method = set as string;
            }
            this._execLambda(arr[index], method, opt, isDual, true, another);
        });
    }

    /** @inheritDoc */
    tupleOptional(value: any, setting: AssertionTuple, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.tuple(value, setting, opt));
    }

    /** @inheritDoc */
    tupleArray(value: any, setting: AssertionTuple, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.tuple.array', (v) => this._isTuple(v, setting));
    }
    // endregion tuple


    // region primitive
    /** @inheritDoc */
    primitive(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.primitive', v => this.lyy.is.primitive(v), {});
    }

    /** @inheritDoc */
    primitiveOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.primitive(value, opt));
    }

    /** @inheritDoc */
    primitiveArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.primitive.array', (v) => this.lyy.is.primitive(v));
    }
    // endregion primitive

    // region key
    /** @inheritDoc */
    key(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.key', v => this.lyy.is.key(v), {});
    }

    /** @inheritDoc */
    keyOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.key(value, opt));
    }

    /** @inheritDoc */
    keyArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.key.array', (v) => this.lyy.is.key(v));
    }
    // endregion key


    // region arrayLike
    /** @inheritDoc */
    arrayLike(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.arrayLike', v => this.lyy.is.arrayLike(v), {});
    }

    /** @inheritDoc */
    arrayLikeOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.arrayLike(value, opt));
    }

    /** @inheritDoc */
    arrayLikeArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.arrayLike.array', (v) => this.lyy.is.arrayLike(v));
    }
    // endregion arrayLike


    // region function
    /** @inheritDoc */
    func(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.function', v => this.lyy.is.func(v), {});
    }

    /** @inheritDoc */
    funcOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.func(value, opt));
    }

    /** @inheritDoc */
    funcArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.function.array', (v) => this.lyy.is.func(v));
    }
    // endregion function

    // region symbol
    /** @inheritDoc */
    sym(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.symbol', v => this.lyy.is.sym(v), {});
    }

    /** @inheritDoc */
    symOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.sym(value, opt));
    }

    /** @inheritDoc */
    symArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.symbol.array', (v) => this.lyy.is.sym(v));
    }
    // endregion symbol


    // region number
    /** @inheritDoc */
    number(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.number', v => this.lyy.is.number(v), {});
    }

    /** @inheritDoc */
    numberOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.number(value, opt));
    }

    /** @inheritDoc */
    numberArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.number.array', (v) => this.lyy.is.number(v));
    }
    // endregion number

    // region positiveNumber
    /** @inheritDoc */
    positiveNumber(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.positiveNumber', v => this.lyy.is.positiveNumber(v), {});
    }

    /** @inheritDoc */
    positiveNumberOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.positiveNumber(value, opt));
    }

    /** @inheritDoc */
    positiveNumberArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.positiveNumber.array', (v) => this.lyy.is.positiveNumber(v));
    }
    // endregion positiveNumber


    // region nonNegativeNumber
    /** @inheritDoc */
    nonNegativeNumber(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.nonNegativeNumber', v => this.lyy.is.nonNegativeNumber(v), {});
    }

    /** @inheritDoc */
    nonNegativeNumberOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.nonNegativeNumber(value, opt));
    }

    /** @inheritDoc */
    nonNegativeNumberArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.nonNegativeNumber.array', (v) => this.lyy.is.nonNegativeNumber(v));
    }
    // endregion nonNegativeNumber


    // region integer
    /** @inheritDoc */
    integer(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.integer', v => this.lyy.is.integer(v), {});
    }

    /** @inheritDoc */
    integerOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.integer(value, opt));
    }

    /** @inheritDoc */
    integerArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.integer.array', (v) => this.lyy.is.integer(v));
    }
    // endregion integer


    // region safeInteger
    /** @inheritDoc */
    safeInteger(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.safeInteger', v => this.lyy.is.safeInteger(v), {});
    }

    /** @inheritDoc */
    safeIntegerOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.safeInteger(value, opt));
    }

    /** @inheritDoc */
    safeIntegerArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.safeInteger.array', (v) => this.lyy.is.safeInteger(v));
    }
    // endregion safeInteger


    // region positiveInteger
    /** @inheritDoc */
    positiveInteger(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.positiveInteger', v => this.lyy.is.positiveInteger(v), {});
    }

    /** @inheritDoc */
    positiveIntegerOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.positiveInteger(value, opt));
    }

    /** @inheritDoc */
    positiveIntegerArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.positiveInteger.array', (v) => this.lyy.is.positiveInteger(v));
    }
    // endregion positiveInteger


    // region nonNegativeInteger
    nonNegativeInteger(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.nonNegativeInteger', v => this.lyy.is.nonNegativeInteger(v), {});
    }

    nonNegativeIntegerArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.nonNegativeInteger(value, opt));
    }

    nonNegativeIntegerOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.nonNegativeInteger.array', (v) => this.lyy.is.nonNegativeInteger(v));
    }
    // endregion nonNegativeInteger

    // region string
    /** @inheritDoc */
    string(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.string', v => this.lyy.is.string(v), {});
    }

    /** @inheritDoc */
    stringOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.string(value, opt));
    }

    /** @inheritDoc */
    stringArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.string.array', (v) => this.lyy.is.string(v));
    }
    // endregion string


    // region text
    /** @inheritDoc */
    text(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.text', v => this.lyy.is.text(v), {});
    }

    /** @inheritDoc */
    textOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.text(value, opt));
    }

    /** @inheritDoc */
    textArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.text.array', (v) => this.lyy.is.text(v));
    }
    // endregion text

    // region clazz
    /** @inheritDoc */
    clazz(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.class', v => this.lyy.is.clazz(v), {});
    }

    /** @inheritDoc */
    clazzOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.clazz(value, opt));
    }

    /** @inheritDoc */
    clazzArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.clazz.array', (v) => this.lyy.is.clazz(v));
    }
    // endregion clazz

    // region possibleFunc
    /** @inheritDoc */
    possibleFunc(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.possibleFunc', v => this.lyy.is.possibleFunc(v), {});
    }

    /** @inheritDoc */
    possibleFuncOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.possibleFunc(value, opt));
    }

    /** @inheritDoc */
    possibleFuncArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.possibleFunc.array', (v) => this.lyy.is.possibleFunc(v));
    }
    // endregion possibleFunc


    // region boolean
    /** @inheritDoc */
    boolean(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.boolean', v => this.lyy.is.boolean(v), {});
    }

    /** @inheritDoc */
    booleanOptional(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.boolean(value, opt));
    }

    /** @inheritDoc */
    booleanArray(value: any, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.boolean.array', (v) => this.lyy.is.boolean(v));
    }
    // endregion boolean

    // region enum
    /** @inheritDoc */
    enum<E extends KeyValue = KeyValue>(value: any, map: EnumMap<E>, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.enum', v => this.lyy.is.enumeration(v, map), {});
    }

    /** @inheritDoc */
    enumOptional<E extends KeyValue = KeyValue>(value: any, map: EnumMap<E>, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.enum(value, map, opt));
    }

    /** @inheritDoc */
    enumArray<E extends KeyValue = KeyValue>(value: any, map: EnumMap<E>, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.enum.array', (v) => this.lyy.is.enumeration(v, map));
    }
    // endregion enum

    // region literal
    /** @inheritDoc */
    literal<E extends KeyValue = KeyValue>(value: any, items: EnumLiteral<E>, opt?: string | AssertionCallback | DevOpt): void {
        this._is(value, opt, 'invalid.literal', v => this.lyy.is.literal(v, items), {});
    }

    /** @inheritDoc */
    literalOptional<E extends KeyValue = KeyValue>(value: any, items: EnumLiteral<E>, opt?: string | AssertionCallback | DevOpt): void {
        this._optional(value, () => this.literal(value, items, opt));
    }

    /** @inheritDoc */
    literalArray<E extends KeyValue = KeyValue>(value: any, items: EnumLiteral<E>, opt?: string | AssertionCallback | DevOpt): void {
        this._array(value, opt, 'invalid.literal.array', (v) => this.lyy.is.literal(v, items));
    }
    // endregion literal


    // region secure

    /** @inheritDoc */
    get $back(): AssertionCommonLike {
        return this;
    }

    /** @inheritDoc */
    $init(): void {

        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, AssertionCommon, 'class', FQN);
        })
    }

    /** @inheritDoc */
    get $secure(): AssertionCommonSecure {
        return this;
    }


    // endregion secure

}
