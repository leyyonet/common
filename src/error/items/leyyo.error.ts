import type {FqnCommonLike, OneOrMore} from "../../shared";
import {ErrorCommonLike, ErrorStackLine, LeyyoErrorLike, LeyyoErrorSecure} from "../index.types";
import type {LeyyoLike} from "../../leyyo";
import type {Opt} from "../../opt";
import type {Logger, LogLevel} from "../../log";

let fqnHandler: FqnCommonLike;

/**
 * Leyyo base error
 * */
export class LeyyoError extends Error implements LeyyoErrorLike, LeyyoErrorSecure {
    private static lyy: LeyyoLike;

    /**
     * For only silent error, means it won't trigger any event
     * */
    protected _silent: boolean;

    /**
     * Error parameters
     * */
    params?: Opt;

    /**
     * Caused by error
     * */
    causedBy?: OneOrMore<Error>;

    /**
     * Stack trace
     * */
    stackTrace?: Array<ErrorStackLine>;

    /**
     * @param {string} message - error message
     * @param {object} opt - error parameters
     * */
    constructor(message: string, opt?: Opt) {
        super(message);
        if (opt !== undefined) {
            this.params = opt;
        }
        if (fqnHandler) {
            try {
                this.name = fqnHandler.getName(this) ?? this.name;
            } catch (e) {
                // nothing
            }
        }
        if (LeyyoError.lyy) {
            if (!this._silent) {
                LeyyoError.lyy.event.emit('ly:error:raised', this);
            }
            LeyyoError.lyy.error.stack(this);
        }
    }
    // region static
    static $setLeyyo(lyy: LeyyoLike) {
        this.lyy = lyy;
        lyy.event.once('ly:fqn:loaded', (v: FqnCommonLike) => fqnHandler = v);
    }
    protected static get $error(): ErrorCommonLike {
        return this.lyy.error;
    }
    // noinspection JSUnusedGlobalSymbols
    protected static get $lyy(): LeyyoLike {
        return this.lyy;
    }
    private static _log(error: LeyyoErrorLike, message: string, level: LogLevel, logger?: Logger): void {
        const params = error.params ?? {};
        params['__error'] = error;
        if (logger) {
            logger.error(message, params);
        }
        else {
            LeyyoError.lyy.event.emit('ly:log', level, {time: Date.now()}, message, params);
        }

    }
    // endregion static

    // region protected
    protected get _errorMessage(): string {
        return `[${this.name}] => ${this.message}`;
    }
    // endregion protected

    // region secret
    $setName(name: string): this {
        if (typeof name === 'string') {
            this.name = name;
        }
        return this;
    }
    $errorLog(logger?: Logger): void {
        LeyyoError._log(this, this._errorMessage, 'error', logger);
    }
    $warnLog(logger?: Logger): void {
        LeyyoError._log(this, this._errorMessage, 'warn', logger);
    }
    $debugLog(logger?: Logger): void {
        LeyyoError._log(this, this._errorMessage, 'debug', logger);
    }
    $infoLog(logger?: Logger): void {
        LeyyoError._log(this, this._errorMessage, 'info', logger);
    }
    $traceLog(logger?: Logger): void {
        LeyyoError._log(this, this._errorMessage, 'trace', logger);
    }
    $list(): Array<string> {return undefined}
    $append(key: string): boolean {return undefined}
    $get(key: string): Array<string> {return undefined}
    $remove(key: string): boolean {return undefined}
    $has(key: string): boolean {return undefined}

    get $back(): LeyyoErrorLike {
        return this;
    }

    get $secure(): LeyyoErrorSecure {
        return this;
    }
    // endregion secret
}
