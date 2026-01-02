import type {HookCommonLike} from "../hook";
import type {IsCommonLike} from "../is";
import type {AssertionCommonLike} from "../assertion";
import type {ErrorCommonLike} from "../error";
import type {LogCommonLike} from "../log";
import type {RepoCommonLike} from "../repo";
import type {ToCommonLike} from "../to";
import type {FqnCommonLike} from "../fqn";
import type {SystemCommonLike} from "../system";
import type {DeveloperCommonLike} from "../developer";
import type {Fnc, ShiftMain, ShiftSecure} from "../shared";
import type {DescriptorCommonLike} from "../descriptor";
import type {WrapperCommonLike} from "../wrapper";
import type {TestCommonLike} from "../test";
import type {DeployCommonLike} from "../deploy";
import type {NameCommonLike} from "../name";
import type {ConfigCommonLike} from "../config";
import type {MixinCommonLike} from "../mixin";

export interface LeyyoLike extends ShiftSecure<LeyyoSecure> {
    readonly is: IsCommonLike;
    readonly hook: HookCommonLike;
    readonly assertion: AssertionCommonLike;
    readonly error: ErrorCommonLike;
    readonly log: LogCommonLike;
    readonly repo: RepoCommonLike;
    readonly to: ToCommonLike;
    readonly fqn: FqnCommonLike;
    readonly system: SystemCommonLike;
    readonly dev: DeveloperCommonLike;
    readonly descriptor: DescriptorCommonLike;
    readonly wrapper: WrapperCommonLike;
    readonly test: TestCommonLike;
    readonly deploy: DeployCommonLike;
    readonly name: NameCommonLike;
    readonly config: ConfigCommonLike;
    readonly mixin: MixinCommonLike;
}
export interface LeyyoSecure extends ShiftMain<LeyyoLike> {
    $earlyRun(fn: Fnc): LeyyoSecure;
    $lazyRun(fn: Fnc): LeyyoSecure;
}
