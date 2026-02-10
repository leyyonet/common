import {Inert} from "./inert";
import {Literal, LiteralItemConfig, LiteralPoolItem, LiteralPoolLike, LiteralPoolOpt} from "./index.types";
import {getSymbol, isEmpty, isFilledObj, isObj, isText, setSymbol, testCase} from "../function";
import {LeyyoLike} from "../base";
import {FQN} from "../internal";
import {KEY_LITERAL_ALT, KEY_LITERAL_I18N, KEY_LITERAL_NAME} from "../const";

const where = `${FQN}.LiteralPool`;

// noinspection JSUnusedGlobalSymbols
/**
 * Literal pool for call with name and lazy loading
 * */
export class LiteralPool extends Inert<LiteralPoolItem, Literal, LiteralPoolOpt> implements LiteralPoolLike {

    constructor(protected leyyo: LeyyoLike) {
        super(leyyo, 'literal', {});
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
                new this.leyyo.developerError('Callback error during loading literal alternate data', testCase(FQN, 186), where).log(e);
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
        return isFilledObj(lit);
    }

    // endregion protected

    // region public

    /** @inheritDoc */
    setConfigItem(lit: Literal, conf: LiteralItemConfig): void {
        if ( !isObj(conf)) {
            return;
        }
        if (isText(conf.name)) {
            setSymbol(lit, KEY_LITERAL_NAME, conf.name);
        }
        if ( !isEmpty(conf.i18n)) {
            setSymbol(lit, KEY_LITERAL_I18N, conf.i18n);
        }
        if (isFilledObj(conf.alt)) {
            setSymbol(lit, KEY_LITERAL_ALT, conf.alt);
        }

    }

    getConfigItem(lit: Literal): LiteralItemConfig {
        if ( !this._validate(lit)) {
            return undefined;
        }
        return {
            name: getSymbol(lit, KEY_LITERAL_NAME),
            i18n: getSymbol(lit, KEY_LITERAL_I18N),
            alt: getSymbol(lit, KEY_LITERAL_ALT),
        } as LiteralItemConfig;
    }

    // endregion public
}
