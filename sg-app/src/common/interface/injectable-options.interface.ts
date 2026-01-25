import { Scope } from "../enum";

export interface InjectableOptions<T = Scope> {
  scope: T;
  token?: string;
}
