// noinspection JSUnusedGlobalSymbols
export function Tested(..._cases: Array<string|number>): ClassDecorator & MethodDecorator {
    return <T>(_clazz: unknown, _property?: PropertyKey, _descriptor?: TypedPropertyDescriptor<T>): void => {
    };
}
