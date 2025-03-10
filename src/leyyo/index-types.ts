import {CommonHook} from "../hook";
import {CommonIs} from "../is";
import {CommonAssertion} from "../assertion";
import {CommonError} from "../error";
import {CommonLog} from "../log";
import {CommonStorage} from "../storage";
import {CommonTo} from "../to";
import {CommonFqn} from "../fqn";

export interface Leyyo {
    readonly is: CommonIs;
    readonly hook: CommonHook;
    readonly assertion: CommonAssertion;
    readonly error: CommonError;
    readonly log: CommonLog;
    readonly storage: CommonStorage;
    readonly to: CommonTo;
    readonly fqn: CommonFqn;
}