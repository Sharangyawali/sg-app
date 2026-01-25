import fs from "fs-extra";
import path from "path";
import { format } from "./format.js";

export async function writeFile(filePath, content, excludeFormat) {
  await fs.ensureDir(path.dirname(filePath));
  let formatted;
  if (!excludeFormat) formatted = await format(content, filePath);
  else formatted = content;

  await fs.writeFile(filePath, formatted);
}
