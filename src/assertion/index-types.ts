import {Arr, InitLike, OneOrMore, ShiftMain, ShiftSecure} from "../aliases";
import {ToTypeOpt} from "../to";

/**
 * Basic is assertions to easy use
 * */
export interface CommonAssertion extends ShiftSecure<CommonAssertionSecure> {

    /**
     * Raises an error with given parameters
     *
     * @param {string} message - error message
     * @param {any?} value
     * @param {string?} indicator - developer indicator
     * @param {string?} def - default error message
     * */
    raise(message: string, value?: any, indicator?: string, def?: string): void;

    /**
     * Raises an error with given parameters
     *
     * @param {AssertionCallback} fn - callback which should return {@link AssertionOpt}
     * @param {any?} value
     * @param {string?} indicator - developer indicator
     * @param {string?} def - default error message
     * */
    raise(fn: AssertionCallback, value?: any, indicator?: string, def?: string): void;

    /**
     * Raises an error with given parameters
     *
     * @param {AssertionOpt} opt - options
     * @param {any?} value
     * @param {string?} indicator - developer indicator
     * @param {string?} def - default error message
     * */
    raise(opt: AssertionOpt, value?: any, indicator?: string, def?: string): void;

    /**
     * Empty function, it can be more useful sometimes
     *
     * @param {Arr} params - insignificant parameters
     * */
    emptyFn(...params: Arr): void;

    /**
     * Converts ant value secure json value
     *
     * Controls:
     * - circular dependency
     * - depth control
     * - handling function and symbol values
     *
     * @param {any} value
     * @returns {any} - it based on generic
     * */
    secureJson<E = unknown>(value: any): E;

    /**
     * Validates value is real number
     *
     * Real number means: !NaN and isFinite
     *
     * @param {any} value
     * @param {ToTypeOpt} opt
     * @returns {number}
     * */
    realNumber(value: number, opt?: ToTypeOpt): number;

    /**
     * Asserts value is not empty
     * @see CommonIs#empty
     *
     * @param {any} value
     * @param {string?} message
     * */
    notEmpty(value: any, message?: string): void;

    /**
     * Asserts value is not empty
     * @see CommonIs#empty
     *
     * @param {any} value
     * @param {AssertionCallback?} fn - it should return {@link AssertionOpt}
     * */
    notEmpty(value: any, fn?: AssertionCallback): void;

    /**
     * Asserts value is not empty
     * @see CommonIs#empty
     *
     * @param {any} value
     * @param {AssertionOpt?} opt
     * */
    notEmpty(value: any, opt?: AssertionOpt): void;

    /**
     * Asserts value is a primitive
     * @see CommonIs#primitive
     *
     * @param {any} value
     * @param {string?} message
     * */
    primitive(value: any, message?: string): void;

    /**
     * Asserts value is a primitive
     * @see CommonIs#primitive
     *
     * @param {any} value
     * @param {AssertionCallback?} fn - it should return {@link AssertionOpt}
     * */
    primitive(value: any, fn?: AssertionCallback): void;

    /**
     * Asserts value is a primitive
     * @see CommonIs#primitive
     *
     * @param {any} value
     * @param {AssertionOpt?} opt
     * */
    primitive(value: any, opt?: AssertionOpt): void;

    /**
     * Asserts value is a real value
     * @see CommonIs#realValue
     *
     * @param {any} value
     * @param {string?} message
     * */
    realValue(value: any, message?: string): void;

    /**
     * Asserts value is a real value
     * @see CommonIs#realValue
     *
     * @param {any} value
     * @param {AssertionCallback?} fn - it should return {@link AssertionOpt}
     * */
    realValue(value: any, fn?: AssertionCallback): void;

    /**
     * Asserts value is a real value
     * @see CommonIs#realValue
     *
     * @param {any} value
     * @param {AssertionOpt?} opt
     * */
    realValue(value: any, opt?: AssertionOpt): void;

    /**
     * Asserts value is a key
     * @see CommonIs#key
     *
     * @param {any} value
     * @param {string?} message
     * */
    key(value: any, message?: string): void;

    /**
     * Asserts value is a key
     * @see CommonIs#key
     *
     * @param {any} value
     * @param {AssertionCallback?} fn - it should return {@link AssertionOpt}
     * */
    key(value: any, fn?: AssertionCallback): void;

    /**
     * Asserts value is a key
     * @see CommonIs#key
     *
     * @param {any} value
     * @param {AssertionOpt?} opt
     * */
    key(value: any, opt?: AssertionOpt): void;

