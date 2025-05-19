export const SysClassItems = [
    'Function', 'Object', 'Boolean', 'Symbol',
    'Error', 'AggregateError', 'EvalError', 'InternalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError',
    `Number`, `BigInt`, `Math`, `Date`,
    'String', 'RegExp',
    'Array', 'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array',
    'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'BigInt64Array', 'BigUint64Array',
    'Map', 'Set', 'WeakMap', 'WeakSet',

    'ArrayBuffer', 'SharedArrayBuffer', 'Atomics', 'DataView', 'JSON',

    'Promise', 'Generator', 'GeneratorFunction', 'AsyncFunction', 'AsyncGenerator', 'AsyncGeneratorFunction',
    'Reflect', 'Proxy',

    'Intl', 'Intl.Collator', 'Intl.DateTimeFormat', 'Intl.ListFormat', 'Intl.NumberFormat',
    'Intl.PluralRules', 'Intl.RelativeTimeFormat', 'Intl.Locale',

    'WebAssembly', 'WebAssembly.Module', 'WebAssembly.Instance', 'WebAssembly.Memory', 'WebAssembly.Table',
    'WebAssembly.CompileError', 'WebAssembly.LinkError', 'WebAssembly.RuntimeError'
] as const;
export type SysClass = typeof SysClassItems[number];