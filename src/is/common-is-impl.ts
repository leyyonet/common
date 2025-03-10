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
} from "../literal";
import {CommonIs, CommonIsSecure} from "./index-types";
import {Leyyo} from "../leyyo";

// noinspection JSUnusedGlobalSymbols, JSUnusedLocalSymbols
/** @inheritDoc */
export class CommonIsImpl implements CommonIs, CommonIsSecure {

    // region is
    /** @inheritDoc */
    empty(value: any): boolean {
        return (value === undefined || value === null || (typeof value === 'string' && value.trim() === ''));
    }

    /** @inheritDoc */
    primitive(value: any): boolean {
        return PrimitiveItems.includes((typeof value) as Primitive);
    }

    /** @inheritDoc */
    realValue(value: any): boolean {
        return RealValueItems.includes((typeof value) as RealValue);
    }

    /** @inheritDoc */
    key(value: any): boolean {
        return KeyValueItems.includes((typeof value) as 'string');
    }

    /** @inheritDoc */
    object(value: any): boolean {
        return value && typeof value === 'object' && !Array.isArray(value);
    }

    /** @inheritDoc */
    array(value: any): boolean {
        return value && typeof value === 'object' && Array.isArray(value);
    }

    /** @inheritDoc */
    func(value: any): boolean {
        return typeof value === 'function';
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
    $init(leyyo: Leyyo): void {
    }

    /** @inheritDoc */
    get $back(): CommonIs {
        return this;
    }

    /** @inheritDoc */
    get $secure(): CommonIsSecure {
        return this;
    }

    // endregion secure

}