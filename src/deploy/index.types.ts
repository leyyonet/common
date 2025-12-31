import {InitLike, ShiftMain, ShiftSecure} from "../shared";
import {Logger} from "../log";
import {DevOpt} from "../developer";

export interface CommonDeployLike extends ShiftSecure<CommonDeploySecure> {
    clearMessages(): void;
    logger(logger: Logger): CommonDeploySecure;
    printAll(pck: string): void;
    printAll(logger: Logger): void;
    has(pck: string, testCase: number | string): DeployType;

    debug(pck: string, deleteSelected?: boolean): Array<DevOpt>;
    info(pck: string, deleteSelected?: boolean): Array<DevOpt>;
    warn(pck: string, deleteSelected?: boolean): Array<DevOpt>;

}
export interface CommonDeploySecure extends ShiftMain<CommonDeployLike>, InitLike {
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
