import path from "path";
import ejs from "ejs";
import { writeFile } from "../utils/write-file.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateTsConfig(appName, dbName) {
  const root = path.join(process.cwd(), appName, "tsconfig.json");
  const contents = dbName
    ? await ejs.renderFile(
        path.join(__dirname, "../../templates/app/typeorm-tsconfig.json.ejs"),
      )
    : await ejs.renderFile(
        path.join(__dirname, "../../templates/app/tsconfig.json.ejs"),
      );
  await writeFile(root, contents);
}
