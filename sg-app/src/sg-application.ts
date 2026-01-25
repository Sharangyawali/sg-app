import { Express } from "express";
import { GlobalPrefixOptions, ISGApplication, RoutRegister, StaticRoutes } from ".";
import express from "express";

export class SGApplication implements ISGApplication {
  private prefixOptions: GlobalPrefixOptions;
  private prefix: string;
  constructor(private app: Express) { }

  use(...args: any[]): this {
    this.app.use(...args);
    return this;
  }
  setStaticRoutes(options: StaticRoutes[]): this {
    options.forEach((o) => {
      o.prefix ? this.app.use(o.prefix, express.static(o.path, { ...(o.options) })) : this.app.use(express.static(o.path, { ...(o.options) }))
    })
    return this
  }
  setGlobalPrefix(prefix: string, options?: GlobalPrefixOptions): this {
    this.prefix = prefix;
    if (options) this.prefixOptions = options;
    return this;
  }
  async listen(port: number, callback?: (error?: Error) => void): Promise<any> {
    await new RoutRegister().register(this.app, this.prefix, this.prefixOptions);
    return this.app.listen(port, callback);
  }
}
