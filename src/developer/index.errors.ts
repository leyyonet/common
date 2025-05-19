import {DevOpt} from "./index.types";

export class LeyyoError extends Error {
    params: DevOpt;

    constructor(message: string, opt: DevOpt) {
        super(message);
        this.params = opt;
    }
}
export class DeveloperError extends LeyyoError {
}

export class InvalidValueError extends LeyyoError {
}

export class CausedError extends LeyyoError {
    causedBy: Error;
    constructor(message: string, opt: DevOpt, e: Error) {
        super(message, opt);
        this.causedBy = e;
    }
}
