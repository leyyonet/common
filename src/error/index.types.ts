import {ClassLike, Obj, OneOrMore, ShiftMain, ShiftSecure} from "../base/index.js";
import {Opt} from "../function/index.js";
import {Logger} from "../common/index.js";

/**
 * {@link LeyyoError}
 * */
export interface LeyyoErrorCtor {
    /**
     * Create without any parameter
     * */
    new(): LeyyoErrorLike;

    /**
     * Create with only message
     *
     * @param {string} message - error message
     * */
    new(message: string): LeyyoErrorLike;

    /**
     * Create with only params
     *
     * @param {Opt} params - error parameters
     * */
    new(params: Opt): LeyyoErrorLike;

    /**
     * Create with message and params
     *
     * @param {string} message - error message
     * @param {Opt} params - error parameters
     * */
    new(message: string, params: Opt): LeyyoErrorLike;
}


/**
 * {@link DeveloperError}
 * */
export interface DeveloperErrorCtor {
    /**
     * Create developer error
     *
     * @param {string} message - error message
     * @param {string} issue - test case
     * @param {string} where - where
     * */
    new(message: string, issue?: string, where?: string): DeveloperErrorLike;

}

export type LeyyoErrorTag = 'printed' | 'sent';

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

export interface DeveloperErrorLike extends Error {

    /**
     * Formatted stack trace
     * */
    stackTrace?: Array<ErrorStackLine>;

    /**
     * Log error
     *
     * @param {Error?} err - optional caused error
     * */
    log(err?: Error): void;
}

export interface LeyyoErrorLike extends Error, ShiftSecure<LeyyoErrorSecure> {
    /**
     * Parameters for error
     * */
    params?: Opt;

    /**
     * Formatted stack trace
     * */
    stackTrace?: Array<ErrorStackLine>;

    /**
     * Caused error
     * */
    causedBy?: OneOrMore<Error>;

    /**
     * Bind caused error
     *
     * @param {Error} err
     * @return {LeyyoErrorLike}
     * */
    causes(err: Error): this;

    /**
     * Bind holder class name
     *
     * @param {string} name - name of class
     * @param {string?} fqn - fqn
     * @return {LeyyoErrorLike}
     * */
    where(name: string, fqn?: string): this;

    /**
     * Bind holder instance
     *
     * @param {Obj} instance - this instance
     * @return {LeyyoErrorLike}
     * */
    where(instance: Obj): this;

    /**
     * Bind holder instance
     *
     * @param {function} clazz - class
     * @return {LeyyoErrorLike}
     * */
    where(clazz: ClassLike): this;

    /**
     * Alias for {@link logError}
     *
     * @param {Logger?} logger - optional bound logger
     * */
    log(logger?: Logger): void;

    /**
     * Log as `fatal`
     *
     * @param {Logger?} logger - optional bound logger
     * */
    logFatal(logger?: Logger): void;

    /**
     * Log as `error`
     *
     * @param {Logger?} logger - optional bound logger
     * */
    logError(logger?: Logger): void;

    /**
     * Log as `warn`
     *
     * @param {Logger?} logger - optional bound logger
     * */
    logWarn(logger?: Logger): void;

    /**
     * Log as `debug`
     *
     * @param {Logger?} logger - optional bound logger
     * */
    logDebug(logger?: Logger): void;

    /**
     * Log as `info`
     *
     * @param {Logger?} logger - optional bound logger
     * */
    logInfo(logger?: Logger): void;

    /**
     * Log as `trace`
     *
     * @param {Logger?} logger - optional bound logger
     * */
    logTrace(logger?: Logger): void;
}

export interface LeyyoErrorSecure extends ShiftMain<LeyyoErrorLike> {
    // region flags
    get $where(): string;

    /**
     * List flags
     *
     * @return {Array<string>} - flags
     * */
    $list<T extends LeyyoErrorTag | string = LeyyoErrorTag | string>(): Array<T>;

    /**
     * Append a flag
     *
     * @param {string} key - flag key
     * @return {boolean} - is it appended?
     * */
    $append<T extends LeyyoErrorTag | string = LeyyoErrorTag | string>(key: T): boolean;

    /**
     * Remove a flag
     *
     * @param {string} key - flag key
     * @return {boolean} - is it removed?
     * */
    $remove<T extends LeyyoErrorTag | string = LeyyoErrorTag | string>(key: T): boolean;

    /**
     * Has a flag?
     *
     * @param {string} key - flag key
     * @return {boolean} - has it?
     * */
    $has<T extends LeyyoErrorTag | string = LeyyoErrorTag | string>(key: T): boolean;

    // endregion flags

    // region methods

    /**
     * Copy source properties into target parameters
     *
     * @param {Error} source - source error
     * */
    $copyProperties(source: Error): void;

    // endregion methods

}
