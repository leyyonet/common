// noinspection JSUnusedGlobalSymbols

if (global?.leyyo_is_testing) {
    ['log', 'warn', 'info', 'debug', 'trace', 'error'].forEach(name => {
        global.console[name] = (): void => {
        };
        console[name] = (): void => {
        };
    });
}
console['fatal'] = (...args: Array<unknown>) => console.error(...args);


export * from './index.types';

export * from './class';
export * from './const';
export * from './enum';
export * from './error';
export * from './common';
export * from './function';
export * from './loader';
