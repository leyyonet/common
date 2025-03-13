// noinspection JSUnusedGlobalSymbols

export * from './exception';
export * from './literal';
export * from './shared';

import {leyyo} from "./leyyo";

const is = leyyo.is;
const hook = leyyo.hook;
const assertion = leyyo.assertion;
const storage = leyyo.storage;
const to = leyyo.to;
const system = leyyo.system;

const commonFqn = leyyo.fqn;
const commonLog = leyyo.log;
const commonError = leyyo.error;
export {leyyo, is, hook, assertion, storage, to, system, commonFqn, commonLog, commonError};


