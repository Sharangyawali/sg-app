import { RouteInfo } from "./route-info.interface";

export interface GlobalPrefixOptions<T = RouteInfo> {
  exclude?: T[];
}
