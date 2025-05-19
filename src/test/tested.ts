// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols

export function Tested(pck?: string, ...cases: Array<string|number>): ClassDecorator;
export function Tested(pck?: string, ...cases: Array<string|number>): MethodDecorator;
export function Tested(pck?: string, ...cases: Array<string|number>): ClassDecorator | MethodDecorator {
    return (clazz: any, _property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>): any => {
        if (descriptor) {
            return descriptor;
        }
        return clazz as Function;
    };
}

export function ClassTested(...cases: Array<string|number>): ClassDecorator {
    return _clazz => _clazz;
}
export function MethodTested(...cases: Array<string|number>): MethodDecorator {
    return <T>(_clazz: any, _property: PropertyKey, descriptor: TypedPropertyDescriptor<T>) =>
        descriptor;
}
