import {CommonLog} from "./index-types";
import {Leyyo} from "../leyyo";
import {Severity} from "../literal";
import {Logger, LoggerLambda, LoggerSecure} from "../shared";
import {DeveloperException} from "../exception";
import {CommonFqn} from "../fqn";

// noinspection JSUnusedLocalSymbols
export class LoggerImpl implements Logger, LoggerSecure {
    private readonly _clazz: Function;
    private _name: string;

    private static _fqn: CommonFqn;
    private static _log: CommonLog;

    constructor(value: Object | Function | string) {
        switch (typeof value) {
            case "function":
                this._clazz = value;
                this._name = LoggerImpl._fqn.name(value);
                break;
            case "object":
                this._clazz = value.constructor;
                this._name = LoggerImpl._fqn.name(value);
                break;
            case "string":
                this._name = value;
                break;
            default:
                throw new DeveloperException('invalid.logger.name', {type: typeof value});
        }

        // when this object is signed by FQN, then refresh logger name
        if (!LoggerImpl._fqn.exists(value)) {
            LoggerImpl._fqn.addHook(value, (name: string) => {
                this._name = name;
            });
        }
    }

    debug(message: any, params?: any): void {
        LoggerImpl._log.apply({severity: 'debug', message: message, holder: this._name, params: params});
    }

    error(message: any, params?: any): void {
        LoggerImpl._log.apply({severity: 'error', message: message, holder: this._name, params: params});
    }

    info(message: any, params?: any): void {
        LoggerImpl._log.apply({severity: 'info', message: message, holder: this._name, params: params});
    }

    log(message: any, params?: any): void {
        LoggerImpl._log.apply({severity: 'log', message: message, holder: this._name, params: params});
    }

    trace(message: any, params?: any): void {
        LoggerImpl._log.apply({severity: 'trace', message: message, holder: this._name, params: params});
    }

    warn(message: any, params?: any): void {
        LoggerImpl._log.apply({severity: 'warn', message: message, holder: this._name, params: params});
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

    static $setLeyyo(leyyo: Leyyo): void {
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