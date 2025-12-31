import {Dict, InitLike, ShiftMain, ShiftSecure} from "../shared";

export interface CommonConfigLike extends ShiftSecure<CommonConfigSecure> {
    read(): void;
    get<R = Dict>(pck?: string): R;
    toJSON(): unknown;
}
export interface CommonConfigSecure extends ShiftMain<CommonConfigLike>, InitLike {
    $update(value: Dict): void;
}

export interface ConfigBasic {
    LEYYO_CONFIG: string;
    PWD: string;
}
