import { SGInterceptor } from "../interface";
import { container } from "../../di-container";
import { Scope } from "../enum";

export const globalInterceptors: any[] = [];

export function UseInterceptor(
  ...interceptorClasses: (SGInterceptor | Function)[]
): MethodDecorator {
  return function (target: any, propertyKey: string | symbol) {
    target[propertyKey].interceptors = interceptorClasses;
  };
}

export function GlobalInterceptors(): ClassDecorator {
  return function (target: any) {
    if (typeof target.prototype.intercept !== "function")
      throw new Error(`${target.name} does not implements intercept method`);
    globalInterceptors.push(target);
    container.register({
      token: target,
      useClass: target as any,
      scope: Scope.SINGLETON
    });
  };
}
