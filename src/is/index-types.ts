import {InitLike, ShiftMain, ShiftSecure} from "../shared";

/**
 * Basic is commands to easy use
 * */
export interface CommonIs extends ShiftSecure<CommonIsSecure> {

    /**
     * Checks value is empty or not?
     * Empty means: `undefined`, `null` or `empty string` after trimming
     *
     * @param {any} value
     * @returns {boolean}
     * */
    empty(value: any): boolean;

    /**
     * Checks value is primitive or not?
     * Primitive means: `string`, `number`, `boolean`
     *
     * @param {any} value
     * @returns {boolean}
     * */
    primitive(value: any): boolean;

    /**
     * Checks value is real value or not?
     * Real value means: `string`, `number`, `bigint`, `boolean`, `object`, `function`
     * So `symbol` is not a real value
     *
     * @param {any} value
     * @returns {boolean}
     * */
    realValue(value: any): boolean;

    /**
     * Checks value is key or not?
     * Key means: `string`, `number`
     *
     * @param {any} value
     * @returns {boolean}
     * */
    key(value: any): boolean;

    /**
     * Checks value is object or not?
     *
     * @param {any} value
     * @returns {boolean}
     * */
    object(value: any): boolean;

    /**
     * Checks value is array or not?
     *
     * @param {any} value
     * @returns {boolean}
     * */
    array(value: any): boolean;

    /**
     * Checks value is function or not?
     *
     * @param {any} value
     * @returns {boolean}
     * */
    func(value: any): boolean;

    /**
     * Checks value is number (float or integer) or not?
     *
     * @param {any} value
     * @returns {boolean}
     *
     * Note: NaN and infinite values are not evaluated as a number
     * */
    number(value: any): boolean;

    /**
     * Checks value is integer or not?
     *
     * @param {any} value
     * @returns {boolean}
     *
     * Note: NaN and infinite values are not evaluated as a number
     * */
    integer(value: any): boolean;

    /**
     * Checks value is safe integer or not?
     * Safe integer means: an integer can not be outside the bigint range
     *
     * @param {any} value
     * @returns {boolean}
     *
     * Note: NaN and infinite values are not evaluated as a number
     * */
    safeInteger(value: any): boolean;

    /**
     * Checks value is string or not?
     * Empty string or space values are also string, if you want different behaviour, please check {@link #text}
     *
     * @param {any} value
     * @returns {boolean}
     * */
    string(value: any): boolean;

    /**
     * Checks value is string which is can not be empty and spaced?
     * Empty string or space values are not a text, if you want different behaviour, please check {@link #string}
     *
     * @param {any} value
     * @returns {boolean}
     * */
    text(value: any): boolean;

    /**
     * Checks value is possible class?
     * Possible class means: object as instance, string as function name, or function
     *
     * @param {any} value
     * @returns {boolean}
     * */
    clazz(value: any): boolean;

    /**
     * Checks value is boolean?
     *
     * @param {any} value
     * @returns {boolean}
     * */
    boolean(value: any): boolean;

    /**
     * Checks value is possible true?
     *
     * Possible true means:
     * - boolean: true
     * - string: `1`, `true`, `t`, `yes`, `y`, `on`
     * - number: > 0 (positive)
     *
     * @param {any} value
     * @returns {boolean}
     * */
    true(value: any): boolean;

    /**
     * Checks value is possible false?
     *
     * Possible false means:
     * - boolean: false
     * - string: `0`, `-1`, `false`, `f`, `no`, `n`, `off`
     * - number: <= 0 (zero or negative)
     *
     * @param {any} value
     * @returns {boolean}
     * */
    false(value: any): boolean;
}

export type CommonIsSecure = ShiftMain<CommonIs> & InitLike;