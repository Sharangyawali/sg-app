import { ControllerMethods } from "../interface";

function RequestMapping(method: string, path?: string): MethodDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const methods: ControllerMethods[] = target.methods || [];
    const index = methods.findIndex((m) => m.handler === propertyKey);
    if (index > -1)
      methods[index] = {
        ...methods[index],
        method: method,
        path: path && path.length > 0 && path[0] !== "/" ? "/" + path : path
      };
    else
      methods.push({
        handler: propertyKey,
        method,
        path: path && path.length > 0 && path[0] !== "/" ? "/" + path : path
      });
    target.methods = methods;
  };
}

export const Get = (path?: string) => RequestMapping("get", path);
export const Post = (path?: string) => RequestMapping("post", path);
export const Put = (path?: string) => RequestMapping("put", path);
export const Patch = (path?: string) => RequestMapping("patch", path);
export const Delete = (path?: string) => RequestMapping("delete", path);
