import {
    AssertionCallback,
    AssertionTuple,
    AssertionTupleDualLambda, AssertionTupleItemLambda,
    CommonAssertionLike,
    CommonAssertionSecure
} from "./index.types";
import {LeyyoLike} from "../leyyo";
import {DevOpt} from "../developer";
import {FQN} from "../internal";
import {Primitive, PrimitiveItems, RealValue, RealValueItems} from "../to";
import {ClassLike, ClassOrFuncOrName, Dict, EnumLiteral, EnumMap, Fnc, Func, KeyValue, Obj, TypeOf} from "../shared";

// noinspection JSUnusedGlobalSymbols
/** @inheritDoc */
export class CommonAssertion implements CommonAssertionLike, CommonAssertionSecure {
    // region properties
    private readonly _EMPTY = [null, undefined];

    // endregion properties

    constructor(private lyy: LeyyoLike) {
    }

    // region internal
    private _run(opt: string | AssertionCallback | DevOpt): DevOpt {
        if (typeof opt === 'string') {
            return {issue: opt};
        } else if (typeof opt === 'function') {
            try {
                const values = opt();
                if (Array.isArray(values)) {
                    let [pck, testCase, opt2] = values;
                    if (!opt2) {
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
        } else {
            return (opt?.contructor === Object) ? opt as DevOpt : {};
        }
    }

    // endregion internal

    // region singular

    /** @inheritDoc */
    notEmpty<T = any>(value: any, opt?: string | AssertionCallback | DevOpt): T {
        if (this._EMPTY.includes(value)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'empty', value, type: typeof value});
        }
        return value as T;
    }


    /** @inheritDoc */
    realValue(value: any, opt?: string | AssertionCallback | DevOpt): RealValue {
        if (!RealValueItems.includes(typeof value as RealValue)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.real.value', value, type: typeof value});
        }
        return value as RealValue;
    }

    /** @inheritDoc */
    realValueOptional(value: any, opt?: string | AssertionCallback | DevOpt): RealValue {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.realValue(value, opt);
    }

    /** @inheritDoc */
    object<T = Dict>(value: any, opt?: string | AssertionCallback | DevOpt): T {
        if (!value || typeof value !== 'object' && !Array.isArray(value)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.object', value, type: typeof value});
        }
        return value as T;
    }

    /** @inheritDoc */
    objectOptional<T = Dict>(value: any, opt?: string | AssertionCallback | DevOpt): T {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.object(value, opt);
    }

    /** @inheritDoc */
    bareObject<T = Dict>(value: any, opt?: string | AssertionCallback | DevOpt): T {
        if (!value || typeof value !== 'object' && value.constructor !== Object) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.bare.object', value, type: typeof value});
        }
        return value as T;
    }

    /** @inheritDoc */
    bareObjectOptional<T = Dict>(value: any, opt?: string | AssertionCallback | DevOpt): T {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.bareObject(value, opt);
    }

    /** @inheritDoc */
    array<V = any>(value: any, opt?: string | AssertionCallback | DevOpt): Array<V> {
        if (!Array.isArray(value)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.array', value, type: typeof value});
        }
        return value as Array<V>;
    }

    /** @inheritDoc */
    arrayOptional<V = any>(value: any, opt?: string | AssertionCallback | DevOpt): Array<V> {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.array(value, opt);
    }

