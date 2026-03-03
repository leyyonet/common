# Leyyo: Common
Common library for Leyyo framework

## Import
- `npm i @leyyo/common`

### Items
| Stereotype       | Name                                                         | Props | Description                                                                     |
|------------------|--------------------------------------------------------------|-------|---------------------------------------------------------------------------------|
| `common`         | [leyyo](src/base/leyyo.ts)                                   | `fqn` | Leyyo common instance                                                           |
| `common`         | [deployCommon](./src/common/deploy.common.ts)                | `fqn` | Common deploy manager for a component(feature)                                  |
| `common`         | [errorCommon](src/common/error.common.ts)                    | `fqn` | Common error manager                                                            |
| `common`         | [eventCommon](./src/common/event.common.ts)                  | `fqn` | common event manager                                                            |
| `common`         | [lifecycleCommon](src/common/lifecycle.common.ts)            | `fqn` | Common lifecycle manager                                                        |
| `common`         | [logCommon](src/common/log.common.ts)                        | `fqn` | Common log manager                                                              |
| `common`         | [repoCommon](src/common/repo.common.ts)                      | `fqn` | Common repo manager for centralized storage                                     |
| `predictor pool` | [enumPool](src/common/enum.pool.ts)                          | `fqn` | Enum pool for predictor                                                         |
| `predictor pool` | [errorPool](src/common/error.pool.ts)                        | `fqn` | Error pool for predictor                                                        |
| `predictor pool` | [literalPool](src/common/literal.pool.ts)                    | `fqn` | Literal pool for predictor                                                      |
| `global storage` | [leyyoStorage](src/sys/leyyo-storage.ts)                     |       | Global storage instance                                                         |
| `abstract`       | [Predictor](src/common/predictor.ts)                         | `fqn` | Abstract for predictor pool                                                     |
| `abstract`       | [EnumLitHandler](src/common/enum-lit.handler.ts)             | `fqn` | Abstract for enum/literal handler                                               |
| `class`          | [LazyInstance](src/base/lazy.instance.ts)                    | `fqn` | Lazy loader instance which hold links                                           |
| `class`          | [PredictorInstance](src/base/predictor.instance.ts)          | `fqn` | Predictor loader instance which hold prediction info and links                  |
| `class`          | [LoggerInstance](src/base/logger.instance.ts)                | `fqn` | Logger instance which is owned by a holder                                      |
| `class`          | [List](src/base/list.ts)                                     | `fqn` | Extended array class                                                            |
| `literal`        | [LogLevel](src/literal/log-level.ts)                         | `fqn` | Log levels                                                                      |
| `error`          | [LeyyoError](src/error/leyyo.error.ts)                       | `fqn` | Leyyo base error class, all error should be extended it, except developer error |
| `error`          | [CausedError](src/error/caused.error.ts)                     | `fqn` | Generic caused by error                                                         |
| `error`          | [HttpError](src/error/http.error.ts)                         | `fqn` | Generic http error                                                              |
| `error`          | [InvalidValueError](src/error/invalid-value.error.ts)        | `fqn` | Generic invalid value error                                                     |
| `error`          | [MultipleError](src/error/multiple.error.ts)                 | `fqn` | Irregular error bucket wich has multiple errors                                 |
| `error`          | [DeveloperError](src/error/developer.error.ts)               | `fqn` | Irregular error for only developer cases                                        |
| `lazy`           | [leyyoCommonLazy](src/loader/leyyo-common-lazy.ts)           |       | Lazy loader                                                                     |
| `predictor`      | [leyyoCommonPredictor](src/loader/leyyo-common-predictor.ts) |       | Predictor loader                                                                |

