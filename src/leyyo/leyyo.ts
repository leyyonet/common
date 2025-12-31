import {Fnc, InitLike} from "../shared";
import {FQN} from "../internal";

import {CommonHookLike} from "../hook";
import {LeyyoLike, LeyyoSecure} from "./index.types";
import {CommonIsLike} from "../is";
import {CommonAssertionLike} from "../assertion";
import {CommonErrorLike} from "../error";
import {CommonLogLike} from "../log";
import {CommonRepoLike} from "../repo";
import {CommonToLike} from "../to";
import {CommonFqnLike} from "../fqn";
import {CommonSystemLike} from "../system";
import {CommonDeveloperLike} from "../developer";
import {CommonDescriptorLike} from "../descriptor";
import {CommonWrapperLike} from "../wrapper";
import {CommonTestLike} from "../test";
import {CommonSystem} from "../system/common-system";
import {CommonIs} from "../is/common-is";
import {CommonRepo} from "../repo/common-repo";
import {CommonHook} from "../hook/common-hook";
import {CommonLog} from "../log/common-log";
import {CommonFqn} from "../fqn/common-fqn";
import {CommonDeveloper} from "../developer/common-developer";
import {CommonError} from "../error/common-error";
import {CommonAssertion} from "../assertion/common-assertion";
import {CommonTo} from "../to/common-to";
import {CommonDescriptor} from "../descriptor/common-descriptor";
import {CommonWrapper} from "../wrapper/common-wrapper";
import {CommonTest} from "../test/common-test";
import {CommonDeployLike} from "../deploy";
import {CommonDeploy} from "../deploy/common-deploy";
import {CommonNameLike} from "../name";
import {CommonName} from "../name/common-name";
import {CommonConfigLike} from "../config";
import {CommonConfig} from "../config/common-config";
import {CommonMixinLike} from "../mixin";
import {CommonMixin} from "../mixin/common-mixin";

export class Leyyo implements LeyyoLike, LeyyoSecure {
    private _lazyCallbacks: Array<Fnc> = [];
    private _earlyCallbacks: Array<Fnc> = [];
    readonly hook: CommonHookLike;
    readonly is: CommonIsLike;
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

    constructor() {
        this.system = new CommonSystem(this); // no
        this.is = new CommonIs(this); // no
        this.test = new CommonTest(this); // no
        this.repo = new CommonRepo(this); // none
        this.config = new CommonConfig(this); // is
        this.mixin = new CommonMixin(this); // is
        this.dev = new CommonDeveloper(this); // test
        this.deploy = new CommonDeploy(this); // dev, test
        this.assertion = new CommonAssertion(this); // dev, test
        this.wrapper = new CommonWrapper(this); // assertion, dev
        this.descriptor = new CommonDescriptor(this); // assertion, dev
        this.name = new CommonName(this); // assertion, dev, descriptor
        this.to = new CommonTo(this); // is, dev, wrapper
        this.hook = new CommonHook(this) // repo, assertion, dev, sym
        this.error = new CommonError(this); // hook
        this.log = new CommonLog(this); // hook, test
        this.fqn = new CommonFqn(this); // hook, descriptor, dev

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
