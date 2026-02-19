import { FQN } from "../internal.js";
import { Fnc, LeyyoLike } from "../base/index.js";
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
import { InertBuildOpt, InertItem, InertLike, InertOpt, InertRepo } from "./index.types.js";

const where = `${FQN}.Inert`;

// noinspection JSUnusedGlobalSymbols
export abstract class Inert<L extends InertItem<T>, T, O extends InertOpt<T>> implements InertLike<
  L,
  T,
  O
> {
  private readonly _repo: InertRepo<L, T>;
  private static _pool: Map<string, Inert<InertItem<unknown>, unknown, InertOpt<unknown>>>;

  /**
   * Constructor
   *
   * @param {LeyyoLike} leyyo
   * @param {string} cluster
   * @param {InertBuildOpt} options
   * */
  protected constructor(
    protected leyyo: LeyyoLike,
    protected cluster: string,
    protected options: InertBuildOpt,
  ) {
    if (!isText(this.cluster)) {
      throw new this.leyyo.developerError("Invalid cluster name", testCase(FQN, "XXX"), where);
    }
    if (isObj(this.options)) {
      this.options = {};
    }
    if (this.options.anonymousName && !isText(this.options.anonymousName)) {
      throw new this.leyyo.developerError("Invalid anonymous name", testCase(FQN, "XXX"), where);
    }

    const repo = this.leyyo.repoCommon;
    if (!Inert._pool) {
      Inert._pool = repo.newMap<string, Inert<InertItem<unknown>, unknown, InertOpt<unknown>>>(
        `${where}.pool`,
      );
    }

    if (Inert._pool.has(this.cluster)) {
      throw new this.leyyo.developerError(
        `Duplicated cluster [${this.cluster}]`,
        testCase(FQN, "XXX"),
        where,
      );
    }
    this._repo = {
      uniqueLoaded: repo.newSet<T>(`${where}.${this.cluster}.uniqueLoaded`),
      fullNames: repo.newMap<string, L>(`${where}.${this.cluster}.fullNames`),
      basicNames: repo.newMap<string, L>(`${where}.${this.cluster}.basicNames`),
      aliases: repo.newMap<string, string>(`${where}.${this.cluster}.aliases`),
      pendingFqn: repo.newMap<string, L>(`${where}.${this.cluster}.pendingFqn`),
      pendingLazy: repo.newMap<string, L>(`${where}.${this.cluster}.pendingLazy`),
    };
    Inert._pool.set(
      this.cluster,
      this._repo as unknown as Inert<InertItem<unknown>, unknown, InertOpt<unknown>>,
    );
  }

  // region private
  protected _inFqnStage(item: L): boolean {
    item.full = getFqn(item.target);
    if (!item.full || !item.full.includes(".")) {
      if (isText(item.fqn)) {
        item.full = setFqn(item.target, item.fqn);
      } else {
        const { pendingFqn } = this._repo;
        pendingFqn.set(item.name, item);
        item.stage = "fqn-waiting";
        onFqnSet(item.target, (f) => this._afterFqnSet(f));
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
        `Inert could not be found after come back, [${full}]`,
        testCase(FQN, "ZZZ"),
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
            testCase(FQN, "ZZZ"),
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
          testCase(FQN, "ZZZ"),
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
              testCase(FQN, "ZZZ"),
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

  // endregion private

  /** @inheritDoc */
  register(options: InertOpt<T>): void {
    const { uniqueLoaded } = this._repo;
    if (!isFilledObj(options)) {
      throw new this.leyyo.developerError("Invalid inert options", testCase(FQN, "XXX"), where);
    }

    // target
    if (this._validate(options.target)) {
      if (options.lazyTarget) {
        delete options.lazyTarget;
      }
      // already defined
      if (uniqueLoaded.has(options.target)) {
        return;
      }
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
        throw new this.leyyo.developerError("Empty name", testCase(FQN, 220), where);
      }
      const item = { ...options, name: basicName, stage: undefined, mode: "eager" } as L;

      if (this._inFqnStage(item)) {
        return;
      }
      item.stage = "persistent";
      this._onFqnCompleted(item);
      this._afterTargetFound(item);
    }
    // lazy target
    else if (options.lazyTarget instanceof Promise) {
      if (!isText(options.name)) {
        throw new this.leyyo.developerError("Invalid inert name", testCase(FQN, "XXX"), where);
      }

      // it's already pending to be loaded
      const { pendingLazy } = this._repo;
      if (pendingLazy.has(options.name)) {
        return;
      }

      const item = { ...options, stage: "loading-waiting", mode: "lazy" } as L;
      pendingLazy.set(options.name, item);
    } else {
      throw new this.leyyo.developerError(
        `Invalid target or lazy target [${options.name}]`,
        testCase(FQN, 224),
        where,
      );
    }
  }

  /** @inheritDoc */
  lazy(
    fqn: string,
    name: string,
    lazyTarget: Promise<T>,
    opt?: Omit<O, "name" | "target" | "lazyTarget" | "fqn">,
  ): void {
    this.register({ ...(opt ?? {}), fqn, name, lazyTarget });
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
      throw new this.leyyo.developerError(`Invalid lazy name`, testCase(FQN, "ZZZ"), where);
    }
    const { pendingLazy, uniqueLoaded } = this._repo;

    const item = this.get(name);
    if (!item) {
      throw new this.leyyo.developerError(
        `Lazy was not defined [${name}]`,
        testCase(FQN, "ZZZ"),
        where,
      );
    }
    // It was already loaded
    if (item.mode === "eager") {
      return item;
    }
    try {
      item.target = await item.lazyTarget;
      if (this._validate(item.target)) {
        item.mode = "eager";
        delete item.lazyTarget;

        // remove from pending
        if (pendingLazy.has(name)) {
          pendingLazy.delete(name);
        }
        await this._nextLoad(item);
        // already loaded
        if (uniqueLoaded.has(item.target)) {
          return item;
        }
      } else {
        item.mode = "conflicted";
      }
    } catch (e) {
      item.mode = "failed";
      new this.leyyo.developerError(
        `Callback inert during loading lazy class [${name}]`,
        testCase(FQN, 227),
        where,
      ).log(e);
    }

    // file could not be loaded
    if (!item.target) {
      return undefined;
    }

    let realName = this._getName(item.target);
    if (item.name !== realName) {
      if (!realName) {
        realName = this._setName(item.target, item.name);
      }
      if (!realName) {
        new this.leyyo.developerError(
          `Conflict in names [${item.name} vs ${realName}]`,
          testCase(FQN, "ZZZ"),
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
   * @param {InertItem} item
   * */
  protected abstract _afterTargetFound(item: L): void;

  /**
   * custom operations after load
   *
   * @param {InertItem} item
   * @return {Promise}
   * @async
   * */
  protected abstract _nextLoad(item: L): Promise<void>;
}
