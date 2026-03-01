import { Predictor } from "./predictor.js";
import { ErrorPoolItem, ErrorPoolLike, ErrorPoolOpt, ClassLike, LeyyoLike } from "../type.js";
import { isClass } from "../function/index.js";
import {
  KEY_ERROR_DEFAULT_MESSAGE,
  KEY_ERROR_EMIT,
  KEY_ERROR_I18N,
  KEY_FQN_PACKAGE,
} from "../const.js";
import { leyyo } from "../base/index.js";

// noinspection JSUnusedGlobalSymbols
/**
 * Error pool for call with name and lazy loading
 * */
export class ErrorPool
  extends Predictor<ErrorPoolItem, ClassLike, ErrorPoolOpt>
  implements ErrorPoolLike
{
  constructor(protected leyyo: LeyyoLike) {
    super(leyyo, "error", { anonymousName: "Error" });
  }

  /** @inheritDoc */
  protected _getName(target: ClassLike): string {
    return target?.name;
  }

  /** @inheritDoc */
  protected async _nextLoad(_item: ErrorPoolItem): Promise<void> {}

  /** @inheritDoc */
  protected _setName(target: ClassLike, _name: string): string {
    return target?.name;
  }

  /** @inheritDoc */
  protected _afterTargetFound(item: ErrorPoolItem): void {
    if (item.lazyTarget) {
      delete item.lazyTarget;
    }
    this.leyyo.errorCommon.setConfigItem(item.target, {
      message: item.message,
      emit: item.emit,
      i18n: item.i18n,
    });
  }

  /** @inheritDoc */
  protected _validate(target: ClassLike): boolean {
    return isClass(target);
  }

  protected _buildOpt(target: ClassLike): ErrorPoolOpt {
    const opt = {} as ErrorPoolOpt;
    if (target[KEY_ERROR_DEFAULT_MESSAGE] !== undefined) {
      opt.message = target[KEY_ERROR_DEFAULT_MESSAGE];
    }
    if (target[KEY_ERROR_EMIT] !== undefined) {
      opt.emit = target[KEY_ERROR_EMIT];
    }
    if (target[KEY_ERROR_I18N] !== undefined) {
      opt.i18n = target[KEY_ERROR_I18N];
    }
    if (target[KEY_FQN_PACKAGE] !== undefined) {
      opt.pck = target[KEY_FQN_PACKAGE];
    }
    return opt;
  }

  /** @inheritDoc */
  define(target: ClassLike, opt?: Omit<ErrorPoolOpt, "name" | "target" | "lazyTarget">): void {
    this.register({ ...(opt ?? {}), target });
  }
}
