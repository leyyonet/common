import {
  DeployCommon,
  EnumPool,
  ErrorCommon,
  ErrorPool,
  EventCommon,
  LifecycleCommon,
  LiteralPool,
  LogCommon,
  RepoCommon,
  SignalCommon,
} from "../common/index.js";
import { DeveloperError, LeyyoError } from "../error/index.js";
import { LoggerInstance } from "./logger.instance.js";
import { KEY_LEYYO_SECURE } from "../const.js";
import { $$_set_leyyo_fn } from "../function/internal.js";
import {
  DeployCommonLike,
  DeveloperErrorCtor,
  EnumPoolLike,
  ErrorCommonLike,
  ErrorPoolLike,
  EventCommonLike,
  EventType,
  LazyDefinerCtor,
  LeyyoErrorCtor,
  LeyyoLike,
  LifecycleCommonLike,
  LiteralPoolLike,
  LogCommonLike,
  Logger,
  LoggerInstanceCtor,
  PredictorDefinerCtor,
  RepoCommonLike,
  SignalCommonLike,
} from "../type.js";
import { PredictorInstance } from "./predictor.instance.js";
import { LazyInstance } from "./lazy.instance.js";

class Leyyo implements LeyyoLike {
  // region property
  private readonly _developerError: DeveloperErrorCtor;
  private readonly _leyyoError: LeyyoErrorCtor;
  private readonly _loggerInstance: LoggerInstanceCtor;
  private readonly _predictorDefiner: PredictorDefinerCtor;
  private readonly _lazyDefiner: LazyDefinerCtor;

  private readonly _repoCommon: RepoCommonLike;
  private readonly _deployCommon: DeployCommonLike;
  private readonly _enumPool: EnumPoolLike;
  private readonly _errorCommon: ErrorCommonLike;
  private readonly _signalCommon: SignalCommonLike;
  private readonly _errorPool: ErrorPoolLike;
  private readonly _eventCommon: EventCommonLike<EventType>;
  private readonly _lifecycleCommon: LifecycleCommonLike;
  private readonly _literalPool: LiteralPoolLike;
  private readonly _logCommon: LogCommonLike;

  private readonly _logger: Logger;
  // endregion property

  constructor() {
    // region binding
    $$_set_leyyo_fn(this);

    this._developerError = DeveloperError;
    this._developerError[KEY_LEYYO_SECURE](this);

    this._leyyoError = LeyyoError;
    this._leyyoError[KEY_LEYYO_SECURE](this);

    this._loggerInstance = LoggerInstance;
    this._loggerInstance[KEY_LEYYO_SECURE](this);

    this._predictorDefiner = PredictorInstance;
    this._predictorDefiner[KEY_LEYYO_SECURE](this);

    this._lazyDefiner = LazyInstance;
    this._lazyDefiner[KEY_LEYYO_SECURE](this);
    // endregion binding

    // region instances
    this._repoCommon = new RepoCommon(this); // none
    this._errorCommon = new ErrorCommon(this); // none
    this._signalCommon = new SignalCommon(this); // repo
    this._logCommon = new LogCommon(this); // repo
    this._eventCommon = new EventCommon(this); // repo
    this._deployCommon = new DeployCommon(this); // repo
    this._lifecycleCommon = new LifecycleCommon(this); // repo
    this._enumPool = new EnumPool(this); // complex
    this._errorPool = new ErrorPool(this);
    this._literalPool = new LiteralPool(this);
    // endregion instances

    // region final
    this._startToConsume();
    // endregion final

    // region instance-ops
    this._logger = this._logCommon.of(Leyyo);
    // endregion instance-ops
  }

  // region private
  private _startToConsume(): void {
    this.logCommon.initConsume();
  }
  // endregion private

  // region classes
  /** @inheritDoc */
  get developerError(): DeveloperErrorCtor {
    return this._developerError;
  }

  /** @inheritDoc */
  get leyyoError(): LeyyoErrorCtor {
    return this._leyyoError;
  }

  /** @inheritDoc */
  get loggerInstance(): LoggerInstanceCtor {
    return this._loggerInstance;
  }

  /** @inheritDoc */
  get predictorDefiner(): PredictorDefinerCtor {
    return this._predictorDefiner;
  }

  /** @inheritDoc */
  get lazyDefiner(): LazyDefinerCtor {
    return this._lazyDefiner;
  }

  // endregion classes

  // region instances

  /** @inheritDoc */
  get logger(): Logger {
    return this._logger;
  }

  /** @inheritDoc */
  get deployCommon(): DeployCommonLike {
    return this._deployCommon;
  }

  /** @inheritDoc */
  get enumPool(): EnumPoolLike {
    return this._enumPool;
  }

  /** @inheritDoc */
  get errorCommon(): ErrorCommonLike {
    return this._errorCommon;
  }

  /** @inheritDoc */
  get errorPool(): ErrorPoolLike {
    return this._errorPool;
  }

  /** @inheritDoc */
  get eventCommon(): EventCommonLike<EventType> {
    return this._eventCommon;
  }

  /** @inheritDoc */
  get lifecycleCommon(): LifecycleCommonLike {
    return this._lifecycleCommon;
  }

  /** @inheritDoc */
  get literalPool(): LiteralPoolLike {
    return this._literalPool;
  }

  /** @inheritDoc */
  get logCommon(): LogCommonLike {
    return this._logCommon;
  }

  /** @inheritDoc */
  get repoCommon(): RepoCommonLike {
    return this._repoCommon;
  }

  get signalCommon(): SignalCommonLike {
    return this._signalCommon;
  }
  // endregion instances
}

/**
 * Leyyo common instance
 * */
export const leyyo: LeyyoLike = new Leyyo();
