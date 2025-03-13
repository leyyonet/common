import {InitLike, LogConsumer, Logger, ShiftMain, ShiftSecure} from "../shared";

export interface CommonLogLike extends ShiftSecure<CommonLogSecure>, LogConsumer {
    create(clazz: Object | Function | string): Logger;
}


export type CommonLogSecure = ShiftMain<CommonLogLike> & InitLike;