import {CommonIsLike, CommonIsSecure} from "./index-types";
import {LeyyoLike} from "../leyyo";
import {BasicType, EnumLiteral, EnumMap, KeyValue} from "../shared";
import {FQN_PCK} from "../internal";
import {
    KeyValueItems,
    Primitive,
    PrimitiveItems,
    RealValue,
    RealValueItems, WeakFalse,
    WeakFalseItems, WeakTrue,
    WeakTrueItems
} from "../to";

// noinspection JSUnusedGlobalSymbols, JSUnusedLocalSymbols
/** @inheritDoc */
export class CommonIs implements CommonIsLike, CommonIsSecure {
    private readonly _EMPTY = [null, undefined];
    private lyy: LeyyoLike;
    // region is
    /** @inheritDoc */
    empty(value: any): boolean {
        return this._EMPTY.includes(value);
    }

    /** @inheritDoc */
    typeOf(value: any, ...types: Array<BasicType>): boolean {
        return !this._EMPTY.includes(value) && types.includes(typeof value);
    }

    /** @inheritDoc */
    primitive(value: any): boolean {
        return !this._EMPTY.includes(value) && PrimitiveItems.includes((typeof value) as Primitive);
    }

    /** @inheritDoc */
    realValue(value: any): boolean {
        return !this._EMPTY.includes(value) && RealValueItems.includes((typeof value) as RealValue);
    }

    /** @inheritDoc */
    key(value: any): boolean {
        return !this._EMPTY.includes(value) && KeyValueItems.includes((typeof value) as 'string');
    }

    /** @inheritDoc */
    object(value: any): boolean {
        return !this._EMPTY.includes(value) && typeof value === 'object' && !Array.isArray(value);
    }

    /** @inheritDoc */
    bareObject(value: any): boolean {
        return !this._EMPTY.includes(value) && typeof value === 'object' && value.constructor === Object;
    }

    /** @inheritDoc */
    anotherObject(value: any): boolean {
        return !this._EMPTY.includes(value) && typeof value === 'object' && value.constructor !== Object;
    }

    /** @inheritDoc */
    arrayLike(value: any): boolean {
        return !this._EMPTY.includes(value) && (Array.isArray(value) || value instanceof Set || value instanceof Array);
    }

    /** @inheritDoc */
    func(value: any): boolean {
        return typeof value === 'function';
    }

    /** @inheritDoc */
    sym(value: any): boolean {
        return typeof value === 'symbol';
    }

    /** @inheritDoc */
    number(value: any): boolean {
        return (typeof value === 'number') && !isNaN(value) && isFinite(value);
    }

    /** @inheritDoc */
    integer(value: any): boolean {
        return this.number(value) && Number.isInteger(value);
    }

    /** @inheritDoc */
    safeInteger(value: any): boolean {
        return this.number(value) && Number.isSafeInteger(value);
    }

    /** @inheritDoc */
    string(value: any): boolean {
        return typeof value === 'string';
    }

    /** @inheritDoc */
    text(value: any): boolean {
        return this.string(value) && (value as string).trim() !== '';
    }

    /** @inheritDoc */
    clazz(value: any): boolean {
        return this.text(value) || this.func(value) || this.object(value);
    }

    /** @inheritDoc */
    enumeration(value: unknown, map: EnumMap): boolean {
        if (!this.bareObject(map)) {
            return false;
        }
        if (KeyValueItems.includes((typeof value) as 'string')) {
            return !!map[value as string];
        }
        return false;
    }

    /** @inheritDoc */
    literal(value: unknown, items: EnumLiteral): boolean {
        if (!Array.isArray(items)) {
            return false;
        }
        if (KeyValueItems.includes((typeof value) as 'string')) {
            return items.includes(value as KeyValue);
        }
        return false;
    }

    /** @inheritDoc */
    boolean(value: any): boolean {
        return (typeof value === 'boolean');
    }

    /** @inheritDoc */
    true(value: any): boolean {
        return (value === true) ||
            (this.text(value) && WeakTrueItems.includes((value as string).toLowerCase() as WeakTrue)) ||
            (this.number(value) && (value as number) > 0);
    }

    /** @inheritDoc */
    false(value: any): boolean {
        return (value === false) ||
            (this.text(value) && WeakFalseItems.includes((value as string).toLowerCase() as WeakFalse)) ||
            (this.number(value) && (value as number) <= 0);
    }

    // endregion is

    // region secure
    /** @inheritDoc */
    $init(lyy: LeyyoLike): void {
        this.lyy = lyy;
        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, CommonIs, 'class', FQN_PCK);
        });
    }

    /** @inheritDoc */
    get $back(): CommonIsLike {
        return this;
    }

    /** @inheritDoc */
    get $secure(): CommonIsSecure {
        return this;
    }

    // endregion secure

}