    /**
     * Asserts value is an object
     * @see CommonIs#object
     *
     * @param {any} value
     * @param {string?} message
     * */
    object(value: any, message?: string): void;

    /**
     * Asserts value is an object
     * @see CommonIs#object
     *
     * @param {any} value
     * @param {AssertionCallback?} fn - it should return {@link AssertionOpt}
     * */
    object(value: any, fn?: AssertionCallback): void;

    /**
     * Asserts value is an object
     * @see CommonIs#object
     *
     * @param {any} value
     * @param {AssertionOpt?} opt
     * */
    object(value: any, opt?: AssertionOpt): void;

    /**
     * Asserts value is an array
     * @see CommonIs#empty
     *
     * @param {any} value
     * @param {string?} message
     * */
    array(value: any, message?: string): void;

    /**
     * Asserts value is an array
     * @see CommonIs#array
     *
     * @param {any} value
     * @param {AssertionCallback?} fn - it should return {@link AssertionOpt}
     * */
    array(value: any, fn?: AssertionCallback): void;

    /**
     * Asserts value is an array
     * @see CommonIs#array
     *
     * @param {any} value
     * @param {AssertionOpt?} opt
     * */
    array(value: any, opt?: AssertionOpt): void;

    /**
     * Asserts value is a function
     * @see CommonIs#func
     *
     * @param {any} value
     * @param {string?} message
     * */
    func(value: any, message?: string): void;

    /**
     * Asserts value is a function
     * @see CommonIs#func
     *
     * @param {any} value
     * @param {AssertionCallback?} fn - it should return {@link AssertionOpt}
     * */
    func(value: any, fn?: AssertionCallback): void;

    /**
     * Asserts value is a function
     * @see CommonIs#func
     *
     * @param {any} value
     * @param {AssertionOpt?} opt
     * */
    func(value: any, opt?: AssertionOpt): void;

    /**
     * Asserts value is a number
     * @see CommonIs#number
     *
     * @param {any} value
     * @param {string?} message
     * */
    number(value: any, message?: string): void;

    /**
     * Asserts value is a number
     * @see CommonIs#number
     *
     * @param {any} value
     * @param {AssertionCallback?} fn - it should return {@link AssertionOpt}
     * */
    number(value: any, fn?: AssertionCallback): void;

    /**
     * Asserts value is a number
     * @see CommonIs#number
     *
     * @param {any} value
     * @param {AssertionOpt?} opt
     * */
    number(value: any, opt?: AssertionOpt): void;

    /**
     * Asserts value is a positive number
     * @see CommonIs#number
     *
     * @param {any} value
     * @param {string?} message
     * */
    positiveNumber(value: any, message?: string): void;

    /**
     * Asserts value is a positive number
     * @see CommonIs#number
     *
     * @param {any} value
     * @param {AssertionCallback?} fn - it should return {@link AssertionOpt}
     * */
    positiveNumber(value: any, fn?: AssertionCallback): void;

    /**
     * Asserts value is a positive number
     * @see CommonIs#number
     *
     * @param {any} value
     * @param {AssertionOpt?} opt
     * */
    positiveNumber(value: any, opt?: AssertionOpt): void;

    /**
     * Asserts value is an integer
     * @see CommonIs#integer
     *
     * @param {any} value
     * @param {string?} message
     * */
    integer(value: any, message?: string): void;

    /**
     * Asserts value is an integer
     * @see CommonIs#integer
     *
     * @param {any} value
     * @param {AssertionCallback?} fn - it should return {@link AssertionOpt}
     * */
    integer(value: any, fn?: AssertionCallback): void;

    /**
     * Asserts value is an integer
     * @see CommonIs#integer
     *
     * @param {any} value
     * @param {AssertionOpt?} opt
     * */
    integer(value: any, opt?: AssertionOpt): void;

    /**
     * Asserts value is a safe integer
     * @see CommonIs#safeInteger
     *
     * @param {any} value
     * @param {string?} message
     * */
    safeInteger(value: any, message?: string): void;

    /**
     * Asserts value is a safe integer
     * @see CommonIs#safeInteger
     *
     * @param {any} value
     * @param {AssertionCallback?} fn - it should return {@link AssertionOpt}
     * */
    safeInteger(value: any, fn?: AssertionCallback): void;

    /**
     * Asserts value is a safe integer
     * @see CommonIs#safeInteger
     *
     * @param {any} value
     * @param {AssertionOpt?} opt
     * */
    safeInteger(value: any, opt?: AssertionOpt): void;

