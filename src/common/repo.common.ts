import { PCK } from "../internal.js";
import { isText, testCase } from "../function/index.js";
import { List } from "../base/index.js";
import { LeyyoLike, ListLike, RepoCommonLike, RepoDataType } from "../type.js";
import { getRootStorage } from "../sys/index.js";
import { KEY_REPO_CODE, KEY_REPO_TYPE } from "../const.js";

const KEY_REPO_VOLATILE = Symbol.for("leyyo:repo:volatile");
const KEY_REPO_ARRAY = Symbol.for("leyyo:repo:array");
const KEY_REPO_LIST = Symbol.for("leyyo:repo:list");
const KEY_REPO_MAP = Symbol.for("leyyo:repo:map");
const KEY_REPO_SET = Symbol.for("leyyo:repo:set");

/**
 * Identifier of file
 * */
const where = `${PCK}.RepoCommon`;

// noinspection JSUnusedGlobalSymbols
export class RepoCommon implements RepoCommonLike {
  // region property
  private static _created: boolean;

  /**
   * Internal volatile repo which could be cleared after lifecycle run
   * */
  private _volatiles = getRootStorage<Set<symbol>>(KEY_REPO_VOLATILE, new Set<symbol>());

  /**
   * Internal items which stores arrays
   * */
  private _arrayItems = getRootStorage<Map<symbol, Array<unknown>>>(
    KEY_REPO_ARRAY,
    new Map<symbol, Array<unknown>>(),
  );

  /**
   * Internal items which stores lists
   * */
  private _listItems = getRootStorage<Map<symbol, ListLike>>(
    KEY_REPO_LIST,
    new Map<symbol, ListLike>(),
  );

  /**
   * Internal items which stores maps
   * */
  private _mapItems = getRootStorage<Map<symbol, Map<unknown, unknown>>>(
    KEY_REPO_MAP,
    new Map<symbol, Map<unknown, unknown>>(),
  );

  /**
   * Internal items which stores sets
   * */
  private _setItems = getRootStorage<Map<symbol, Set<unknown>>>(
    KEY_REPO_SET,
    new Map<symbol, Set<unknown>>(),
  );

  // endregion property

  constructor(private leyyo: LeyyoLike) {
    if (RepoCommon._created) {
      throw new Error("ZZZ");
    }
    RepoCommon._created = true;
  }

  private _typeFromCode(code: symbol): RepoDataType {
    if (typeof code !== "symbol") {
      return undefined;
    }
    if (this._arrayItems.has(code)) {
      return "array";
    }
    if (this._mapItems.has(code)) {
      return "map";
    }
    if (this._setItems.has(code)) {
      return "set";
    }
    if (this._listItems.has(code)) {
      return "list";
    }
    return undefined;
  }
  private _clearOrRemove(code: symbol, remove?: boolean): number {
    const type = this._typeFromCode(code);
    if (!type) {
      return -1;
    }
    let length: number;
    switch (type) {
      case "array": {
        const array = this._arrayItems.get(code);
        length = array.length;
        array.splice(0, length);
        if (remove) {
          this._arrayItems.delete(code);
        }
        return length;
      }
      case "map": {
        const map = this._mapItems.get(code);
        length = map.size;
        map.clear();
        if (remove) {
          this._mapItems.delete(code);
        }
        return length;
      }
      case "set": {
        const set = this._setItems.get(code);
        length = set.size;
        set.clear();
        if (remove) {
          this._setItems.delete(code);
        }
        return length;
      }
      case "list": {
        const list = this._listItems.get(code);
        length = list.length;
        list.clear();
        if (remove) {
          this._listItems.delete(code);
        }
        return length;
      }
      default:
        return -1;
    }
  }

  // region general

  /** @inheritDoc */
  clear(code: symbol): number {
    return this._clearOrRemove(code, false);
  }

  /** @inheritDoc */
  clearVolatile(): number {
    const length = this._volatiles.size;
    Array.from(this._volatiles.values()).forEach((code) => this._clearOrRemove(code, true));
    this._volatiles.clear();
    return length;
  }

  /** @inheritDoc */
  getCode<K1 = unknown, K2 = unknown>(
    value: Array<K1> | ListLike<K1> | Map<K1, K2> | Set<K1>,
  ): symbol {
    if (!value) {
      return undefined;
    }
    return value[KEY_REPO_CODE];
  }

  /** @inheritDoc */
  getType<K1 = unknown, K2 = unknown>(
    value: symbol | Array<K1> | ListLike<K1> | Map<K1, K2> | Set<K1>,
  ): RepoDataType {
    if (!value) {
      return undefined;
    }
    if (typeof value === "symbol") {
      return this._typeFromCode(value);
    }
    return this._typeFromCode(value[KEY_REPO_CODE]);
  }

