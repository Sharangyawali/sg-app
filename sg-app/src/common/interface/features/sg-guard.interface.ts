import { HttpContext } from "../..";

export interface SGGuard {
  canAccess(httpContext: HttpContext): Promise<Boolean>;
}
