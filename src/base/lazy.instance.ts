import {
  LazyDefinerLike,
  LazyDependencyLambda,
  LazyItem,
  LazyItemLambda,
  LazyLoadTuple,
  LazyViewerLike,
  LeyyoLike,
} from "../type.js";
import { testCase } from "../function/index.js";
import { PCK } from "../internal.js";
import { KEY_LEYYO_SECURE } from "../const.js";

let _leyyo: LeyyoLike;

// noinspection JSUnusedLocalSymbols
/**
 * Lazy instance class
 * */
export class LazyInstance implements LazyDefinerLike, LazyViewerLike {
  private _closed: boolean;
  private _loaded: boolean;
  private _dependencies: Set<LazyViewerLike | LazyDependencyLambda>;
  private _members: Set<LazyItemLambda>;
  private _items: Set<LazyItem>;

  constructor(readonly pck: string) {}

  /** @inheritDoc */
  dependencies(): Array<LazyViewerLike | LazyDependencyLambda> {
    if (!this._dependencies) {
      return [];
    }
    return Array.from(this._dependencies.values());
  }

  /** @inheritDoc */
  members(): Array<LazyItemLambda> {
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
  add(...members: Array<LazyItemLambda>): LazyDefinerLike {
    if (this._closed) {
      throw new _leyyo.developerError(
        `Lazy instance[${this.pck}] is closed to add member`,
        testCase(PCK, "lazy", "closed-for-member"),
        `${PCK}.LazyInstance`,
      );
    }
    if (!this._members) {
      this._members = _leyyo.repoCommon.newSet(`${this.pck}.lazy.members`);
    }
    members.forEach((member, index) => {
      if (typeof member !== "function") {
        throw new _leyyo.developerError(
          `Invalid member[#${index}] value`,
          testCase(PCK, "lazy", "invalid-member"),
          `${PCK}.LazyInstance`,
        );
      }
      this._members.add(member);
    });
    return this;
  }

  /** @inheritDoc */
  dependency(
    ...dependencies: Array<LazyDependencyLambda | LazyDefinerLike | LazyViewerLike>
  ): LazyDefinerLike {
    if (this._closed) {
      throw new _leyyo.developerError(
        `Lazy instance[${this.pck}] is closed to add dependency`,
        testCase(PCK, "lazy", "closed-for-dependency"),
        `${PCK}.LazyInstance`,
      );
    }
    dependencies.forEach((dependency, index) => {
      if (!(typeof dependency === "function" || dependency instanceof LazyInstance)) {
        throw new _leyyo.developerError(
          `Lazy dependency [${this.pck}][#${index}] is invalid`,
          testCase(PCK, "lazy", "invalid-dependency"),
          `${PCK}.LazyInstance`,
        );
      }
      if (!this._dependencies) {
        this._dependencies = _leyyo.repoCommon.newSet(`${this.pck}.lazy.dependencies`);
      }
      if (typeof dependency === "function") {
        if (this._dependencies.has(dependency)) {
          throw new _leyyo.developerError(
            `Lazy dependency [${this.pck}][#${index}] is duplicated`,
            testCase(PCK, "lazy", "duplicated-dependency"),
            `${PCK}.LazyInstance`,
          );
        }
      } else {
        if (this._dependencies.has(dependency)) {
          throw new _leyyo.developerError(
            `Lazy dependency [${this.pck}][#${index}] is duplicated`,
            testCase(PCK, "lazy", "duplicated-dependency"),
            `${PCK}.LazyInstance`,
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
  end(): LazyViewerLike {
    this._closed = true;
    return this;
  }

  get isLoaded(): boolean {
    return this._loaded;
  }

  async load(): Promise<LazyLoadTuple> {
    let loadedCount = 0;
    if (!this._loaded) {
      this._loaded = true;
      if (!this._items) {
        this._items = _leyyo.repoCommon.newSet(`${this.pck}.lazy.items`);
      }
      if (this._dependencies) {
        let dependencyResult: LazyLoadTuple;
        const arr = Array.from(this._dependencies.values());
        for (let i = 0; i < arr.length; i++) {
          const dependency = arr[i];
          let view: LazyViewerLike;
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
          this._items.add(await arr[i]());
        }

        _leyyo.repoCommon.remove(this._members);
        delete this._members;
      }
    }
    return [loadedCount, this._items.size];
  }

  get items(): Array<LazyItem> {
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
