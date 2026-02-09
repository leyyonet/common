import {secureJson} from "../function";
import {ErrorStackBuilder, ErrorStackLine, LeyyoStackLike, LogConsumerLambda, LogItem} from "../index.types";
import {toErrorJsonBasic} from "../common";

const LY_DEVELOPER_MESSAGE = Symbol.for('leyyo/developer.message');
const LY_DEVELOPER_CASE = Symbol.for('leyyo/developer.case');
const LY_DEVELOPER_WHERE = Symbol.for('leyyo/developer.where');
let _logConsumer: LogConsumerLambda;
let _stackBuilder: ErrorStackBuilder;

/** Developer error */
export class DeveloperError extends Error implements LeyyoStackLike {
    protected [LY_DEVELOPER_MESSAGE]: string;
    protected [LY_DEVELOPER_CASE]: string;
    protected [LY_DEVELOPER_WHERE]: string;
    /**
     * Stack trace
     * */
    stackTrace?: Array<ErrorStackLine>;

    /**
     * @param {string} message - error message
     * @param {string} issue - test case
     * @param {string} where - where
     * */
    constructor(message: string, issue?: string, where?: string) {
        message = message ?? 'Developer error';
        const pureMessage = message;
        if (typeof issue === 'string') {
            message += ` [case:${issue}]`;
        }
        if (typeof where === 'string') {
            message += ` [w:${where}]`;
        }
        super(message);
        this[LY_DEVELOPER_MESSAGE] = pureMessage;
        if (typeof issue === 'string') {
            this[LY_DEVELOPER_CASE] = issue;
        }
        if (typeof where === 'string') {
            this[LY_DEVELOPER_WHERE] = where;
        }
        if (_stackBuilder) {
            _stackBuilder(this);
        }
    }
    log(err?: Error): void {
        if (err instanceof Error) {
            this['causedBy'] = err;
        }
        const item: LogItem = {
            level: 'fatal',
            where: this[LY_DEVELOPER_WHERE],
            now: new Date().toISOString(),
            message: this[LY_DEVELOPER_MESSAGE],
            params: toErrorJsonBasic(this, {testCase: this[LY_DEVELOPER_CASE]}),
        }
        if (_logConsumer) {
            _logConsumer(item);
        }
        else {
            console.error(secureJson(item));
        }
    }
    static boundLog(fn: LogConsumerLambda): void {
        if (typeof fn === 'function') {
            _logConsumer = fn;
        }
    }
    static stackBuilder(fn: ErrorStackBuilder): void {
        if (!_stackBuilder && typeof fn === 'function') {
            _stackBuilder = fn;
        }
    }
}
