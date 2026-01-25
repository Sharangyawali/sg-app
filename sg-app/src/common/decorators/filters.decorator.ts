import { container } from "../../di-container";
import { Scope } from "../enum";

export const filters: any[] = [];

export function Catch(): ClassDecorator {
  return function (target: any) {
    if (typeof target.prototype.catch !== "function")
      throw new Error(`${target.name} does not implements catch method`);
    filters.push(target);
    container.register({
      token: target,
      useClass: target as any,
      scope: Scope.SINGLETON
    });
  };
}
