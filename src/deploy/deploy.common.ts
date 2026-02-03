import type {DeployCommonLike, DeployCommonSecure, DeployItem, DeployType,} from "./index.types";
import type {LeyyoLike} from "../leyyo";
import type {Logger} from "../log";
import type {Opt} from "../opt";
import {FQN} from "../internal";

export class DeployCommon implements DeployCommonLike, DeployCommonSecure {
    private _types = ['debug', 'info', 'warn'] as Array<DeployType>;
    private _logger: Logger;
    private _lines: Array<DeployItem> = [];
    private _is: boolean;

    constructor(private lyy: LeyyoLike) {
    }

    // region private
    private _add(type: DeployType, pck: string, testCase: number | string, opt: Opt): DeployItem {
        const item = {opt: {case: this.code(pck, testCase), ...opt}, logger: this._logger, type};
        this._lines.push(item);
        return item;
    }

    private _get(type: DeployType, v2: string | Logger, deleteSelected: boolean): Array<Opt> {
        const lines = [] as Array<DeployItem>;
        if (typeof v2 === 'string') {
            const pck = v2;
            lines.push(...this._lines.filter(item => item.type === type && (typeof item.opt.case === 'string') && item.opt.case.startsWith(pck)));
        } else {
            const logger = v2;
            lines.push(...this._lines.filter(item => item.type === type && item.logger === logger));
        }
        if (deleteSelected) {
            lines.forEach(item => {
                const index = this._lines.findIndex(a => a === item);
                if (index >= 0) {
                    this._lines.splice(index, 1);
                }
            })
        }
        return lines.map(item => item.opt);
    }

    private _printAll(v1: string | Logger): void {
        const logger = ((typeof v1 === 'string') ? this._logger : (v1 ?? this._logger)) as Logger;
        this._types.forEach(type => {
            this._get(type, v1, true)
                .forEach(opt => {
                    logger[type](opt.issue, opt);
                });
        })
    }
    private _print(item: DeployItem): void {
        item.logger[item.type](item.opt.issue, item.opt); // todo
    }

    // endregion private

    clearMessages(): void {
        this._lines = [];
    }

    logger(logger: Logger): DeployCommonSecure {
        this._logger = logger;
        return this;
    }

    has(pck: string, testCase: number | string): DeployType {
        const code = this.code(pck, testCase);
        const filtered = this._lines.filter(d => d.opt.case === code);
        if (filtered.length < 1) {
            return undefined;
        }
        return filtered[0].type;
    }

    debug(pck: string, deleteSelected?: boolean): Array<Opt> {
        return this._get('debug', pck, deleteSelected);
    }

    info(pck: string, deleteSelected?: boolean): Array<Opt> {
        return this._get('info', pck, deleteSelected);
    }

    warn(pck: string, deleteSelected?: boolean): Array<Opt> {
        return this._get('warn', pck, deleteSelected);
    }

    printAll(v1: Logger | string): void {
        this._printAll(v1);
    }

    title(testCase: string|number, title: string): string {
        return `${testCase} >> ${title}`;
    }
    code(pck: string, testCase: string|number): string {
        pck = (['string', 'number'].includes(typeof pck)) ? pck : FQN;
        testCase = (['string', 'number'].includes(typeof testCase)) ? testCase : 'XXX';
        return `${pck}#${testCase}`;
    }
    get isTest(): boolean {
        return this._is;
    }
    $ok(): void {
        this._is = true;
        if (global) {
            if (!global.leyyo_is_testing) {
                global.leyyo_is_testing = true;

                ['log', 'warn', 'info', 'debug', 'trace', 'error', 'native'].forEach(name => {
                    global.console[name] = (): void => {
                    };
                    console[name] = (): void => {
                    };
                });

            }
        }
    }

    // region secure

    get $secure(): DeployCommonSecure {
        return this;
    }

    get $back(): DeployCommonLike {
        return this;
    }

    $init(): void {
    }

    $debug(pck: string, testCase: number | string, opt: Opt): void {
        this._print(this._add('debug', pck, testCase, opt));
    }

    $info(pck: string, testCase: number | string, opt: Opt): void {
        this._print(this._add('info', pck, testCase, opt));
    }

    $warn(pck: string, testCase: number | string, opt: Opt): void {
        this._print(this._add('warn', pck, testCase, opt));
    }

    $printAll(): void {
        this._printAll(undefined);
    }
    // endregion secure
}
