import {InitLike, ShiftMain, ShiftSecure} from "../shared";

export interface CommonTestLike extends ShiftSecure<CommonTestSecure> {
    title(testCase: string|number, title: string): string;
    code(pck: string, testCase: string|number): string;
    get is(): boolean;
}


export interface CommonTestSecure extends ShiftMain<CommonTestLike>, InitLike {
    $ok(): void;
}

