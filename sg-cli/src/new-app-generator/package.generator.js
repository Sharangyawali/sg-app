import path from "path";
import ejs from "ejs";
import { writeFile } from "../utils/write-file.js";
import { installPackages } from "../utils/install-packages.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generatePackageJson(appName, dbName) {
  const root = path.join(process.cwd(), appName, "package.json");
  const contents = await ejs.renderFile(
    path.join(__dirname, "../../templates/app/package.json.ejs"),
    {
      name: appName,
    },
  );
  await writeFile(root, contents);
  let dbPackage;
  if (dbName) {
    switch (dbName) {
      case "mysql":
        dbPackage = "mysql2";
        break;
      case "sqlite":
        dbPackage = "sqlite3";
        break;
      case "mongodb":
        dbPackage = "mongodb";
        break;
      default:
        dbPackage = "pg";
        break;
    }
  }
  dbPackage
    ? await installPackages(appName, [
        `@sharangyawali/sg-app typeorm ${dbPackage} --save`,
      ])
    : await installPackages(appName, ["@sharangyawali/sg-app --save"]);
  await installPackages(appName, ["typescript ts-node-dev --save-dev"]);
}
