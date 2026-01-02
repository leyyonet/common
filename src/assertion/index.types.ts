import type {ClassLike, EnumLiteral, EnumMap, InitLike, KeyValue, ShiftMain, ShiftSecure} from "../shared";
import type {DevOpt} from "../developer";

export type AssertionTupleItems =
    'notEmpty' | keyof AssertionCommonSingular
    | keyof KeyOpt1<AssertionCommonSingular>
    | keyof KeyOpt2<AssertionCommonSingular>
    | keyof KeyArray1<AssertionCommonSingular>
    | keyof KeyArray2<AssertionCommonSingular>;
export type AssertionTupleDuals =
    'notEmpty' | keyof AssertionCommonDual
    | keyof KeyOpt1<AssertionCommonDual>
    | keyof KeyOpt2<AssertionCommonDual>
    | keyof KeyArray1<AssertionCommonDual>
    | keyof KeyArray2<AssertionCommonDual>;

export type AssertionTupleValue = AssertionTupleItems | [AssertionTupleDuals, any];
export type AssertionTuple = Array<AssertionTupleValue | ['or', Array<AssertionTupleValue>]>;
export type AssertionTupleItemLambda = (value: any, opt: string | AssertionCallback | DevOpt) => any;
export type AssertionTupleDualLambda = (value: any, setting: any, opt: string | AssertionCallback | DevOpt) => any;

/**
 * Basic assertions to easy use
 * */
export interface AssertionCommonLike extends AssertionCommonSingular, AssertionCommonDual, ShiftSecure<AssertionCommonSecure> {

