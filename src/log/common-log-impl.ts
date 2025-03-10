import {Leyyo} from "../leyyo";
import {CommonLog, CommonLogSecure} from "./index-types";
import {LoggerImpl} from "./logger-impl";
import {CommonHook} from "../hook";
import {
    Keys,
    LogDefinedProvider,
    Logger,
    LogLine,
    LogLineEnhanced,
    LY_ATTACHED_LOG,
    LY_PENDING_LOG_REGISTER
} from "../shared";

// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
export class CommonLogImpl implements CommonLog, CommonLogSecure {
    private hook: CommonHook;

    constructor() {
        this.create.bind(this);
        this.apply.bind(this);
        this.check.bind(this);
        this.print.bind(this);
    }

    get $secure(): CommonLogSecure {
        throw this;
    }

    $init(leyyo: Leyyo): void {

        this.hook = leyyo.hook;

        const fields = ['create', 'apply', 'check', 'print'] as Keys<LogDefinedProvider>;
        const rec = {proper: false} as LogDefinedProvider;
        fields.forEach(field => {
            rec[field] = this[field];
        });

        // define itself temporarily for log operations
        this.hook.defineProvider<LogDefinedProvider>(LY_ATTACHED_LOG, CommonLogImpl, rec);

        // when new log provider is defined, replace all common methods
        this.hook.whenProviderDefined<LogDefinedProvider>(LY_ATTACHED_LOG, CommonLogImpl, (ins) => {
            fields.forEach(field => {
                if (typeof ins[field] === 'function') {
                    this[field] = ins[field];
                }
            });
        });
    }

    create(clazz: Object | Function | string): Logger {
        const ins = new LoggerImpl(clazz);
        this.hook.queueForCallback(LY_PENDING_LOG_REGISTER, ins, clazz);
        return ins;
    }

    apply(line: LogLine): void {
        if (global?.leyyo_is_testing || !line) {
            return;
        }
        const lineEnhanced = line as LogLineEnhanced;
        lineEnhanced.time = new Date();
        this.check(lineEnhanced);
        this.print(lineEnhanced);
    }

    private check<T>(line: LogLineEnhanced<T>): void {
        // nothing
    }

    private print<T>(line: LogLineEnhanced<T>): void {
        console[line.severity](`[${line.time}] ${line.severity} ${line.holder} ${line.message}`, line.params);
    }

    get $back(): CommonLog {
        return this;
    }

    // endregion logging

}