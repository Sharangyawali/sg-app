import path from "path";
import ejs from "ejs";
import { writeFile } from "../utils/write-file.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateEnvExample(appName, dbName) {
  const root = path.join(process.cwd(), appName, ".env.example");
  let contents;
  if (dbName)
    contents = await ejs.renderFile(
      path.join(__dirname, "../../templates/app/env.example.ejs"),
      {
        DATABASE: dbName.toUpperCase(),
      },
    );
  else
    contents = `
#APPLICATION
APP_PORT = "<< APP_PORT HERE >>"
    `;
  await writeFile(root, contents, true);
}
