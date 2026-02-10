import {KEY_SECURE_1} from "../const";
import {LeyyoLike} from "../base";
import {DeveloperErrorLike, ErrorStackLine} from "./index.types";


// region properties
const LY_DEVELOPER_MESSAGE = Symbol.for('leyyo/developer.message');
const LY_DEVELOPER_CASE = Symbol.for('leyyo/developer.case');
const LY_DEVELOPER_WHERE = Symbol.for('leyyo/developer.where');
let _leyyo: LeyyoLike;

// endregion properties

/** Developer error */
export class DeveloperError extends Error implements DeveloperErrorLike {
    protected [LY_DEVELOPER_MESSAGE]: string;
    protected [LY_DEVELOPER_CASE]: string;
    protected [LY_DEVELOPER_WHERE]: string;

    /** @inheritDoc */
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
        _leyyo.errorCommon.buildStack(this);
    }

    static [KEY_SECURE_1](leyyo: LeyyoLike) {
        if ( !_leyyo) {
            _leyyo = leyyo;
        }
    }

    /** @inheritDoc */
    log(err?: Error): void {
        if (err instanceof Error) {
            this['causedBy'] = err;
        }
        _leyyo.logCommon.emitLog('fatal', this[LY_DEVELOPER_WHERE], this, _leyyo.errorCommon.toJsonBasic(this, {testCase: this[LY_DEVELOPER_CASE]}));
    }
}
