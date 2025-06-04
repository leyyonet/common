import {CommonDeployLike, CommonDeploySecure, DeployItem, DeployType,} from "./index.types";
import {LeyyoLike} from "../leyyo";
import {FQN} from "../internal";
import {Logger} from "../log";
import {DevOpt} from "../developer";

export class CommonDeploy implements CommonDeployLike, CommonDeploySecure {
    private _types = ['debug', 'info', 'warning'] as Array<DeployType>;
    private _logger: Logger;
    private _lines: Array<DeployItem> = [];

    constructor(private lyy: LeyyoLike) {
    }

    // region private
    private _add(type: DeployType, pck: string, testCase: number | string, opt: DevOpt): void {
        this._lines.push({opt: {case: this.lyy.test.code(pck, testCase), ...opt}, logger: this._logger, type});
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

    // endregion private

    clearMessages(): void {
        this._lines = [];
    }

    logger(logger: Logger): CommonDeploySecure {
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

    warning(pck: string, deleteSelected?: boolean): Array<DevOpt> {
        return this._get('warning', pck, deleteSelected);
    }

    printAll(v1: Logger | string): void {
        this._printAll(v1);
    }

    // region secure

    get $secure(): CommonDeploySecure {
        return this;
    }

    get $back(): CommonDeployLike {
        return this;
    }

    $init(): void {
        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, CommonDeploy, 'class', FQN);
        });
    }

    $debug(pck: string, testCase: number | string, opt: DevOpt): void {
        this._add('debug', pck, testCase, opt);
    }

    $info(pck: string, testCase: number | string, opt: DevOpt): void {
        this._add('info', pck, testCase, opt);
    }

    $warning(pck: string, testCase: number | string, opt: DevOpt): void {
        this._add('warning', pck, testCase, opt);
    }

    $printAll(): void {
        this._printAll(undefined);
    }
    // endregion secure
}