  /** @inheritDoc */
  keys(): Array<symbol> {
    return [
      ...Array.from(this._arrayItems.keys()),
      ...Array.from(this._listItems.keys()),
      ...Array.from(this._mapItems.keys()),
      ...Array.from(this._setItems.keys()),
    ];
  }

  /** @inheritDoc */
  remove<K1 = unknown, K2 = unknown>(
    value: symbol | Array<K1> | ListLike<K1> | Map<K1, K2> | Set<K1>,
  ): number {
    const code = typeof value === "symbol" ? value : this.getCode(value);
    return this._clearOrRemove(code, true);
  }

  /** @inheritDoc */
  sizes(): Record<string, number> {
    const result = {} as Record<string, number>;
    const duplicated = {} as Record<string, number>;

    for (const [sym, item] of this._arrayItems.entries()) {
      const key = sym.description;
      if (result[key] === undefined) {
        result[key] = item.length;
      } else {
        if (duplicated[key] === undefined) {
          duplicated[key] = 0;
        }
        duplicated[key]++;
        result[`${key}#${duplicated[key]}`] = item.length;
      }
    }
    for (const [sym, item] of this._mapItems.entries()) {
      const key = sym.description;
      if (result[key] === undefined) {
        result[key] = item.size;
      } else {
        if (duplicated[key] === undefined) {
          duplicated[key] = 0;
        }
        duplicated[key]++;
        result[`${key}#${duplicated[key]}`] = item.size;
      }
    }
    for (const [sym, item] of this._setItems.entries()) {
      const key = sym.description;
      if (result[key] === undefined) {
        result[key] = item.size;
      } else {
        if (duplicated[key] === undefined) {
          duplicated[key] = 0;
        }
        duplicated[key]++;
        result[`${key}#${duplicated[key]}`] = item.size;
      }
    }
    for (const [sym, item] of this._listItems.entries()) {
      const key = sym.description;
      if (result[key] === undefined) {
        result[key] = item.length;
      } else {
        if (duplicated[key] === undefined) {
          duplicated[key] = 0;
        }
        duplicated[key]++;
        result[`${key}#${duplicated[key]}`] = item.length;
      }
    }
    return result;
  }

  // endregion general

  // region new-collection
  /** @inheritDoc */
  newArray<V>(name: string, volatile?: boolean): Array<V> {
    if (!isText(name)) {
      throw new this.leyyo.developerError(
        "Invalid repository array name",
        testCase(PCK, "repo", "invalid-array-name"),
        where,
      );
    }
    const item = [] as Array<V>;
    const code = Symbol.for(name.split("#").join(""));
    this._arrayItems.set(code, item);
    if (volatile) {
      this._volatiles.add(code);
    }
    item[KEY_REPO_CODE] = code;
    item[KEY_REPO_TYPE] = "array" as RepoDataType;
    return item;
  }

  /** @inheritDoc */
  newList<V>(name: string, volatile?: boolean): ListLike<V> {
    if (!isText(name)) {
      throw new this.leyyo.developerError(
        "Invalid repository list name",
        testCase(PCK, "repo", "invalid-list-name"),
        where,
      );
    }
    const item = new List<V>();
    const code = Symbol.for(name.split("#").join(""));
    this._listItems.set(code, item);
    if (volatile) {
      this._volatiles.add(code);
    }
    item[KEY_REPO_CODE] = code;
    item[KEY_REPO_TYPE] = "list" as RepoDataType;
    return item;
  }

  /** @inheritDoc */
  newMap<K, V>(name: string, volatile?: boolean): Map<K, V> {
    if (!isText(name)) {
      throw new this.leyyo.developerError(
        "Invalid repository map name",
        testCase(PCK, "repo", "invalid-map-name"),
        where,
      );
    }
    const item = new Map<K, V>();
    const code = Symbol.for(name.split("#").join(""));
    this._mapItems.set(code, item);
    if (volatile) {
      this._volatiles.add(code);
    }
    item[KEY_REPO_CODE] = code;
    item[KEY_REPO_TYPE] = "map" as RepoDataType;
    return item;
  }

  /** @inheritDoc */
  newSet<V>(name: string, volatile?: boolean): Set<V> {
    if (!isText(name)) {
      throw new this.leyyo.developerError(
        "Invalid repository set name",
        testCase(PCK, "repo", "invalid-set-name"),
        where,
      );
    }
    const item = new Set<V>();
    const code = Symbol.for(name.split("#").join(""));
    this._setItems.set(code, item);
    if (volatile) {
      this._volatiles.add(code);
    }
    item[KEY_REPO_CODE] = code;
    item[KEY_REPO_TYPE] = "set" as RepoDataType;
    return item;
  }
  // endregion new-collection

  // region secure
  init(): void {
    const lifecycle = this.leyyo.lifecycleCommon;
    // clear volatile
    lifecycle.addStage("clear", "repo.volatile", () => this.clearVolatile());

    // prevent re-call
    this.init = () => {};
  }
  // endregion secure
}