    /** @inheritDoc */
    instanceOf<C>(value: any, clazz: C, opt?: string | AssertionCallback | DevOpt): TypeOf<C> {
        if (typeof clazz !== 'function') {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.instanceof', value: clazz, type: typeof clazz});
        }
        if (!(value instanceof (clazz as ClassLike))) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'not.instance.of', value, type: typeof value, clazz: (clazz as Fnc)?.name});
        }
        return value as TypeOf<C>;
    }

    /** @inheritDoc */
    instanceOfOptional<C>(value: any, clazz: C, opt?: string | AssertionCallback | DevOpt): TypeOf<C> {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.instanceOf(value, clazz, opt);
    }

    /** @inheritDoc */
    tuple<T>(value: any, setting: AssertionTuple, opt?: string | AssertionCallback | DevOpt): T {
        if (!Array.isArray(setting)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.tuple.setting', value: setting, type: typeof setting});
        }
        if (!Array.isArray(value)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'tuple.should.be.array', value: setting, type: typeof setting});
        }
        const arr = value as Array<any>;
        if (arr.length !== setting.length) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'tuple.size.conflict', value: arr.length, setting: setting.length});
        }
        setting.forEach((set, index) => {
            if (Array.isArray(set)) {
                let method = set[0] as string;
                const another = set[1];
                if (set.length === 2 || typeof method !== 'string' || another === undefined) {
                    throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.tuple.setting', index, value: setting, type: typeof setting});
                }
                if (method.includes('?')) {
                    method = method.replace('?', 'Optional');
                }
                const lambda = this[method] as AssertionTupleDualLambda;
                if (typeof lambda !== 'function') {
                    throw this.lyy.dev.invalidError(this._run(opt), {issue: 'unknown.assertion.method', value: method});
                }
                lambda(arr[index], another, opt);
            }
            else if (typeof set === 'string') {
                let method = set as string;
                if (method.includes('?')) {
                    method = method.replace('?', 'Optional');
                }
                const lambda = this[method] as AssertionTupleItemLambda;
                if (typeof lambda !== 'function') {
                    throw this.lyy.dev.invalidError(this._run(opt), {issue: 'unknown.assertion.method', value: method});
                }
                lambda(arr[index], opt);
            }
        });
        return value as T;
    }

    // endregion singular

    // region multiple

    /** @inheritDoc */
    primitive(value: any, opt?: string | AssertionCallback | DevOpt): Primitive {
        if (!PrimitiveItems.includes(typeof value as Primitive)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.primitive', value, type: typeof value});
        }
        return value as Primitive;
    }

    /** @inheritDoc */
    primitiveOptional(value: any, opt?: string | AssertionCallback | DevOpt): Primitive {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.primitive(value, opt);
    }

    /** @inheritDoc */
    primitiveArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<Primitive> {
        const arr = this.array(value, opt);
        if (arr.length < 1 || arr.some(item => !PrimitiveItems.includes(typeof item as Primitive))) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.primitive.array', value, type: typeof value});
        }
        return value as Array<Primitive>;
    }

    /** @inheritDoc */
    key(value: any, opt?: string | AssertionCallback | DevOpt): KeyValue {
        if (!['string', 'number'].includes(typeof value)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.key', value, type: typeof value});
        }
        return value as KeyValue;
    }

    /** @inheritDoc */
    keyOptional(value: any, opt?: string | AssertionCallback | DevOpt): KeyValue {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.key(value, opt);
    }

    /** @inheritDoc */
    keyArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<KeyValue> {
        const arr = this.array(value, opt);
        if (arr.length < 1 || arr.some(item => !['string', 'number'].includes(typeof item))) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.key.array', value, type: typeof value});
        }
        return value as Array<KeyValue>;
    }

    /** @inheritDoc */
    func<F extends Func = Func>(value: any, opt?: string | AssertionCallback | DevOpt): F {
        if (typeof value !== 'function') {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.function', value, type: typeof value});
        }
        return value as F;
    }

    /** @inheritDoc */
    funcOptional<F extends Func = Func>(value: any, opt?: string | AssertionCallback | DevOpt): F {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.func(value, opt);
    }

    /** @inheritDoc */
    funcArray<F extends Func = Func>(value: any, opt?: string | AssertionCallback | DevOpt): Array<F> {
        const arr = this.array(value, opt);
        if (arr.length < 1 || arr.some(item => typeof item !== 'function')) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.function.array', value, type: typeof value});
        }
        return value as Array<F>;
    }

    /** @inheritDoc */
    sym(value: any, opt?: string | AssertionCallback | DevOpt): symbol {
        if (typeof value !== 'symbol') {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.symbol', value, type: typeof value});
        }
        return value as symbol;
    }

    /** @inheritDoc */
    symOptional(value: any, opt?: string | AssertionCallback | DevOpt): symbol {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.sym(value, opt);
    }

    /** @inheritDoc */
    symArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<symbol> {
        const arr = this.array(value, opt);
        if (arr.length < 1 || arr.some(item => typeof item !== 'symbol')) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.symbol.array', value, type: typeof value});
        }
        return value as Array<symbol>;
    }

    /** @inheritDoc */
    number(value: any, opt?: string | AssertionCallback | DevOpt): number {
        if (typeof value !== 'number') {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.number', value, type: typeof value});
        }
        return value as number;
    }

    /** @inheritDoc */
    numberOptional(value: any, opt?: string | AssertionCallback | DevOpt): number {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.number(value, opt);
    }

    /** @inheritDoc */
    numberArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<number> {
        const arr = this.array(value, opt);
        if (arr.length < 1 || arr.some(item => typeof item !== 'number')) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.number.array', value, type: typeof value});
        }
        return value as Array<number>;
    }

    /** @inheritDoc */
    positiveNumber(value: any, opt?: string | AssertionCallback | DevOpt): number {
        if (typeof value !== 'number' || (value <= 0)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.positive.positive', value, type: typeof value});
        }
        return value as number;
    }

    /** @inheritDoc */
    positiveNumberOptional(value: any, opt?: string | AssertionCallback | DevOpt): number {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.positiveNumber(value, opt);
    }

    /** @inheritDoc */
    positiveNumberArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<number> {
        const arr = this.array(value, opt);
        if (arr.length < 1 || arr.some(item => typeof item !== 'number' || (item <= 0))) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.positive.number.array', value, type: typeof value});
        }
        return value as Array<number>;
    }

    /** @inheritDoc */
    nonNegative(value: any, opt?: string | AssertionCallback | DevOpt): number {
        if (typeof value !== 'number' || (value < 0)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.non-negative.number', value, type: typeof value});
        }
        return value as number;
    }

    /** @inheritDoc */
    nonNegativeOptional(value: any, opt?: string | AssertionCallback | DevOpt): number {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.nonNegative(value, opt);
    }

    /** @inheritDoc */
    nonNegativeArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<number> {
        const arr = this.array(value, opt);
        if (arr.length < 1 || arr.some(item => typeof item !== 'number' || (item < 0))) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.non-negative.number.array', value, type: typeof value});
        }
        return value as Array<number>;
    }

    /** @inheritDoc */
    integer(value: any, opt?: string | AssertionCallback | DevOpt): number {
        if (!Number.isInteger(value)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.integer', value, type: typeof value});
        }
        return value as number;
    }

    /** @inheritDoc */
    integerArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<number> {
        const arr = this.array(value, opt);
        if (arr.length < 1 || arr.some(item => !Number.isInteger(item))) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.integer.array', value, type: typeof value});
        }
        return value as Array<number>;
    }

    /** @inheritDoc */
    integerOptional(value: any, opt?: string | AssertionCallback | DevOpt): number {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.integer(value, opt);
    }

    /** @inheritDoc */
    safeInteger(value: any, opt?: string | AssertionCallback | DevOpt): number {
        if (!Number.isSafeInteger(value)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.safe.integer', value, type: typeof value});
        }
        return value as number;
    }

    /** @inheritDoc */
    safeIntegerOptional(value: any, opt?: string | AssertionCallback | DevOpt): number {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.safeInteger(value, opt);
    }

    /** @inheritDoc */
    safeIntegerArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<number> {
        const arr = this.array(value, opt);
        if (arr.length < 1 || arr.some(item => !Number.isSafeInteger(item))) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.safe.integer.array', value, type: typeof value});
        }
        return value as Array<number>;
    }

    /** @inheritDoc */
    positiveInteger(value: any, opt?: string | AssertionCallback | DevOpt): number {
        if (!Number.isInteger(value) || ((value as number) <= 0)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.positive.integer', value, type: typeof value});
        }
        return value as number;
    }

    /** @inheritDoc */
    positiveIntegerOptional(value: any, opt?: string | AssertionCallback | DevOpt): number {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.positiveNumber(value, opt);
    }

    /** @inheritDoc */
    positiveIntegerArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<number> {
        const arr = this.array(value, opt);
        if (arr.length < 1 || arr.some(item => !Number.isSafeInteger(item) || ((item as number) <= 0))) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.positive.integer.array', value, type: typeof value});
        }
        return value as Array<number>;
    }

    /** @inheritDoc */
    string(value: any, opt?: string | AssertionCallback | DevOpt): string {
        if (typeof value !== 'string') {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.string', value, type: typeof value});
        }
        return value as string;
    }

    /** @inheritDoc */
    stringOptional(value: any, opt?: string | AssertionCallback | DevOpt): string {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.string(value, opt);
    }

    /** @inheritDoc */
    stringArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<string> {
        const arr = this.array(value, opt);
        if (arr.length < 1 || arr.some(item => typeof item !== 'string')) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.string.array', value, type: typeof value});
        }
        return value as Array<string>;
    }

    /** @inheritDoc */
    text(value: any, opt?: string | AssertionCallback | DevOpt): string {
        if (typeof value !== 'string' || value.trim() !== value || value === '') {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.text', value, type: typeof value});
        }
        return value as string;
    }

    /** @inheritDoc */
    textOptional(value: any, opt?: string | AssertionCallback | DevOpt): string {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.text(value, opt);
    }

    /** @inheritDoc */
    textArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<string> {
        const arr = this.array(value, opt);
        if (arr.length < 1 || arr.some(item => typeof item !== 'string' || item.trim() !== item || item === '')) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.text.array', value, type: typeof value});
        }
        return value as Array<string>;
    }

    /** @inheritDoc */
    clazz(value: any, opt?: string | AssertionCallback | DevOpt): ClassOrFuncOrName {
        if (!((typeof value === 'function') || (typeof value === 'string' && value.trim() !== ''))) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.class.or.name', value, type: typeof value});
        }
        return value as ClassOrFuncOrName;
    }

    /** @inheritDoc */
    clazzOptional(value: any, opt?: string | AssertionCallback | DevOpt): ClassOrFuncOrName {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.clazz(value, opt);
    }

    /** @inheritDoc */
    clazzArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<ClassOrFuncOrName> {
        const arr = this.array(value, opt);
        if (arr.length < 1 || arr.some(item => !((typeof item === 'function') || (typeof item === 'string' && item.trim() !== '')))) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.class.or.name.array', value, type: typeof value});
        }
        return value as Array<ClassOrFuncOrName>;
    }

    /** @inheritDoc */
    boolean(value: any, opt?: string | AssertionCallback | DevOpt): boolean {
        if (typeof value !== 'boolean') {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.boolean', value, type: typeof value});
        }
        return value as boolean;
    }

    /** @inheritDoc */
    booleanOptional(value: any, opt?: string | AssertionCallback | DevOpt): boolean {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.boolean(value, opt);
    }

    /** @inheritDoc */
    booleanArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<boolean> {
        const arr = this.array(value, opt);
        if (arr.length < 1 || arr.some(item => typeof item !== 'boolean')) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.boolean.array', value, type: typeof value});
        }
        return value as Array<boolean>;
    }

    /** @inheritDoc */
    enum<E extends KeyValue = KeyValue>(value: any, map: EnumMap<E>, opt?: string | AssertionCallback | DevOpt): E {
        if (!map || typeof map !== 'object' && (map as Obj).constructor !== Object) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.enum.map', value: map, type: typeof map});
        }
        if (!['string', 'number'].includes(typeof value) || map[value]) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.enum', value, type: typeof value});
        }
        return value as E;
    }

    /** @inheritDoc */
    enumOptional<E extends KeyValue = KeyValue>(value: any, map: EnumMap<E>, opt?: string | AssertionCallback | DevOpt): E {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.enum(value, map, opt);
    }

    /** @inheritDoc */
    enumArray<E extends KeyValue = KeyValue>(value: any, map: EnumMap<E>, opt?: string | AssertionCallback | DevOpt): Array<E> {
        if (!map || typeof map !== 'object' && (map as Obj).constructor !== Object) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.enum.map', value: map, type: typeof map});
        }
        const arr = this.array(value, opt);
        if (arr.length < 1 || arr.some(item => (!['string', 'number'].includes(typeof item) || map[item as KeyValue]))) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.enum.array', value, type: typeof value});
        }
        return value as Array<E>;
    }

    /** @inheritDoc */
    literal<E extends KeyValue = KeyValue>(value: any, items: EnumLiteral<E>, opt?: string | AssertionCallback | DevOpt): E {
        if (!Array.isArray(items)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.literal.items', value: items, type: typeof items});
        }
        if (!['string', 'number'].includes(typeof value) || !(items as Array<E>).includes(value)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.literal', value, type: typeof value});
        }
        return value as E;
    }

    /** @inheritDoc */
    literalOptional<E extends KeyValue = KeyValue>(value: any, items: EnumLiteral<E>, opt?: string | AssertionCallback | DevOpt): E {
        if (this._EMPTY.includes(value)) {
            return undefined;
        }
        return this.literal(value, items, opt);
    }

    /** @inheritDoc */
    literalArray<E extends KeyValue = KeyValue>(value: any, items: EnumLiteral<E>, opt?: string | AssertionCallback | DevOpt): Array<E> {
        if (!Array.isArray(items)) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.literal.items', value: items, type: typeof items});
        }
        const arr = this.array(value, opt);
        if (arr.length < 1 || arr.some(item => (!['string', 'number'].includes(typeof item) || !(items as Array<E>).includes(item)))) {
            throw this.lyy.dev.invalidError(this._run(opt), {issue: 'invalid.enum.array', value, type: typeof value});
        }
        return value as Array<E>;
    }


    // endregion multiple

    // region secure

    /** @inheritDoc */
    get $back(): CommonAssertionLike {
        return this;
    }

    /** @inheritDoc */
    $init(): void {

        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, CommonAssertion, 'class', FQN);
        })
    }

    /** @inheritDoc */
    get $secure(): CommonAssertionSecure {
        return this;
    }

    // endregion secure

}
