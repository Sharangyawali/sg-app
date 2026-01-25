import { container } from "../../di-container";
import { Scope } from "../enum/scope.enum";
import { MiddlewareOptions } from "../interface/global-middleware-options.interface";

export const middlewares: any[] = [];

export function Middleware(options?: MiddlewareOptions): ClassDecorator {
  return function (target: any) {
    if (typeof target.prototype.use !== "function")
      throw new Error(`${target.name} does not implements use method`);
    middlewares.push({ target, options });
    container.register({
      token: target,
      useClass: target as any,
      scope: Scope.SINGLETON
    });
  };
}
