import {CommonHook, CommonHookImpl} from "../hook";
import {Leyyo} from "./index-types";
import {CommonIs, CommonIsImpl} from "../is";
import {CommonAssertion, CommonAssertionImpl} from "../assertion";
import {CommonError, CommonErrorImpl} from "../error";
import {CommonLog, CommonLogImpl, LoggerImpl} from "../log";
import {CommonStorage, CommonStorageImpl} from "../storage";
import {CommonTo, CommonToImpl} from "../to";
import {$$setLeyyo, List, LY_PENDING_ENUM_REGISTER} from "../shared";
import {FQN_PCK} from "../internal";
import {
    CountryCodeItems,
    EnvironmentItems,
    HttpMethodItems,
    HttpPlaceItems,
    KeyValueItems,
    LanguageCodeItems,
    LocaleCodeItems,
    PrimitiveItems,
    RealValueItems,
    SeverityItems,
    StorageTypeItems,
    WeakFalseItems,
    WeakTrueItems
} from "../literal";
import {AssertionException, CausedException, DeveloperException, Exception, MultipleException} from "../exception";
import assert from "node:assert";
import {CommonFqn, CommonFqnImpl} from "../fqn";

export class LeyyoImpl implements Leyyo {
    readonly hook: CommonHook;
    readonly is: CommonIs;
    readonly assertion: CommonAssertion;
    readonly error: CommonError;
    readonly log: CommonLog;
    readonly storage: CommonStorage;
    readonly to: CommonTo;
    readonly fqn: CommonFqn;

    constructor() {
        this.is = new CommonIsImpl();
        this.storage = new CommonStorageImpl();
        this.hook = new CommonHookImpl() // storage
        this.log = new CommonLogImpl(); // hook
        this.error = new CommonErrorImpl(); // hook
        this.assertion = new CommonAssertionImpl(); // is, hook
        this.to = new CommonToImpl(); // is, hook, assertion
        this.fqn = new CommonFqnImpl(); // hook

        this.init();
        this.postInit();
        this.initFqnRegister();
        this.initErrorRegister();
        this.initEnumRegister();
    }

    private init() {
        this.is.$secure.$init(this);
        this.storage.$secure.$init(this);
        this.hook.$secure.$init(this);
        this.log.$secure.$init(this);
        this.error.$secure.$init(this);
        this.assertion.$secure.$init(this);
        this.to.$secure.$init(this);
    }

    private postInit() {
        $$setLeyyo(this);
        LoggerImpl.$setLeyyo(this);
        Exception.$setLeyyo(this);
    }

    private initFqnRegister() {
        this.fqn.register(CommonIsImpl, 'class', FQN_PCK);
        this.fqn.register(CommonStorageImpl, 'class', FQN_PCK);
        this.fqn.register(CommonHookImpl, 'class', FQN_PCK);
        this.fqn.register(CommonFqnImpl, 'class', FQN_PCK);
        this.fqn.register(CommonLogImpl, 'class', FQN_PCK);
        this.fqn.register(CommonErrorImpl, 'class', FQN_PCK);
        this.fqn.register(CommonAssertionImpl, 'class', FQN_PCK);
        this.fqn.register(CommonToImpl, 'class', FQN_PCK);

        this.fqn.register(List, 'class', FQN_PCK);
        this.fqn.register(LoggerImpl, 'class', FQN_PCK);
        this.fqn.register(assert, 'function', FQN_PCK);

    }

    private initErrorRegister() {
        [Exception, AssertionException, CausedException, DeveloperException, MultipleException].forEach(cls => {
            this.fqn.register(cls, 'class', FQN_PCK);
            this.error.register(cls);
        });
    }

    private initEnumRegister() {
        [PrimitiveItems, StorageTypeItems, RealValueItems, KeyValueItems, WeakTrueItems, WeakFalseItems,
            HttpMethodItems, HttpPlaceItems, SeverityItems, EnvironmentItems,
            CountryCodeItems, LanguageCodeItems, LocaleCodeItems].forEach(enm => {
            this.fqn.register(enm, 'enum', FQN_PCK);
            this.hook.queueForCallback(LY_PENDING_ENUM_REGISTER, enm);
        })


    }
}

export const leyyo: Leyyo = new LeyyoImpl();