import {DeveloperErrorCtor, LeyyoErrorCtor} from "../error";
import {LoggerInstanceCtor} from "../class";
import {
    DeployCommonLike,
    EnumPoolLike,
    ErrorCommonLike,
    ErrorPoolLike,
    EventCommonLike,
    EventType,
    LifecycleCommonLike,
    LiteralPoolLike,
    LogCommonLike,
    Logger,
    RepoCommonLike
} from "../common";

export interface LeyyoLike {
    get developerError(): DeveloperErrorCtor;

    get leyyoError(): LeyyoErrorCtor;

    get loggerInstance(): LoggerInstanceCtor;

    get logger(): Logger;

    get deployCommon(): DeployCommonLike;

    get enumPool(): EnumPoolLike;

    get errorCommon(): ErrorCommonLike;

    get errorPool(): ErrorPoolLike;

    get eventCommon(): EventCommonLike<EventType>;

    get lifecycleCommon(): LifecycleCommonLike;

    get literalPool(): LiteralPoolLike;

    get logCommon(): LogCommonLike;


    get repoCommon(): RepoCommonLike;
}
