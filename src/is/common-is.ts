import {CommonIsLike, CommonIsSecure} from "./index.types";
import {LeyyoLike} from "../leyyo";
import {BasicType, ClassLike, EnumLiteral, EnumMap, KeyValue} from "../shared";
import {FQN} from "../internal";
import {
    KeyValueItems,
    Primitive,
    PrimitiveItems,
    RealValue,
    RealValueItems,
    WeakFalse,
    WeakFalseItems,
    WeakTrue,
    WeakTrueItems
} from "../to";

// noinspection JSUnusedGlobalSymbols, JSUnusedLocalSymbols
/** @inheritDoc */
export class CommonIs implements CommonIsLike, CommonIsSecure {
    private readonly _EMPTY = [null, undefined];

    constructor(private lyy: LeyyoLike) {
    }
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
    positiveNumber(value: any): boolean {
        return (typeof value === 'number') && !isNaN(value) && isFinite(value) && value > 0;
    }

    /** @inheritDoc */
    nonNegativeNumber(value: any): boolean {
        return (typeof value === 'number') && !isNaN(value) && isFinite(value) && value >= 0;
    }

    /** @inheritDoc */
    integer(value: any): boolean {
        return (typeof value === 'number') && !isNaN(value) && isFinite(value) && Number.isInteger(value);
    }

    /** @inheritDoc */
    safeInteger(value: any): boolean {
        return (typeof value === 'number') && !isNaN(value) && isFinite(value) && Number.isSafeInteger(value);
    }

    /** @inheritDoc */
    positiveInteger(value: any): boolean {
        return (typeof value === 'number') && !isNaN(value) && isFinite(value) && value > 0;
    }

    /** @inheritDoc */
    nonNegativeInteger(value: any): boolean {
        return (typeof value === 'number') && !isNaN(value) && isFinite(value) && value >= 0;
    }

    /** @inheritDoc */
    string(value: any): boolean {
        return typeof value === 'string';
    }

    /** @inheritDoc */
    text(value: any): boolean {
        return typeof value === 'string' && value.trim() !== '';
    }

    /** @inheritDoc */
    clazz(value: any): boolean {
        if (typeof value !== 'function') {
            return false;
        }
        try {
            return Function.prototype.toString.call(value).startsWith('class');
        }
        catch (e) {
            return false;
        }
    }
    /** @inheritDoc */
    possibleFunc(value: any): boolean {
        switch (typeof value) {
            case "function":
                return true;
            case "string":
                return typeof value === 'string' && value.trim() !== '';
        }
        return false;
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
    instanceOf<T>(value: unknown, clazz: ClassLike<T>): boolean {
        if (!value || !clazz !! || typeof clazz !== 'function' || typeof value !== 'object') {
            return false;
        }
        return value instanceof clazz;
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
    $init(): void {
        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, CommonIs, 'class', FQN);
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