### Functions
| Scope       | Name                                                   | Params                  | Return               | Description                                                             |
|-------------|--------------------------------------------------------|-------------------------|----------------------|-------------------------------------------------------------------------|
| `system`    | [packageJson](src/sys/package-json.ts)                 | *(url)*                 | *PackageJson*        | Parse package json                                                      |
| `utility`   | [delay](src/function/delay.ts)                         | *(waiting?, response?)* | *given `response`*   | Delay or sleep for n msec                                               |
| `utility`   | [extendedType](src/function/extended-type.ts)          | *(value)*               | *ExtendedType*       | Get extended type of value, it produces more options for typeof keyword |
| `utility`   | [jitterInterval](src/function/jitter-interval.ts)      | *@go detail*            | *number*             | Generate next delay time with exponential & randomized manner           |
| `utility`   | [oneOrMore](src/function/one-or-more.ts)               | *(valueOrValues)*       | *values*             | Return array value from one or more type                                |
| `utility`   | [secureClone](src/function/secure-clone.ts)            | *(value)*               | *value*              | Clones a value (object) with taking attention circular objects          |
| `utility`   | [secureObject](src/function/secure-json.ts)            | *(value)*               | *string*             | Converts an object to secure object                                     |
| `utility`   | [secureJson](src/function/secure-json.ts)              | *(value)*               | *string*             | Converts an object to secure string                                     |
| `utility`   | [times](src/function/times.ts)                         | *(num)*                 | *number[]*           | Builds easy number array for foreach usage                              |
| `utility`   | [emptyFn](src/function/empty-fn.ts)                    | *(...)*                 | *void*               | Empty function, it can be more useful sometimes                         |
| `fqn`       | [deleteFqn](src/function/delete-fqn.ts)                | *(target)*              | *boolean*            | Remove fqn name                                                         |
| `fqn`       | [getFqn](src/function/get-fqn.ts)                      | *(target)*              | *string*             | Get fqn name                                                            |
| `fqn`       | [hasFqn](src/function/has-fqn.ts)                      | *(target)*              | *boolean*            | Has fqn name?                                                           |
| `fqn`       | [onFqnSet](src/function/on-fqn-set.ts)                 | *(target, callback)*    | *boolean*            | Stores a callback which will be triggered when target has fqn name      |
| `fqn`       | [setAnonymousFqn](src/function/set-anonymous-fqn.ts)   | *(target)*              | *string*             | Sets anonymous fqn name to a target                                     |
| `fqn`       | [setFqn](src/function/set-fqn.ts)                      | *(target, pck)*         | *string*             | Set fqn name to a target                                                |
| `fqn`       | [setFqnInstance](src/function/set-fqn-instance.ts)     | *(target, pck, name)*   | *string*             | Set fqn name to an instance                                             |
| `fqn`       | [triggerFqn](src/function/trigger-fqn.ts)              | *(target, full?)*       | *boolean*            | Trigger a callback when target has fqn name                             |
| `is`        | [isClass](src/function/is-class.ts)                    | *(fn)*                  | *boolean*            | Is class?                                                               |
| `is`        | [isEmpty](src/function/is-empty.ts)                    | *(value)*               | *boolean*            | Is empty? (null, undefined, empty string)                               |
| `is`        | [isFilledArr](src/function/is-filled-arr.ts)           | *(value)*               | *boolean*            | Is filled array?                                                        |
| `is`        | [isFilledObj](src/function/is-filled-obj.ts)           | *(value)*               | *boolean*            | Is filled object? (keys.length > 0)                                     |
| `is`        | [isObj](src/function/is-obj.ts)                        | *(value)*               | *boolean*            | Is object? ie: array is not evaluated as object                         |
| `is`        | [isText](src/function/is-text.ts)                      | *(value)*               | *boolean*            | Text means: it should be string, not empty, not enveloped by space      |
| `anonymous` | [setAnonymousName](src/function/set-anonymous-name.ts) | *(target, prefix?)*     | *string*             | Set anonymous name to a function or class                               |
| `anonymous` | [isAnonymousName](src/function/is-anonymous-name.ts)   | *(name)*                | *boolean*            | Is anonymous name?                                                      |
| `options`   | [optAdd](src/function/opt-add.ts)                      | *(opt, key, value)*     | *opt*                | Add key=value into options                                              |
| `options`   | [optAppend](src/function/opt-append.ts)                | *(opt, merged)*         | *opt*                | Merge two options                                                       |
| `options`   | [optCheck](src/function/opt-check.ts)                  | *(opt)*                 | *opt*                | Check option, if it's invalid, create empty options                     |
| `options`   | [optClone](src/function/opt-clone.ts)                  | *(opt)*                 | *opt*                | Clone existing option                                                   |
| `options`   | [optField](src/function/opt-field.ts)                  | *(opt, field)*          | *opt*                | Add field into options                                                  |
| `options`   | [optFn](src/function/opt-fn.ts)                        | *(opt)*                 | *opt*                | It's used to easy arrow function usage for lazy evaluation of options   |
| `props`     | [getKey](src/function/get-prop.ts)                     | *(target, key)*         | *any*                | Get target's visible property                                           |
| `props`     | [getSymbol](src/function/get-prop.ts)                  | *(target, key)*         | *any*                | Get target's hidden property                                            |
| `props`     | [getProp](src/function/get-prop.ts)                    | *(target, key)*         | *any*                | Get target's any property                                               |
| `props`     | [deleteKey](src/function/delete-prop.ts)               | *(target, key)*         | *boolean*            | Delete target's visible property                                        |
| `props`     | [deleteSymbol](src/function/delete-prop.ts)            | *(target, key)*         | *boolean*            | Delete target's hidden property                                         |
| `props`     | [deleteProp](src/function/delete-prop.ts)              | *(target, key)*         | *boolean*            | Delete target's any property                                            |
| `props`     | [setKey](src/function/set-prop.ts)                     | *(target, key, value)*  | *boolean*            | Set target's visible property                                           |
| `props`     | [setSymbol](src/function/set-prop.ts)                  | *(target, key, value)*  | *boolean*            | Set target's hidden property                                            |
| `props`     | [setProp](src/function/set-prop.ts)                    | *(target, key, value)*  | *boolean*            | Set target's any property                                               |
| `loader`    | [defineLazy](src/function/define-lazy.ts)              | *(package, postfix?)*   | *Lazy instance*      | Define a lazy instance                                                  |
| `loader`    | [definePredictor](src/function/define-predictor.ts)    | *(package, postfix?)*   | *Predictor instance* | Define a predictor instance                                             |
| `lifecycle` | [runExporter](src/function/run-exporter.ts)            | *()*                    | *Promise*            | Run exporter                                                            |
| `testing`   | [initTest](src/function/init-test.ts)                  | *()*                    | *void*               | Initialize test                                                         |
| `testing`   | [isTest](src/function/is-test.ts)                      | *()*                    | *boolean*            | Is current process test?                                                |
| `testing`   | [randomTestNo](src/function/random-test-no.ts)         | *()*                    | *string*             | Generate random test no                                                 |
| `testing`   | [testCase](src/function/test-case.ts)                  | *(pck, caseNo, ...)*    | *string*             | Build test case                                                         |
| `testing`   | [testName](src/function/test-name.ts)                  | *(case, title)*         | *string*             | Build test name                                                         |

