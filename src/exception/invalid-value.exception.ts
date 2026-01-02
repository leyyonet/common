import {Exception} from "./exception";
import type {DevOpt} from "../developer";

// noinspection Annotator
export class InvalidValueException extends Exception {
    constructor(message: string, params?: DevOpt) {
        super(message, params);
    }
}
