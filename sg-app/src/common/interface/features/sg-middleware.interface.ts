import { NextFunction, Request, Response } from "express";

export interface SGMiddleware {
  use(request: Request, response: Response, next: NextFunction): any;
}
