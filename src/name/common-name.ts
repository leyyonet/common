import {CommonNameLike, CommonNameSecure} from "./index.types";
import {LeyyoLike} from "../leyyo";
import {FQN} from "../internal";
import {ClassLike, Func} from "../shared";

export class CommonName implements CommonNameLike, CommonNameSecure {
    private _counter = 0;
    private _pattern = /((?:[a-zA-Z_$][a-zA-Z\d_$]*\.)*)([a-zA-Z_$][a-zA-Z\d_$]*)/g;

    constructor(private lyy: LeyyoLike) {
    }

    copy(source: Func | ClassLike, target: Func | ClassLike): void {
        if (source?.name) {
            this.set(target, source.name);
        }
    }

    set(target: Func | ClassLike, name: string): void {
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

    get $secure(): CommonNameSecure {
        return this;
    }

    get $back(): CommonNameLike {
        return this;
    }

    $init(): void {
        this.lyy.$secure
            .$lazyRun(() => {
                this.lyy.fqn.register(null, CommonName, 'class', FQN);
            });
    }

}
