import path from "path";
import ejs from "ejs";
import { writeFile } from "../utils/write-file.js";
import { getAllEjsFiles } from "../utils/get-ejs-files.js";
import { getRelativePath } from "../utils/get-relative-path.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateApplication(appName) {
  const files = await getAllEjsFiles(
    path.join(__dirname, "../../templates/app/src/application"),
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
