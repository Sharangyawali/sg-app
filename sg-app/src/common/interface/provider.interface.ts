import { Scope } from "../enum";
import { Constructor, Token } from "./injection-token.interface";
import { Type } from "./type.interface";

export type ModuleProvider<T = any> =
  | Type<any>
  | ClassProvider<T>
  | ValueProvider<T>
  | FactoryProvider<T>;

export interface ClassProvider<T = any> {
  token: Token<T>;
  useClass?: Constructor<T>;
  scope: Scope;
}

export interface ValueProvider<T = any> {
  token: Token<T>;
  useValue?: T;
  scope: Scope;
}

export interface FactoryProvider<T = any> {
  inject: Token[];
  token: Token<T>;
  useFactory: (...args: any[]) => T | Promise<T>;
  scope: Scope;
}
export interface Provider<T = any> {
  token: Token<T>;
  useClass?: Constructor<T>;
  useValue?: T;
  scope: Scope;
  inject?: Token[];
  useFactory?: (...args: any[]) => T | Promise<T>;
}
