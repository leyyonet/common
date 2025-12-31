import {CommonHookLike} from "../hook";
import {CommonIsLike} from "../is";
import {CommonAssertionLike} from "../assertion";
import {CommonErrorLike} from "../error";
import {CommonLogLike} from "../log";
import {CommonRepoLike} from "../repo";
import {CommonToLike} from "../to";
import {CommonFqnLike} from "../fqn";
import {CommonSystemLike} from "../system";
import {CommonDeveloperLike} from "../developer";
import {Fnc, ShiftMain, ShiftSecure} from "../shared";
import {CommonDescriptorLike} from "../descriptor";
import {CommonWrapperLike} from "../wrapper";
import {CommonTestLike} from "../test";
import {CommonDeployLike} from "../deploy";
import {CommonNameLike} from "../name";
import {CommonConfigLike} from "../config";
import {CommonMixinLike} from "../mixin";

export interface LeyyoLike extends ShiftSecure<LeyyoSecure> {
    readonly is: CommonIsLike;
    readonly hook: CommonHookLike;
    readonly assertion: CommonAssertionLike;
    readonly error: CommonErrorLike;
    readonly log: CommonLogLike;
    readonly repo: CommonRepoLike;
    readonly to: CommonToLike;
    readonly fqn: CommonFqnLike;
    readonly system: CommonSystemLike;
    readonly dev: CommonDeveloperLike;
    readonly descriptor: CommonDescriptorLike;
    readonly wrapper: CommonWrapperLike;
    readonly test: CommonTestLike;
    readonly deploy: CommonDeployLike;
    readonly name: CommonNameLike;
    readonly config: CommonConfigLike;
    readonly mixin: CommonMixinLike;
}
export interface LeyyoSecure extends ShiftMain<LeyyoLike> {
    $earlyRun(fn: Fnc): LeyyoSecure;
    $lazyRun(fn: Fnc): LeyyoSecure;
}
