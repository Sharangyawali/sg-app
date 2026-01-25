import { container } from "../../di-container";
import { Scope } from "../enum";
import { ModuleOptions, Provider } from "../interface";

export function Module(options?: ModuleOptions): ClassDecorator {
  return function (target: any) {
    if (options.providers) {
      options.providers.forEach((p) => {
        if (Object.keys(p).length > 0) {
          const provider = p as Provider;
          if (provider.useClass || provider.useValue || provider.useFactory)
            container.register({
              scope: provider.scope || Scope.SINGLETON,
              token: provider.token,
              useValue: provider.useValue,
              useClass: provider.useClass,
              useFactory: provider.useFactory,
              inject: provider.inject
            });
        }
      });
    }
  };
}
