import type {Arr, Describable, InitLike, OneOrMore, ShiftMain, ShiftSecure} from "../shared";
import type {Severity} from "../log";

export interface DeveloperCommonLike extends ShiftSecure<DeveloperCommonSecure> {
    opt<O extends DevOpt = DevOpt>(value: O): O;
    desc<O extends DevOpt = DevOpt>(ins: Describable, value: O): O;

    buildParameters(opt: DevOpt, extra?: DevOpt, e?: Error): DeveloperParamResult;
    append<O extends DevOpt = DevOpt>(opt: O, field: string, value: any): O;
    fetch(opt: DevOpt, field: string): any;

    appendAll<O extends DevOpt = DevOpt>(opt: O, extra: DevOpt): O;

    checkParameters(opt: DevOpt, extra?: DevOpt): DevOpt;

    /**
     * Asserts value is an object
     * @param {DevOpt} opt
     * @param {DevOpt?} extra
     * */
    developerError(opt: DevOpt, extra?: DevOpt): Error;

    developerError2(pck: string, testCase:number|string, opt: DevOpt): Error;
    developerError2(issue: string, opt: DevOpt): Error;

    /**
     * Asserts value is an object
     * @param {DevOpt} opt
     * @param {DevOpt?} extra
     * */
    invalidError(opt: DevOpt, extra?: DevOpt): Error;

    /**
     * Asserts value is an object
     * @param {Error} e
     * @param {DevOpt} opt
     * @param {DevOpt?} extra
     * */
    nativeError(e: Error, opt: DevOpt, extra?: DevOpt): Error;
    nativeError2(pck: string, testCase:number|string, e: Error, opt?: DevOpt): Error;

    /**
     * Asserts value is an object
     * @param {Error} e
     * @param {DevOpt} opt
     * @param {Severity?} severity
     * */
    log(e: Error, opt: DevOpt, severity?: Severity): void;

    log(opt: DevOpt, severity?: Severity): void;

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
    secureJson(value: any, asString: true): string;
}

/**
 * Secure assertion methods
 * */
export type DeveloperCommonSecure = ShiftMain<DeveloperCommonLike> & InitLike;


export interface DevOpt {
    issue?: OneOrMore<DeveloperReason | string>;
    message?: string;
    field?: string;
    param?: any;
    where?: any;
    value?: any;
    expected?: any;
    current?: any;
    type?: any;
    method?: any;
    case?: any;
    desc?: string;

    [k: string]: any;
}
export type DevCallback = () => DevOpt;


export type DeveloperReason = 'invalid' | 'not.allowed' | 'not.found' | 'duplicated' | 'empty' | 'conflicted';


export interface DeveloperParamResult {
    message: string;
    opt: DevOpt
}
