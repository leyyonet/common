import {
    ClassOrFuncOrName,
    Dict, EnumLiteral, EnumMap,
    Func,
    InitLike,
    KeyValue,
    ShiftMain,
    ShiftSecure,
    TypeOf
} from "../shared";
import {DevOpt} from "../developer";
import {Primitive, RealValue} from "../to";

export type AssertionTupleItems = 'object'|'object?'|
    'bareObject'|'bareObject?'|
    'array'|'array?'|
    'realValue'|'realValue?'|
    'primitive'|'primitive?'|
    'key'|'key?'|
    'func'|'func?'|
    'sym'|'sym?'|
    'number'|'number?'|
    'positiveNumber'|'positiveNumber?'|
    'integer'|'integer?'|
    'safeInteger'|'safeInteger?'|
    'positiveInteger'|'positiveInteger?'|
    'string'|'string?'|
    'text'|'text?'|
    'clazz'|'clazz?'|
    'boolean'|'boolean?';
export type AssertionTupleDuals = 'instanceOf'|'instanceOf?'|
    'enum'|'enum?'|
    'literal'|'literal?';
export type AssertionTuple = Array<AssertionTupleItems | [AssertionTupleDuals, any]>;
export type AssertionTupleItemLambda = (value: any, opt: string | AssertionCallback | DevOpt) => any;
export type AssertionTupleDualLambda = (value: any, setting: any, opt: string | AssertionCallback | DevOpt) => any;
/**
 * Basic assertions to easy use
 * */
export interface CommonAssertionLike extends ShiftSecure<CommonAssertionSecure> {

    // region singular
    /**
     * Asserts value is not empty
     * @see CommonIsLike#empty
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    notEmpty<T = any>(value: any, opt?: string | AssertionCallback | DevOpt): T;

    /**
     * Asserts value is a real value
     * @see CommonIsLike#realValue
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    realValue(value: any, opt?: string | AssertionCallback | DevOpt): RealValue;

    /**
     * Optional usage of below
     * @see #realValue
     * */
    realValueOptional(value: any, opt?: string | AssertionCallback | DevOpt): RealValue;

    /**
     * Asserts value is an object
     * @see CommonIsLike#object
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    object<T = Dict>(value: any, opt?: string | AssertionCallback | DevOpt): T;

    /**
     * Optional usage of below
     * @see #object
     * */
    objectOptional<T = Dict>(value: any, opt?: string | AssertionCallback | DevOpt): T;

    /**
     * Asserts value is an object
     * @see CommonIsLike#object
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    bareObject<T = Dict>(value: any, opt?: string | AssertionCallback | DevOpt): T;

    /**
     * Optional usage of below
     * @see #bareObject
     * */
    bareObjectOptional<T = Dict>(value: any, opt?: string | AssertionCallback | DevOpt): T;

    /**
     * Asserts value is an array
     * @see CommonIsLike#empty
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    array<V = any>(value: any, opt?: string | AssertionCallback | DevOpt): Array<V>;

    /**
     * Optional usage of below
     * @see #array
     * */
    arrayOptional<V = any>(value: any, opt?: string | AssertionCallback | DevOpt): Array<V>;

    /**
     * Asserts value is instance of class
     *
     * @param {any} value
     * @param {ClassLike} clazz
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    instanceOf<C>(value: any, clazz: C, opt?: string | AssertionCallback | DevOpt): TypeOf<C>;

    /**
     * Optional usage of below
     * @see #instanceOf
     * */
    instanceOfOptional<C>(value: any, clazz: C, opt?: string | AssertionCallback | DevOpt): TypeOf<C>;

    /**
     * Asserts value is a tuple
     *
     * @param {any} value
     * @param {AssertionTuple} setting
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    tuple<T>(value: any, setting: AssertionTuple, opt?: string | AssertionCallback | DevOpt): T;

    // endregion singular


    // region multiple

    /**
     * Asserts value is a primitive
     * @see CommonIsLike#primitive
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    primitive(value: any, opt?: string | AssertionCallback | DevOpt): Primitive;

    /**
     * Optional usage of below
     * @see #primitive
     * */
    primitiveOptional(value: any, opt?: string | AssertionCallback | DevOpt): Primitive;

