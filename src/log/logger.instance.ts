import type {Logger, LoggerSecure} from "./index.types";
import type {LeyyoLike} from "../leyyo";
import type {LogLevel} from "./log-level";
import {FQN} from "../internal";
import type {DeployCommonSecure} from "../deploy";
import type {FqnCommonLike} from "../shared";
import {LoggerError} from "./logger.error";
import type {EventCommonLike} from "../event";
import type {Opt} from "../opt";

let fqnHandler: FqnCommonLike;
let eventCommon: EventCommonLike;

// noinspection JSUnusedLocalSymbols
export class LoggerInstance implements Logger, LoggerSecure {
    private static lyy: LeyyoLike;
    private _clazz: Function;
    private _name: string;


    constructor(value: Object | Function | string) {
        switch (typeof value) {
            case "function":
                this._clazz = value;
                this._name = this._clazz?.name;
                break;
            case "object":
                this._clazz = value?.constructor;
                this._name = this._clazz?.name;
                break;
            case "string":
                this._name = value;
                break;
            default:
                throw new LoggerError('Invalid logger owner', {where: `${FQN}.LoggerInstance`, method: 'constructor', type: typeof value, value});
        }
        if (typeof this._clazz === 'function') {
            let name: string;
            if (fqnHandler) {
                name = fqnHandler.getName(this._clazz);
            }
            if (!name) {
                setTimeout(() => {
                    if (fqnHandler && typeof this._clazz === 'function') {
                        const name2 = fqnHandler.getName(this._clazz);
                        if (name2) {
                            this._name = name2;
                            delete this._clazz;
                        }
                    }
                }, 100);
            }
            else {
                this._name = name;
                delete this._clazz;
            }
        }
    }

    debug(message: any, params?: any|Opt): void {
        const ctx = {name: this._name, time: Date.now()};
        eventCommon?.emit('ly:log', 'debug', ctx, message, params);
    }

    trace(message: any, params?: any|Opt): void {
        const ctx = {name: this._name, time: Date.now()};
        eventCommon?.emit('ly:log', 'trace', ctx, message, params);
    }

    info(message: any, params?: any|Opt): void {
        const ctx = {name: this._name, time: Date.now()};
        eventCommon?.emit('ly:log', 'info', ctx, message, params);
    }

    warn(message: any, params?: any|Opt): void {
        const ctx = {name: this._name, time: Date.now()};
        eventCommon?.emit('ly:log', 'warn', ctx, message, params);
    }

    error(message: any, params?: any|Opt): void {
        const ctx = {name: this._name, time: Date.now()};
        eventCommon?.emit('ly:log', 'error', ctx, message, params);
    }

    fatal(message: any, params?: any|Opt): void {
        const ctx = {name: this._name, time: Date.now()};
        eventCommon?.emit('ly:log', 'fatal', ctx, message, params);
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
        eventCommon = this.lyy.event;
        eventCommon.on('ly:fqn:loaded', (v: FqnCommonLike) => fqnHandler = v);
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
                this[k] = (message: any, params?: any|Opt): void => {
                    const ctx = {name: this._name, time: Date.now()};
                    eventCommon?.emit('ly:log', k, ctx, message, params);
                }
            }
            else {
                this[k] = (_message: any, _params?: any|Opt): void => {}
            }
        }
    }

    // endregion secure
}
