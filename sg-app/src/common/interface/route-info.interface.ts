import { RequestMethodEnum } from "../enum/request-method.enum";

export interface RouteInfo {
  routePrefix: string;
  method: RequestMethodEnum;
}
