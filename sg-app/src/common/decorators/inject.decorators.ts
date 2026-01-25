import { Token } from "../interface";
import "reflect-metadata";
export function Inject(token: Token): ParameterDecorator & PropertyDecorator {
  return (target: any, _: string | symbol | undefined, index?: number) => {
    if (typeof index === "number") {
      const existing =
        Reflect.getMetadata("custom:inject_tokens", target) || {};
      existing[index] = token;
      Reflect.defineMetadata("custom:inject_tokens", existing, target);
    }
  };
}
