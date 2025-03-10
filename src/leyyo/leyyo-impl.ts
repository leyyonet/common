import {CommonCallback, CommonCallbackImpl} from "../callback";
import {Leyyo} from "./index-types";
import {CommonIs, CommonIsImpl} from "../is";
import {$$setLeyyo, assert, CommonAssertion, CommonAssertionImpl} from "../assertion";
import {
    AssertionException,
    CausedException,
    CommonError,
    CommonErrorImpl,
    DeveloperException,
    Exception,
    MultipleException
} from "../error";
import {CommonLog, CommonLogImpl, LoggerImpl} from "../log";
import {CommonStorage, CommonStorageImpl, List} from "../storage";
import {CommonTo, CommonToImpl} from "../to";
import {LY_PENDING_ENUM_REGISTER, LY_PENDING_ERROR_REGISTER, LY_PENDING_FQN_REGISTER} from "../constants";
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
} from "../literals";

export class LeyyoImpl implements Leyyo {
    readonly callback: CommonCallback;
    readonly is: CommonIs;
    readonly assertion: CommonAssertion;
    readonly error: CommonError;
    readonly log: CommonLog;
    readonly storage: CommonStorage;
    readonly to: CommonTo;

    constructor() {
        this.is = new CommonIsImpl();
        this.storage = new CommonStorageImpl();
        this.callback = new CommonCallbackImpl() // storage
        this.log = new CommonLogImpl(); // callback
        this.error = new CommonErrorImpl(); // callback
        this.assertion = new CommonAssertionImpl(); // is, callback
        this.to = new CommonToImpl(); // is, callback, assertion

        this.init();
        this.postInit();
        this.initFqnRegister();
        this.initErrorRegister();
        this.initEnumRegister();
    }

    private init() {
        this.is.$secure.$init(this);
        this.storage.$secure.$init(this);
        this.callback.$secure.$init(this);
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
        this.callback.queueForCallback(LY_PENDING_FQN_REGISTER, CommonIsImpl, 'class', FQN_PCK);
        this.callback.queueForCallback(LY_PENDING_FQN_REGISTER, CommonStorageImpl, 'class', FQN_PCK);
        this.callback.queueForCallback(LY_PENDING_FQN_REGISTER, CommonCallbackImpl, 'class', FQN_PCK);
        this.callback.queueForCallback(LY_PENDING_FQN_REGISTER, CommonLogImpl, 'class', FQN_PCK);
        this.callback.queueForCallback(LY_PENDING_FQN_REGISTER, CommonErrorImpl, 'class', FQN_PCK);
        this.callback.queueForCallback(LY_PENDING_FQN_REGISTER, CommonAssertionImpl, 'class', FQN_PCK);
        this.callback.queueForCallback(LY_PENDING_FQN_REGISTER, CommonToImpl, 'class', FQN_PCK);

        this.callback.queueForCallback(LY_PENDING_FQN_REGISTER, List, 'class', FQN_PCK);
        this.callback.queueForCallback(LY_PENDING_FQN_REGISTER, LoggerImpl, 'class', FQN_PCK);
        this.callback.queueForCallback(LY_PENDING_FQN_REGISTER, assert, 'function', FQN_PCK);

    }

    private initErrorRegister() {
        [Exception, AssertionException, CausedException, DeveloperException, MultipleException].forEach(cls => {
            this.callback.queueForCallback(LY_PENDING_FQN_REGISTER, cls, 'class', FQN_PCK);
            this.callback.queueForCallback(LY_PENDING_ERROR_REGISTER, cls);
        });
    }

    private initEnumRegister() {
        [PrimitiveItems, StorageTypeItems, RealValueItems, KeyValueItems, WeakTrueItems, WeakFalseItems,
            HttpMethodItems, HttpPlaceItems, SeverityItems, EnvironmentItems,
            CountryCodeItems, LanguageCodeItems, LocaleCodeItems].forEach(enm => {
            this.callback.queueForCallback(LY_PENDING_FQN_REGISTER, enm, 'enum', FQN_PCK);
            this.callback.queueForCallback(LY_PENDING_ENUM_REGISTER, enm);
        })


    }
}

export const leyyo: Leyyo = new LeyyoImpl();