import {FQN} from "../internal";
import {RepoCommon} from "../repo/repo.common";
import {LogCommon} from "../log/log.common";
import {ErrorCommon} from "../error/error.common";
import {DeployCommon} from "../deploy/deploy.common";
import {NameCommon} from "../name/name.common";
import {EventCommon} from "../event/event.common";
import {OptCommon} from "../opt/opt.common";
import type {Fnc, InitLike} from "../shared";
import type {DeployCommonLike} from "../deploy";
import type {NameCommonLike} from "../name";
import type {LeyyoLike, LeyyoSecure} from "./index.types";
import type {ErrorCommonLike} from "../error";
import type {LogCommonLike} from "../log";
import type {RepoCommonLike} from "../repo";
import type {EventCommonLike} from "../event";

export class Leyyo implements LeyyoLike, LeyyoSecure {
    private _lazyCallbacks: Array<Fnc> = [];
    private _earlyCallbacks: Array<Fnc> = [];
    readonly error: ErrorCommonLike;
    readonly log: LogCommonLike;
    readonly repo: RepoCommonLike;
    readonly deploy: DeployCommonLike;
    readonly name: NameCommonLike;
    readonly event: EventCommonLike;
    readonly opt: OptCommon;

    constructor() {
        this.repo = new RepoCommon(this); // none
        this.deploy = new DeployCommon(this); // dev, test
        this.name = new NameCommon(this); // dev
        this.error = new ErrorCommon(this); //
        this.log = new LogCommon(this); // test
        this.event = new EventCommon(this); // repo, assertion
        this.opt = new OptCommon(this);

        const members = [
            this.repo.$secure,
            this.deploy.$secure,
            this.name.$secure,
            this.error.$secure,
            this.log.$secure,
            this.event.$secure,
            this.opt.$secure,
        ] as Array<InitLike>;

        members.forEach(member => member.$init(this));
        this.$lazyRun(() => {
            this.event.emit('ly:fqn:register', 'class', FQN, Leyyo);
        })
        this._earlyCallbacks.forEach(fn => fn());
        this._lazyCallbacks.forEach(fn => fn());
        members.forEach(member => {
            delete member.$init;
        });

        ['$secure', '$back', '$earlyRun', '$lazyRun', '_lazyCallbacks', '_earlyCallbacks'].forEach(field => {
            delete this[field];
        })
    }

    // region secure

    get $secure(): LeyyoSecure {
        return this;
    }

    get $back(): LeyyoLike {
        return this;
    }

    $earlyRun(fn: Fnc): LeyyoSecure {
        this._earlyCallbacks.push(fn);
        return this;
    }

    $lazyRun(fn: Fnc): LeyyoSecure {
        this._lazyCallbacks.push(fn);
        return this;
    }

    // endregion secure
}
