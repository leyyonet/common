export const KEY_FQN_NAME: unique symbol = Symbol.for('leyyo:fqn:basic');
export const KEY_FQN_ON_SET: unique symbol = Symbol.for('leyyo:fqn:on-set');
export const VAL_FQN_ANONYMOUS = '#Fqn';

/**
 * Normal empty values
 * */
export const EMPTY_VALUES = [null, undefined];

// noinspection JSUnusedGlobalSymbols
/**
 * Empty values with empty string
 * */
export const EMPTY_VALUES_STR = [null, undefined, ''];

export const VAL_NAME_ANONYMOUS = '~';

export const KEY_SECURE_1: unique symbol = Symbol.for('leyyo:secure:1');

export const KEY_ERROR_HTTP_STATUS: unique symbol = Symbol.for('leyyo:http:status');
export const VAL_ERROR_UNKNOWN_NAME: string = 'UnknownError';
export const VAL_ERROR_UNKNOWN_MESSAGE: string = 'Unknown error';
export const KEY_ERROR_DEFAULT_MESSAGE: unique symbol = Symbol.for('leyyo:error:message');
export const KEY_ERROR_I18N: unique symbol = Symbol.for('leyyo:error:i18n');
export const KEY_ERROR_EMIT: unique symbol = Symbol.for('leyyo:error:emit');
export const KEY_ERROR_RAISED: unique symbol = Symbol.for('leyyo:error:raised');
export const KEY_ERROR_EMITTED: unique symbol = Symbol.for('leyyo:error:emitted');
export const KEY_ERROR_FLAGS = Symbol.for('leyyo:error:flags');
export const KEY_ERROR_WHERE = Symbol.for('leyyo:error:where');

export const KEY_LOADER_NAME: unique symbol = Symbol.for('leyyo:loader:name');
export const KEY_LOADER_STAMP: unique symbol = Symbol.for('leyyo:loader:stamp');
export const KEY_LOADER_EMPTY: unique symbol = Symbol.for('leyyo:loader:empty');

export const KEY_LOG_ALREADY: unique symbol = Symbol.for('leyyo:log:already');


export const KEY_ENUM_NAME: unique symbol = Symbol.for('leyyo::enum:name');
export const KEY_ENUM_ALT: unique symbol = Symbol.for('leyyo:enum:alt');
export const KEY_ENUM_I18N: unique symbol = Symbol.for('leyyo:enum:i18n');

export const KEY_LITERAL_NAME: unique symbol = Symbol.for('leyyo::literal:name');
export const KEY_LITERAL_ALT: unique symbol = Symbol.for('leyyo:literal:alt');
export const KEY_LITERAL_I18N: unique symbol = Symbol.for('leyyo:literal:i18n');
