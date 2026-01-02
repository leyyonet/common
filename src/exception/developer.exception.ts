import {Exception} from "./exception";
import type {DevOpt} from "../developer";

// noinspection Annotator
export class DeveloperException extends Exception {
    constructor(params?: DevOpt) {
        super('Developer Error', params);
    }
}
