import {
    KeyValueItems,
    Primitive,
    PrimitiveItems,
    RealValue,
    RealValueItems, WeakFalse, WeakFalseItems,
    WeakTrue,
    WeakTrueItems
} from "../literals";
import {CommonIs, CommonIsSecure} from "./index-types";
import {Leyyo} from "../leyyo";

// noinspection JSUnusedGlobalSymbols, JSUnusedLocalSymbols
export class CommonIsImpl implements CommonIs, CommonIsSecure {

    $init(leyyo: Leyyo): void {
    }

    // region is
    empty(value: unknown): boolean {
        return (value === undefined || value === null);
    }
    primitive(value: unknown): boolean {
        return PrimitiveItems.includes((typeof value) as Primitive);
    }
    value(value: unknown): boolean {
        return RealValueItems.includes((typeof value) as RealValue);
    }
    key(value: unknown): boolean {
        return KeyValueItems.includes((typeof value) as 'string');
    }
    object(value: unknown): boolean {
        return value && typeof value === 'object' && !Array.isArray(value);
    }
    array(value: unknown): boolean {
        return value && typeof value === 'object' && Array.isArray(value);
    }
    func(value: unknown): boolean {
        return typeof value === 'function';
    }
    number(value: unknown): boolean {
        return (typeof value === 'number') && !isNaN(value) && isFinite(value);
    }
    integer(value: unknown): boolean {
        return this.number(value) && Number.isSafeInteger(value);
    }
    string(value: unknown): boolean {
        return typeof value === 'string';
    }
    text(value: unknown): boolean {
        return this.string(value) && (value as string).trim() !== '';
    }
    clazz(value: unknown): boolean {
        return this.text(value) || this.func(value) || this.object(value);
    }
    boolean(value: unknown): boolean {
        return (typeof value === 'boolean');
    }
    true(value: unknown): boolean {
        return (value === true) ||
            (this.text(value) && WeakTrueItems.includes((value as string).toLowerCase() as WeakTrue)) ||
            (this.number(value) && (value as number) > 0);
    }
    false(value: unknown): boolean {
        return (value === false) ||
            (this.text(value) && WeakFalseItems.includes((value as string).toLowerCase() as WeakFalse)) ||
            (this.number(value) && (value as number) <= 0);
    }

    get $back(): CommonIs {
        return this;
    }

    get $secure(): CommonIsSecure {
        return this;
    }
    // endregion is
}