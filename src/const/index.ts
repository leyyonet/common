export const LY_FQN_BASIC: unique symbol = Symbol.for('leyyo.fqn');

export const LY_ENUM_NAME: unique symbol = Symbol.for('leyyo/enum.name');
export const LY_ENUM_ALT: unique symbol = Symbol.for('leyyo/enum.alt');

/**
 * Normal empty values
 * */
export const EMPTY_VALUES = [null, undefined];

// noinspection JSUnusedGlobalSymbols
/**
 * Empty values with empty string
 * */
export const EMPTY_VALUES_STR = [null, undefined, ''];



export const LY_ERROR_DEFAULT_MESSAGE: unique symbol = Symbol.for('leyyo.common/error.message');
export const LY_ERROR_DECORATE_I18N: unique symbol = Symbol.for('leyyo.common/error.i18n');
export const LY_ERROR_EMIT: unique symbol = Symbol.for('leyyo.common/error.emit');
export const LY_ERROR_EMITTED: unique symbol = Symbol.for('leyyo.common/error.emitted');
export const LY_ERROR_HTTP_STATUS: unique symbol = Symbol.for('leyyo.common/http.status');
export const LY_ERROR_UNKNOWN_NAME: string = 'UnknownError';
export const LY_ERROR_UNKNOWN_MESSAGE: string = 'Unknown error';
export const LY_ERROR_FLAGS = Symbol.for('leyyo/error.flags');

export const LY_LOADER_NAME: unique symbol = Symbol.for('leyyo/loader.name');
export const LY_LOADER_STAMP: unique symbol = Symbol.for('leyyo/loader.stamp');
export const LY_LOADER_EMPTY: unique symbol = Symbol.for('leyyo/loader.empty');

export const LY_LOG_ALREADY: unique symbol = Symbol.for('leyyo/log.already');
