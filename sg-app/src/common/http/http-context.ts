import { Request, Response } from "express";
import { ControllerMethods } from "../interface";

export class HttpContext {
  private readonly req: Request;
  private readonly res: Response;
  constructor(
    private readonly request: Request,
    private readonly response: Response,
    private readonly methodMeta: ControllerMethods
  ) {
    this.req = request;
    this.res = response;
  }

  getRequest(): Request {
    return this.req;
  }
  getResponse(): Response {
    return this.res;
  }
  getMetaData<T>(key: string): T {
    return this.methodMeta[key];
  }
}
