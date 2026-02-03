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

import {Leyyo} from "./leyyo/leyyo";
import type {LeyyoLike} from "./leyyo";

export * from './error';
export * from './leyyo';
export * from './log';
export * from './shared'; // type
export * from './opt'; // type
export * from './repo';
export * from './deploy';
export * from './name';
export * from './event';
export * from './util'; // function

export const leyyo: LeyyoLike = new Leyyo();
export const $repo = leyyo.repo;
export const $log = leyyo.log;
export const $err = leyyo.error;
export const $deploy = leyyo.deploy;
export const $name = leyyo.name;
export const $event = leyyo.event;
export const $opt = leyyo.opt;

