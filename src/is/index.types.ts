import type {BasicType, ClassLike, EnumLiteral, EnumMap, InitLike, ShiftMain, ShiftSecure} from "../shared";

/**
 * Basic is commands to easy use
 * */
export interface IsCommonLike extends ShiftSecure<IsCommonSecure> {

    /**
     * Checks value is empty or not?
     * Empty means: `undefined`, `null` or `empty string` after trimming
     *
     * @param {any} value
     * @returns {boolean}
     * */
    empty(value: any): boolean;

    /**
     * Checks type of value is in given types
     *
     * @param {any} value
     * @param {Array} types
     * @returns {boolean}
     * */
    typeOf(value: any, ...types: Array<BasicType>): boolean;

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
     * Checks value is bare object [constructor === Object] or not?
     *
     * @param {any} value
     * @returns {boolean}
     * */
    bareObject(value: any): boolean;

    /**
     * Checks value is another object [constructor !== Object] or not?
     *
     * @param {any} value
     * @returns {boolean}
     * */
    anotherObject(value: any): boolean;

    /**
     * Checks value is array like (array, Set or List) or not?
     *
     * @param {any} value
     * @returns {boolean}
     * */
    arrayLike(value: any): boolean;

    /**
     * Checks value is function or not?
     *
     * @param {any} value
     * @returns {boolean}
     * */
    func(value: any): boolean;
    /**
     * Checks value is symbol or not?
     *
     * @param {any} value
     * @returns {boolean}
     * */
    sym(value: any): boolean;

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
     * Checks value is positive number or not?
     *
     * @param {any} value
     * @returns {boolean}
     *
     * Note: NaN and infinite values are not evaluated as a number
     * */
    positiveNumber(value: any): boolean;

    /**
     * Checks value is non-negative number or not?
     *
     * @param {any} value
     * @returns {boolean}
     *
     * Note: NaN and infinite values are not evaluated as a number
     * */
    nonNegativeNumber(value: any): boolean;

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
     * Checks value is positive integer or not?
     *
     * @param {any} value
     * @returns {boolean}
     *
     * Note: NaN and infinite values are not evaluated as a number
     * */
    positiveInteger(value: any): boolean;

    /**
     * Checks value is non-negative integer or not?
     *
     * @param {any} value
     * @returns {boolean}
     *
     * Note: NaN and infinite values are not evaluated as a number
     * */
    nonNegativeInteger(value: any): boolean;

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
     * Checks value is class?
     *
     * @param {any} value
     * @returns {boolean}
     * */
    clazz(value: any): boolean;

    /**
     * Checks value is possible func?
     * Possible class means: object as instance, string as function name, or function
     *
     * @param {any} value
     * @returns {boolean}
     * */
    possibleFunc(value: any): boolean;

    /**
     * Checks value is an enum value?
     *
     * @param {any} value
     * @param {EnumMap<string>} map
     * @returns {boolean}
     * */
    enumeration(value: unknown, map: EnumMap): boolean;

    /**
     * Checks value is an enum value?
     *
     * @param {any} value
     * @param {EnumLiteral<string>} items
     * @returns {boolean}
     * */
    literal(value: unknown, items: EnumLiteral): boolean;

    /**
     * Checks value is an instance of class?
     *
     * @param {any} value
     * @param {ClassLike} clazz
     * @returns {boolean}
     * */
    instanceOf<T>(value: unknown, clazz: ClassLike<T>): boolean;

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

export type IsCommonSecure = ShiftMain<IsCommonLike> & InitLike;
