import { HttpContext } from "../..";

export interface SGInterceptor {
  intercept(httpContext: HttpContext): Promise<(data: any) => any | void>;
}
