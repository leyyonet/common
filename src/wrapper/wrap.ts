import type {ClassLike, Fnc, Obj} from "../shared";
import type {WrapLike, WrapType} from "./index.types";

export class Wrap<V extends ClassLike|Fnc|string|Obj = Fnc> implements WrapLike<V> {
    readonly value: V;
    readonly type: WrapType;

    constructor(type: WrapType, value: V) {
        this.value = value;
        this.type = type;
    }
}
