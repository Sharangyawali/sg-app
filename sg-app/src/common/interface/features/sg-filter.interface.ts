import { HttpContext, HttpException } from "../..";

export interface SGFilter {
  catch(exception: HttpException, context: HttpContext): any;
}
