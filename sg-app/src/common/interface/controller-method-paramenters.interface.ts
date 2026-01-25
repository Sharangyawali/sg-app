import { RequestParameters } from "../enum";

export interface ControllerMethodParams<T = RequestParameters | string> {
  dtoClass: any;
  index: number;
  paramType: T;
}
