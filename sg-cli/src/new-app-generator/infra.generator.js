import path from "path";
import ejs from "ejs";
import { writeFile } from "../utils/write-file.js";
import { getAllEjsFiles } from "../utils/get-ejs-files.js";
import { getRelativePath } from "../utils/get-relative-path.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateController(appName) {
  const files = await getAllEjsFiles(
    path.join(__dirname, "../../templates/app/src/infra/controllers"),
  );
  for (const file of files) {
    const root = path.join(
      process.cwd(),
      appName,
      getRelativePath(file.parentPath),
      file.name.replace(".ejs", ".ts"),
    );
    const contents = await ejs.renderFile(
      path.join(file.parentPath, file.name),
    );
    await writeFile(root, contents);
  }
}

async function generateServer(appName) {
  const files = await getAllEjsFiles(
    path.join(__dirname, "../../templates/app/src/infra/server"),
  );
  for (const file of files) {
    const root = path.join(
      process.cwd(),
      appName,
      getRelativePath(file.parentPath),
      file.name.replace(".ejs", ".ts"),
    );
    const contents = await ejs.renderFile(
      path.join(file.parentPath, file.name),
    );
    await writeFile(root, contents);
  }
}

async function generateEntities(appName, dbName) {
  const files = await getAllEjsFiles(
    path.join(
      __dirname,
      "../../templates/app/src/infra/datasource/[database]/entities",
    ),
  );
  for (const file of files) {
    const root = path.join(
      process.cwd(),
      appName,
      getRelativePath(file.parentPath),
      file.name.replace(".ejs", ".ts"),
    );
    const contents = await ejs.renderFile(
      path.join(file.parentPath, file.name),
    );
    await writeFile(root.replace(/\[database\]/g, dbName), contents);
  }
}

async function generateProviders(appName, dbName) {
  const files = await getAllEjsFiles(
    path.join(
      __dirname,
      "../../templates/app/src/infra/datasource/[database]/providers",
    ),
  );
  for (const file of files) {
    const root = path.join(
      process.cwd(),
      appName,
      getRelativePath(file.parentPath),
      file.name.replace(".ejs", ".ts"),
    );
    const contents = await ejs.renderFile(
      path.join(file.parentPath, file.name),
      {
        database: dbName,
        DATABASE: dbName.toUpperCase(),
      },
    );
    await writeFile(root.replace(/\[database\]/g, dbName), contents);
  }
}

async function generateRepositories(appName, dbName) {
  const files = await getAllEjsFiles(
    path.join(
      __dirname,
      "../../templates/app/src/infra/datasource/[database]/repositories",
    ),
  );
  for (const file of files) {
    const root = path.join(
      process.cwd(),
      appName,
      getRelativePath(file.parentPath),
      file.name.replace(".ejs", ".ts"),
    );
    root.replace(/\[database\]/g, dbName);
    const contents = await ejs.renderFile(
      path.join(file.parentPath, file.name),
      {
        Database: dbName.charAt(0).toUpperCase() + dbName.slice(1),
        database: dbName,
      },
    );
    await writeFile(root.replace(/\[database\]/g, dbName), contents);
  }
}

async function generateDbDatasource(appName, dbName) {
  const root = path.join(
    process.cwd(),
    appName,
    `src/infra/datasource/${dbName}/${dbName}.datasource.ts`,
  );
  const contents = await ejs.renderFile(
    path.join(
      __dirname,
      "../../templates/app/src/infra/datasource/[database]/[database].datasource.ejs",
    ),
    {
      DATABASE: dbName.toUpperCase(),
      Database: dbName.charAt(0).toUpperCase() + dbName.slice(1),
    },
  );
  await writeFile(root, contents);
}

async function generateDbModule(appName, dbName) {
  const root = path.join(
    process.cwd(),
    appName,
    `src/infra/datasource/${dbName}/${dbName}.module.ts`,
  );
  const contents = await ejs.renderFile(
    path.join(
      __dirname,
      "../../templates/app/src/infra/datasource/[database]/[database].module.ejs",
    ),
    {
      database: dbName,
      Database: dbName.charAt(0).toUpperCase() + dbName.slice(1),
    },
  );
  await writeFile(root, contents);
}

async function generateDatasourceModule(appName, dbName) {
  const root = path.join(
    process.cwd(),
    appName,
    `src/infra/datasource/datasource.module.ts`,
  );
  const contents = await ejs.renderFile(
    path.join(
      __dirname,
      "../../templates/app/src/infra/datasource/datasource.module.ejs",
    ),
    {
      Database: dbName.charAt(0).toUpperCase() + dbName.slice(1),
      database: dbName,
    },
  );
  await writeFile(root, contents);
}

async function generateDataSource(appName, dbName) {
  dbName = dbName.toLowerCase();
  await generateEntities(appName, dbName);
  await generateProviders(appName, dbName);
  await generateRepositories(appName, dbName);
  await generateDbDatasource(appName, dbName);
  await generateDbModule(appName, dbName);
  await generateDatasourceModule(appName, dbName);
}

async function generateInfraModule(appName, dbName) {
  const root = path.join(process.cwd(), appName, "src/infra/infra.module.ts");
  let contents = await ejs.renderFile(
    path.join(__dirname, "../../templates/app/src/infra/infra.module.ejs"),
  );
  if (!dbName) {
    contents = contents
      .replace(
        /^\s*import\s+\{\s*DataSourceModule\s*\}\s+from\s+["'][^"']+["'];\s*\n?/gm,
        "",
      )
      .replace(
        /(\bimports\s*:\s*\[[\s\S]*?)(\s*DataSourceModule\s*,?\s*)([\s\S]*?\])/m,
        "$1$3",
      );
  }
  await writeFile(root, contents);
}

export async function generateInfra(appName, dbName) {
  await generateController(appName);
  await generateServer(appName);
  if (dbName) await generateDataSource(appName, dbName);
  await generateInfraModule(appName, dbName);
}
