import {FQN} from "../internal";
import {ClassLike, Fnc, Logger, LoggerSecure, Obj, Opt} from "../index.types";
import {emitLog, getFqn, newRepoMap, testCase} from "../common";
import {DeveloperError} from "../error";
import {isText} from "../function";
import {LogLevel} from "../enum";

const loggerDepot = newRepoMap<string, Logger>(`${FQN}.loggerDepot`);

const where = `${FQN}.LoggerInstance`;

// noinspection JSUnusedLocalSymbols
export class LoggerInstance implements Logger, LoggerSecure {
    private readonly _name: string;


    constructor(value: Obj | ClassLike | Fnc | string) {
        switch (typeof value) {
            case "function":
                this._name = checkLoggerName(getFqn(value), 0);
                break;
            case "object":
                this._name = checkLoggerName(getFqn(value), 0);
                break;
            case "string":
                this._name = checkLoggerName(value, 0);
                break;
            default:
                this._name = randomLoggerName();
        }

    }

    // region static
    // noinspection JSUnusedGlobalSymbols
    static instances(): Array<string> {
        return Array.from(loggerDepot.keys());
    }

    // noinspection JSUnusedGlobalSymbols
    static refresh(name: string, level: LogLevel): void {
        if ( !isText(name)) {
            throw new DeveloperError('Invalid logger name!', testCase(FQN, 162), where);
        }
        if ( !loggerDepot.has(name)) {
            throw new DeveloperError(`Logger could not be found! name: ${name}`, testCase(FQN, 162), where);
        }
        const instance = loggerDepot.get(name);

        if ( !isText(level)) {
            throw new DeveloperError(`Invalid logger level! name: ${name}`, testCase(FQN, 163), where);
        }
        if (level.startsWith('$')) {
            throw new DeveloperError(`Forbidden logger level! name: ${name}, level: ${level}`, testCase(FQN, 164), where);
        }
        if (typeof instance[level] !== 'function') {
            throw new DeveloperError(`Logger level could not be found! name: ${name}, level: ${level}`, testCase(FQN, 162), where);
        }
        try {
            instance.$secure.$refresh(level);
        } catch (e) {
            new DeveloperError(`Logger refresh raises! name: ${name}, level: ${level}`, testCase(FQN, 162), where).log(e);
        }
    }

    // endregion static

    // region levels
    debug(message: any, params?: any | Opt): void {
        emitLog('debug', this._name, message, params);
    }

    trace(message: any, params?: any | Opt): void {
        emitLog('trace', this._name, message, params);
    }

    info(message: any, params?: any | Opt): void {
        emitLog('info', this._name, message, params);
    }

    warn(message: any, params?: any | Opt): void {
        emitLog('warn', this._name, message, params);
    }

    error(message: any, params?: any | Opt): void {
        emitLog('error', this._name, message, params);
    }

    fatal(message: any, params?: any | Opt): void {
        emitLog('fatal', this._name, message, params);
    }

    // endregion levels

    // region secure
    get $back(): Logger {
        return this;
    }

    get $secure(): LoggerSecure {
        return this;
    }

    get $name(): string {
        return this._name;
    }

    $refresh(level: LogLevel): void {
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
                this[k] = (message: any, params?: any | Opt): void => emitLog(k as LogLevel, this._name, message, params);
            }
            else {
                this[k] = (_message: any, _params?: any | Opt): void => {
                }
            }
        }
    }

    // endregion secure
}

/**
 * Generate random test no
 *
 * @return {string}
 * */
function randomLoggerName(): string {
    return checkLoggerName('Logger', Math.floor(Math.random() * 1000));
}

function checkLoggerName(name: string, index: number): string {
    if (loggerDepot.has(name)) {
        return checkLoggerName(name, index + 1);
    }
    return name + (index === 0) ? '' : `(#${index})`;
}

/**
 * Default logger for general purpose
 * */
export const defLogger: Logger = new LoggerInstance('*DefaultLogger');
