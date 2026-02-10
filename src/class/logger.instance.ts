import {LeyyoLike} from "../base";
import {LogLevel} from "../enum";
import {isText, Opt} from "../function";
import {KEY_SECURE_1} from "../const";
import {Logger, LoggerSecure} from "../common";

// region property
let _leyyo: LeyyoLike;
// endregion property

// noinspection JSUnusedLocalSymbols
export class LoggerInstance implements Logger, LoggerSecure {
    private _name: string;

    constructor(name: string) {
        if ( !isText(name)) {
            name = `Logger@` + Math.round(Math.random() * Number.MAX_SAFE_INTEGER).toString(10);
        }
        this._name = name;
    }

    // region static

    static [KEY_SECURE_1](leyyo: LeyyoLike) {
        if ( !_leyyo) {
            _leyyo = leyyo;
        }
    }

    // endregion static

    // region levels
    debug(message: any, params?: any | Opt): void {
        _leyyo.logCommon.emitLog('debug', this._name, message, params);
    }

    trace(message: any, params?: any | Opt): void {
        _leyyo.logCommon.emitLog('trace', this._name, message, params);
    }

    info(message: any, params?: any | Opt): void {
        _leyyo.logCommon.emitLog('info', this._name, message, params);
    }

    warn(message: any, params?: any | Opt): void {
        _leyyo.logCommon.emitLog('warn', this._name, message, params);
    }

    error(message: any, params?: any | Opt): void {
        _leyyo.logCommon.emitLog('error', this._name, message, params);
    }

    fatal(message: any, params?: any | Opt): void {
        _leyyo.logCommon.emitLog('fatal', this._name, message, params);
    }

    // endregion levels

    // region secure
    /** @inheritDoc */
    get $back(): Logger {
        return this;
    }

    /** @inheritDoc */
    get $secure(): LoggerSecure {
        return this;
    }

    /** @inheritDoc */
    get $name(): string {
        return this._name;
    }

    /** @inheritDoc */
    $refreshName(name: string): void {
        if ( !isText(name)) {
            return;
        }
        this._name = name;

    }

    /** @inheritDoc */
    $refreshLevels(level: LogLevel): void {
        if ( !isText(level)) {
            return;
        }
        const rec = {
            debug: false,
            trace: false,
            info: false,
            warn: false,
            error: true,
            fatal: true,
        } as Record<LogLevel, boolean>;
        switch (level) {
            case 'debug':
                rec.debug = true;
                rec.trace = true;
                rec.info = true;
                rec.warn = true;
                break;
            case 'trace':
                rec.trace = true;
                rec.info = true;
                rec.warn = true;
                break;
            case 'info':
                rec.info = true;
                rec.warn = true;
                break;
            case 'warn':
                rec.warn = true;
                break;
            default:
                break;
        }
        for (const [k, active] of Object.entries(rec)) {
            if (active) {
                this[k] = (message: any, params?: any | Opt): void => _leyyo.logCommon.emitLog(k as LogLevel, this._name, message, params);
            }
            else {
                this[k] = (_message: any, _params?: any | Opt): void => {
                }
            }
        }
    }

    // endregion secure
}
