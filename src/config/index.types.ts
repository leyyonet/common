import type {Dict, InitLike, ShiftMain, ShiftSecure} from "../shared";

export interface ConfigCommonLike extends ShiftSecure<ConfigCommonSecure> {
    read(): void;
    get<R = Dict>(pck?: string): R;
    toJSON(): unknown;
}
export interface ConfigCommonSecure extends ShiftMain<ConfigCommonLike>, InitLike {
    $update(value: Dict): void;
}

export interface ConfigBasic {
    LEYYO_CONFIG: string;
    PWD: string;
}
