import type {Fnc, InitLike} from "../shared";
import {FQN} from "../internal";
import {SystemCommon} from "../system/system.common";
import {IsCommon} from "../is/is.common";
import {RepoCommon} from "../repo/repo.common";
import {HookCommon} from "../hook/hook.common";
import {LogCommon} from "../log/log.common";
import {FqnCommon} from "../fqn/fqn.common";
import {DeveloperCommon} from "../developer/developer.common";
import {ErrorCommon} from "../error/error.common";
import {AssertionCommon} from "../assertion/assertion.common";
import {ToCommon} from "../to/to.common";
import {DescriptorCommon} from "../descriptor/descriptor.common";
import {WrapperCommon} from "../wrapper/wrapper.common";
import {TestCommon} from "../test/test.common";
import {DeployCommon} from "../deploy/deploy.common";
import {NameCommon} from "../name/name.common";
import {ConfigCommon} from "../config/config.common";
import {MixinCommon} from "../mixin/mixin.common";

import type {ConfigCommonLike} from "../config";
import type {DeployCommonLike} from "../deploy";
import type {MixinCommonLike} from "../mixin";
import type {NameCommonLike} from "../name";
import type {HookCommonLike} from "../hook";
import type {LeyyoLike, LeyyoSecure} from "./index.types";
import type {IsCommonLike} from "../is";
import type {AssertionCommonLike} from "../assertion";
import type {ErrorCommonLike} from "../error";
import type {LogCommonLike} from "../log";
import type {RepoCommonLike} from "../repo";
import type {ToCommonLike} from "../to";
import type {FqnCommonLike} from "../fqn";
import type {SystemCommonLike} from "../system";
import type {DeveloperCommonLike} from "../developer";
import type {DescriptorCommonLike} from "../descriptor";
import type {WrapperCommonLike} from "../wrapper";
import type {TestCommonLike} from "../test";

export class Leyyo implements LeyyoLike, LeyyoSecure {
    private _lazyCallbacks: Array<Fnc> = [];
    private _earlyCallbacks: Array<Fnc> = [];
    readonly hook: HookCommonLike;
    readonly is: IsCommonLike;
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

    constructor() {
        this.system = new SystemCommon(this); // no
        this.is = new IsCommon(this); // no
        this.test = new TestCommon(this); // no
        this.repo = new RepoCommon(this); // none
        this.config = new ConfigCommon(this); // is
        this.mixin = new MixinCommon(this); // is
        this.dev = new DeveloperCommon(this); // test
        this.deploy = new DeployCommon(this); // dev, test
        this.assertion = new AssertionCommon(this); // dev, test
        this.wrapper = new WrapperCommon(this); // assertion, dev
        this.descriptor = new DescriptorCommon(this); // assertion, dev
        this.name = new NameCommon(this); // assertion, dev, descriptor
        this.to = new ToCommon(this); // is, dev, wrapper
        this.hook = new HookCommon(this) // repo, assertion, dev, sym
        this.error = new ErrorCommon(this); // hook
        this.log = new LogCommon(this); // hook, test
        this.fqn = new FqnCommon(this); // hook, descriptor, dev

        const members = [
            this.system.$secure,
            this.is.$secure,
            this.test.$secure,
            this.repo.$secure,
            this.config.$secure,
            this.mixin.$secure,
            this.dev.$secure,
            this.deploy.$secure,
            this.assertion.$secure,
            this.wrapper.$secure,
            this.descriptor.$secure,
            this.name.$secure,
            this.to.$secure,
            this.hook.$secure,
            this.error.$secure,
            this.log.$secure,
            this.fqn.$secure,
        ] as Array<InitLike>;

        members.forEach(member => member.$init(this));
        this.$lazyRun(() => {
            this.fqn.register(null, Leyyo, 'class', FQN);
        })
        this._earlyCallbacks.forEach(fn => fn());
        this._lazyCallbacks.forEach(fn => fn());
        members.forEach(member => {
            this.descriptor.remove(member, '$init');
        });

        ['$secure', '$back', '$earlyRun', '$lazyRun', '_lazyCallbacks', '_earlyCallbacks'].forEach(field => {
            this.descriptor.remove(this, field);
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
