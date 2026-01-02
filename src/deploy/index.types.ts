import type {InitLike, ShiftMain, ShiftSecure} from "../shared";
import type {Logger} from "../log";
import type {DevOpt} from "../developer";

export interface DeployCommonLike extends ShiftSecure<DeployCommonSecure> {
    clearMessages(): void;
    logger(logger: Logger): DeployCommonSecure;
    printAll(pck: string): void;
    printAll(logger: Logger): void;
    has(pck: string, testCase: number | string): DeployType;

    debug(pck: string, deleteSelected?: boolean): Array<DevOpt>;
    info(pck: string, deleteSelected?: boolean): Array<DevOpt>;
    warn(pck: string, deleteSelected?: boolean): Array<DevOpt>;

}
export interface DeployCommonSecure extends ShiftMain<DeployCommonLike>, InitLike {
    $debug(pck: string, testCase: number | string, opt: DevOpt): void;
    $info(pck: string, testCase: number | string, opt: DevOpt): void;
    $warn(pck: string, testCase: number | string, opt: DevOpt): void;
    $printAll(): void;
}

export interface DeployItem {
    logger: Logger;
    type: DeployType;
    opt: DevOpt;
}

export type DeployType = 'debug' | 'info' | 'warn';
