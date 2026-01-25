import { SGGuard } from "../interface";
import { container } from "../../di-container";
import { Scope } from "../enum";

export const globalGuards: any[] = [];

export function UseGuard(
  ...guardClasses: (SGGuard | Function)[]
): MethodDecorator {
  return function (target: any, propertyKey: string | symbol) {
    target[propertyKey].guards = guardClasses;
  };
}

export function GlobalGuard(): ClassDecorator {
  return function (target: any) {
    if (typeof target.prototype.canAccess !== "function")
      throw new Error(`${target.name} does not implements canActivate method`);
    globalGuards.push(target);
    container.register({
      token: target,
      useClass: target as any,
      scope: Scope.SINGLETON
    });
  };
}
