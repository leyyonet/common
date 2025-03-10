import {InitLike, LogConsumer, Logger, ShiftMain, ShiftSecure} from "../shared";

export interface CommonLog extends ShiftSecure<CommonLogSecure>, LogConsumer {
    create(clazz: Object | Function | string): Logger;
}


export type CommonLogSecure = ShiftMain<CommonLog> & InitLike;