### Test Cases
| Case                               | Error          | Message                                           | Method |
|------------------------------------|----------------|---------------------------------------------------|--------|
| `lifecycle:invalid-stage`          | DeveloperError | Invalid lifecycle stage                           |        |
| `lifecycle:not-found-stage`        | DeveloperError | Lifecycle stage could not be found                |        |
| `lifecycle:invalid-name`           | DeveloperError | Invalid lifecycle name                            |        |
| `lifecycle:sort-error`             | DeveloperError | Callback error during lifecycle order lambda      |        |
| `lifecycle:callback-error`         | DeveloperError | Callback error during lifecycle callback          |        |
| `lifecycle:invalid-callback`       | DeveloperError | Invalid lifecycle callback                        |        |
| `deploy:invalid-name`              | DeveloperError | Invalid component name                            |        |
| `deploy:invalid-callback`          | DeveloperError | Invalid caller callback                           |        |
| `deploy:wait-callback-error`       | DeveloperError | Callback error during caller's callback           |        |
| `deploy:pending-callback-error`    | DeveloperError | Callback error during pending callback            |        |
| `event:invalid-name`               | DeveloperError | Invalid event name                                |        |
| `event:invalid-listener`           | DeveloperError | Invalid listener callback                         |        |
| `repo:invalid-array-name`          | DeveloperError | Invalid repository array name                     |        |
| `repo:invalid-list-name`           | DeveloperError | Invalid repository list name                      |        |
| `repo:invalid-map-name`            | DeveloperError | Invalid repository map name                       |        |
| `repo:invalid-set-name`            | DeveloperError | Invalid repository set name                       |        |
| `fqn:invalid-name`                 | DeveloperError | Invalid fqn name                                  |        |
| `fqn:invalid-target`               | DeveloperError | Invalid fqn target                                |        |
| `fqn:invalid-package-name`         | DeveloperError | Invalid fqn package                               |        |
| `fqn:contains-dot`                 | DeveloperError | Name part contains dot                            |        |
| `fqn:enveloped-by-dots`            | DeveloperError | Name is enveloped with dots                       |        |
| `fqn:contains-anonymous`           | DeveloperError | Name constains anoymous                           |        |
| `fqn:starts-with-anonymous`        | DeveloperError | Name starts with anonymous                        |        |
| `fqn:already-literal`              | DeveloperError | Object is already a literal                       |        |
| `fqn:already-enum`                 | DeveloperError | Object is already an enum                         |        |
| `fqn:unexpected-type`              | DeveloperError | Target type is unexpected                         |        |
| `lazy:closed-for-member`           | DeveloperError | Member could not be added for closed holder       |        |
| `lazy:closed-for-dependency`       | DeveloperError | Dependency could not be added for closed holder   |        |
| `lazy:invalid-member`              | DeveloperError | Member type is invalid                            |        |
| `lazy:invalid-dependency`          | DeveloperError | Dependency type is invalid                        |        |
| `lazy:duplicated-dependency`       | DeveloperError | Dependency is duplicated (already added)          |        |
| `predictor:closed-for-member`      | DeveloperError | Member could not be added for closed holder       |        |
| `predictor:closed-for-dependency`  | DeveloperError | Dependency could not be added for closed holder   |        |
| `predictor:invalid-member`         | DeveloperError | Member type is invalid                            |        |
| `predictor:invalid-dependency`     | DeveloperError | Dependency type is invalid                        |        |
| `predictor:duplicated-dependency`  | DeveloperError | Dependency is duplicated (already added)          |        |
| `predictor:invalid-cluster`        | DeveloperError | Cluster is invalid                                |        |
| `predictor:invalid-anonymous-name` | DeveloperError | Anonymous name is invalid                         |        |
| `predictor:invalid-name`           | DeveloperError | Name (basic or full) is invalid                   |        |
| `predictor:invalid-target`         | DeveloperError | Target is invalid                                 |        |
| `predictor:invalid-options`        | DeveloperError | Options invalid                                   |        |
| `predictor:invalid-basic-name`     | DeveloperError | Basic name is invalid                             |        |
| `predictor:duplicated-cluster`     | DeveloperError | Cluster is duplicated                             |        |
| `predictor:duplicated-full-name`   | DeveloperError | Full name is duplicated                           |        |
| `predictor:duplicated-basic-name`  | DeveloperError | Basic name is duplicated                          |        |
| `predictor:duplicated-alias`       | DeveloperError | Alias is duplicated                               |        |
| `predictor:not-found-item`         | DeveloperError | Item could not be found                           |        |
| `predictor:not-found-target`       | DeveloperError | Target could not be found                         |        |
| `predictor:conflicted-name`        | DeveloperError | There is a conflict between names                 |        |
| `predictor:load-target-error`      | DeveloperError | Unexpected error during loading target            |        |
| `enum:load-alt-error`              | DeveloperError | Callback error during loading enum alternate data |        |
| `literal:load-alt-error`           | DeveloperError | Callback error during loading enum alternate data |        |
| `error:invalid-package-name`       | DeveloperError | Invalid package name                              |        |
| `error:invalid-short-name`         | DeveloperError | Invalid short name [{packageName}]                |        |
| `error:duplicated-package-name`    | DeveloperError | Duplicated package name [{packageName}]           |        |
| `error:invalid-config`             | DeveloperError | Unexpected error during set property              |        |
| `log:invalid-formatter`            | DeveloperError | Invalid log formatter                             |        |
| `log:invalid-styler`               | DeveloperError | Invalid log styler                                |        |
| `log:invalid-context-finder`       | DeveloperError | Invalid context finder lambda                     |        |
| `prop:get-error`                   | DeveloperError | Unexpected error during get property              |        |
| `prop:delete-error`                | DeveloperError | Unexpected error during delete property           |        |
| `prop:set-error`                   | DeveloperError | Unexpected error during set property              |        |
| `anonymous:invalid-target`         | DeveloperError | Target should be function                         |        |
| `anonymous:invalid-prefix`         | DeveloperError | Prefix should be text (if not empty)              |        |
| `anonymous:invalid-name`           | DeveloperError | Name should be test                               |        |
| `anonymous:contains-dot`           | DeveloperError | Name could not contain dot                        |        |
| `anonymous:starts-with-anonymous`  | DeveloperError | Name could not start with anonymous part          |        |
| `anonymous:set-error`              | DeveloperError | Unexpected error during set name                  |        |

