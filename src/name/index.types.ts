import type {ClassLike, Fnc, InitLike, ShiftMain, ShiftSecure} from "../shared";

export interface NameCommonLike extends ShiftSecure<NameCommonSecure> {
    /**
     * Copies function name
     * */
    copy(source: Fnc | ClassLike, target: Fnc | ClassLike): void;

    /**
     * Sets function name, especially for arrow functions or proxied class
     * */
    set(target: Fnc | ClassLike, name: string): void;

    /**
     * Validates fqn or function name
     * */
    validate(value: string, hasPackage?: boolean): void;

    /**
     * Builds anonymous name
     * */
    anonymous(type?: string, counter?: number): string;
}
export interface NameCommonSecure extends ShiftMain<NameCommonLike>, InitLike {
}
