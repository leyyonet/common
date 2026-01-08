import type {EnvInstanceLike} from "./index.types";

export class EnvInstance<K extends string = string> implements EnvInstanceLike<K> {

    constructor(private readonly pck: string) {
    }

}
