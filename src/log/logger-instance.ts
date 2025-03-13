import {CommonLogLike} from "./index-types";
import {LeyyoLike} from "../leyyo";
import {Severity} from "../literal";
import {Logger, LoggerLambda, LoggerSecure, LogLine} from "../shared";
import {DeveloperException} from "../exception";
import {CommonFqnLike} from "../fqn";

// noinspection JSUnusedLocalSymbols
export class LoggerInstance implements Logger, LoggerSecure {
    private readonly _clazz: Function;
    private _name: string;

    private static _fqn: CommonFqnLike;
    private static _log: CommonLogLike;

    constructor(value: Object | Function | string) {
        switch (typeof value) {
            case "function":
                this._clazz = value;
                this._name = LoggerInstance._fqn.name(value);
                break;
            case "object":
                this._clazz = value.constructor;
                this._name = LoggerInstance._fqn.name(value);
                break;
            case "string":
                this._name = value;
                break;
            default:
                throw new DeveloperException('invalid.logger.name', {type: typeof value});
        }

        // when this object is signed by FQN, then refresh logger name
        if (!LoggerInstance._fqn.exists(value)) {
            LoggerInstance._fqn.addHook(value, (name: string) => {
                this._name = name;
            });
        }
    }

    private _prepare(severity: Severity, message: any, params: any): LogLine {
        if (!message && params?.indicator) {
            message = params.indicator;
            delete params.indicator;
        }
        return {severity, message, params, holder: this._name};
    }

    debug(message: any, params?: any): void {
        LoggerInstance._log.apply(this._prepare('debug', message, params));
    }

    error(message: any, params?: any): void {
        LoggerInstance._log.apply(this._prepare('error', message, params));
    }

    info(message: any, params?: any): void {
        LoggerInstance._log.apply(this._prepare('info', message, params));
    }

    log(message: any, params?: any): void {
        LoggerInstance._log.apply(this._prepare('log', message, params));
    }

    trace(message: any, params?: any): void {
        LoggerInstance._log.apply(this._prepare('trace', message, params));
    }

    warn(message: any, params?: any): void {
        LoggerInstance._log.apply(this._prepare('warn', message, params));
    }

    // region secure
    get $back(): Logger {
        return this;
    }

    get $secure(): LoggerSecure {
        return this;
    }

    get $clazz(): Function {
        return this._clazz;
    }

    get $name(): string {
        return this._name;
    }

    static $setLeyyo(leyyo: LeyyoLike): void {
        this._fqn = leyyo.fqn;
        this._log = leyyo.log;
    }

    $setMethod(method: Severity, lambda?: LoggerLambda): void {
        if (typeof lambda === 'function') {
            this[method] = lambda;
        } else {
            this[method] = () => {
            };
        }
    }

    $assert(error: Error, indicator: string, params?: unknown): void {
    }

    // endregion secure
}