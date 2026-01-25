import { RouteInfo } from "./route-info.interface";

export interface MiddlewareOptions<T = RouteInfo> {
  exclude?: T[];

  forRoutes?: T[];
}
