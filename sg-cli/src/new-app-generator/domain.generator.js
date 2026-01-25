import path from "path";
import ejs from "ejs";
import { writeFile } from "../utils/write-file.js";
import { getAllEjsFiles } from "../utils/get-ejs-files.js";
import { getRelativePath } from "../utils/get-relative-path.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateDomain(appName, dbName) {
  const files = await getAllEjsFiles(
    path.join(__dirname, "../../templates/app/src/domain"),
  );
  for (const file of files) {
    if (
      dbName ||
      (!file.parentPath.includes("datasource") &&
        !file.parentPath.includes("entities") &&
        !file.parentPath.includes("repositories"))
    ) {
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
}
