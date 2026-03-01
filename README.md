# Leyyo: Common
Common library for Leyyo framework

## Import
- `npm i @leyyo/common`

### Items
| Stereotype        | Name                                                          | Props                              | Description |
|-------------------|---------------------------------------------------------------|------------------------------------|-------------|
| `function`        | [parseAuth](./src/items/parse-auth.ts)                        |                                    |             |
| `config`          | [hdrAuthEnv](src/items/hdr-auth.env.ts)                       |                                    |             |
| `error`           | [AuthorizationError](./src/error/authorization.error.ts)      | `fqn`, `predictor`, `i18n`, `emit` |             |
| `request handler` | [authMiddleware](src/middleware/auth.middleware.ts)           | `fqn`                              |             |
| `foretell`        | [leyyoHdrAuthForetell](src/loader/leyyo-hdr-auth-foretell.ts) |                                    |             |
| `lazy`            | [leyyoHdrAuthLazy](src/loader/leyyo-hdr-auth-lazy.ts)         |                                    |             |

## Usage (Runtime)

## Test Cases
| Test Case | Error          | Message                                                   | Method                               |
|-----------|----------------|-----------------------------------------------------------|--------------------------------------|
| `100`     | DeveloperError | Invalid lifecycle stage                                   | add**Lifecycle**Stage                |
| `101`     | DeveloperError | Lifecycle stage could not be found [{stage}]              | add**Lifecycle**Stage                |
| `102`     | DeveloperError | Invalid lifecycle name [{stage}]                          | add**Lifecycle**Stage                |
| `103`     | DeveloperError | Invalid lifecycle callback [{stage}/{name}]               | add**Lifecycle**Stage                |
| `104`     | DeveloperError | Invalid lifecycle stage                                   | run**Lifecycle**Stage                |
| `105`     | DeveloperError | Lifecycle stage could not be found [{stage}]              | run**Lifecycle**Stage                |
| `106`     | DeveloperError | Callback error during lifecycle order lambda [{stage}]    | run**Lifecycle**Stage                |
| `107`     | DeveloperError | Callback error during lifecycle callback [{stage}/{name}] | run**Lifecycle**Stage                |
| `108`     | DeveloperError | Invalid lifecycle stage                                   | set**Lifecycle**OrderLambda          |
| `109`     | DeveloperError | Lifecycle stage could not be found [{stage}]              | set**Lifecycle**OrderLambda          |
| `110`     | DeveloperError | Invalid lifecycle callback [{stage}]                      | set**Lifecycle**OrderLambda          |
| `120`     | DeveloperError | Invalid component name                                    | wait**Deploy**                       |
| `121`     | DeveloperError | Invalid caller callback [{name}]                          | wait**Deploy**                       |
| `122`     | DeveloperError | Callback error during caller's callback [{name}]          | wait**Deploy**                       |
| `123`     | DeveloperError | Invalid component name                                    | complete**Deploy**                   |
| `124`     | DeveloperError | Callback error during pending callback [{name}]           | complete**Deploy**                   |
| `130`     | DeveloperError | Invalid event name                                        | listen**Event**                      |
| `131`     | DeveloperError | Invalid listener callback [{name}]                        | listen**Event**                      |
| `132`     | DeveloperError | Invalid event name                                        | deactivate**Event**                  |
| `133`     | DeveloperError | Invalid event name                                        | activate**Event**                    |
| `134`     | DeveloperError | Invalid event name                                        | emit**Event**                        |
| `140`     | DeveloperError | Invalid repository array name                             | newRepo**Array**                     |
| `141`     | DeveloperError | Invalid repository list name                              | newRepo**List**                      |
| `142`     | DeveloperError | Invalid repository map name                               | newRepo**Map**                       |
| `143`     | DeveloperError | Invalid repository set name                               | newRepo**Set**                       |
| `150`     | DeveloperError | Invalid fqn name                                          | set**Fqn**                           |
| `151`     | DeveloperError | Empty fqn target [{fqn}]                                  | set**Fqn**                           |
| `152`     | DeveloperError | Invalid fqn target [{fqn}]                                | set**Fqn**                           |
| `220`     | DeveloperError | Invalid error class                                       | define**Error**                      |
| `221`     | DeveloperError | Invalid error options [{className}]                       | define**Error**                      |
| `222`     | DeveloperError | Invalid error options                                     | defineLazy**Error**                  |
| `223`     | DeveloperError | Invalid error name                                        | defineLazy**Error**                  |
| `224`     | DeveloperError | Invalid error class path [{className}]                                 | defineLazy**Error**                  |
| `225`     | DeveloperError | Invalid error class name                                  | loadLazy**Error**                    |
| `226`     | DeveloperError | Error was not defined [{className}]                                  | loadLazy**Error**                    |
| `227`     | DeveloperError | Callback error during loading lazy class [${name}]                  | loadLazy**Error**                    |
| `230`     | DeveloperError | Invalid package name                                      | add**Error**KnownPackage               |
| `231`     | DeveloperError | Invalid short name [{packageName}]                        | add**Error**KnownPackage                 |
| `232`     | DeveloperError | Duplicated package name [{packageName}]                   | add**Error**KnownPackage                 |
| `180`     | DeveloperError | Invalid enum data                                         | define**Enum**                       |
| `181`     | DeveloperError | Invalid enum options                                      | define**Enum**                       |
| `182`     | DeveloperError | Invalid enum name                                         | define**Enum**                       |
| `183`     | DeveloperError | Invalid enum load path                                    | defineLazy**Enum**                   |
| `184`     | DeveloperError | Invalid enum options                                      | defineLazy**Enum**                   |
| `185`     | DeveloperError | Invalid enum name                                         | defineLazy**Enum**                   |
| `186`     | DeveloperError | Callback error during loading enum data                   | loadLazy**Enum**                     |
| `187`     | DeveloperError | Callback error during loading enum alternate data         | loadLazy**Enum**                     |
| `200`     | DeveloperError | Invalid log formatter                                     | set**Log**Formatter                  |
| `201`     | DeveloperError | Invalid log styler                                        | set**Log**DeploymentStyler           |
| `202`     | DeveloperError | Invalid log styler                                        | set**Log**LocalStyler                |
| `203`     | DeveloperError | Invalid context finder lambda                             | listen `context:set-finder` at logFn |
| ``        | DeveloperError |                                                           |                                      |

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
