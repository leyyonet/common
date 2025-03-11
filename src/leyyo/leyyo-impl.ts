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
    SysClassItems,
    SysFunctionItems,
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
        this.fqn.register(null, CommonIsImpl, 'class', FQN_PCK);
        this.fqn.register(null, CommonStorageImpl, 'class', FQN_PCK);
        this.fqn.register(null, CommonHookImpl, 'class', FQN_PCK);
        this.fqn.register(null, CommonFqnImpl, 'class', FQN_PCK);
        this.fqn.register(null, CommonLogImpl, 'class', FQN_PCK);
        this.fqn.register(null, CommonErrorImpl, 'class', FQN_PCK);
        this.fqn.register(null, CommonAssertionImpl, 'class', FQN_PCK);
        this.fqn.register(null, CommonToImpl, 'class', FQN_PCK);

        this.fqn.register(null, List, 'class', FQN_PCK);
        this.fqn.register(null, LoggerImpl, 'class', FQN_PCK);
        this.fqn.register(null, assert, 'function', FQN_PCK);

    }

    private initErrorRegister() {
        [Exception, AssertionException, CausedException, DeveloperException, MultipleException].forEach(cls => {
            this.fqn.register(null, cls, 'class', FQN_PCK);
            this.error.register(cls);
        });
    }

    private initEnumRegister() {
        const enumMap = {
            Primitive:PrimitiveItems,
            StorageType:StorageTypeItems,
            RealValue:RealValueItems,
            KeyValue:KeyValueItems,
            WeakTrue:WeakTrueItems,
            WeakFalse:WeakFalseItems,
            HttpMethod:HttpMethodItems,
            HttpPlace:HttpPlaceItems,
            Severity:SeverityItems,
            Environment:EnvironmentItems,
            CountryCode:CountryCodeItems,
            LanguageCode:LanguageCodeItems,
            LocaleCode:LocaleCodeItems,
            SysClass:SysClassItems,
            SysFunction:SysFunctionItems,
        };
        for (const [name, value] of Object.entries(enumMap)) {
            this.fqn.register(name, value, 'enum', FQN_PCK);
            this.hook.queueForCallback(LY_PENDING_ENUM_REGISTER, value);
        }
    }
}

export const leyyo: Leyyo = new LeyyoImpl();