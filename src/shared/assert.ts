// noinspection JSUnusedGlobalSymbols

import {CommonAssertionLike} from "../assertion";
import {LeyyoLike} from "../leyyo";
import {AssertionOpt} from "./index-types";

let assertion: CommonAssertionLike;

export function assert(flag: boolean, message?: string): void;
export function assert(flag: boolean, opt?: AssertionOpt): void;
export function assert(flag: boolean, fn?: Function): void;
export function assert(flag: boolean, v2?: string | Function | AssertionOpt): void {
    if (!flag) {
        assertion.raise(v2 as string);
    }
}

export function $$setLeyyo(leyyo: LeyyoLike): void {
    assertion = leyyo.assertion;
}
