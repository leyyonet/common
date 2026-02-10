import {Inert} from "./inert";
import {Enum, EnumItemConfig, EnumPoolItem, EnumPoolLike, EnumPoolOpt} from "./index.types";
import {getSymbol, isEmpty, isFilledObj, isObj, isText, setSymbol, testCase} from "../function";
import {LeyyoLike} from "../base";
import {FQN} from "../internal";
import {KEY_ENUM_ALT, KEY_ENUM_I18N, KEY_ENUM_NAME} from "../const";

const where = `${FQN}.EnumPool`;

// noinspection JSUnusedGlobalSymbols
/**
 * Enum pool for call with name and lazy loading
 * */
export class EnumPool extends Inert<EnumPoolItem, Enum, EnumPoolOpt> implements EnumPoolLike {

    constructor(protected leyyo: LeyyoLike) {
        super(leyyo, 'enum', {});
    }

    // region protected
    /** @inheritDoc */
    protected _getName(enm: Enum): string {
        return this.getConfigItem(enm)?.name;
    }

    /** @inheritDoc */
    protected async _nextLoad(item: EnumPoolItem): Promise<void> {
        if (item.target && item.lazyAlt) {
            try {
                item.alt = await item.lazyAlt;
                delete item.lazyAlt;
                this.setConfigItem(item.target, item);
            } catch (e) {
                new this.leyyo.developerError('Callback error during loading enum alternate data', testCase(FQN, 186), where).log(e);
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
        if ( !isObj(conf)) {
            return;
        }
        if (isText(conf.name)) {
            setSymbol(enm, KEY_ENUM_NAME, conf.name);
        }
        if ( !isEmpty(conf.i18n)) {
            setSymbol(enm, KEY_ENUM_I18N, conf.i18n);
        }
        if (isFilledObj(conf.alt)) {
            setSymbol(enm, KEY_ENUM_ALT, conf.alt);
        }

    }

    getConfigItem(enm: Enum): EnumItemConfig {
        if ( !this._validate(enm)) {
            return undefined;
        }
        return {
            name: getSymbol(enm, KEY_ENUM_NAME),
            i18n: getSymbol(enm, KEY_ENUM_I18N),
            alt: getSymbol(enm, KEY_ENUM_ALT),
        } as EnumItemConfig;
    }

    // endregion public
}
