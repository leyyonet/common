/**
 * JSON Object, record of `JsonValue`
 *
 * @see #JsonValue
 */
export type JsonObject = { [K in string]?: JsonValue };
/**
 * JSON Array, array of `JsonValue`
 *
 * @see #JsonValue
 */
export type JsonArray = Array<JsonValue>;

/**
 * JSON Primitive
 *
 * `OneOf`
 * @see `string`
 * @see `number`
 * @see `boolean`
 * @see `null`
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * JSON Value
 *
 * `OneOf`
 * @see #JsonPrimitive
 * @see #JsonObject
 * @see #JsonArray
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
