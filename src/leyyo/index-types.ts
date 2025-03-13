import {CommonHookLike} from "../hook";
import {CommonIsLike} from "../is";
import {CommonAssertionLike} from "../assertion";
import {CommonErrorLike} from "../error";
import {CommonLogLike} from "../log";
import {CommonStorageLike} from "../storage";
import {CommonToLike} from "../to";
import {CommonFqnLike} from "../fqn";
import {CommonSystemLike} from "../system";

export interface LeyyoLike {
    readonly is: CommonIsLike;
    readonly hook: CommonHookLike;
    readonly assertion: CommonAssertionLike;
    readonly error: CommonErrorLike;
    readonly log: CommonLogLike;
    readonly storage: CommonStorageLike;
    readonly to: CommonToLike;
    readonly fqn: CommonFqnLike;
    readonly system: CommonSystemLike;
}