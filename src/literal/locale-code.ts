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