import { generateAppModule } from "./app-module.generator.js";
import { generateApplication } from "./application.generator.js";
import { generateCommon } from "./common.generator.js";
import { generateDomain } from "./domain.generator.js";
import { generateEnvExample } from "./env-example.generator.js";
import { generateInfra } from "./infra.generator.js";
import { generateMain } from "./main.generator.js";
import { generateDbMigrations } from "./migrations.generator.js";
import { generatePackageJson } from "./package.generator.js";
import { generateTsConfig } from "./tsconfig.generator.js";

export async function generateApp(appName, dbName) {
  await generatePackageJson(appName, dbName);
  await generateApplication(appName);
  await generateCommon(appName);
  await generateDomain(appName, dbName);
  await generateInfra(appName, dbName);
  await generateAppModule(appName);
  await generateTsConfig(appName, dbName);
  await generateMain(appName);
  await generateEnvExample(appName, dbName);
  if (dbName) await generateDbMigrations(appName, dbName);
}
