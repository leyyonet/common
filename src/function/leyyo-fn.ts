import {LeyyoLike} from "../base/index.js";

let _leyyo: LeyyoLike;

export function $$set_leyyo_fn(leyyo: LeyyoLike): void {
    if ( !_leyyo && leyyo) {
        _leyyo = leyyo;
    }
}

export function $$get_leyyo_fn(): LeyyoLike {
    return _leyyo;
}