    /**
     * Array usage of below
     * @see #primitive
     * */
    primitiveArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<Primitive>;

    /**
     * Asserts value is a key
     * @see CommonIsLike#key
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    key(value: any, opt?: string | AssertionCallback | DevOpt): KeyValue;

    /**
     * Optional usage of below
     * @see #key
     * */
    keyOptional(value: any, opt?: string | AssertionCallback | DevOpt): KeyValue;

    /**
     * Array usage of below
     * @see #key
     * */
    keyArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<KeyValue>;

    /**
     * Asserts value is a function
     * @see CommonIsLike#func
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    func<F extends Func = Func>(value: any, opt?: string | AssertionCallback | DevOpt): F;

    /**
     * Optional usage of below
     * @see #func
     * */
    funcOptional<F extends Func = Func>(value: any, opt?: string | AssertionCallback | DevOpt): F;

    /**
     * Array usage of below
     * @see #func
     * */
    funcArray<F extends Func = Func>(value: any, opt?: string | AssertionCallback | DevOpt): Array<F>;

    /**
     * Asserts value is a symbol
     * @see CommonIsLike#func
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    sym(value: any, opt?: string | AssertionCallback | DevOpt): symbol;

    /**
     * Optional usage of below
     * @see #sym
     * */
    symOptional(value: any, opt?: string | AssertionCallback | DevOpt): symbol;

    /**
     * Array usage of below
     * @see #sym
     * */
    symArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<symbol>;

    /**
     * Asserts value is a number
     * @see CommonIsLike#number
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    number(value: any, opt?: string | AssertionCallback | DevOpt): number;

    /**
     * Optional usage of below
     * @see #number
     * */
    numberOptional(value: any, opt?: string | AssertionCallback | DevOpt): number;

    /**
     * Array usage of below
     * @see #number
     * */
    numberArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<number>;

    /**
     * Asserts value is a positive number
     * @see CommonIsLike#number
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    positiveNumber(value: any, opt?: string | AssertionCallback | DevOpt): number;

    /**
     * Optional usage of below
     * @see #positiveNumber
     * */
    positiveNumberOptional(value: any, opt?: string | AssertionCallback | DevOpt): number;

    /**
     * Array usage of below
     * @see #positiveNumber
     * */
    positiveNumberArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<number>;

    /**
     * Asserts value is a non-negative number
     * @see CommonIsLike#number
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    nonNegative(value: any, opt?: string | AssertionCallback | DevOpt): number;

    /**
     * Optional usage of below
     * @see #nonNegative
     * */
    nonNegativeOptional(value: any, opt?: string | AssertionCallback | DevOpt): number;

    /**
     * Array usage of below
     * @see #nonNegative
     * */
    nonNegativeArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<number>;

    /**
     * Asserts value is an integer
     * @see CommonIsLike#integer
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    integer(value: any, opt?: string | AssertionCallback | DevOpt): number;

    /**
     * Optional usage of below
     * @see #integer
     * */
    integerOptional(value: any, opt?: string | AssertionCallback | DevOpt): number;

    /**
     * Array usage of below
     * @see #integer
     * */
    integerArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<number>;

    /**
     * Asserts value is a safe integer
     * @see CommonIsLike#safeInteger
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    safeInteger(value: any, opt?: string | AssertionCallback | DevOpt): number;

    /**
     * Optional usage of below
     * @see #safeInteger
     * */
    safeIntegerOptional(value: any, opt?: string | AssertionCallback | DevOpt): number;

    /**
     * Array usage of below
     * @see #safeInteger
     * */
    safeIntegerArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<number>;

