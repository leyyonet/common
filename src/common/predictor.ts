import { PCK } from "../internal.js";
import {
  Fnc,
  FqnTarget,
  LeyyoLike,
  PredictorBuildOpt,
  PredictorItem,
  PredictorLike,
  PredictorOpt,
  PredictorRepo,
} from "../type.js";
import {
  getFqn,
  isFilledArr,
  isFilledObj,
  isObj,
  isText,
  onFqnSet,
  setAnonymousName,
  setFqn,
  testCase,
} from "../function/index.js";

const where = `${PCK}.Predictor`;

// noinspection JSUnusedGlobalSymbols
export abstract class Predictor<
  L extends PredictorItem<T>,
  T,
  O extends PredictorOpt<T>,
> implements PredictorLike<L, T, O> {
  private readonly _repo: PredictorRepo<L, T>;
  private static _pool: Map<
    string,
    Predictor<PredictorItem<unknown>, unknown, PredictorOpt<unknown>>
  >;

  /**
   * Constructor
   *
   * @param {LeyyoLike} leyyo
   * @param {string} cluster
   * @param {PredictorBuildOpt} options
   * */
  protected constructor(
    protected leyyo: LeyyoLike,
    protected cluster: string,
    protected options: PredictorBuildOpt,
  ) {
    if (!isText(this.cluster)) {
      throw new this.leyyo.developerError(
        "Invalid cluster name",
        testCase(PCK, "predictor", "invalid-cluster"),
        where,
      );
    }
    if (isObj(this.options)) {
      this.options = {};
    }
    if (this.options.anonymousName && !isText(this.options.anonymousName)) {
      throw new this.leyyo.developerError(
        "Invalid anonymous name",
        testCase(PCK, "predictor", "invalid-anonymous-name"),
        where,
      );
    }

    const repo = this.leyyo.repoCommon;
    if (!Predictor._pool) {
      Predictor._pool = repo.newMap<
        string,
        Predictor<PredictorItem<unknown>, unknown, PredictorOpt<unknown>>
      >(`${where}.pool`);
    }

    if (Predictor._pool.has(this.cluster)) {
      new this.leyyo.developerError(
        `Duplicated cluster [${this.cluster}]`,
        testCase(PCK, "predictor", "duplicated-cluster"),
        where,
      ).log();
      this._repo = Predictor._pool.get(this.cluster)._repo as PredictorRepo<L, T>;
    } else {
      this._repo = {
        targets: repo.newMap<T, L>(`${where}.${this.cluster}.targets`),
        fullNames: repo.newMap<string, L>(`${where}.${this.cluster}.fullNames`),
        basicNames: repo.newMap<string, L>(`${where}.${this.cluster}.basicNames`),
        aliases: repo.newMap<string, string>(`${where}.${this.cluster}.aliases`),
        pendingFqn: repo.newMap<string, L>(`${where}.${this.cluster}.pendingFqn`),
        pendingLazy: repo.newMap<string, L>(`${where}.${this.cluster}.pendingLazy`),
      };
      Predictor._pool.set(
        this.cluster,
        this._repo as unknown as Predictor<PredictorItem<unknown>, unknown, PredictorOpt<unknown>>,
      );
    }
  }

  // region private
  protected _inFqnStage(item: L): boolean {
    item.full = getFqn(item.target as FqnTarget);
    if (!item.full || !item.full.includes(".")) {
      if (isText(item.pck)) {
        item.full = setFqn(item.target as FqnTarget, item.pck);
      } else {
        const { pendingFqn } = this._repo;
        pendingFqn.set(item.name, item);
        item.stage = "fqn-waiting";
        onFqnSet(item.target as FqnTarget, (f) => this._afterFqnSet(f));
        this._afterTargetFound(item);
        return true;
      }
    }
    return false;
  }

  protected _afterFqnSet(full: string): void {
    if (!isText(full)) {
      return;
    }
    const { pendingFqn } = this._repo;
    const item = pendingFqn.get(full.split(".").pop());
    if (item) {
      pendingFqn.delete(item.name);
      item.full = full;
      item.stage = "persistent";
      this._onFqnCompleted(item);
    } else {
      new this.leyyo.developerError(
        `Predictor could not be found after come back, [${full}]`,
        testCase(PCK, "predictor", "not-found-item"),
        where,
      ).log();
    }
  }

  protected _onFqnCompleted(item: L): void {
    let ignore: boolean;
    const { fullNames, basicNames, aliases } = this._repo;
    if (isText(item.full)) {
      ignore = false;
      if (fullNames.has(item.full)) {
        const anotherItem = fullNames.get(item.full);
        if (anotherItem.target !== item.target) {
          ignore = true;
          new this.leyyo.developerError(
            `Duplicated full name [${item.full}]`,
            testCase(PCK, "predictor", "duplicated-full-name"),
            where,
          ).log();
        }
      }
      if (!ignore) {
        fullNames.set(item.full, item);
      }
    }

    ignore = false;
    if (basicNames.has(item.name)) {
      const anotherItem = basicNames.get(item.name);
      if (anotherItem.target !== item.target) {
        ignore = true;
        new this.leyyo.developerError(
          `Duplicated basic name [${item.name}]`,
          testCase(PCK, "predictor", "duplicated-basic-name"),
          where,
        ).log();
      }
    }
    if (!ignore) {
      basicNames.set(item.name, item);
    }

    if (isFilledArr(item.aliases)) {
      item.aliases.forEach((alias) => {
        ignore = false;
        if (aliases.has(alias)) {
          const anotherName = aliases.get(alias);
          if (![item.name, item.full].includes(anotherName)) {
            ignore = true;
            new this.leyyo.developerError(
              `Duplicated alias [${item.name}]`,
              testCase(PCK, "predictor", "duplicated-alias"),
              where,
            ).log();
          }
        }
        if (!ignore) {
          aliases.set(alias, item.full ?? item.name);
        }
      });
    }
  }

  private async _load(item: L): Promise<void> {
    // It was already loaded
    if (item.mode === "eager") {
      return;
    }
    const { pendingLazy, targets } = this._repo;
    try {
      item.target = await item.lazyTarget;
      if (this._validate(item.target)) {
        item.mode = "eager";
        delete item.lazyTarget;
        item = { ...this._buildOpt(item.target), ...item };

        // remove from pending
        if (pendingLazy.has(item.name)) {
          pendingLazy.delete(item.name);
        }
        await this._nextLoad(item);
        // already loaded
        if (targets.has(item.target)) {
          return;
        }
        this.leyyo.logger.debug(`# [Predictor] ${this.cluster} loaded, ${item.name}`);
      } else {
        item.mode = "conflicted";
      }
    } catch (e) {
      item.mode = "failed";
      new this.leyyo.developerError(
        `Callback predictor during loading lazy target [${item.name}]`,
        testCase(PCK, "predictor", "load-target-error"),
        where,
      ).log(e);
      return;
    }

    // file could not be loaded
    if (!item.target) {
      new this.leyyo.developerError(
        `Target not found [${item.name}]`,
        testCase(PCK, "predictor", "not-found-target"),
        where,
      ).log();
      return;
    }

    let realName = this._getName(item.target);
    if (item.name !== realName) {
      if (!realName) {
        realName = this._setName(item.target, item.name);
      }
      if (!realName) {
        new this.leyyo.developerError(
          `Conflict in names [${item.name} vs ${realName}]`,
          testCase(PCK, "predictor", "conflicted-name"),
          where,
        ).log();
      }
    }

    if (this._inFqnStage(item)) {
      return;
    }
    item.stage = "persistent";
    this._onFqnCompleted(item);
    this._afterTargetFound(item);
  }

  // endregion private

  /** @inheritDoc */
  register(options: PredictorOpt<T>): L {
    const { targets } = this._repo;
    if (!isFilledObj(options)) {
      throw new this.leyyo.developerError(
        "Invalid predictor options",
        testCase(PCK, "predictor", "invalid-options"),
        where,
      );
    }
    let item: L;

    // target
    if (this._validate(options.target)) {
      if (options.lazyTarget) {
        delete options.lazyTarget;
      }
      // already defined
      if (targets.has(options.target)) {
        return targets.get(options.target);
      }
      options = { ...this._buildOpt(options.target), ...options };
      let basicName = this._getName(options.target);
      if (!basicName) {
        if (isText(options.name)) {
          basicName = options.name;
          this._setName(options.target, options.name);
        } else if (this.options.anonymousName) {
          basicName = setAnonymousName(options.target as Fnc, this.options.anonymousName);
        }
      }
      if (!basicName) {
        throw new this.leyyo.developerError(
          "Empty name",
          testCase(PCK, "predictor", "invalid-basic-name"),
          where,
        );
      }
      item = { ...options, name: basicName, stage: undefined, mode: "eager" } as L;
      item.load = async () => this._load(item);
      this.leyyo.logger.debug(`# [Predictor] ${this.cluster} added (eager), ${options.name}`);
      if (!this._inFqnStage(item)) {
        item.stage = "persistent";
        this._onFqnCompleted(item);
        this._afterTargetFound(item);
      }
      return item;
    }
    // lazy target
    else if (options.lazyTarget instanceof Promise) {
      if (!isText(options.name)) {
        throw new this.leyyo.developerError(
          "Invalid predictor name",
          testCase(PCK, "predictor", "invalid-basic-name"),
          where,
        );
      }

      // it's already pending to be loaded
      const { pendingLazy } = this._repo;
      if (pendingLazy.has(options.name)) {
        return pendingLazy.get(options.name);
      }

      item = { ...options, stage: "loading-waiting", mode: "lazy" } as L;
      item.load = async () => this._load(item);
      pendingLazy.set(options.name, item);
      this.leyyo.logger.debug(`# [Predictor] ${this.cluster} added (lazy), ${options.name}`);
      return item;
    }
    throw new this.leyyo.developerError(
      `Invalid target or lazy target <${this.cluster}> [${options.name}] ${JSON.stringify(options.target)}`,
      testCase(PCK, "predictor", "invalid-target"),
      where,
    );
  }

  /** @inheritDoc */
  lazy(
    pck: string,
    name: string,
    lazyTarget: Promise<T>,
    opt?: Omit<O, "name" | "target" | "lazyTarget" | "pck">,
  ): L {
    return this.register({ ...(opt ?? {}), pck, name, lazyTarget });
  }

  /** @inheritDoc */
  isLazy(name: string): boolean {
    return this.get(name)?.mode === "lazy";
  }

  /** @inheritDoc */
  isInvalid(name: string): boolean {
    return ["failed", "conflicted"].includes(this.get(name)?.mode);
  }

  /** @inheritDoc */
  isFailed(name: string): boolean {
    return this.get(name)?.mode === "failed";
  }

  /** @inheritDoc */
  isConflicted(name: string): boolean {
    return this.get(name)?.mode === "conflicted";
  }

  /** @inheritDoc */
  isEager(name: string): boolean {
    return this.get(name)?.mode === "eager";
  }

  /** @inheritDoc */
  has(name: string): boolean {
    return !!this.get(name);
  }

  /** @inheritDoc */
  get(name: string): L {
    if (!isText(name)) {
      return undefined;
    }
    const { fullNames, basicNames, pendingFqn, pendingLazy, aliases } = this._repo;

    if (name.includes(".")) {
      if (fullNames.has(name)) {
        return fullNames.get(name);
      }
      return this.get(name.split(".").pop());
    }
    // no dot

    if (pendingFqn.has(name)) {
      return pendingFqn.get(name);
    }
    if (pendingLazy.has(name)) {
      return pendingLazy.get(name);
    }
    if (aliases.has(name)) {
      return this.get(aliases.get(name));
    }
    return basicNames.get(name);
  }

  /** @inheritDoc */
  async load(name: string): Promise<L> {
    if (!isText(name)) {
      throw new this.leyyo.developerError(
        `Invalid lazy name`,
        testCase(PCK, "predictor", "invalid-name"),
        where,
      );
    }

    const item = this.get(name);
    if (!item) {
      throw new this.leyyo.developerError(
        `Lazy was not defined [${name}]`,
        testCase(PCK, "predictor", "not-found-item"),
        where,
      );
    }
    await this._load(item);
    return item;
  }

  /**
   * Validate target
   *
   * @param {any} target
   * @return {boolean}
   * */
  protected abstract _validate(target: T): boolean;

  /**
   * Build options from target
   *
   * @param {any} target
   * @return {PredictorOpt}
   * */
  protected _buildOpt(target: T): O {
    return {} as O;
  }

  /**
   * Get name of target
   *
   * @param {any} target
   * @return {string}
   * */
  protected abstract _getName(target: T): string;

  /**
   * Set name of target
   *
   * @param {any} target
   * @param {string} name
   * @return {string}
   * */
  protected abstract _setName(target: T, name: string): string;

  /**
   * Stamp lambda, todo
   *
   * @param {PredictorItem} item
   * */
  protected abstract _afterTargetFound(item: L): void;

  /**
   * custom operations after load
   *
   * @param {PredictorItem} item
   * @return {Promise}
   * @async
   * */
  protected abstract _nextLoad(item: L): Promise<void>;
}
