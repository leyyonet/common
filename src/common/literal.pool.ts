import { Predictor } from "./predictor.js";
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
import {
  LeyyoLike,
  Literal,
  LiteralItemConfig,
  LiteralPoolItem,
  LiteralPoolLike,
  LiteralPoolOpt,
} from "../type.js";
import { PCK } from "../internal.js";
import { KEY_LITERAL_ALT, KEY_LITERAL_I18N, KEY_LITERAL_NAME } from "../const.js";

const where = `${PCK}.LiteralPool`;

// noinspection JSUnusedGlobalSymbols
/**
 * Literal pool for call with name and lazy loading
 * */
export class LiteralPool
  extends Predictor<LiteralPoolItem, Literal, LiteralPoolOpt>
  implements LiteralPoolLike
{
  constructor(protected leyyo: LeyyoLike) {
    super(leyyo, "literal", {});
  }

  // region protected
  /** @inheritDoc */
  protected _getName(lit: Literal): string {
    return this.getConfigItem(lit)?.name;
  }

  /** @inheritDoc */
  protected async _nextLoad(item: LiteralPoolItem): Promise<void> {
    if (item.target && item.lazyAlt) {
      try {
        item.alt = await item.lazyAlt;
        delete item.lazyAlt;
        this.setConfigItem(item.target, item);
      } catch (e) {
        new this.leyyo.developerError(
          "Callback error during loading literal alternate data",
          testCase(PCK, "literal", "load-alt-error"),
          where,
        ).log(e);
      }
    }
    delete item.lazyAlt;
  }

  /** @inheritDoc */
  protected _setName(lit: Literal, name: string): string {
    if (isText(name)) {
      setSymbol(lit, KEY_LITERAL_NAME, name);
      return name;
    }
    return undefined;
  }

  /** @inheritDoc */
  protected _afterTargetFound(item: LiteralPoolItem): void {
    if (item.lazyTarget) {
      delete item.lazyTarget;
    }
    if (item.lazyAlt) {
      delete item.lazyAlt;
    }
    this.setConfigItem(item.target, item);
  }

  /** @inheritDoc */
  protected _validate(lit: Literal): boolean {
    return isFilledArr(lit);
  }

  // endregion protected

  // region public

  /** @inheritDoc */
  setConfigItem(lit: Literal, conf: LiteralItemConfig): void {
    if (!isObj(conf)) {
      return;
    }
    if (isText(conf.name)) {
      setSymbol(lit, KEY_LITERAL_NAME, conf.name);
    }
    if (!isEmpty(conf.i18n)) {
      setSymbol(lit, KEY_LITERAL_I18N, conf.i18n);
    }
    if (isFilledObj(conf.alt)) {
      setSymbol(lit, KEY_LITERAL_ALT, conf.alt);
    }
  }

  /** @inheritDoc */
  getConfigItem(lit: Literal): LiteralItemConfig {
    if (!this._validate(lit)) {
      return undefined;
    }
    return {
      name: getSymbol(lit, KEY_LITERAL_NAME),
      i18n: getSymbol(lit, KEY_LITERAL_I18N),
      alt: getSymbol(lit, KEY_LITERAL_ALT),
    } as LiteralItemConfig;
  }

  /** @inheritDoc */
  define(
    pck: string,
    name: string,
    target: Literal,
    opt?: Omit<LiteralPoolOpt, "name" | "target" | "lazyTarget" | "pck">,
  ): void {
    this.register({ ...(opt ?? {}), pck, name, target });
  }
  // endregion public
}