    // region instanceOf
    /**
     * Optional usage of above
     * @see #instanceOf
     * */
    instanceOfOptional<T>(value: any, clazz: ClassLike<T>, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #literal
     * */
    instanceOfArray<T>(value: any, clazz: ClassLike<T>, opt?: string | AssertionCallback | DevOpt): void;

    // endregion instanceOf

    // region tuple
    /**
     * Optional usage of above
     * @see #realValue
     * */
    tupleOptional(value: any, setting: AssertionTuple, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #literal
     * */
    tupleArray(value: any, setting: AssertionTuple, opt?: string | AssertionCallback | DevOpt): void;

    // endregion tuple

    // region enum
    /**
     * Optional usage of above
     * @see #enum
     * */
    enumOptional<E extends KeyValue = KeyValue>(value: any, map: EnumMap<E>, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #enum
     * */
    enumArray<E extends KeyValue = KeyValue>(value: any, map: EnumMap<E>, opt?: string | AssertionCallback | DevOpt): void;

    // endregion enum

    // region or
    /**
     * Optional usage of above
     * @see #orCase
     * */
    orCaseOptional(value: any, types: Array<AssertionTupleValue>, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #orCase
     * */
    orCaseArray(value: any, types: Array<AssertionTupleValue>, opt?: string | AssertionCallback | DevOpt): void;

    // endregion or

    // region literal
    /**
     * Optional usage of above
     * @see #literal
     * */
    literalOptional<E extends KeyValue = KeyValue>(value: any, items: EnumLiteral<E>, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #literal
     * */
    literalArray<E extends KeyValue = KeyValue>(value: any, items: EnumLiteral<E>, opt?: string | AssertionCallback | DevOpt): void;

    // endregion literal

    // region general
    /**
     * Asserts value is not empty
     * @see IsCommonLike#empty
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    notEmpty(value: any, opt?: string | AssertionCallback | DevOpt): void;
    // endregion general

    // region realValue
    /**
     * Optional usage of above
     * @see #realValue
     * */
    realValueOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #literal
     * */
    realValueArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion realValue

    // region object
    /**
     * Optional usage of above
     * @see #object
     * */
    objectOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #literal
     * */
    objectArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion object

    // region bareObject
    /**
     * Optional usage of above
     * @see #bareObject
     * */
    bareObjectOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #literal
     * */
    bareObjectArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion bareObject

    // region anotherObject
    /**
     * Optional usage of above
     * @see #bareObject
     * */
    anotherObjectOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #literal
     * */
    anotherObjectArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion anotherObject

    // region arrayLike
    /**
     * Optional usage of above
     * @see #realValue
     * */
    arrayLikeOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #literal
     * */
    arrayLikeArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion arrayLike

    // region array
    /**
     * Optional usage of above
     * @see #array
     * */
    arrayOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #array
     * */
    arrayArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion array

    // region primitive
    /**
     * Optional usage of above
     * @see #primitive
     * */
    primitiveOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #primitive
     * */
    primitiveArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion primitive

    // region key
    /**
     * Optional usage of above
     * @see #key
     * */
    keyOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #key
     * */
    keyArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion key

    // region function
    /**
     * Optional usage of above
     * @see #func
     * */
    funcOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #func
     * */
    funcArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion function

    // region symbol
    /**
     * Optional usage of above
     * @see #sym
     * */
    symOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #sym
     * */
    symArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion symbol

    // region number
    /**
     * Optional usage of above
     * @see #number
     * */
    numberOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #number
     * */
    numberArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion number

    // region positiveNumber
    /**
     * Optional usage of above
     * @see #positiveNumber
     * */
    positiveNumberOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #positiveNumber
     * */
    positiveNumberArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion positiveNumber

    // region nonNegativeNumber
    /**
     * Optional usage of above
     * @see #nonNegativeNumber
     * */
    nonNegativeNumberOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #nonNegativeNumber
     * */
    nonNegativeNumberArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion nonNegativeNumber

    // region integer
    /**
     * Optional usage of above
     * @see #integer
     * */
    integerOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #integer
     * */
    integerArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion integer

    // region safeInteger
    /**
     * Optional usage of above
     * @see #safeInteger
     * */
    safeIntegerOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #safeInteger
     * */
    safeIntegerArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion safeInteger

    // region positiveInteger
    /**
     * Optional usage of above
     * @see #positiveInteger
     * */
    positiveIntegerOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #positiveInteger
     * */
    positiveIntegerArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion positiveInteger

    // region nonNegativeInteger
    /**
     * Optional usage of above
     * @see #positiveInteger
     * */
    nonNegativeIntegerOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #positiveInteger
     * */
    nonNegativeIntegerArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion nonNegativeInteger

    // region string
    /**
     * Optional usage of above
     * @see #string
     * */
    stringOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #string
     * */
    stringArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion string

    // region text
    /**
     * Optional usage of above
     * @see #text
     * */
    textOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #text
     * */
    textArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion text

    // region clazz
    /**
     * Optional usage of above
     * @see #clazz
     * */
    clazzOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #clazz
     * */
    clazzArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion clazz

    // region possibleFunc
    /**
     * Optional usage of above
     * @see #clazz
     * */
    possibleFuncOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #clazz
     * */
    possibleFuncArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion possibleFunc

    // region boolean
    /**
     * Optional usage of above
     * @see #boolean
     * */
    booleanOptional(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Array usage of above
     * @see #boolean
     * */
    booleanArray(value: any, opt?: string | AssertionCallback | DevOpt): void;

    // endregion boolean

}

export interface AssertionCommonDual {
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
    instanceOf<T>(value: any, clazz: ClassLike<T>, opt?: string | AssertionCallback | DevOpt): void;

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
    tuple(value: any, setting: AssertionTuple, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is a boolean
     * @see IsCommonLike#boolean
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
    enum<E extends KeyValue = KeyValue>(value: any, map: EnumMap<E>, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is a boolean
     * @see IsCommonLike#boolean
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
    literal<E extends KeyValue = KeyValue>(value: any, items: EnumLiteral<E>, opt?: string | AssertionCallback | DevOpt): void;
}

export interface AssertionCommonSingular {
    /**
     * Asserts value is a real value
     * @see IsCommonLike#realValue
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    realValue(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is an object
     * @see IsCommonLike#object
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    object(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is an object
     * @see IsCommonLike#object
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    bareObject(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is another object [constructor !== Object] or not?
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     * */
    anotherObject(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is array like (array, Set or List) or not?
     * @see IsCommonLike#arrayLike
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     * */
    arrayLike(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is an array
     * @see IsCommonLike#empty
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    array(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is a primitive
     * @see IsCommonLike#primitive
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    primitive(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is a key
     * @see IsCommonLike#key
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    key(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is a function
     * @see IsCommonLike#func
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    func(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is a symbol
     * @see IsCommonLike#func
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    sym(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is a number
     * @see IsCommonLike#number
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    number(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is a positive number
     * @see IsCommonLike#number
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    positiveNumber(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is a non-negative number
     * @see IsCommonLike#number
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    nonNegativeNumber(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is an integer
     * @see IsCommonLike#integer
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    integer(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is a safe integer
     * @see IsCommonLike#safeInteger
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    safeInteger(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is a positive integer
     * @see IsCommonLike#integer
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    positiveInteger(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is a positive integer
     * @see IsCommonLike#integer
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    nonNegativeInteger(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is a string
     * @see IsCommonLike#string
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    string(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is a text
     * @see IsCommonLike#text
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    text(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is a class
     * @see IsCommonLike#clazz
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    clazz(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Checks value is possible func?
     * Possible class means: object as instance, string as function name, or function
     * @see IsCommonLike#possibleFunc
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    possibleFunc(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is a boolean
     * @see IsCommonLike#boolean
     *
     * @param {any} value
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    boolean(value: any, opt?: string | AssertionCallback | DevOpt): void;

    /**
     * Asserts value is any of them
     *
     * @param {any} value
     * @param {Array<AssertionTupleValue>} types
     * @param {(string | AssertionCallback | DevOpt)?} opt
     *
     * Option cases
     * - string: issue
     * - function: it should return {@link DevOpt}
     * - object: object:
     * */
    orCase(value: any, types: Array<AssertionTupleValue>, opt?: string | AssertionCallback | DevOpt): void;
}

type KeyOpt1<T> = {
    [K in keyof T as `${string & K}?`]: string;
};
type KeyOpt2<T> = {
    [K in keyof T as `${string & K}Optional`]: string;
};
type KeyArray1<T> = {
    [K in keyof T as `${string & K}[]`]: string;
};
type KeyArray2<T> = {
    [K in keyof T as `${string & K}Array`]: string;
};
/**
 * Secure assertion methods
 * */
export type AssertionCommonSecure = ShiftMain<AssertionCommonLike> & InitLike;

export type AssertionCallback = () => string | DevOpt | [string, string | number, DevOpt?];
