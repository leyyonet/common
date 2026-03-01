import { Predictor } from "./predictor.js";
import {
  Enum,
  EnumItemConfig,
  EnumNonFunctional,
  EnumPoolItem,
  EnumPoolLike,
  EnumPoolOpt,
} from "../type.js";
import {
  getSymbol,
  isEmpty,
  isFilledArr,
  isFilledObj,
  isObj,
  isText,
  setSymbol,
  testCase,
} from "../function/index.js";
import { KeyValue, LeyyoLike } from "../type.js";
import { PCK } from "../internal.js";
import { KEY_ENUM_ALIAS, KEY_ENUM_ALT, KEY_ENUM_I18N, KEY_ENUM_NAME } from "../const.js";

const where = `${PCK}.EnumPool`;

// noinspection JSUnusedGlobalSymbols
/**
 * Enum pool for call with name and lazy loading
 * */
export class EnumPool extends Predictor<EnumPoolItem, Enum, EnumPoolOpt> implements EnumPoolLike {
  constructor(protected leyyo: LeyyoLike) {
    super(leyyo, "enum", {});
  }

  // region protected
  /** @inheritDoc */
  protected _getName(enm: Enum): string {
    return this.getConfigItem(enm)?.name;
  }

  /** @inheritDoc */
  protected async _nextLoad(item: EnumPoolItem): Promise<void> {
    if (!item.target) {
      return;
    }
    if (item.lazyAlt) {
      try {
        item.alt = await item.lazyAlt;
        delete item.lazyAlt;
        this.setConfigItem(item.target, item);
      } catch (e) {
        new this.leyyo.developerError(
          "Callback error during loading enum alternate data",
          testCase(PCK, "enum", "load-alt-error"),
          where,
        ).log(e);
      }
    }
    delete item.lazyAlt;
  }

  /** @inheritDoc */
  protected _setName(enm: Enum, name: string): string {
    if (isText(name)) {
      setSymbol(enm, KEY_ENUM_NAME, name);
      return name;
    }
    return undefined;
  }

  /** @inheritDoc */
  protected _afterTargetFound(item: EnumPoolItem): void {
    if (item.lazyTarget) {
      delete item.lazyTarget;
    }
    if (item.lazyAlt) {
      delete item.lazyAlt;
    }
    this.setConfigItem(item.target, item);
  }

  /** @inheritDoc */
  protected _validate(enm: Enum): boolean {
    return isFilledObj(enm);
  }

  // endregion protected

  // region public

  /** @inheritDoc */
  setConfigItem(enm: Enum, conf: EnumItemConfig): void {
    if (!isObj(conf)) {
      return;
    }
    if (isText(conf.name)) {
      setSymbol(enm, KEY_ENUM_NAME, conf.name);
    }
    if (!isEmpty(conf.i18n)) {
      setSymbol(enm, KEY_ENUM_I18N, conf.i18n);
    }
    if (isFilledObj(conf.alt)) {
      setSymbol(enm, KEY_ENUM_ALT, conf.alt);
    }
    if (isFilledArr(conf.aliases)) {
      setSymbol(enm, KEY_ENUM_ALIAS, conf.aliases);
    }
  }

  getConfigItem(enm: Enum): EnumItemConfig {
    if (!this._validate(enm)) {
      return undefined;
    }
    return {
      name: getSymbol(enm, KEY_ENUM_NAME),
      i18n: getSymbol(enm, KEY_ENUM_I18N),
      alt: getSymbol(enm, KEY_ENUM_ALT),
      aliases: getSymbol(enm, KEY_ENUM_ALIAS),
    } as EnumItemConfig;
  }

  /** @inheritDoc */
  define(
    pck: string,
    name: string,
    target: Enum,
    opt?: Omit<EnumPoolOpt, "name" | "target" | "lazyTarget" | "pck">,
  ): void {
    this.register({ ...(opt ?? {}), pck, name, target });
  }

  toLiteral<E extends KeyValue = KeyValue>(enm: Enum<E>): ReadonlyArray<EnumNonFunctional<E>> {
    return Object.keys(enm)
      .filter((key) => isNaN(Number(key)))
      .map((key) => enm[key])
      .filter((val) => ["number", "string"].includes(typeof val)) as unknown as ReadonlyArray<
      EnumNonFunctional<E>
    >;
  }

  merge<N>(...maps: Enum[]): N {
    let result = {} as N;
    maps.forEach((item) => {
      result = { ...result, ...item } as N;
    });
    return result;
  }
  // endregion public
}
