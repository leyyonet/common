import {
    DeployCommon,
    DeployCommonLike,
    EnumPool,
    EnumPoolLike,
    ErrorCommon,
    ErrorCommonLike,
    ErrorPool,
    ErrorPoolLike,
    EventCommon,
    EventCommonLike,
    EventType,
    LifecycleCommon,
    LifecycleCommonLike,
    LiteralPool,
    LiteralPoolLike,
    LogCommon,
    LogCommonLike,
    Logger,
    RepoCommon,
    RepoCommonLike
} from "../common/index.js";
import {DeveloperError, DeveloperErrorCtor, LeyyoError, LeyyoErrorCtor} from "../error/index.js";
import {LoggerInstanceCtor} from "../class/index.js";
import {LoggerInstance} from "../class/logger.instance.js";
import {KEY_SECURE_1} from "../const/index.js";
import {$$set_leyyo_fn} from "../function/leyyo-fn.js";
import {LeyyoLike} from "./leyyo.types.js";

class Leyyo implements LeyyoLike {
    private readonly _developerError: DeveloperErrorCtor;
    private readonly _leyyoError: LeyyoErrorCtor;
    private readonly _loggerInstance: LoggerInstanceCtor;

    private readonly _repoCommon: RepoCommonLike;
    private readonly _deployCommon: DeployCommonLike;
    private readonly _enumPool: EnumPoolLike;
    private readonly _errorCommon: ErrorCommonLike;
    private readonly _errorPool: ErrorPoolLike;
    private readonly _eventCommon: EventCommonLike<EventType>;
    private readonly _lifecycleCommon: LifecycleCommonLike;
    private readonly _literalPool: LiteralPoolLike;
    private readonly _logCommon: LogCommonLike;

    private readonly _logger: Logger;

    constructor() {
        // region binding
        $$set_leyyo_fn(this);

        this._developerError = DeveloperError;
        this._developerError[KEY_SECURE_1](this);

        this._leyyoError = LeyyoError;
        this._leyyoError[KEY_SECURE_1](this);

        this._loggerInstance = LoggerInstance;
        this._loggerInstance[KEY_SECURE_1](this);
        // endregion binding

        // region instances
        this._repoCommon = new RepoCommon(this); // none
        this._errorCommon = new ErrorCommon(this); // none
        this._logCommon = new LogCommon(this); // repo
        this._eventCommon = new EventCommon(this); // repo
        this._deployCommon = new DeployCommon(this); // repo
        this._lifecycleCommon = new LifecycleCommon(this); // repo
        this._enumPool = new EnumPool(this); // complex
        this._errorPool = new ErrorPool(this);
        this._literalPool = new LiteralPool(this);
        // endregion instances

        // region instance-ops
        this._logger = this._logCommon.of(Leyyo);
        // endregion instance-ops

        // region final
        this._startToConsume();
        // endregion final
    }

    private _startToConsume(): void {
        this.logCommon.initConsume();
    }

    get developerError(): DeveloperErrorCtor {
        return this._developerError;
    }

    get leyyoError(): LeyyoErrorCtor {
        return this._leyyoError;
    }

    get loggerInstance(): LoggerInstanceCtor {
        return this._loggerInstance;
    }

    get repoCommon(): RepoCommonLike {
        return this._repoCommon;
    }

    get deployCommon(): DeployCommonLike {
        return this._deployCommon;
    }

    get enumPool(): EnumPoolLike {
        return this._enumPool;
    }

    get errorCommon(): ErrorCommonLike {
        return this._errorCommon;
    }

    get errorPool(): ErrorPoolLike {
        return this._errorPool;
    }

    get eventCommon(): EventCommonLike<EventType> {
        return this._eventCommon;
    }

    get lifecycleCommon(): LifecycleCommonLike {
        return this._lifecycleCommon;
    }

    get literalPool(): LiteralPoolLike {
        return this._literalPool;
    }

    get logCommon(): LogCommonLike {
        return this._logCommon;
    }

    get logger(): Logger {
        return this._logger;
    }
}

/**
 * Leyyo common instance
 * */
export const leyyo: LeyyoLike = new Leyyo();
