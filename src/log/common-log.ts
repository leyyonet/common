import {LeyyoCommonHook, LeyyoLike} from "../leyyo";
import {CommonLogLike, CommonLogSecure, LogDefinedProvider, Logger, LogLine, LogLineEnhanced} from "./index.types";
import {LoggerInstance} from "./logger-instance";
import {Keys} from "../shared";
import {FQN} from "../internal";
import {Severity, SeverityItems} from "./severity";

const BLINK = '\\033[5m';
const RED1 = '\x1b[31m';
const RED2 = '\x1b[101m';
const GREEN1 = '\x1b[32m';
const GREEN2 = '\x1b[102m';
const YELLOW1 = '\x1b[33m';
const YELLOW2 = '\x1b[103m';
const BLUE1 = '\x1b[34m';
const BLUE2 = '\x1b[104m';
const MAGENTA1 = '\x1b[35m';
const MAGENTA2 = '\x1b[105m';
const CYAN1 = '\x1b[36m';
const CYAN2 = '\x1b[106m';
const GRAY1 = '\x1b[37m';
const END = '\x1b[0m';

const RED_FG = '\x1b[31m';
const GREEN_FG = '\x1b[32m';
const YELLOW_FG = '\x1b[33m';
const BLUE_FG = '\x1b[34m';
const MAGENTA_FG = '\x1b[35m';
const CYAN_FG = '\x1b[36m';

const RED_BG = '\x1b[41m';
const GREEN_BG = '\x1b[42m';
const YELLOW_BG = '\x1b[43m';
const BLUE_BG = '\x1b[44m';
const MAGENTA_BG = '\x1b[45m';
const CYAN_BG = '\x1b[46m';

// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
export class CommonLog implements CommonLogLike, CommonLogSecure {
    private lyy: LeyyoLike;

    private COLORS = {
        debug: ['debug',    'DEBUG', GRAY1, CYAN_FG, '', ''],
        trace: ['log',      'TRACE', GRAY1, CYAN_FG, '', ''],
        log: ['log',        '  LOG', GREEN_BG, GREEN_FG, '', ''],
        info: ['log',       ' INFO', GREEN_BG, GREEN_FG, '', ''],
        warn: ['warn',      ' WARN', YELLOW_BG, YELLOW_FG, YELLOW_FG, END],
        error: ['error',    'ERROR', RED_BG, RED_FG, RED_BG, END],
        fatal: ['error',    'FATAL', MAGENTA_BG, MAGENTA_FG, MAGENTA_BG, END],
    } as Record<Severity, [string, string, string, string, string, string]>;

    constructor() {
        this.create.bind(this);
        this.apply.bind(this);
        this.check.bind(this);
        this.print.bind(this);
    }

    get $secure(): CommonLogSecure {
        return this;
    }

    $init(lyy: LeyyoLike): void {
        this.lyy = lyy;

        // @formatter:off
        this.lyy.$secure.
            $earlyRun(() => {
                LoggerInstance.$setLeyyo(this.lyy);
            }).
            $lazyRun(() => {
                const fields = ['create', 'apply', 'check', 'print'] as Keys<LogDefinedProvider>;
                const rec = {proper: false} as LogDefinedProvider;
                fields.forEach(field => {
                    rec[field] = this[field];
                });

                // define itself temporarily for log operations
            this.lyy.hook.defineProvider<LogDefinedProvider>(LeyyoCommonHook.logAttached, CommonLog, rec);

                // when new log provider is defined, replace all common methods
            this.lyy.hook.whenProviderDefined<LogDefinedProvider>(LeyyoCommonHook.logAttached, CommonLog, (ins) => {
                    fields.forEach(field => {
                        if (typeof ins[field] === 'function') {
                            this[field] = ins[field];
                        }
                    });
                });
            }).
            $lazyRun(() => {
            this.lyy.fqn.register(null, CommonLog, 'class', FQN);
            this.lyy.fqn.register(null, LoggerInstance, 'class', FQN);

            const enumMap = {
                Severity: SeverityItems,
            };
            for (const [name, value] of Object.entries(enumMap)) {
                this.lyy.fqn.register(name, value, 'enum', FQN);
                this.lyy.hook.queueForCallback(LeyyoCommonHook.enumPendingRegister, value);
            }
        });
        // @formatter:off
    }

    create(clazz: Object | Function | string): Logger {
        const ins = new LoggerInstance(clazz);
        this.lyy.hook.queueForCallback(LeyyoCommonHook.logPendingRegister, ins, clazz);
        return ins;
    }

    apply(line: LogLine): void {
        if (global?.leyyo_is_testing || this.lyy.test.is || !line) {
            return;
        }
        const lineEnhanced = line as LogLineEnhanced;
        lineEnhanced.time = new Date();
        lineEnhanced.where = this.lyy.dev.fetch(lineEnhanced.params, 'where');
        this.check(lineEnhanced);
        this.print(lineEnhanced);
    }

    private check<T>(line: LogLineEnhanced<T>): void {
        // nothing
    }

    private print<T>(line: LogLineEnhanced<T>): void {
        let where = line.where;
        const date = line.time.toISOString();
        let json = '';
        if (line.params && Object.keys(line.params).length > 0) {
            json = GRAY1 + ' => ' + this.lyy.dev.secureJson(line.params, true) + END;
        }
        const colors = this.COLORS[line.severity] ?? this.COLORS.trace;
        const [severity, short, bg, clr1, clr2S, cls2E] = colors;

        if (!where) {
            where = ''.padStart(20);
        }
        else if (where.length > 20) {
            where = where.substring(where.length - 20);
        }
        else {
            where = where.padStart(20);
        }
        const arr = [
            BLUE1, date.substring(11, 23), END,
            ' | ',
            bg, short, END,
            ' | ',
            clr1, where, END,
            ' | ',
            clr2S, line.message, cls2E,
            json,
        ];
        console[severity](arr.join(''));
    }

    get $back(): CommonLogLike {
        return this;
    }

    // endregion logging

}
