import { RequestMethodEnum } from "../enum";

export interface ControllerMethods<T = RequestMethodEnum | string> {
  method: T;
  path?: string;
  handler: string | symbol;
}
