import { Express, Request, Response, Router } from "express";
import { AppLogger } from "./logger";
import {
  ControllerMethodParams,
  ControllerMethods,
  controllers,
  filters,
  globalGuards,
  globalInterceptors,
  GlobalPrefixOptions,
  HttpContext,
  HttpException,
  MiddlewareOptions,
  middlewares,
  RequestMethodEnum,
  RequestParameters,
  RouteInfo,
  Scope,
  SGFilter,
  SGGuard,
  SGInterceptor,
  SGMiddleware
} from "./common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CLSService } from "./cls";
import { container } from "./di-container";

export class RoutRegister {
  private readonly logger: AppLogger;
  private router: Router;
  private prefix: string;
  private prefixOptions: GlobalPrefixOptions;
  private app: Express;
  constructor() {
    this.logger = new AppLogger();
  }

  async register(
    app: Express,
    globalPrefix?: string,
    prefixOptions?: GlobalPrefixOptions
  ) {
    this.app = app;
    this.router = app.router;
    this.prefix = globalPrefix;
    this.prefixOptions = prefixOptions;
    this.registerCLS();
    this.registerMiddleWares();
    await this.registerControllerCLasses();
  }
  private registerCLS() {
    container.register({
      scope: Scope.SINGLETON,
      token: CLSService,
      useClass: CLSService
    });
  }

  private registerMiddleWares() {
    for (const middleware of middlewares) {
      this.app.use(async (req, res, next) => {
        let path = req.path;
        if (this.prefix) {
          const splits = path.split(`${this.prefix}`);
          if (splits.length > 1) path = splits[1];
          else path = splits[0];
        }
        const options: MiddlewareOptions = middleware.options;
        if (
          options?.exclude &&
          options?.exclude.length > 0 &&
          this.doContains(options?.exclude, path, req.method)
        ) {
          return next();
        }
        if (
          options?.forRoutes &&
          options?.forRoutes.length > 0 &&
          !this.doContains(options?.forRoutes, path, req.method)
        ) {
          return next();
        }
        const middlewareInstance = await container.resolve<SGMiddleware>(
          middleware.target
        );
        await middlewareInstance.use(req, res, next);
      });
    }
  }

  private doContains(
    excludes: RouteInfo[],
    path: string,
    method: string
  ): Boolean {
    return excludes.some(
      (e) =>
        path.startsWith(e.routePrefix) &&
        (e.method === RequestMethodEnum.ALL ||
          e.method === method.toLowerCase())
    );
  }

  private async registerControllerCLasses() {
    for (let ControllerClass of controllers) {
      const prefix = ControllerClass.prototype.prefix;
      for (const method of (ControllerClass.prototype
        .methods || []) as ControllerMethods[]) {
        const guards: any[] = [
          ...(ControllerClass.prototype[method.handler].guards || []),
          ...globalGuards
        ];
        const interceptors: any[] = [
          ...(ControllerClass.prototype[method.handler].interceptors || []),
          ...globalInterceptors
        ];
        const parameters: ControllerMethodParams[] =
          ControllerClass.prototype[method.handler].parameters || [];
        const scope = container.computeEffectiveScope(ControllerClass)
        await this.registerRoute(
          prefix,
          method,
          guards,
          interceptors,
          parameters,
          ControllerClass,
          scope
        );
      }
    }
  }

  private async registerRoute(
    prefix: string,
    method: ControllerMethods,
    guards: any[],
    interceptors: any[],
    parameters: ControllerMethodParams[],
    controllerInstance: any,
    scope: Scope
  ) {
    let path = method.path ? `${prefix}${method.path}` : prefix;
    if (
      this.prefix &&
      (!this.prefixOptions ||
        !this.prefixOptions.exclude ||
        this.prefixOptions.exclude.length <= 0 ||
        !this.doContains(this.prefixOptions.exclude, path, method.method))
    ) {
      path = this.prefix + path;
    }
    const logString = `[ROUTE] MAPPED{${path}, ${method.method.toUpperCase()}}`;
    if (scope == Scope.SINGLETON) {
      controllerInstance = await container.resolve<any>(controllerInstance)
    }
    this.router[method.method](path, async (req: Request, res: Response) => {
      const cls = await container.resolve(CLSService);
      cls.run(req, async () => {
        const httpContext = new HttpContext(req, res, method);
        try {
          await this.routeHandler(
            req,
            res,
            guards,
            interceptors,
            httpContext,
            parameters,
            scope !== Scope.SINGLETON ? await container.resolve<any>(controllerInstance, cls.get('requestId')) : controllerInstance,
            method
          );
        } catch (error) {
          if (error instanceof HttpException) {
            await this.catchExceptions(httpContext, error);
          }
          else {
            console.log({ error })
          }
          if (!res.headersSent)
            res.status(500).json({ message: "Internal Server Error!!" });
        }
        finally {
          container.removeRequest(cls.get('instanceId'))
        }
      });
    });
    this.logger.log(logString);
  }

