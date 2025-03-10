import {CommonFqn, CommonFqnSecure} from "./index-types";
import {Leyyo} from "../leyyo";
import {FqnDefinedProvider, FqnStereoType, Keys, LY_ATTACHED_FQN, LY_PENDING_FQN_REGISTER} from "../shared";
import {CommonHook} from "../hook";

// noinspection JSUnusedLocalSymbols
export class CommonFqnImpl implements CommonFqn, CommonFqnSecure {
    private hook: CommonHook;

    get $back(): CommonFqn {
        return this;
    }

    $init(leyyo: Leyyo): void {
        this.hook = leyyo.hook;

        const fields = ['name', 'register'] as Keys<FqnDefinedProvider>;

        const rec = {proper: false} as FqnDefinedProvider;
        fields.forEach(field => {
            rec[field] = this[field];
        });

        // define itself temporarily for fqn operations
        leyyo.hook.defineProvider<FqnDefinedProvider>(LY_ATTACHED_FQN, CommonFqnImpl, rec);

        // when new fqn provider is defined, replace all common methods
        leyyo.hook.whenProviderDefined<FqnDefinedProvider>(LY_ATTACHED_FQN, CommonFqnImpl, (ins) => {
            fields.forEach(field => {
                if (typeof ins[field] === 'function') {
                    this[field] = ins[field];
                }
            });
        });
    }

    get $secure(): CommonFqnSecure {
        return this;
    }

    name(value: any): string {
        switch (typeof value) {
            case "function":
                return value.name;
            case "object":
                return value.constructor.name;
            case "string":
                return value;
            default:
                return null;
        }
    }

    register(value: any, type: FqnStereoType, pckName: string): void {
        this.hook.queueForCallback(LY_PENDING_FQN_REGISTER, value, type, pckName);
    }


}