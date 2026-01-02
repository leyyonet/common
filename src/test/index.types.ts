import type {InitLike, ShiftMain, ShiftSecure} from "../shared";

export interface TestCommonLike extends ShiftSecure<TestCommonSecure> {
    title(testCase: string|number, title: string): string;
    code(pck: string, testCase: string|number): string;
    get is(): boolean;
}


export interface TestCommonSecure extends ShiftMain<TestCommonLike>, InitLike {
    $ok(): void;
}

