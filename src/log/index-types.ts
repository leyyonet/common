import {Leyyo} from "../leyyo";
import {Severity} from "../literals";
import {Dict, ShiftMain, ShiftSecure} from "../aliases";
import {CommonCallbackDefined} from "../callback";

export interface CommonLog extends ShiftSecure<CommonLogSecure>, LogConsumer {
    create(clazz: Object|Function|string): Logger;
}

export interface CommonLogCb extends CommonCallbackDefined {
    create?(clazz: Object|Function|string): Logger;
    apply?(line: LogLine): void;
    check?<T>(line: LogLineEnhanced<T>): void;
    print<T>(line: LogLineEnhanced<T>): void;
}

export interface CommonLogSecure extends ShiftMain<CommonLog> {
    $init(leyyo: Leyyo): void;
}

export interface LogConsumer {
    apply(line: LogLine): void;
}
export interface LogLine {
    severity: Severity;
    message: string|Error;
    holder?: string;
    params?: Dict;
}
export interface LogLineEnhanced<L = Dict> extends LogLine {
    time?: Date;
    locals?: L;
}
export interface Logger extends ShiftSecure<LoggerSecure> {
    error(message: string, params?: any): void;
    error(error: Error, params?: any): void;
    error(whatever: any, params?: any): void;

    warn(message: string, params?: any): void;
    warn(error: Error, params?: any): void;
    warn(whatever: any, params?: any): void;

    info(message: string, params?: any): void;
    info(error: Error, params?: any): void;
    info(whatever: any, params?: any): void;

    log(message: string, params?: any): void;
    log(error: Error, params?: any): void;
    log(whatever: any, params?: any): void;

    trace(message: string, params?: any): void;
    trace(error: Error, params?: any): void;
    trace(whatever: any, params?: any): void;

    debug(message: string, params?: any): void;
    debug(error: Error, params?: any): void;
    debug(whatever: any, params?: any): void;
}
export type LogMethod = 'error'|'warn'|'info'|'log'|'trace'|'debug';
export interface LoggerSecure extends ShiftMain<Logger> {
    get $clazz(): Function;
    get $name(): string;
    $assert(error: Error, indicator: string, params?: unknown): void;
    $setName(name: string): void;
    $setMethod(method: LogMethod, lambda?: LoggerLambda): void;
}
export type LoggerLambda = (whatever: any, params?: any) => void;
// endregion logger
