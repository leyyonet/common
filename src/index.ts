// noinspection JSUnusedGlobalSymbols

if (global?.leyyo_is_testing) {
    ['log', 'warn', 'info', 'debug', 'trace', 'error', 'native'].forEach(name => {
        global.console[name] = (): void => {
        };
        console[name] = (): void => {
        };
    });
}

import {LeyyoLike} from "./leyyo";
import {Leyyo} from "./leyyo/leyyo";

export * from './assertion';
export * from './developer';
export * from './error';
export * from './exception';
export * from './fqn';
export * from './hook';
export * from './is';
export * from './leyyo';
export * from './log';
export * from './shared';
export * from './repo';
export * from './system';
export * from './to';
export * from './wrapper';
export * from './descriptor';
export * from './test';
export * from './deploy';
export * from './name';
export * from './config';

export const leyyo: LeyyoLike = new Leyyo();
export const $descriptor = leyyo.descriptor;
export const $is = leyyo.is;
export const $hook = leyyo.hook;
export const $assert = leyyo.assertion;
export const $repo = leyyo.repo;
export const $to = leyyo.to;
export const $sys = leyyo.system;
export const $dev = leyyo.dev;
export const $fqn = leyyo.fqn;
export const $log = leyyo.log;
export const $err = leyyo.error;
export const $wrapper = leyyo.wrapper;
export const $test = leyyo.test;
export const $deploy = leyyo.deploy;
export const $name = leyyo.name;
export const $config = leyyo.config;
