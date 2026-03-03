import {
  LifecycleCommonLike,
  LifecycleSortLambda,
  LifecycleStage,
  LifecycleTuple,
  Fnc,
  LeyyoLike,
} from "../type.js";
import { PCK } from "../internal.js";
import { isText, testCase } from "../function/index.js";

const where = `${PCK}.LifecycleFn`;

// noinspection JSUnusedGlobalSymbols
/**
 * Lifecycle common interface
 * */
export class LifecycleCommon implements LifecycleCommonLike {
  private _stages: Map<LifecycleStage, Map<string, Array<Fnc>>>;
  private _sortLambda: LifecycleSortLambda;

  /**
   * Constructor
   * */
  constructor(private leyyo: LeyyoLike) {
    this._stages = this.leyyo.repoCommon.newMap<LifecycleStage, Map<string, Array<Fnc>>>(
      `${where}.stages`,
    );
    // initialize stages
    this._init("initialize");
    this._init("export");
    this._init("validate");
    this._init("process");
    this._init("clear");
    this._init("ota-before");
    this._init("ota-after");
    this._init("kill");
  }

  /**
   * Init lifecycle by stage
   *
   * @param {LifecycleStage} stage - stage
   * */
  private _init(stage: LifecycleStage): void {
    const newMap = this.leyyo.repoCommon.newMap<string, Array<Fnc>>(`${where}.${stage}`);
    this._stages.set(stage, newMap);
  }

  /** @inheritDoc */
  addStage(stage: LifecycleStage, name: string, callback: Fnc): void {
    if (!isText(stage)) {
      throw new this.leyyo.developerError(
        "Invalid lifecycle stage",
        testCase(PCK, "lifecycle", "invalid-stage"),
        where,
      );
    }
    if (!this._stages.has(stage)) {
      throw new this.leyyo.developerError(
        `Lifecycle stage could not be found [${stage}]`,
        testCase(PCK, "lifecycle", "not-found-stage"),
        where,
      );
    }
    if (!isText(name)) {
      throw new this.leyyo.developerError(
        `Invalid lifecycle name [${stage}]`,
        testCase(PCK, "lifecycle", "invalid-name"),
        where,
      );
    }
    if (typeof callback !== "function") {
      throw new this.leyyo.developerError(
        `Invalid lifecycle callback [${stage}/${name}]`,
        testCase(PCK, "lifecycle", "invalid-callback"),
        where,
      );
    }
    const item = this._stages.get(stage);
    if (!item.has(name)) {
      item.set(name, []);
    }
    item.get(name).push(callback);
  }

  /** @inheritDoc */
  async runStage(stage: LifecycleStage, ...params: Array<unknown>): Promise<number> {
    if (!isText(stage)) {
      throw new this.leyyo.developerError(
        "Invalid lifecycle stage",
        testCase(PCK, "lifecycle", "invalid-stage"),
        where,
      );
    }
    if (!this._stages.has(stage)) {
      throw new this.leyyo.developerError(
        `Lifecycle stage could not be found [${stage}]`,
        testCase(PCK, "lifecycle", "not-found-stage"),
        where,
      );
    }
    let count = 0;
    const item = this._stages.get(stage);
    if (item.size < 1) {
      return count;
    }
    let sorted: Array<LifecycleTuple>;
    if (this._sortLambda) {
      try {
        sorted = this._sortLambda(this._stages.get(stage));
      } catch (e) {
        new this.leyyo.developerError(
          `Callback error during lifecycle order lambda [${stage}]`,
          testCase(PCK, "lifecycle", "sort-error"),
          where,
        ).log(e);
      }
    }
    if (!sorted) {
      sorted = [];
      for (const [name, callbacks] of item.entries()) {
        sorted.push([name, callbacks]);
      }
    }
    for (const [name, callbacks] of sorted) {
      for (const callback of callbacks) {
        try {
          await callback(...params);
          count++;
        } catch (e) {
          new this.leyyo.developerError(
            `Callback error during lifecycle callback [${stage}/${name}]`,
            testCase(PCK, "lifecycle", "callback-error"),
            where,
          ).log(e);
        }
      }
    }
    return count;
  }

  /** @inheritDoc */
  setOrderLambda(stage: LifecycleStage, lambda: LifecycleSortLambda): void {
    if (!isText(stage)) {
      throw new this.leyyo.developerError(
        "Invalid lifecycle stage",
        testCase(PCK, "lifecycle", "invalid-stage"),
        where,
      );
    }
    if (!this._stages.has(stage)) {
      throw new this.leyyo.developerError(
        `Lifecycle stage could not be found [${stage}]`,
        testCase(PCK, "lifecycle", "not-found-stage"),
        where,
      );
    }
    if (typeof lambda !== "function") {
      throw new this.leyyo.developerError(
        `Invalid lifecycle callback [${stage}]`,
        testCase(PCK, "lifecycle", "invalid-callback"),
        where,
      );
    }
    this._sortLambda = lambda;
  }
}
