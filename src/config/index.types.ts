import {Dict, ShiftMain, ShiftSecure} from "../shared";
import {Logger} from "../log";
import {DevOpt} from "../developer";

export interface CommonConfigLike extends ShiftSecure<CommonConfigSecure> {
    read(): void;
    get<R = Dict>(pck?: string): R;
}
export interface CommonConfigSecure extends ShiftMain<CommonConfigLike> {
    $update(value: Dict): void;
}

export interface ConfigBasic {
    LEYYO_CONFIG: string;
    PWD: string;
}
