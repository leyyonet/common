import {Func, InitLike} from "../shared";
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

export class Leyyo implements LeyyoLike, LeyyoSecure {
    private _lazyCallbacks: Array<Func> = [];
    private _earlyCallbacks: Array<Func> = [];
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

    constructor() {
        this.system = new CommonSystem();
        this.is = new CommonIs();
        this.repo = new CommonRepo();
        this.hook = new CommonHook() // repo
        this.log = new CommonLog(); // hook
        this.fqn = new CommonFqn(); // hook
        this.dev = new CommonDeveloper();
        this.error = new CommonError(); // hook
        this.assertion = new CommonAssertion(); // is, hook
        this.to = new CommonTo(); // is, hook, assertion
        this.descriptor = new CommonDescriptor();
        this.wrapper = new CommonWrapper();
        this.test = new CommonTest();
        this.deploy = new CommonDeploy();
        this.name = new CommonName();

        const members = [
            this.system.$secure,
            this.is.$secure,
            this.repo.$secure,
            this.hook.$secure,
            this.fqn.$secure,
            this.dev.$secure,
            this.log.$secure,
            this.error.$secure,
            this.assertion.$secure,
            this.to.$secure,
            this.descriptor.$secure,
            this.wrapper.$secure,
            this.test.$secure,
            this.deploy.$secure,
            this.name.$secure,
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

    $earlyRun(fn: Func): LeyyoSecure {
        this._earlyCallbacks.push(fn);
        return this;
    }

    $lazyRun(fn: Func): LeyyoSecure {
        this._lazyCallbacks.push(fn);
        return this;
    }

    // endregion secure
}
