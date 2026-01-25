import { Type } from "./type.interface";

export type Constructor<T = any> = new (...args: any[]) => T;
export interface Abstract<T> extends Function {
    prototype: T;
}
export type Token<T = any> = symbol | string | Type<T> | Function | Abstract<T> | Constructor<T>;

