import {
  addDatabaseProvider,
  updateDataSourceDomain,
  updateDBDataSource,
} from "../utils/update-files.js";
import path from "path";

async function handleDataSourceDomain(className) {
  const root = path.join(process.cwd(), "src/domain/datasource/datasource.ts");
  await updateDataSourceDomain(root, className);
}

async function handleDBDataSource(className, dbName) {
  const root = path.join(
    process.cwd(),
    "src/infra/datasource",
    dbName,
    `${dbName}.datasource.ts`
  );
  await updateDBDataSource(root, className, dbName);
}

async function handleDatabaseProvider(className, dbName) {
  const root = path.join(
    process.cwd(),
    "src/infra/datasource",
    dbName,
    `providers/${dbName}.provider.ts`
  );
  await addDatabaseProvider(root, `${dbName}Providers`, className, dbName);
}

export async function handleDatasources(className, dbName) {
  await handleDatabaseProvider(className, dbName);
  await handleDataSourceDomain(className);
  await handleDBDataSource(className, dbName);
}
