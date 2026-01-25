import path from "path";
import ejs from "ejs";
import { writeFile } from "../utils/write-file.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateAppModule(appName) {
  const root = path.join(process.cwd(), appName, "src/app.module.ts");
  const contents = await ejs.renderFile(
    path.join(__dirname, "../../templates/app/src/app.module.ejs"),
  );
  await writeFile(root, contents);
}
