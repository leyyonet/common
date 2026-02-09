# Leyyo: Localization
Common library for Leyyo framework

## Import
- `npm i @leyyo/localization`

## Usage (Runtime)

### Country Code
> All country codes with alpha 3 and related language codes
> 
> @see [ISO 3166](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes)
>
```typescript
import {countryHandler} from "@leyyo/localization";

/*
 * Country exists
 */
console.log(countryHandler.has('IE'));
// ==> true

/*
 * Get country object as
 * {code: string, name: string, alpha: string, languages: string[]}
 */
console.log(countryHandler.get('IE'));
// ==> {code: 'IE', name: 'Ireland', alpha3: 'IRL', languages: ['en', 'ga']}

/*
 * Get name of country
 */
console.log(countryHandler.getName('IE'));
// ==> 'Ireland'

/*
 * Get alpha 3 code of country
 */
console.log(countryHandler.getAlpha3('IE'));
// ==> 'IRL'

/*
 * Get used languages of country
 */
console.log(countryHandler.getLanguages('IE'));
// ==> ['en', 'ga']

/*
 * Find all countries by given used language codes
 */
console.log(countryHandler.findByLanguage('ga'));
// ==> ['IE', ...]

/*
 * Get country objects by given country codes
 */
console.log(countryHandler.getSelected('IE', 'KE'));
// ==> [
//      {code: 'IE', name: 'Ireland', alpha3: 'IRL', languages: ['en', 'ga']},
//      {code: 'KE', name: 'Kenya', alpha3: 'KEN', languages: ['sw', 'en']}
//     ]

/*
 * List all country objects
 * 
 * @note it can be used during combo
 */
console.log(countryHandler.getAll()); // A-Z ordered
// ==> [{code: 'AD', name: 'Andorra', alpha3: 'AND', languages: ['ca']}, ...]

/*
 * List all country codes
 * 
 * @note it can be used during validations
 */
console.log(countryHandler.codes); // A-Z ordered
// ==> ['AD', 'AE', 'AF', 'AG', 'AI', 'AL', ...]

```

### Exchange Code
> All exchange codes with symbol, number and related country codes
> 
> @see [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217)
>
```typescript
import {exchangeHandler} from "@leyyo/localization-common";

/*
 * Exchange exists
 */
console.log(exchangeHandler.has('USD'));
// ==> true

/*
 * Get exchange object as
 * {code: string, name: string, symbol: string, number: number, countries: string[]}
 */
console.log(exchangeHandler.get('USD'));
// ==> {code: 'USD', name: 'US Dollar', symbol: '$', number: 840, countries: ['AS', 'GU', 'IO', 'US', 'VG', ...]}

/*
 * Get name of exchange
 */
console.log(exchangeHandler.getName('USD'));
// ==> 'US Dollar'

/*
 * Get symbol of exchange
 */
console.log(exchangeHandler.getSymbol('USD'));
// ==> '$'

/*
 * Get number of exchange
 */
console.log(exchangeHandler.getNumber('USD'));
// ==> 840

/*
 * Get related countries of exchange
 */
console.log(exchangeHandler.getCountries('USD'));
// ==> ['AS', 'GU', 'IO', 'US', 'VG', ...]

/*
 * Find all exchanges by given country code
 */
console.log(exchangeHandler.findByCountry('US'));
// ==> ['USD', ...]

/*
 * Get exchange objects by given codes
 */
console.log(exchangeHandler.getSelected('USD', 'EUR'));
// ==> [
//      {code: 'USD', name: 'US Dollar', symbol: '$', number: 840, countries: ['AS', 'GU', 'IO', 'US', 'VG', ...]},
//      {code: 'EUR', name: 'Euro', symbol: '€', number: 978, countries: ["GB", "AD", "AT", "BE", "CY", ...]}
//     ]

/*
 * List all exchange objects
 * 
 * @note it can be used during combo
 */
console.log(exchangeHandler.getAll()); // A-Z ordered
// ==> [{code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', number: 784, countries: ['AE']}, ...]

/*
 * List all country codes
 * 
 * @note it can be used during validations
 */
console.log(exchangeHandler.codes); // A-Z ordered
// ==> ['AED', 'AFN', 'ALL', 'AMD', 'AOA', 'ARS', 'AWG', ...]

```

