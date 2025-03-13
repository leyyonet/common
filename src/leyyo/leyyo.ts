import {CommonHook, CommonHookLike} from "../hook";
import {LeyyoLike} from "./index-types";
import {CommonIs, CommonIsLike} from "../is";
import {CommonAssertion, CommonAssertionLike} from "../assertion";
import {CommonError, CommonErrorLike} from "../error";
import {CommonLog, CommonLogLike, LoggerInstance} from "../log";
import {CommonStorage, CommonStorageLike} from "../storage";
import {CommonTo, CommonToLike} from "../to";
import {$$setLeyyo, assert, List, LY_PENDING_ENUM_REGISTER} from "../shared";
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
import {CommonFqn, CommonFqnLike} from "../fqn";
import {CommonSystem, CommonSystemLike} from "../system";

export class Leyyo implements LeyyoLike {
    readonly hook: CommonHookLike;
    readonly is: CommonIsLike;
    readonly assertion: CommonAssertionLike;
    readonly error: CommonErrorLike;
    readonly log: CommonLogLike;
    readonly storage: CommonStorageLike;
    readonly to: CommonToLike;
    readonly fqn: CommonFqnLike;
    readonly system: CommonSystemLike;

    constructor() {
        this.system = new CommonSystem();
        this.is = new CommonIs();
        this.storage = new CommonStorage();
        this.hook = new CommonHook() // storage
        this.log = new CommonLog(); // hook
        this.fqn = new CommonFqn(); // hook
        this.error = new CommonError(); // hook
        this.assertion = new CommonAssertion(); // is, hook
        this.to = new CommonTo(); // is, hook, assertion


        this.init();
        this.postInit();
        this.initFqnRegister();
        this.initErrorRegister();
        this.initEnumRegister();
    }

    private init() {
        this.system.$secure.$init(this);
        this.is.$secure.$init(this);
        this.storage.$secure.$init(this);
        this.hook.$secure.$init(this);
        this.fqn.$secure.$init(this);
        this.log.$secure.$init(this);
        this.error.$secure.$init(this);
        this.assertion.$secure.$init(this);
        this.to.$secure.$init(this);
    }

    private postInit() {
        $$setLeyyo(this);
        LoggerInstance.$setLeyyo(this);
        Exception.$setLeyyo(this);
    }

    private initFqnRegister() {
        this.fqn.register(null, CommonSystem, 'class', FQN_PCK);
        this.fqn.register(null, CommonIs, 'class', FQN_PCK);
        this.fqn.register(null, CommonStorage, 'class', FQN_PCK);
        this.fqn.register(null, CommonHook, 'class', FQN_PCK);
        this.fqn.register(null, CommonFqn, 'class', FQN_PCK);
        this.fqn.register(null, CommonLog, 'class', FQN_PCK);
        this.fqn.register(null, CommonError, 'class', FQN_PCK);
        this.fqn.register(null, CommonAssertion, 'class', FQN_PCK);
        this.fqn.register(null, CommonTo, 'class', FQN_PCK);

        this.fqn.register(null, List, 'class', FQN_PCK);
        this.fqn.register(null, LoggerInstance, 'class', FQN_PCK);
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
            Primitive: PrimitiveItems,
            StorageType: StorageTypeItems,
            RealValue: RealValueItems,
            KeyValue: KeyValueItems,
            WeakTrue: WeakTrueItems,
            WeakFalse: WeakFalseItems,
            HttpMethod: HttpMethodItems,
            HttpPlace: HttpPlaceItems,
            Severity: SeverityItems,
            Environment: EnvironmentItems,
            CountryCode: CountryCodeItems,
            LanguageCode: LanguageCodeItems,
            LocaleCode: LocaleCodeItems,
            SysClass: SysClassItems,
            SysFunction: SysFunctionItems,
        };
        for (const [name, value] of Object.entries(enumMap)) {
            this.fqn.register(name, value, 'enum', FQN_PCK);
            this.hook.queueForCallback(LY_PENDING_ENUM_REGISTER, value);
        }
    }
}

export const leyyo: LeyyoLike = new Leyyo();