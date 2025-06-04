import {
    CommonWrapperLike, CommonWrapperSecure,
    WrapLike, WrapType
} from "./index.types";
import {LeyyoLike} from "../leyyo";
import {ClassLike, Func, Obj} from "../shared";
import {FQN} from "../internal";
import {Wrap} from "./wrap";

export class CommonWrapper implements CommonWrapperLike, CommonWrapperSecure {

    constructor(private lyy: LeyyoLike) {
    }

    get $secure(): CommonWrapperSecure {
        return this;
    }

    get $back(): CommonWrapperLike {
        return this;
    }

    $init(): void {
        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, CommonWrapper, 'class', FQN);
            this.lyy.fqn.register(null, Wrap, 'class', FQN);
        });
    }

    $create<V extends ClassLike|Func|string|Obj = Func>(type: WrapType, value: V): WrapLike<V> {
        return new Wrap<V>(type, value);
    }

    ofClass(clazz: ClassLike): WrapLike<ClassLike> {
        this.lyy.assertion.func(clazz, () => this.lyy.dev.opt({field: 'clazz', where: `${FQN}.CommonWrapper`, method: 'ofClass'}));
        return this.$create('class', clazz);
    }

    ofFunction(fn: Func): WrapLike<Func> {
        this.lyy.assertion.func(fn, () => this.lyy.dev.opt({field: 'fn', where: `${FQN}.CommonWrapper`, method: 'ofFunction'}));
        return this.$create('function', fn);
    }

    ofInstance(instance: Obj): WrapLike<Obj> {
        this.lyy.assertion.object(instance, () => this.lyy.dev.opt({field: 'instance', where: `${FQN}.CommonWrapper`, method: 'ofInstance'}));
        return this.$create('instance', instance);
    }

    ofString(name: string): WrapLike<string> {
        this.lyy.assertion.text(name, () => this.lyy.dev.opt({field: 'name', where: `${FQN}.CommonWrapper`, method: 'ofString'}));
        return this.$create('string', name);
    }



    is(wrap: any): boolean {
        return wrap && wrap instanceof Wrap;
    }
    isClass(wrap: any): boolean {
        return wrap && wrap instanceof Wrap && wrap.type === 'class';
    }
    isFunction(wrap: any): boolean {
        return wrap && wrap instanceof Wrap && wrap.type === 'function';
    }
    isString(wrap: any): boolean {
        return wrap && wrap instanceof Wrap && wrap.type === 'string';
    }
    isInstance(wrap: any): boolean {
        return wrap && wrap instanceof Wrap && wrap.type === 'instance';
    }

    asClass(wrap: any): ClassLike {
        return this.isClass(wrap) ? (wrap as WrapLike<ClassLike>).value : undefined;
    }
    asFunction<F extends Func = Func>(wrap: any): F {
        return this.isFunction(wrap) ? (wrap as WrapLike).value as F : undefined;
    }
    asString(wrap: any): string {
        return this.isString(wrap) ? (wrap as WrapLike<string>).value : undefined;
    }
    asInstance<I extends Obj = Obj>(wrap: any): I {
        return this.isInstance(wrap) ? (wrap as WrapLike<Obj>).value as I : undefined;
    }

    type(wrap: any): WrapType {
        if (wrap && wrap instanceof Wrap) {
            return wrap.type;
        }
        return undefined;
    }
    value<V extends ClassLike|Func|string|Obj = Func>(wrap: WrapLike<V>): V {
        if (wrap && wrap instanceof Wrap) {
            return wrap.value;
        }
        return undefined;
    }
}
