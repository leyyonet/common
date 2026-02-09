import {emitEvent, listenEvent} from "./event.fn";
import {DeveloperError} from "../error";
import {FQN} from "../internal";
import {testCase} from "./test.fn";
import {errorText, isEmpty, isFilledObj, isObj, secureJson} from "../function";
import {ContextFinderLambda, LocalColorLike, LogFormatterLambda, LogItem, LogStylerLambda, Opt} from "../index.types";
import {LY_LOG_ALREADY} from "../const";
import {toErrorJsonBasic} from "./error.fn";
import {LogLevel} from "../enum";

// region properties
const where = `${FQN}.LogFn`;
let logFormatter: LogFormatterLambda;
let logDeploymentStyler: LogStylerLambda;
let logLocalStyler: LogStylerLambda;
let logStyler: LogStylerLambda;
const emptyWhere = ''.padStart(20);
let contextFinder: ContextFinderLambda;
// endregion properties

/**
 * Local console colors
 *
 * @type {LocalColorLike}
 * */
const localColor: LocalColorLike = {
    bold: '\x1b[1m',
    normal: '\x1b[21m',
    end: '\x1b[0m',
    param: '\x1b[90m',
    levels: {
        fatal: [true, '\x1b[31m', '\x1b[91m'], // bold red
        error: [false, '\x1b[31m', '\x1b[91m'], // red
        warn: [false, '\x1b[35m', '\x1b[95m'], // magenta
        info: [false, '\x1b[32m', '\x1b[92m'], // green
        debug: [false, '\x1b[33m', '\x1b[93m'], // yellow
        trace: [false, '\x1b[36m', '\x1b[96m'], // yellow
    }
};

// region setters
// noinspection JSUnusedGlobalSymbols
/**
 * Set formatter
 *
 * @param {function} fn - lambda for formatter
 * */
export function setLogFormatter(fn: LogFormatterLambda): void {
    if (typeof fn !== 'function') {
        throw new DeveloperError('Invalid log formatter', testCase(FQN, 161), where);
    }
    logFormatter = fn;
}

// noinspection JSUnusedGlobalSymbols
/**
 * Set deployment styler
 *
 * @param {function} fn - lambda for styler
 * */
export function setLogDeploymentStylerLog(fn: LogStylerLambda): void {
    if (typeof fn !== 'function') {
        throw new DeveloperError('Invalid log styler', testCase(FQN, 162), where);
    }
    logDeploymentStyler = fn;

    if (process.env['NODE_ENV'] !== 'local') {
        logStyler = logDeploymentStyler;
    }
}

// noinspection JSUnusedGlobalSymbols
/**
 * Set local style
 *
 * @param {function} fn - lambda for styler
 * */
export function setLogLocalStylerLog(fn: LogStylerLambda): void {
    if (typeof fn !== 'function') {
        throw new DeveloperError('Invalid log local styler', testCase(FQN, 162), where);
    }
    logLocalStyler = fn;

    if (process.env['NODE_ENV'] === 'local') {
        logStyler = logLocalStyler;
    }
}
// endregion setters

// region local-functions
/**
 * Build short style of logger name
 *
 * @param {string} where - original logger name
 * @param {string} - short style
 * */
function shortenWhere(where: string): string {
    if (!where) {
        return undefined;
    }
    if (!where.includes('.')) {
        return where;
    }
    const parts = where.split('.');
    where = parts.pop();
    if (parts.length > 0) {
        where = parts.map(w => w.slice(0, 1)).join('.') + '.' + where;
    }
    return where
}

/**
 * Log consumer
 *
 * @param {LogItem} item
 * */
function consumeLog(item: LogItem): void {
    if (!isObj(item)) {
        return;
    }
    item.where = shortenWhere(item.where);
    try {
        logFormatter(item);
    } catch (e) {
    }
    let message: string;
    try {
        message = logStyler(item);
    } catch (e) {
    }
    if (typeof message !== 'string') {
        message = `${item?.now} - ${typeof item.message === 'string' ? item.message : secureJson(item.message)}`;
        if (item.params) {
            message += ` ~^~ ${secureJson(item.params)}`;
        }
    }
    console[item.level](message);
}
// endregion local-functions

// region defaults
/**
 * Default log formatter
 *
 * @param {LogItem} item
 * */
