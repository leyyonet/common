import type {Logger, LoggerSecure, LogLine} from "./index.types";
import type {LeyyoLike} from "../leyyo";
import type {DevOpt} from "../developer";
import type {LogLevel} from "./log-level";
import {FQN} from "../internal";
import type {DeployCommonSecure} from "../deploy";

// noinspection JSUnusedLocalSymbols
export class LoggerInstance implements Logger, LoggerSecure {
    private static lyy: LeyyoLike;
    private _clazz: Function;
    private _name: string;
    private _name2: string;


    constructor(value: Object | Function | string) {
        switch (typeof value) {
            case "function":
                this._clazz = value;
                break;
            case "object":
                this._clazz = value.constructor;
                break;
            case "string":
                this._name = value;
                break;
            default:
                LoggerInstance.lyy.dev.developerError({
                    issue: 'invalid.logger.name',
                    where: `${FQN}.LoggerInstance`,
                    type: typeof value
                });
        }
        if (typeof this._clazz === 'function') {
            if (LoggerInstance.lyy.fqn.exists(this._clazz)) {
                this._name = LoggerInstance.lyy.fqn.name(this._clazz);
                delete this._name2;
                delete this._clazz;
            }
            else {
                this._name2 = this._clazz?.name;
                // when this object is signed by FQN, then refresh logger name
                LoggerInstance.lyy.fqn.addHook(value, (name: string) => {
                    this._name = name;
                    delete this._name2;
                    delete this._clazz;
                });
            }
        }
    }

    private _prepare(level: LogLevel, info: any, params: any): LogLine {
        const extra = {} as DevOpt;
        let e: Error;
        if (info instanceof Error) {
            e = info;
        }
        else if (typeof info === 'string') {
            extra['message'] = info;
        }
        else {
            extra['info'] = info;
        }
        const {message, opt} = LoggerInstance.lyy.dev.buildParameters(params, extra, e);
        const where = this._name ?? this._name2;
        if (where && opt.where !== where) {
            if (opt.where) {
                opt[`where-${Date.now()}`] = LoggerInstance.lyy.dev.fetch(opt, 'where');
            } else if (where) {
                opt['where'] = where;
            }
        }
        return {level, message, params: opt};
    }

    debug(message: any, params?: any|DevOpt): void {
        LoggerInstance.lyy.log.apply(this._prepare('debug', message, params));
    }

    trace(message: any, params?: any|DevOpt): void {
        LoggerInstance.lyy.log.apply(this._prepare('trace', message, params));
    }

    info(message: any, params?: any|DevOpt): void {
        LoggerInstance.lyy.log.apply(this._prepare('info', message, params));
    }

    warn(message: any, params?: any|DevOpt): void {
        LoggerInstance.lyy.log.apply(this._prepare('warn', message, params));
    }

    error(message: any, params?: any|DevOpt): void {
        LoggerInstance.lyy.log.apply(this._prepare('error', message, params));
    }

    fatal(message: any, params?: any|DevOpt): void {
        LoggerInstance.lyy.log.apply(this._prepare('fatal', message, params));
    }


    get deploy(): DeployCommonSecure {
        return LoggerInstance.lyy.deploy.logger(this);
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

    static $setLeyyo(lyy: LeyyoLike): void {
        this.lyy = lyy;
    }

    $refresh(level: LogLevel): void {
        const rec= {
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
                this[k] = (message: any, params?: any|DevOpt): void => {
                    LoggerInstance.lyy.log.apply(this._prepare(k as LogLevel, message, params));
                }
            }
            else {
                this[k] = (_message: any, _params?: any|DevOpt): void => {}
            }
        }
    }

    // endregion secure
}