  private async routeHandler(
    req: Request,
    res: Response,
    guards: any[],
    interceptors: any[],
    httpContext: HttpContext,
    parameters: any[],
    controller: any,
    method: ControllerMethods
  ) {
    await this.registerGuards(guards, httpContext);
    const afterResponseInterceptor = await this.handleRequestInterceptors(
      interceptors,
      httpContext
    );
    const validatedParameters = await this.validateParameters(
      parameters,
      req,
      res
    );
    let data = await controller[method.handler](...validatedParameters);
    data = await this.handleResponseInterceptors(
      afterResponseInterceptor,
      data
    );
    if (!res.headersSent)
      res.send(data);
  }
  private async registerGuards(
    guards: any[],
    httpContext: HttpContext,
  ) {
    for (const guard of guards) {
      const guardInstance = await container.resolve<SGGuard>(guard);
      const canActive = await guardInstance.canAccess(httpContext);
      if (!canActive) throw new HttpException("Forbidden", 403);
    }
  }

  private async handleRequestInterceptors(
    interceptors: any[],
    httpContext: HttpContext
  ): Promise<((data: any) => any)[]> {
    const afterInterceptors: ((data: any) => any)[] = [];
    for (const interceptor of interceptors) {
      let interceptorInstance;
      if (typeof interceptor == "object") interceptorInstance = interceptor;
      else
        interceptorInstance = await container.resolve<SGInterceptor>(interceptor);
      const afterIntercept = await interceptorInstance.intercept(httpContext);
      if (afterIntercept) afterInterceptors.push(afterIntercept);
    }
    return afterInterceptors;
  }

  private async handleResponseInterceptors(
    interceptors: ((data: any) => any)[],
    data: any
  ): Promise<any> {
    for (const afterInterceptor of interceptors) {
      data = await afterInterceptor(data);
    }
    return data;
  }

  private async validateParameters(
    parameters: ControllerMethodParams[],
    request: Request,
    response: Response
  ): Promise<any[]> {
    const transformedParameters = [];
    parameters.sort((a, b) => a.index - b.index);
    for (const { paramType, dtoClass } of parameters) {
      let paramData;
      if (paramType == RequestParameters.QUERY) {
        paramData = structuredClone(request.query);
      } else if (paramType == RequestParameters.BODY)
        paramData = structuredClone(request.body);
      else if (paramType == RequestParameters.PARAMS)
        paramData = structuredClone(request.params);
      else if (paramType == RequestParameters.FILE)
        paramData = structuredClone(request["file"]);
      else if (paramType == RequestParameters.FILES)
        paramData = structuredClone(request["files"]);
      else if (paramType == RequestParameters.REQUEST)
        paramData = request;
      else if (paramType == RequestParameters.RESPONSE)
        paramData = response;
      if (dtoClass) {
        const transformedClass = plainToInstance(
          dtoClass,
          { ...paramData },
          { enableImplicitConversion: true }
        );
        const errors = await validate(transformedClass, {
          whitelist: true
        });
        if (errors.length > 0) {
          throw new HttpException(errors, 400);
        }
        transformedParameters.push(transformedClass);
      } else {
        transformedParameters.push(paramData);
      }
    }
    return transformedParameters;
  }

  private async catchExceptions(
    httpContext: HttpContext,
    error: HttpException
  ) {
    for (const filter of filters) {
      const filterInstance = await container.resolve<SGFilter>(filter);
      await filterInstance.catch(error, httpContext);
    }
  }
}
