// noinspection JSUnusedGlobalSymbols
/**
 * Weak True items
 * */
export const StorageTypeItems = ['array', 'list', 'map', 'set'] as const;
/**
 * Storage type literal, as an enum
 * */
export type StorageType = typeof StorageTypeItems[number];

/**
 * Weak True items
 * */
export const PrimitiveItems = ['string', 'number', 'boolean'] as const;
/**
 * Weak True
 * */
export type Primitive = typeof PrimitiveItems[number];
/**
 * Weak True items
 * */
export const RealValueItems = ['string', 'number', 'bigint', 'boolean', 'object', 'function'] as const;
/**
 * Weak True
 * */
export type RealValue = typeof RealValueItems[number];
/**
 * Weak True items
 * */
export const KeyValueItems = ['string', 'number'] as const;

/**
 * Weak True items
 * */
export const WeakTrueItems = ['1', 'true', 't', 'yes', 'y', 'on'] as const;
/**
 * Weak True
 * */
export type WeakTrue = typeof WeakTrueItems[number];
/**
 * Weak False items
 * */
export const WeakFalseItems = ['0', '-1', 'false', 'f', 'no', 'n', 'off'] as const;
/**
 * Weak False
 * */
export type WeakFalse = typeof WeakFalseItems[number];
/**
 * Weak Boolean
 * */
export type WeakBoolean = WeakTrue & WeakFalse;


/**
 * Http Method items
 * */
export const HttpMethodItems = ['delete', 'get', 'head', 'link', 'options', 'patch', 'post', 'purge', 'put', 'unlink'] as const;
/**
 * Http Method
 * */
export type HttpMethod = typeof HttpMethodItems[number];

/**
 * Http Place items
 * */
export const HttpPlaceItems = ['query', 'body', 'header', 'path'] as const;
/**
 * Http Place
 * */
export type HttpPlace = typeof HttpPlaceItems[number];


/**
 * Severity items
 * */
export const SeverityItems = ['debug', 'error', 'fatal', 'info', 'log', 'trace', 'warn'] as const;
/**
 * Severity for log and errors
 * */
export type Severity = typeof SeverityItems[number];

/**
 * Environment items
 * */
export const EnvironmentItems = ['automation', 'development', 'local', 'production', 'staging', 'test'] as const;
/**
 * Environment
 * */
export type Environment = typeof EnvironmentItems[number];


/**
 * Country code items
 * */
export const CountryCodeItems = ['AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AN', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX',
    'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BM', 'BN', 'BO', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD',
    'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CS', 'CU', 'CV', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC',
    'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN',
    'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS',
    'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS',
    'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX',
    'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM',
    'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM',
    'SN', 'SO', 'SR', 'ST', 'SV', 'SY', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ',
    'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'YE', 'YT', 'ZA', 'ZM', 'ZW'] as const;
/**
 * Country code
 * */
export type CountryCode = typeof CountryCodeItems[number];
/**
 * Language code items
 * */
export const LanguageCodeItems = ['af', 'an', 'ar', 'as', 'ast', 'az', 'be', 'bg', 'bn', 'br', 'bs', 'ca', 'ce', 'ch', 'co', 'cr', 'cs',
    'cv', 'cy', 'da', 'de', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fj', 'fo', 'fr', 'fur', 'fy', 'ga', 'gd', 'gl', 'gu', 'he', 'hi',
    'hr', 'hsb', 'ht', 'hu', 'hy', 'id', 'is', 'it', 'iu', 'ja', 'ji', 'ka', 'kk', 'km', 'kn', 'ko', 'ks', 'ky', 'la', 'lb', 'lt', 'lv', 'mi',
    'mk', 'ml', 'mo', 'mr', 'ms', 'mt', 'my', 'nb', 'ne', 'ng', 'nl', 'nn', 'no', 'nv', 'oc', 'om', 'or', 'pa', 'pl', 'pt', 'qu', 'rm', 'ro',
    'ru', 'sa', 'sb', 'sc', 'sd', 'sg', 'si', 'sk', 'sl', 'so', 'sq', 'sr', 'sv', 'sw', 'sx', 'sz', 'ta', 'te', 'th', 'tig', 'tk', 'tlh',
    'tn', 'tr', 'ts', 'tt', 'uk', 'ur', 've', 'vi', 'vo', 'wa', 'xh', 'zh', 'zu'] as const;
/**
 * Language codes
 * */
export type LanguageCode = typeof LanguageCodeItems[number];
/**
 * Locale code items
 * */
export const LocaleCodeItems = ['af', 'an', 'ar', 'ar-ae', 'ar-bh', 'ar-dz', 'ar-eg', 'ar-iq', 'ar-jo', 'ar-kw', 'ar-lb', 'ar-ly',
    'ar-ma', 'ar-om', 'ar-qa', 'ar-sa', 'ar-sy', 'ar-tn', 'ar-ye', 'as', 'ast', 'az', 'be', 'bg', 'bn', 'br', 'bs', 'ca', 'ce', 'ch',
    'co', 'cr', 'cs', 'cv', 'cy', 'da', 'de', 'de-at', 'de-ch', 'de-de', 'de-li', 'de-lu', 'el', 'en', 'en-au', 'en-bz', 'en-ca',
    'en-gb', 'en-ie', 'en-jm', 'en-nz', 'en-ph', 'en-tt', 'en-us', 'en-za', 'en-zw', 'eo', 'es', 'es-ar', 'es-bo', 'es-cl', 'es-co',
    'es-cr', 'es-do', 'es-ec', 'es-es', 'es-gt', 'es-hn', 'es-mx', 'es-ni', 'es-pa', 'es-pe', 'es-pr', 'es-py', 'es-sv', 'es-uy',
    'es-ve', 'et', 'eu', 'fa', 'fa-ir', 'fi', 'fj', 'fo', 'fr', 'fr-be', 'fr-ca', 'fr-ch', 'fr-fr', 'fr-lu', 'fr-mc', 'fur', 'fy', 'ga',
    'gd', 'gd-ie', 'gl', 'gu', 'he', 'hi', 'hr', 'hsb', 'ht', 'hu', 'hy', 'id', 'is', 'it', 'it-ch', 'iu', 'ja', 'ji', 'ka', 'kk', 'km',
    'kn', 'ko', 'ko-kp', 'ko-kr', 'ks', 'ky', 'la', 'lb', 'lt', 'lv', 'mi', 'mk', 'ml', 'mo', 'mr', 'ms', 'mt', 'my', 'nb', 'ne', 'ng', 'nl',
    'nl-be', 'nn', 'no', 'nv', 'oc', 'om', 'or', 'pa', 'pa-in', 'pa-pk', 'pl', 'pt', 'pt-br', 'qu', 'rm', 'ro', 'ro-mo', 'ru', 'ru-mo',
    'sa', 'sb', 'sc', 'sd', 'sg', 'si', 'sk', 'sl', 'so', 'sq', 'sr', 'sv', 'sv-fi', 'sv-sv', 'sw', 'sx', 'sz', 'ta', 'te', 'th', 'tig',
    'tk', 'tlh', 'tn', 'tr', 'ts', 'tt', 'uk', 'ur', 've', 'vi', 'vo', 'wa', 'xh', 'zh', 'zh-cn', 'zh-hk', 'zh-sg', 'zh-tw', 'zu'] as const;
/**
 * Locale codes
 *
 * Pattern: [Language Code]-[Country Code]
 * */
export type LocaleCode = typeof LocaleCodeItems[number];