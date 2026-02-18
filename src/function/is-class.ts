/**
 * Is class?
 *
 * @param {any} fn - given value
 * @return {boolean} - is class?
 * */
export function isClass(fn: unknown): boolean {
    if (typeof fn !== 'function') {
        return false;
    }
    try {
        return Function.prototype.toString.call(fn).toString().startsWith('class ');
    }
    catch (e) {
        return false;
    }
    // // Class constructor is also a function
    // if ( !(fn && fn.constructor === Function) || (fn as Fnc).prototype === undefined) {
    //     return false;
    // }
    //
    // // This is a class that extends other class
    // if (Function.prototype !== Object.getPrototypeOf(fn)) {
    //     return true;
    // }
    //
    // // Usually a function will only have 'constructor' in the prototype
    // return Object.getOwnPropertyNames((fn as Fnc).prototype).length > 1;
}
