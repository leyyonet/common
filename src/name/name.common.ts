import {FQN} from "../internal";

import type {NameCommonLike, NameCommonSecure} from "./index.types";
import type {LeyyoLike} from "../leyyo";
import type {ClassLike, Fnc} from "../shared";
import {NameError} from "./name.error";

export class NameCommon implements NameCommonLike, NameCommonSecure {
    private _counter = 0;
    private _pattern = /((?:[a-zA-Z_$][a-zA-Z\d_$]*\.)*)([a-zA-Z_$][a-zA-Z\d_$]*)/g;

    constructor(private lyy: LeyyoLike) {
    }

    copy(source: Fnc | ClassLike, target: Fnc | ClassLike): void {
        if (source?.name) {
            this.set(target, source.name);
        }
    }

    set(target: Fnc | ClassLike, name: string): void {
        try {
            Object.defineProperty(target, 'name', {
                value: name,
                configurable: true,
                writable: false,
                enumerable: false
            });
        } catch (e) {
            const err = this.lyy.error.cast(e, {where: `${FQN}.NameCommon`, method: 'set'});;
            err.$secure.$warnLog();
        }
    }

    anonymous(type?: string, counter?: number): string {
        if (![null, undefined].includes(type)) {
            if (typeof type !== 'string') {
                throw new NameError('Invalid name', {where: `${FQN}.NameCommon`, method: 'anonymous', value: type});
            }
            else {
                type = type.trim();
                if (type === '') {
                    type = undefined;
                }
                else if (!this._pattern.test(type)) {
                    throw new NameError('Wrong formatted name', {where: `${FQN}.NameCommon`, method: 'anonymous', value: type});
                }
            }
        }
        else {
            type = undefined;
        }
        if (![null, undefined].includes(counter)) {
            if (typeof counter !== 'number' || !Number.isSafeInteger(counter)) {
                throw new NameError('Invalid name counter', {where: `${FQN}.NameCommon`, method: 'anonymous', value: counter});
            }
            else if (counter < 0) {
                counter = undefined;
            }
        }
        else {
            counter = undefined;
        }
        if (!type) {
            type = 'Leyyo';
        }
        if (!counter) {
            this._counter++;
            counter = this._counter;
        }
        return [type, counter].join('$$');
    }

    validate(value: string, hasPackage?: boolean): void {
        if (typeof value !== 'string') {
            throw new NameError('Invalid name', {where: `${FQN}.NameCommon`, method: 'validate', value});
        }
        if (value.includes('.')) {
            if (!hasPackage) {
                throw new NameError('Class is not plain, so it contains package part', {where: `${FQN}.NameCommon`, method: 'validate', value});
            }
            value.split('.').forEach((part, index) => {
                if (part.trim() !== part || part === '') {
                    throw new NameError('Wrong formatted name with space', {where: `${FQN}.NameCommon`, method: 'validate', value, part, index});
                }
                if (!this._pattern.test(part)) {
                    throw new NameError('Wrong formatted name with pattern', {where: `${FQN}.NameCommon`, method: 'validate', value, part, index});
                }
            });
        }
        else {
            if (value.trim() !== value || value === '') {
                throw new NameError('Wrong formatted name with space', {where: `${FQN}.NameCommon`, method: 'validate', value});
            }
            if (!this._pattern.test(value)) {
                throw new NameError('Wrong formatted name', {where: `${FQN}.NameCommon`, method: 'validate', value});
            }
        }
    }

    get $secure(): NameCommonSecure {
        return this;
    }

    get $back(): NameCommonLike {
        return this;
    }

    $init(): void {
        this.lyy.$secure
            .$lazyRun(() => {
            });
    }

}
