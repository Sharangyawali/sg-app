import path from "path";
import ejs from "ejs";
import { writeFile } from "../utils/write-file.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateMain(appName) {
  const root = path.join(process.cwd(), appName, "src/main.ts");
  const contents = await ejs.renderFile(
    path.join(__dirname, "../../templates/app/src/main.ejs"),
    {},
  );
  await writeFile(root, contents);
}
