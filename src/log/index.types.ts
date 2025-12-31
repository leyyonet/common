import {Dict, InitLike, ShiftMain, ShiftSecure} from "../shared";
import {HookDefinedProvider} from "../hook";
import {DevOpt} from "../developer";
import {Severity} from "./severity";
import {CommonDeploySecure} from "../deploy";

export interface CommonLogLike extends ShiftSecure<CommonLogSecure>, LogConsumer {
    create(clazz: Object | Function | string): Logger;
}


export type CommonLogSecure = ShiftMain<CommonLogLike> & InitLike;


export interface LogDefinedProvider extends HookDefinedProvider {
    create?(clazz: Object | Function | string): Logger;

    apply?(line: LogLine): void;

    check?<T>(line: LogLineEnhanced<T>): void;

    print<T>(line: LogLineEnhanced<T>): void;
}

export interface LogConsumer {
    apply(line: LogLine): void;
}

export interface LogLine {
    severity: Severity;
    message: string | Error;
    params?: Dict;
}

export interface LogLineEnhanced<L = Dict> extends LogLine {
    time?: Date;
    where?: string;
    locals?: L;
}

export interface Logger extends ShiftSecure<LoggerSecure> {

    debug(message: string, params?: any|DevOpt): void;
    debug(error: Error, params?: any|DevOpt): void;
    debug(whatever: any, params?: any|DevOpt): void;

    trace(message: string, params?: any|DevOpt): void;
    trace(error: Error, params?: any|DevOpt): void;
    trace(whatever: any, params?: any|DevOpt): void;

    info(message: string, params?: any|DevOpt): void;
    info(error: Error, params?: any|DevOpt): void;
    info(whatever: any, params?: any|DevOpt): void;

    warn(message: string, params?: any|DevOpt): void;
    warn(error: Error, params?: any|DevOpt): void;
    warn(whatever: any, params?: any|DevOpt): void;

    error(message: string, params?: any|DevOpt): void;
    error(error: Error, params?: any|DevOpt): void;
    error(whatever: any, params?: any|DevOpt): void;

    fatal(message: string, params?: any|DevOpt): void;
    fatal(error: Error, params?: any|DevOpt): void;
    fatal(whatever: any, params?: any|DevOpt): void;

    get deploy(): CommonDeploySecure;
}

export interface LoggerSecure extends ShiftMain<Logger> {
    get $clazz(): Function;

    get $name(): string;

    $refresh(severity: Severity): void;
}
