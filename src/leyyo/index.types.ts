import type {ErrorCommonLike} from "../error";
import type {LogCommonLike} from "../log";
import type {RepoCommonLike} from "../repo";
import type {Fnc, ShiftMain, ShiftSecure} from "../shared";
import type {DeployCommonLike} from "../deploy";
import type {NameCommonLike} from "../name";
import type {EventCommonLike} from "../event";
import type {OptCommonLike} from "../opt";

export interface LeyyoLike extends ShiftSecure<LeyyoSecure> {
    readonly error: ErrorCommonLike;
    readonly log: LogCommonLike;
    readonly repo: RepoCommonLike;
    readonly deploy: DeployCommonLike;
    readonly name: NameCommonLike;
    readonly event: EventCommonLike;
    readonly opt: OptCommonLike;
}
export interface LeyyoSecure extends ShiftMain<LeyyoLike> {
    $earlyRun(fn: Fnc): LeyyoSecure;
    $lazyRun(fn: Fnc): LeyyoSecure;
}
