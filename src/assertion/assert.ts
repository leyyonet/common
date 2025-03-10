import {AssertionOpt, CommonAssertion} from "./index-types";
import {Leyyo} from "../leyyo";

let assertion: CommonAssertion;

export function assert(flag: boolean, message?: string): void;
export function assert(flag: boolean, opt?: AssertionOpt): void;
export function assert(flag: boolean, fn?: Function): void;
export function assert(flag: boolean, v2?: string | Function | AssertionOpt): void {
    if (!flag) {
        assertion.raise(v2 as string);
    }
}

export function $$setLeyyo(leyyo: Leyyo): void {
    assertion = leyyo.assertion;
}