### Symbols
| Name                      | Public | Description                                    |
|---------------------------|--------|------------------------------------------------|
| `leyyo:storage:global`    | -      | Key on `global` for central storage            |
| `leyyo:storage:packages`  | -      | Key on storage to store loaded packages        |
| `leyyo:storage:config`    | -      | Key on storage to store loaded configs         |
| `leyyo:repo:array`        | -      | Key on storage to store central arrays         |
| `leyyo:repo:list`         | -      | Key on storage to store central lists          |
| `leyyo:repo:map`          | -      | Key on storage to store central maps           |
| `leyyo:repo:set`          | -      | Key on storage to store central sets           |
| `leyyo:repo:volatile`     | -      | Key on storage to store volatile repositories  |
| `leyyo:fqn:package`       | √      | Package name on target                         |
| `leyyo:fqn:on-set`        | √      | Fqn callback on target                         |
| `leyyo:secure`            | √      | Multi-purpose link on targets, to handle leyyo |
| `leyyo:error:http-status` | √      | Http status on error class                     |
| `leyyo:error:message`     | √      | Default message on error class                 |
| `leyyo:error:i18n`        | √      | I18n feature on error class                    |
| `leyyo:error:emit`        | √      | Emit feature on error class                    |
| `leyyo:error:raised`      | √      | already raised on error instance               |
| `leyyo:error:flags`       | √      | Multi-purpose flags on error instance          |
| `leyyo:error:where`       | √      | Location on error instance                     |
| `leyyo:enum:name`         | √      | Name on enum instance                          |
| `leyyo:enum:alt`          | √      | Alteration map on enum instance                |
| `leyyo:enum:i18n`         | √      | I18n feature on enum instance                  |
| `leyyo:enum:alias`        | √      | Alias feature on enum instance                 |
| `leyyo:literal:name`      | √      | Name on literal array                          |
| `leyyo:literal:alt`       | √      | Alteration map on literal array                |
| `leyyo:literal:i18n`      | √      | I18n feature on literal array                  |
| `leyyo:literal:alias`     | √      | Alias feature on literal array                 |
| `leyyo:developer:case`    | √      | Case number on developer error                 |
| `leyyo:developer:where`   | √      | Location info on developer error               |
| `leyyo:repo:code`         | √      | Repository code on repo collection             |
| `leyyo:repo:type`         | √      | Repository type on repo collection             |

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
