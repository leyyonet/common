import type {Dict, InitLike, ShiftMain, ShiftSecure} from "../shared";
import type {LogLevel} from "./log-level";
import type {DeployCommonSecure} from "../deploy";
import type {Opt} from "../opt";

export interface LogCommonLike extends ShiftSecure<LogCommonSecure>, LogConsumer {
    create(clazz: Object | Function | string): Logger;
}


export type LogCommonSecure = ShiftMain<LogCommonLike> & InitLike;


export interface LogConsumer {
    apply(line: LogLine): void;
}

export interface LogLine {
    level: LogLevel;
    message: string | Error;
    params?: Dict;
}

export interface LogLineEnhanced<L = Dict> extends LogLine {
    time?: Date;
    where?: string;
    locals?: L;
}

export interface Logger extends ShiftSecure<LoggerSecure> {

    debug(message: string, params?: any|Opt): void;
    debug(error: Error, params?: any|Opt): void;
    debug(whatever: any, params?: any|Opt): void;

    trace(message: string, params?: any|Opt): void;
    trace(error: Error, params?: any|Opt): void;
    trace(whatever: any, params?: any|Opt): void;

    info(message: string, params?: any|Opt): void;
    info(error: Error, params?: any|Opt): void;
    info(whatever: any, params?: any|Opt): void;

    warn(message: string, params?: any|Opt): void;
    warn(error: Error, params?: any|Opt): void;
    warn(whatever: any, params?: any|Opt): void;

    error(message: string, params?: any|Opt): void;
    error(error: Error, params?: any|Opt): void;
    error(whatever: any, params?: any|Opt): void;

    fatal(message: string, params?: any|Opt): void;
    fatal(error: Error, params?: any|Opt): void;
    fatal(whatever: any, params?: any|Opt): void;

    get deploy(): DeployCommonSecure;
}

export interface LoggerSecure extends ShiftMain<Logger> {
    get $clazz(): Function;

    get $name(): string;

    $refresh(level: LogLevel): void;
}
