import {FQN} from "../internal";

import type {NameCommonLike, NameCommonSecure} from "./index.types";
import type {LeyyoLike} from "../leyyo";
import type {ClassLike, Fnc} from "../shared";

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
        this.lyy.descriptor.save(target, 'name', name);
    }

    anonymous(type?: string, counter?: number): string {
        this.lyy.assertion.textOptional(type, () => this.lyy.dev.opt({
            message: 'Invalid class prefix',
            where: `${FQN}.CommonName`,
            method: 'anonymous',
            value: type,
            field: 'type',
        }));
        this.lyy.assertion.integerOptional(counter, () => this.lyy.dev.opt({
            message: 'Invalid class counter',
            where: `${FQN}.CommonName`,
            method: 'anonymous',
            value: counter,
            field: 'counter',
        }));

        if ( !type) {
            type = 'Leyyo';
        }
        if ( !Number.isSafeInteger(counter) || counter < 0) {
            this._counter++;
            counter = this._counter;
        }
        return [type, counter].join('$$');
    }

    validate(value: string, hasPackage?: boolean): void {
        this.lyy.assertion.text(value, () => this.lyy.dev.opt({
            message: 'Invalid class name type',
            where: `${FQN}.CommonName`,
            method: 'validate',
            value,
            type: typeof value,
        }));
        if (!this._pattern.test(value)) {
            this.lyy.dev.developerError2(FQN, 100, {
                message: 'Invalid class name pattern',
                where: `${FQN}.CommonName`,
                method: 'validate',
                value,
            });
        }
        if (!hasPackage && value.includes('.')) {
            this.lyy.dev.developerError2(FQN, 100, {
                message: 'Class is not plain, so it contains package part',
                where: `${FQN}.CommonName`,
                method: 'validate',
                value,
            });
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
                this.lyy.fqn.register(null, NameCommon, 'class', FQN);
            });
    }

}
