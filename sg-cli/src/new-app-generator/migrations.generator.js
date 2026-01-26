import path from "path";
import ejs from "ejs";
import { writeFile } from "../utils/write-file.js";
import { fileURLToPath } from "url";
import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateDbMigrations(appName, dbName) {
  const root = path.join(
    process.cwd(),
    appName,
    `db/${dbName}/${dbName}-migrations.ts`,
  );
  const contents = await ejs.renderFile(
    path.join(
      __dirname,
      "../../templates/app/db/[database]/[database]-migrations.ejs",
    ),
    {
      database: dbName,
      DATABASE: dbName.toUpperCase(),
    },
  );
  await writeFile(root, contents);
  await fs.ensureDir(
    path.join(process.cwd(), appName, `db/${dbName}/migrations`),
  );
}
