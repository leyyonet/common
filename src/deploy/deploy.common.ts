import {FQN} from "../internal";

import type {DeployCommonLike, DeployCommonSecure, DeployItem, DeployType,} from "./index.types";
import type {LeyyoLike} from "../leyyo";
import type {Logger} from "../log";
import type {DevOpt} from "../developer";

export class DeployCommon implements DeployCommonLike, DeployCommonSecure {
    private _types = ['debug', 'info', 'warn'] as Array<DeployType>;
    private _logger: Logger;
    private _lines: Array<DeployItem> = [];

    constructor(private lyy: LeyyoLike) {
    }

    // region private
    private _add(type: DeployType, pck: string, testCase: number | string, opt: DevOpt): DeployItem {
        const item = {opt: {case: this.lyy.test.code(pck, testCase), ...opt}, logger: this._logger, type};
        this._lines.push(item);
        return item;
    }

    private _get(type: DeployType, v2: string | Logger, deleteSelected: boolean): Array<DevOpt> {
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
        const dev = this.lyy.dev;
        this._types.forEach(type => {
            this._get(type, v1, true)
                .forEach(opt => {
                    const {opt: opt2, message} = dev.buildParameters(opt);
                    logger[type](message, opt2);
                });
        })
    }
    private _print(item: DeployItem): void {
        const {opt, message} = this.lyy.dev.buildParameters(item.opt);
        item.logger[item.type](message, opt);
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
        const code = this.lyy.test.code(pck, testCase);
        const filtered = this._lines.filter(d => d.opt.case === code);
        if (filtered.length < 1) {
            return undefined;
        }
        return filtered[0].type;
    }

    debug(pck: string, deleteSelected?: boolean): Array<DevOpt> {
        return this._get('debug', pck, deleteSelected);
    }

    info(pck: string, deleteSelected?: boolean): Array<DevOpt> {
        return this._get('info', pck, deleteSelected);
    }

    warn(pck: string, deleteSelected?: boolean): Array<DevOpt> {
        return this._get('warn', pck, deleteSelected);
    }

    printAll(v1: Logger | string): void {
        this._printAll(v1);
    }

    // region secure

    get $secure(): DeployCommonSecure {
        return this;
    }

    get $back(): DeployCommonLike {
        return this;
    }

    $init(): void {
        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, DeployCommon, 'class', FQN);
        });
    }

    $debug(pck: string, testCase: number | string, opt: DevOpt): void {
        this._print(this._add('debug', pck, testCase, opt));
    }

    $info(pck: string, testCase: number | string, opt: DevOpt): void {
        this._print(this._add('info', pck, testCase, opt));
    }

    $warn(pck: string, testCase: number | string, opt: DevOpt): void {
        this._print(this._add('warn', pck, testCase, opt));
    }

    $printAll(): void {
        this._printAll(undefined);
    }
    // endregion secure
}