    /**
     * Asserts value is a positive integer
     * @see CommonIsLike#integer
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    positiveInteger(value: any, opt?: string | AssertionCallback | DevOpt): number;

    /**
     * Optional usage of below
     * @see #positiveInteger
     * */
    positiveIntegerOptional(value: any, opt?: string | AssertionCallback | DevOpt): number;

    /**
     * Array usage of below
     * @see #positiveInteger
     * */
    positiveIntegerArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<number>;

    /**
     * Asserts value is a string
     * @see CommonIsLike#string
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    string(value: any, opt?: string | AssertionCallback | DevOpt): string;

    /**
     * Optional usage of below
     * @see #string
     * */
    stringOptional(value: any, opt?: string | AssertionCallback | DevOpt): string;

    /**
     * Array usage of below
     * @see #string
     * */
    stringArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<string>;

    /**
     * Asserts value is a text
     * @see CommonIsLike#text
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    text(value: any, opt?: string | AssertionCallback | DevOpt): string;

    /**
     * Optional usage of below
     * @see #text
     * */
    textOptional(value: any, opt?: string | AssertionCallback | DevOpt): string;

    /**
     * Array usage of below
     * @see #text
     * */
    textArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<string>;

    /**
     * Asserts value is a possible class
     * @see CommonIsLike#clazz
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    clazz(value: any, opt?: string | AssertionCallback | DevOpt): ClassOrFuncOrName;

    /**
     * Optional usage of below
     * @see #clazz
     * */
    clazzOptional(value: any, opt?: string | AssertionCallback | DevOpt): ClassOrFuncOrName;

    /**
     * Array usage of below
     * @see #clazz
     * */
    clazzArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<ClassOrFuncOrName>;

    /**
     * Asserts value is a boolean
     * @see CommonIsLike#boolean
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    boolean(value: any, opt?: string | AssertionCallback | DevOpt): boolean;

    /**
     * Optional usage of below
     * @see #boolean
     * */
    booleanOptional(value: any, opt?: string | AssertionCallback | DevOpt): boolean;

    /**
     * Array usage of below
     * @see #boolean
     * */
    booleanArray(value: any, opt?: string | AssertionCallback | DevOpt): Array<boolean>;

    /**
     * Asserts value is a boolean
     * @see CommonIsLike#boolean
     *
     * @param {any} value
     * @param {EnumMap} map
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    enum<E extends KeyValue = KeyValue>(value: any, map: EnumMap<E>, opt?: string | AssertionCallback | DevOpt): E;

    /**
     * Optional usage of below
     * @see #enum
     * */
    enumOptional<E extends KeyValue = KeyValue>(value: any, map: EnumMap<E>, opt?: string | AssertionCallback | DevOpt): E;

    /**
     * Array usage of below
     * @see #enum
     * */
    enumArray<E extends KeyValue = KeyValue>(value: any, map: EnumMap<E>, opt?: string | AssertionCallback | DevOpt): Array<E>;

    /**
     * Asserts value is a boolean
     * @see CommonIsLike#boolean
     *
     * @param {any} value
     * @param {EnumLiteral} items
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    literal<E extends KeyValue = KeyValue>(value: any, items: EnumLiteral<E>, opt?: string | AssertionCallback | DevOpt): E;

    /**
     * Optional usage of below
     * @see #literal
     * */
    literalOptional<E extends KeyValue = KeyValue>(value: any, items: EnumLiteral<E>, opt?: string | AssertionCallback | DevOpt): E;

    /**
     * Array usage of below
     * @see #literal
     * */
    literalArray<E extends KeyValue = KeyValue>(value: any, items: EnumLiteral<E>, opt?: string | AssertionCallback | DevOpt): Array<E>;

    // endregion multiple

}

/**
 * Secure assertion methods
 * */
export type CommonAssertionSecure = ShiftMain<CommonAssertionLike> & InitLike;

export type AssertionCallback = () => string | DevOpt | [string, string|number, DevOpt?];
