import express from "express";
import { AppLogger, ConfigService, container, FactoryOptions, ISGApplication, ISGFactory, Scope, SGApplication } from ".";
import cors from 'cors';
export class SGFactory implements ISGFactory {
  private app;
  constructor() {
    this.registerClasses()
  }
  create(_: any, options?: FactoryOptions): ISGApplication {
    this.app = express();
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    if (options && options.cors)
      typeof options.cors === 'boolean' ? this.app.use(cors()) : this.app.use(cors({ ...options.cors }))
    return new SGApplication(this.app);
  }
  private registerClasses() {
    container.register({
      scope: Scope.SINGLETON,
      token: ConfigService,
      useClass: ConfigService
    });
    container.register({
      scope: Scope.SINGLETON,
      token: AppLogger,
      useClass: AppLogger
    });
  }
}
