import {
  PredictorDefinerLike,
  PredictorDependencyLambda,
  PredictorItemLambda,
  PredictorViewerLike,
  LeyyoLike,
  PredictorItem,
  LazyLoadTuple,
} from "../type.js";
import { testCase } from "../function/index.js";
import { PCK } from "../internal.js";
import { KEY_LEYYO_SECURE } from "../const.js";

let _leyyo: LeyyoLike;
// noinspection JSUnusedLocalSymbols
/**
 * Predictor instance class
 * */
export class PredictorInstance implements PredictorDefinerLike, PredictorViewerLike {
  private _closed: boolean;
  private _loaded: boolean;
  private _dependencies: Set<PredictorViewerLike | PredictorDependencyLambda>;
  private _members: Set<PredictorItemLambda<unknown>>;
  private _items: Set<PredictorItem<unknown>>;

  constructor(readonly pck: string) {}

  /** @inheritDoc */
  dependencies(): Array<PredictorViewerLike | PredictorDependencyLambda> {
    if (!this._dependencies) {
      return [];
    }
    return Array.from(this._dependencies.values());
  }

  /** @inheritDoc */
  members(): Array<PredictorItemLambda<unknown>> {
    if (!this._members) {
      return [];
    }
    return Array.from(this._members.values());
  }

  /** @inheritDoc */
  get isClosed(): boolean {
    return this._closed;
  }

  /** @inheritDoc */
  add<T>(...members: Array<PredictorItemLambda<T>>): PredictorDefinerLike {
    if (this._closed) {
      throw new _leyyo.developerError(
        `Predictor [${this.pck}] is closed for adding a member`,
        testCase(PCK, "predictor", "closed-for-member"),
        `${PCK}.PredictorInstance`,
      );
    }
    members.forEach((member, index) => {
      if (typeof member !== "function") {
        throw new _leyyo.developerError(
          `Predictor member [${this.pck}][#${index}] is invalid`,
          testCase(PCK, "predictor", "invalid-member"),
          `${PCK}.PredictorInstance`,
        );
      }
      if (!this._members) {
        this._members = _leyyo.repoCommon.newSet(`${this.pck}.predictor.members`);
      }
      this._members.add(member);
    });
    return this;
  }

  /** @inheritDoc */
  dependency(
    ...dependencies: Array<PredictorDependencyLambda | PredictorDefinerLike | PredictorViewerLike>
  ): PredictorDefinerLike {
    if (this._closed) {
      throw new _leyyo.developerError(
        `Predictor [${this.pck}] is closed for a dependency`,
        testCase(PCK, "predictor", "closed-for-dependency"),
        `${PCK}.PredictorInstance`,
      );
    }
    dependencies.forEach((dependency, index) => {
      if (!(typeof dependency === "function" || dependency instanceof PredictorInstance)) {
        throw new _leyyo.developerError(
          `Predictor member [${this.pck}][#${index}] is invalid`,
          testCase(PCK, "predictor", "invalid-dependency"),
          `${PCK}.PredictorInstance`,
        );
      }
      if (!this._dependencies) {
        this._dependencies = _leyyo.repoCommon.newSet(`${this.pck}.predictor.dependencies`);
      }
      if (typeof dependency === "function") {
        if (this._dependencies.has(dependency)) {
          throw new _leyyo.developerError(
            `Predictor dependency [${this.pck}][#${index}] is duplicated`,
            testCase(PCK, "predictor", "duplicated-dependency"),
            `${PCK}.PredictorInstance`,
          );
        }
      } else {
        if (this._dependencies.has(dependency)) {
          throw new _leyyo.developerError(
            `Predictor dependency [${dependency.pck}] is duplicated`,
            testCase(PCK, "predictor", "duplicated-dependency"),
            `${PCK}.PredictorInstance`,
          );
        }
        if (!dependency.isClosed) {
          dependency.end();
        }
      }
      this._dependencies.add(dependency);
    });
    return this;
  }

  /** @inheritDoc */
  end(): PredictorViewerLike {
    this._closed = true;
    return this;
  }

  /** @inheritDoc */
  get isLoaded(): boolean {
    return this._loaded;
  }

  async load(): Promise<LazyLoadTuple> {
    let loadedCount = 0;
    if (!this._loaded) {
      this._loaded = true;
      if (!this._items) {
        this._items = _leyyo.repoCommon.newSet(`${this.pck}.predictor.items`);
      }
      if (this._dependencies) {
        let dependencyResult: LazyLoadTuple;
        const arr = Array.from(this._dependencies.values());
        for (let i = 0; i < arr.length; i++) {
          const dependency = arr[i];
          let view: PredictorViewerLike;
          if (typeof dependency === "function") {
            view = await dependency();
          } else {
            view = dependency;
          }
          if (!view.isLoaded) {
            dependencyResult = await view.load();
            loadedCount += dependencyResult[0];
          }
          view.items.forEach((item) => this._items.add(item));
        }

        _leyyo.repoCommon.remove(this._dependencies);
        delete this._dependencies;
      }
      if (this._members) {
        const arr = Array.from(this._members.values());
        for (let i = 0; i < arr.length; i++) {
          const lambda = arr[i];
          const item = lambda();
          if (item.mode !== "eager") {
            await item.load();
            loadedCount++;
          }
          this._items.add(item);
        }

        _leyyo.repoCommon.remove(this._members);
        delete this._members;
      }
    }
    return [loadedCount, this._items.size];
  }
  /** @inheritDoc */
  get items(): Array<PredictorItem<unknown>> {
    if (!this._items) {
      return [];
    }
    return Array.from(this._items.values());
  }
  static [KEY_LEYYO_SECURE](leyyo: LeyyoLike) {
    if (!_leyyo) {
      _leyyo = leyyo;
    }
  }
}
