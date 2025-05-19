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
