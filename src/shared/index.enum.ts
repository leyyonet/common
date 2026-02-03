import {EnumAlt, EnumLiteral, EnumMap} from "./index.types";

export interface EnumCommonLike {
    getEnum(name: string): [EnumMap, EnumAlt?];
    getLiteral(name: string): [EnumLiteral, EnumAlt?];
    getEnumAsync(name: string): Promise<[EnumMap, EnumAlt?]>;
    getLiteralAsync(name: string): Promise<[EnumLiteral, EnumAlt?]>;
}
