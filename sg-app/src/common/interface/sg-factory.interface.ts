import { CorsOptions } from "./cors.interface";
import { ISGApplication } from "./sg-application.interface";

export interface FactoryOptions {
    cors?: CorsOptions | boolean
}

export interface ISGFactory {
    create(appModule: any, options?: FactoryOptions): ISGApplication
}