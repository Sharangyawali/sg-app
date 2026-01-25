import { container } from "../../di-container";
import { Scope } from "../enum";

export const controllers: any[] = [];

export function RestController(prefix: string = "/"): ClassDecorator {
  return function (target: any) {
    target.prototype.prefix = prefix[0] !== "/" ? "/" + prefix : prefix;
    controllers.push(target);
    container.register({
      token: target,
      useClass: target as any,
      scope: Scope.SINGLETON
    });
  };
}
