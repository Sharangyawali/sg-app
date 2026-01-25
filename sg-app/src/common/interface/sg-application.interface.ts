import { GlobalPrefixOptions } from "./global-prefix-options.interface";
import { StaticRoutes } from "./static-route.interface";

export interface ISGApplication {
  use(...args: any[]): this;
  setStaticRoutes(options: StaticRoutes[]): this;
  setGlobalPrefix(prefix: string, options?: GlobalPrefixOptions): this;
  listen(port: number, callback?: (error?: Error) => void): Promise<any>;
}
