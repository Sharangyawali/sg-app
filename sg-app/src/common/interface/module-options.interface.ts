import { ModuleProvider } from "./provider.interface";

export interface ModuleOptions {
  controllers?: any[];
  imports?: any[];
  providers?: ModuleProvider[];
}