### Language Code
> All language codes
>
> @see [ISO 639](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes)
>
```typescript
import {languageHandler} from "@leyyo/localization-common";

/*
 * Language exists
 */
console.log(languageHandler.has('tr'));
// ==> true

/*
 * Get language object as {code: string, name: string}
 */
console.log(languageHandler.get('tr'));
// ==> {code: 'tr', name: 'Turkish'}

/*
 * Get name of language
 */
console.log(languageHandler.getName('tr'));
// ==> 'Turkish'

/*
 * Get language objects by given codes
 */
console.log(languageHandler.getSelected('tr', 'bg'));
// ==> [
//      {code: 'tr', name: 'Turkish'},
//      {code: 'bg', name: 'Bulgarian'}
//     ]

/*
 * List all language objects
 * 
 * @note it can be used during combo
 */
console.log(languageHandler.getAll()); // A-Z ordered
// ==> [{code: 'aa', name: 'Afar'}, ...]

/*
 * List all language codes
 * 
 * @note it can be used during validations
 */
console.log(languageHandler.codes); // A-Z ordered
// ==> ['aa', 'ab', 'ae', 'af', 'ak', 'am', 'an', 'ar', 'as', 'av', 'ay', 'az', ...]

```

### Locale Code
> All locale codes
>
> @see [IANA](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry)
>
> **Note**
> It also covers language codes
> 
```typescript
import {localeHandler} from "@leyyo/localization-common";

/*
 * Locale exists
 */
console.log(localeHandler.has('es-ve'));
// ==> true

/*
 * Get locale object as
 * {code: string, name: string, language?: string, countries: string[]}
 */
console.log(localeHandler.get('es-ve'));
// ==> {code: 'es-ve', name: 'Spanish (Venezuela)', language: 'es', countries: ['VE']}

/*
 * Get name of locale
 */
console.log(localeHandler.getName('es-ve'));
// ==> 'Spanish (Venezuela)'

/*
 * Get language of locale
 */
console.log(localeHandler.getLanguage('es-ve'));
// ==> 'es'

/*
 * Get countries of locale
 */
console.log(localeHandler.getCountries('es-ve'));
// ==> ['VE']

/*
 * Get locale objects by given codes
 */
console.log(localeHandler.getSelected('es-ve', 'fr-mc'));
// ==> [
//      {code: 'es-ve', name: 'Spanish (Venezuela)', language: 'es', countries: ['VE']},
//      {code: 'fr-mc', name: 'French (Monaco)', language: 'fr', countries: ['MC']}
//     ]

/*
 * List all locale objects
 * 
 * @note it can be used during combo
 */
console.log(localeHandler.getAll()); // A-Z ordered
// ==> [{code: 'af', name: 'Afrikaans', language: 'af', countries: ['ZA']}, ...]

/*
 * List all locale codes
 * 
 * @note it can be used during validations
 */
console.log(localeHandler.codes); // A-Z ordered
// ==> ['af', 'sq', 'an', 'ar', 'ar-dz', 'ar-bh', 'ar-eg', ...]

```

