import {ShiftMain, ShiftSecure} from "../shared";
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
    warning(pck: string, deleteSelected?: boolean): Array<DevOpt>;

}
export interface CommonDeploySecure extends ShiftMain<CommonDeployLike> {
    $debug(pck: string, testCase: number | string, opt: DevOpt): void;
    $info(pck: string, testCase: number | string, opt: DevOpt): void;
    $warning(pck: string, testCase: number | string, opt: DevOpt): void;
    $printAll(): void;
}

export interface DeployItem {
    logger: Logger;
    type: DeployType;
    opt: DevOpt;
}

export type DeployType = 'debug' | 'info' | 'warning';
