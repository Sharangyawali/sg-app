import { RequestParameters } from "../enum";
import { ControllerMethodParams } from "../interface";

function Validator(data: string, dtoClass: any): ParameterDecorator {
  return function (target: any, propertyKey: string | symbol, index: number) {
    const parameters: ControllerMethodParams[] =
      target[propertyKey].parameters || [];
    parameters.push({ index, dtoClass, paramType: data });
    target[propertyKey].parameters = parameters;
  };
}

export const Query = (dtoClass: any) => Validator(RequestParameters.QUERY, dtoClass);
export const Body = (dtoClass: any) => Validator(RequestParameters.BODY, dtoClass);
export const Params = (dtoClass: any) => Validator(RequestParameters.PARAMS, dtoClass);
export const UploadedFile = () => Validator(RequestParameters.FILE, null)
export const UploadedFiles = () => Validator(RequestParameters.FILES, null)
export const Req = () => Validator(RequestParameters.REQUEST, null)
export const Res = () => Validator(RequestParameters.RESPONSE, null)