### Timezone Code
> All timezone codes
>
> @see [TZ](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
>
> **Note**
> It also covers alias timezones
>
```typescript
import {timezoneHandler} from "@leyyo/localization-common";

/*
 * Timezone exists
 */
console.log(timezoneHandler.has('Africa/Dakar'));
// ==> true

/*
 * Get timezone object as
 * {code: string, name: string, sdt: number, dst: number, parent?: string, countries: string[]}
 */
console.log(timezoneHandler.get('Europe/Berlin'));
// ==> {code: 'Europe/Berlin', name: 'Europe > Berlin', sdt: 1, dst: 2, parent: undefined, countries: ['DE']}

/*
 * Get timezone object for alias
 */
console.log(timezoneHandler.get('Africa/Dakar')); // it's alias, so points to "Africa/Abidjan"
// ==> {code: 'Africa/Dakar', name: 'Africa > Abidjan', sdt: 1, dst: 2, parent: 'Africa/Abidjan', countries: ['CI', 'BF', 'GH', 'GM', 'GN', 'IS',...]}

/*
 * Get name of timezone
 */
console.log(timezoneHandler.getName('Europe/Berlin'));
// ==> 'Europe > Berlin'

/*
 * Get hour for timezone as SDT (3 options)
 */
console.log(timezoneHandler.getHour('Europe/Berlin'));
// ==> 1

console.log(timezoneHandler.getSdt('Europe/Berlin'));
// ==> 1

console.log(timezoneHandler.getStandard('Europe/Berlin'));
// ==> 1

/*
 * Get hour for timezone as DST (3 options)
 */
console.log(timezoneHandler.getHour('Europe/Berlin', true));
// ==> 2

console.log(timezoneHandler.getDst('Europe/Berlin'));
// ==> 2

console.log(timezoneHandler.getDaylightSaving('Europe/Berlin'));
// ==> 2

/*
 * Get countries of timezone
 */
console.log(timezoneHandler.getCountries('Europe/Berlin'));
// ==> ['DE']

/*
 * Get alias status of timezone
 */
console.log(timezoneHandler.isAlias('Africa/Dakar'));
// ==> true

console.log(timezoneHandler.isAlias('Africa/Abidjan'));
// ==> false

/*
 * Get timezone objects by given codes
 */
console.log(timezoneHandler.getSelected('Europe/Berlin', 'Africa/Dakar'));
// ==> [
//      {code: 'Europe/Berlin', name: 'Europe > Berlin', sdt: 1, dst: 2, parent: undefined, countries: ['DE']},
//      {code: 'Africa/Dakar', name: 'Africa > Abidjan', sdt: 1, dst: 2, parent: 'Africa/Abidjan', countries: ['CI', 'BF', 'GH', 'GM', 'GN', 'IS',...]}
//     ]

/*
 * List all timezone objects
 * 
 * @note it can be used during combo
 */
console.log(timezoneHandler.getAll()); // A-Z ordered
// ==> [{code: 'Etc/GMT+1', name: 'Etc > GMT +1', sdt: -1, dst: -1, parent: undefined, countries: []}, ...]

/*
 * List all timezone codes
 * 
 * @note it can be used during validations
 */
console.log(timezoneHandler.codes); // A-Z ordered
// ==> ['Etc/GMT+1', 'Etc/GMT+2', ...]

```

## Usage (Design time)
```typescript
import type {CountryCode, ExchangeCode, LanguageCode, LocaleCode, TimezoneCode} from "@leyyo/localization-common";
// please "type" keyword to prevent runtime loading

interface MyInterface {
    country: CountryCode;
    exchange: ExchangeCode;
    language: LanguageCode;
    locale: LocaleCode;
    timezone: TimezoneCode;
}


```

## Standards
- Language: `TS`
- Eslint: `Yes`
- Static Code Analysis: `Yes` *IntelliJ Code Inspections*
- DDD - Document Driven: `Yes`
- DDD - Domain Driven: `Yes`
- EDD - Exception Driven: `Yes`
- TDD - Test Driven: `Yes`
- LDD - Log Driven: `Yes`
- 12FA - 12 Factor-App: `50%` *Partially*

## Dependencies
### NO

---
### Prepared by
- Mustafa Yelmer
- mustafayelmer(at)gmail.com
- `2022-07-08`
