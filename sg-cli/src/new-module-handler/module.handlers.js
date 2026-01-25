import { handleController } from "./controller.handlers.js";
import { handleDatasources } from "./datasources.handlers.js";
import { handleEntity } from "./entity.handlers.js";
import { handleRepository } from "./repositories.handlers.js";
import { serviceHandler } from "./service.handlers.js";
import { handleUseCase } from "./usecase.handlers.js";

export async function handleModule(className, fileName, dbName) {
  if (dbName) {
    await handleEntity(fileName, className, dbName);
    await handleRepository(fileName, className, dbName);
    await handleDatasources(className, dbName);
  }
  await serviceHandler(className, fileName, dbName);
  await handleUseCase(className, fileName);
  await handleController(className, fileName);
}
