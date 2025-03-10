import {ShiftMain, ShiftSecure} from "../aliases";
import {Leyyo} from "../leyyo";

export interface CommonIs extends ShiftSecure<CommonIsSecure>{
    empty(value: unknown): boolean;
    primitive(value: unknown): boolean;
    value(value: unknown): boolean;
    key(value: unknown): boolean;
    object(value: unknown): boolean;
    array(value: unknown): boolean;
    func(value: unknown): boolean;
    number(value: unknown): boolean;
    integer(value: unknown): boolean;
    string(value: unknown): boolean;
    text(value: unknown): boolean;
    clazz(value: unknown): boolean;
    boolean(value: unknown): boolean;
    true(value: unknown): boolean;
    false(value: unknown): boolean;
}

export interface CommonIsSecure extends ShiftMain<CommonIs> {
    $init(leyyo: Leyyo): void;
}