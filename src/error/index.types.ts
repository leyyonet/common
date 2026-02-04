import type {ClassLike, InitLike, OneOrMore, ShiftMain, ShiftSecure} from "../shared";
import type {Logger} from "../log";
import type {Opt} from "../opt";

export type ErrorCastType = 'leyyo' | 'silent' | 'caused';

/**
 * Error common interface
 * */
export interface ErrorCommonLike extends ShiftSecure<ErrorCommonSecure> {
    /**
     * Register an error class
     *
     * @param {function} clazz - error class
     * @param {string?} fqn - fully qualified name
     * */
    register(clazz: ClassLike, fqn?: string): void;

    /**
     * Cast a native error to given error class
     *
     * @param {function} clazz - new error class
     * @param {Error} e - native error instance
     * @param {Opt?} params - params for error
     * @return {LeyyoErrorLike} - new error instance
     * */
    castForClass<E extends LeyyoErrorLike>(clazz: ClassLike<E>, e: Error, params?: Opt): E;

    /**
     * Cast a native error to one of default error classes
     *
     * @param {Error} e - native error instance
     * @param {Opt?} params - params for error
     * @param {ErrorCastType?} type - which class, ie: leyyo, silent, caused
     * @return {LeyyoErrorLike} - new error instance
     * */
    cast(e: Error, params?: Opt, type?: ErrorCastType): LeyyoErrorLike;

    /**
     * Add known package to shorten stack paths
     *
     * @param {string} packageName - original package name, like @package/component
     * @param {string} shortName - short name for given package
     * */
    addKnownPackage(packageName: string, shortName: string): void;

    /**
     * Build formatted {@link LeyyoErrorLike#stackTrace} from native {@link Error#stack}
     *
     * @param {LeyyoErrorLike} source - error instance
     * @param {boolean} force - format again, even if it was already formatted
     * */
    stack(source: LeyyoErrorLike, force?: boolean): void;

    /**
     * Build easy error text as `<info> [error.name] => [error.message]`
     *
     * @param {Error} err - error instance
     * @param {...Array<string|number>} parts - parts for info
     * @return {string}
     * */
    logText(err: Error, ...parts: Array<string|number>): string;
}

/**
 * Stack line
 * */
export interface ErrorStackLine {
    /**
     * File of error
     * */
    file: string;

    /**
     * Method of error
     * */
    method?: string;

    /**
     * Position of error
     * */
    pos?: string;
}

export type ErrorCommonSecure = ShiftMain<ErrorCommonLike> & InitLike;
export interface LeyyoErrorLike extends Error, ShiftSecure<LeyyoErrorSecure> {
    /**
     * Parameters for error
     * */
    params?: Opt;

    /**
     * Caused error
     * */
    causedBy?: OneOrMore<Error>;

    /**
     * Formatted stack trace
     * */
    stackTrace?: Array<ErrorStackLine>;
}
export interface LeyyoErrorSecure extends ShiftMain<LeyyoErrorLike> {
    $setName(name: string): this;
    $errorLog(logger?: Logger): void;
    $warnLog(logger?: Logger): void;
    $debugLog(logger?: Logger): void;
    $infoLog(logger?: Logger): void;
    $traceLog(logger?: Logger): void;

    $list(): Array<string>;
    $append(key: string): boolean;
    $get(key: string): Array<string>;
    $remove(key: string): boolean;
    $has(key: string): boolean;

}
