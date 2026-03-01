import { LeyyoLike } from "../type.js";

let _leyyo: LeyyoLike;
let _isTest: boolean = false;

export function $$_setTest(): void {
  _isTest = true;
}

export function $$_isTest(): boolean {
  return _isTest;
}

export function $$_set_leyyo_fn(leyyo: LeyyoLike): void {
  if (!_leyyo && leyyo) {
    _leyyo = leyyo;
  }
}

export function $$_get_leyyo_fn(): LeyyoLike {
  return _leyyo;
}
