import {Inert} from "./inert";
import {ErrorPoolItem, ErrorPoolLike, ErrorPoolOpt} from "./index.types";
import {ClassLike, LeyyoLike} from "../base";
import {isClass} from "../function";

// noinspection JSUnusedGlobalSymbols
/**
 * Error pool for call with name and lazy loading
 * */
export class ErrorPool extends Inert<ErrorPoolItem, ClassLike, ErrorPoolOpt> implements ErrorPoolLike {

    constructor(protected leyyo: LeyyoLike) {
        super(leyyo, 'error', {anonymousName: 'Error'});
    }

    /** @inheritDoc */
    protected _getName(target: ClassLike): string {
        return target?.name;
    }

    /** @inheritDoc */
    protected async _nextLoad(_item: ErrorPoolItem): Promise<void> {
    }

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
        })
    }

    /** @inheritDoc */
    protected _validate(target: ClassLike): boolean {
        return isClass(target);
    }
}
