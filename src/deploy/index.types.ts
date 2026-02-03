import type {InitLike, ShiftMain, ShiftSecure} from "../shared";
import type {Logger} from "../log";
import type {Opt} from "../opt";

export interface DeployCommonLike extends ShiftSecure<DeployCommonSecure> {
    clearMessages(): void;
    logger(logger: Logger): DeployCommonSecure;
    printAll(pck: string): void;
    printAll(logger: Logger): void;
    has(pck: string, testCase: number | string): DeployType;

    debug(pck: string, deleteSelected?: boolean): Array<Opt>;
    info(pck: string, deleteSelected?: boolean): Array<Opt>;
    warn(pck: string, deleteSelected?: boolean): Array<Opt>;

    title(testCase: string|number, title: string): string;
    code(pck: string, testCase: string|number): string;
    get isTest(): boolean;

}
export interface DeployCommonSecure extends ShiftMain<DeployCommonLike>, InitLike {
    $debug(pck: string, testCase: number | string, opt: Opt): void;
    $info(pck: string, testCase: number | string, opt: Opt): void;
    $warn(pck: string, testCase: number | string, opt: Opt): void;
    $printAll(): void;
    $ok(): void;
}

export interface DeployItem {
    logger: Logger;
    type: DeployType;
    opt: Opt;
}

export type DeployType = 'debug' | 'info' | 'warn';
