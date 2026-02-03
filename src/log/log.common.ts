import type {LeyyoLike} from "../leyyo";
import type {LogCommonLike, LogCommonSecure, Logger, LogLine, LogLineEnhanced} from "./index.types";
import {LoggerInstance} from "./logger.instance";
import {FQN} from "../internal";
import {type LogLevel, LogLevelItems} from "./log-level";
import type {Opt} from "../opt";
import {secureJson} from "../util";

// const BLINK = '\\033[5m';
// const RED1 = '\x1b[31m';
// const RED2 = '\x1b[101m';
// const GREEN1 = '\x1b[32m';
// const GREEN2 = '\x1b[102m';
// const YELLOW1 = '\x1b[33m';
// const YELLOW2 = '\x1b[103m';
const BLUE1 = '\x1b[34m';
// const BLUE2 = '\x1b[104m';
// const MAGENTA1 = '\x1b[35m';
// const MAGENTA2 = '\x1b[105m';
// const CYAN1 = '\x1b[36m';
// const CYAN2 = '\x1b[106m';
const GRAY1 = '\x1b[37m';
const END = '\x1b[0m';

const RED_FG = '\x1b[31m';
const GREEN_FG = '\x1b[32m';
const YELLOW_FG = '\x1b[33m';
// const BLUE_FG = '\x1b[34m';
const MAGENTA_FG = '\x1b[35m';
const CYAN_FG = '\x1b[36m';

const RED_BG = '\x1b[41m';
const GREEN_BG = '\x1b[42m';
const YELLOW_BG = '\x1b[43m';
// const BLUE_BG = '\x1b[44m';
const MAGENTA_BG = '\x1b[45m';
// const CYAN_BG = '\x1b[46m';


// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
export class LogCommon implements LogCommonLike, LogCommonSecure {
    private COLORS = {
        debug: ['debug', 'DEBUG', GRAY1, CYAN_FG, '', ''],
        trace: ['trace', 'TRACE', GRAY1, CYAN_FG, '', ''],
        info: ['info', ' INFO', GREEN_BG, GREEN_FG, '', ''],
        warn: ['warn', ' WARN', YELLOW_BG, YELLOW_FG, YELLOW_FG, END],
        error: ['error', 'ERROR', RED_BG, RED_FG, RED_BG, END],
        fatal: ['error', 'FATAL', MAGENTA_BG, MAGENTA_FG, MAGENTA_BG, END],
    } as Record<LogLevel, [string, string, string, string, string, string]>;

    constructor(private lyy: LeyyoLike) {
        this.create.bind(this);
        this.apply.bind(this);
        this.check.bind(this);
        this.print.bind(this);
    }

    get $secure(): LogCommonSecure {
        return this;
    }

    $init(): void {

        // @formatter:off
        this.lyy.$secure.
            $earlyRun(() => {
                LoggerInstance.$setLeyyo(this.lyy);
            }).
            $lazyRun(() => {
                this.lyy.event.overwrite('ly:log', (level: LogLevel, _ctx: unknown, message: unknown, params: Opt) => {
                  console[level](message, params);
                });
                this.lyy.event.emit('ly:enum:register', 'literal', LogLevelItems, 'LogLevelItems', FQN)
            });
        // @formatter:off
    }

    create(clazz: Object | Function | string): Logger {
        return new LoggerInstance(clazz);
    }

    apply(line: LogLine): void {
        if (this.lyy.deploy.isTest || !line) {
            return;
        }
        const lineEnhanced = line as LogLineEnhanced;
        lineEnhanced.time = new Date();
        lineEnhanced.where = 'aaa'; // todo
        this.check(lineEnhanced);
        this.print(lineEnhanced);
    }

    private check<T>(line: LogLineEnhanced<T>): void {
        // nothing
    }
    private where(where: string): string {
        if (typeof where !== 'string') {
            where = secureJson(where);
        }
        if (!where) {
            where = ''.padStart(20);
        }
        else {
            if (where.includes('.')) {
                const parts = where.split('.');
                where = parts.pop();
                if (parts.length > 0) {
                    where = parts.map(w => w.slice(0, 1)).join('.') + '.' + where;
                }
            }
        }
        if (where.length <= 20) {
            return where.padStart(20);
        }
        else {
            return where.substring(where.length - 20);
        }

    }

    private print<T>(line: LogLineEnhanced<T>): void {
        let where = this.where(line.where);
        const date = line.time.toISOString();
        let json = '';
        if (line.params && Object.keys(line.params).length > 0) {
            json = GRAY1 + ' => ' + secureJson(line.params) + END;
        }
        const colors = this.COLORS[line.level] ?? this.COLORS.trace;
        const [level, short, bg, clr1, clr2S, cls2E] = colors;

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
        console[level](arr.join(''));
    }

    get $back(): LogCommonLike {
        return this;
    }

    // endregion logging

}
