import { container } from "../../di-container";
import { Scope } from "../enum";
import { InjectableOptions } from "../interface";

export function Component(options?: InjectableOptions): ClassDecorator {
  return function (target: any) {
    container.register({
      token: options && options.token ? options.token : target,
      useClass: target as any,
      scope: options && options.scope ? options.scope : Scope.SINGLETON
    });
  };
}
