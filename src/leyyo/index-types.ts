import {CommonCallback} from "../callback";
import {CommonIs} from "../is";
import {CommonAssertion} from "../assertion";
import {CommonError} from "../error";
import {CommonLog} from "../log";
import {CommonStorage} from "../storage";
import {CommonTo} from "../to";

export interface Leyyo {
    readonly is: CommonIs;
    readonly callback: CommonCallback;
    readonly assertion: CommonAssertion;
    readonly error: CommonError;
    readonly log: CommonLog;
    readonly storage: CommonStorage;
    readonly to: CommonTo;
}