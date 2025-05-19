export const SysFunctionItems = ['constructor', '__defineGetter__', '__defineSetter__', 'hasOwnProperty',
    '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable',
    'toString', 'valueOf', '__proto__', 'toLocaleString', 'toJSON', '__esModule'] as const;
export type SysFunction = typeof SysFunctionItems[number];