logFormatter = (item: LogItem): void => {
    if (item?.ctx) {
        const ctx = item.ctx as {id: number, req: {headers: {'correlation-id': string}}};
        item.ctx = {
            tid: ctx?.id,
            cid: ctx?.req?.headers ? ctx?.req?.headers["correlation-id"] : undefined,
        }
    }
    item.paramStr = item.params ? secureJson(item.params) : undefined;
    delete item.params;
    if (item.paramStr && ['{}', '[]'].includes(item.paramStr as string)) {
        delete item.paramStr;
    }
}

/**
 * Default log deployment styler (on server)
 *
 * @param {LogItem} item
 * @return {string}
 * */
logDeploymentStyler = (item: LogItem): string => {
    let message = item.now;
    if (item?.ctx) {
        if (item.ctx['pid']) {
            message += ` [p:${item.ctx['pid']}]`;
        }
        else {
            message += ` [p:]`;
        }
        if (item.ctx['tid']) {
            message += ` [t:${item.ctx['tid']}]`;
        }
        else {
            message += ` [t:]`;
        }
        if (item.ctx['cid']) {
            message += ` [c:${item.ctx['cid']}]`;
        }
        else {
            message += ` [c:]`;
        }
    }
    if (item.where) {
        message += ` [w:${item.where}]`;
    }
    else {
        message += ` [w:]`;
    }
    message += ' ' + item.message;
    return message + (item.paramStr ? ' ~^~ ' + item.paramStr : '');
}

/**
 * Default log locale styler (on local computer)
 *
 * @param {LogItem} item
 * @return {string}
 * */
logLocalStyler = (item: LogItem): string => {
    const {bold, end, param} = localColor;
    const [isBold, regular, light] = localColor.levels[item.level] ?? localColor.levels.debug;
    let message = item.now.substring(10, 11) + ` ${param}[p:${process.pid}]${end}`;
    if (item?.ctx) {
        if (item.ctx['tid']) {
            message += ` ${regular}[t:${item.ctx['tid']}]`;
        }
        else {
            message += ` ${param}[t:]`;
        }
        if (item.ctx['cid']) {
            message += ` ${light}[c:${item.ctx['cid']}]`;
        }
        else {
            message += ` ${param}[c:]`;
        }
    }
    if (item.where) {
        message += ` ${regular}[${item.where}]`;
    }
    else {
        message += ` ${param}[${emptyWhere}]`;
    }
    message += ` ${isBold ? bold : ''}${light}${item.message}${end}`;
    return message + (item.paramStr ? ` ~^~ ${param}${item.paramStr}${end}` : '');
}

/**
 * Set current styler by environment
 * */
if (process.env['NODE_ENV'] === 'local') {
    logStyler = logLocalStyler
}
else {
    logStyler = logDeploymentStyler;
}
// endregion defaults

export function emitLog(level: LogLevel, where: string, message: any, params?: any | Opt): void {
    const item: LogItem = {
        level,
        where,
        now: new Date().toISOString(),
        message: undefined,
        params: undefined,
    }
    if (message instanceof Error) {
        const err = message as Error;
        try {
            if (err[LY_LOG_ALREADY]) {
                return;
            }
            err[LY_LOG_ALREADY] = true;
        } catch (e) {
        }
        item.message = errorText(message);
        item.params = toErrorJsonBasic(message, params);
    }
    else {
        if (typeof message !== 'string') {
            if (isEmpty(message)) {
                message = '??';
            }
            else {
                if (typeof message === 'object') {
                    try {
                        if (message[LY_LOG_ALREADY]) {
                            return;
                        }
                        message[LY_LOG_ALREADY] = true;
                    } catch (e) {
                    }
                }
                message = secureJson(message);
            }
        }
        item.message = message;
        item.params = isFilledObj(params) ? params : {};
    }

    if (!item.where && params?.where) {
        try {
            if (typeof params.where === 'string') {
                item.where = params.where;
                delete params.where;
            }
            else if (params.where instanceof Set) {
                const whereList = Array.from(params.where.values());
                item.where = whereList[0] as string;
                params.where.delete(item.where);
            }
        } catch (e) {
        }
    }
    if (contextFinder) {
        try {
            item.ctx = contextFinder((item.params as Opt)?.req);
        } catch (e) {
        }
    }

    emitEvent('log', item);
}
// region binding

listenEvent('context:finder', (v: ContextFinderLambda) => {
    if (typeof v === 'function') {
        contextFinder = v;
    }
    else {
        new DeveloperError('Invalid context finder lambda', testCase(FQN, '150'), where).log();
    }
})

// bind to event emitter
listenEvent('log', consumeLog);
// bind to developer error
DeveloperError.boundLog(consumeLog);
// endregion binding