    /**
     * Asserts value is a positive integer
     * @see CommonIs#integer
     *
     * @param {any} value
     * @param {string?} message
     * */
    positiveInteger(value: any, message?: string): void;

    /**
     * Asserts value is a positive integer
     * @see CommonIs#integer
     *
     * @param {any} value
     * @param {AssertionCallback?} fn - it should return {@link AssertionOpt}
     * */
    positiveInteger(value: any, fn?: AssertionCallback): void;

    /**
     * Asserts value is a positive integer
     * @see CommonIs#integer
     *
     * @param {any} value
     * @param {AssertionOpt?} opt
     * */
    positiveInteger(value: any, opt?: AssertionOpt): void;

    /**
     * Asserts value is a string
     * @see CommonIs#string
     *
     * @param {any} value
     * @param {string?} message
     * */
    string(value: any, message?: string): void;

    /**
     * Asserts value is a string
     * @see CommonIs#string
     *
     * @param {any} value
     * @param {AssertionCallback?} fn - it should return {@link AssertionOpt}
     * */
    string(value: any, fn?: AssertionCallback): void;

    /**
     * Asserts value is a string
     * @see CommonIs#string
     *
     * @param {any} value
     * @param {AssertionOpt?} opt
     * */
    string(value: any, opt?: AssertionOpt): void;

    /**
     * Asserts value is a text
     * @see CommonIs#text
     *
     * @param {any} value
     * @param {string?} message
     * */
    text(value: any, message?: string): string;

    /**
     * Asserts value is a text
     * @see CommonIs#text
     *
     * @param {any} value
     * @param {AssertionCallback?} fn - it should return {@link AssertionOpt}
     * */
    text(value: any, fn?: AssertionCallback): string;

    /**
     * Asserts value is a text
     * @see CommonIs#text
     *
     * @param {any} value
     * @param {AssertionOpt?} opt
     * */
    text(value: any, opt?: AssertionOpt): string;

    /**
     * Asserts value is a possible class
     * @see CommonIs#clazz
     *
     * @param {any} value
     * @param {string?} message
     * */
    clazz(value: any, message?: string): void;

    /**
     * Asserts value is a possible class
     * @see CommonIs#clazz
     *
     * @param {any} value
     * @param {AssertionCallback?} fn - it should return {@link AssertionOpt}
     * */
    clazz(value: any, fn?: AssertionCallback): void;

    /**
     * Asserts value is a possible class
     * @see CommonIs#clazz
     *
     * @param {any} value
     * @param {AssertionOpt?} opt
     * */
    clazz(value: any, opt?: AssertionOpt): void;

    /**
     * Asserts value is a date
     *
     * @param {any} value
     * @param {string?} message
     * */
    date(value: any, message?: string): void;

    /**
     * Asserts value is a date
     *
     * @param {any} value
     * @param {AssertionCallback?} fn - it should return {@link AssertionOpt}
     * */
    date(value: any, fn?: AssertionCallback): void;

    /**
     * Asserts value is a date
     *
     * @param {any} value
     * @param {AssertionOpt?} opt
     * */
    date(value: any, opt?: AssertionOpt): void;

    /**
     * Asserts value is a boolean
     * @see CommonIs#boolean
     *
     * @param {any} value
     * @param {string?} message
     * */
    boolean(value: any, message?: string): void;

    /**
     * Asserts value is a boolean
     * @see CommonIs#boolean
     *
     * @param {any} value
     * @param {AssertionCallback?} fn - it should return {@link AssertionOpt}
     * */
    boolean(value: any, fn?: AssertionCallback): void;

    /**
     * Asserts value is a boolean
     * @see CommonIs#boolean
     *
     * @param {any} value
     * @param {AssertionOpt?} opt
     * */
    boolean(value: any, opt?: AssertionOpt): void;
}

export interface CommonAssertionSecure extends ShiftMain<CommonAssertion>, InitLike {
}

export interface AssertionOpt {
    indicator?: AssertionReason | string;
    param?: string;
    where?: string;
    value?: any;
    expected?: OneOrMore<string>;
    current?: string;
    type?: string;

    [k: string]: any;
}

type AssertionReason = 'invalid.type' | 'not.found' | 'duplicated' | 'empty'

export type AssertionCallback = () => string | AssertionOpt;

export interface AssertionBuiltResult {
    message?: string;
    params: AssertionOpt;
}