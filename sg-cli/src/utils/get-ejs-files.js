import { readdir } from "fs/promises";

export async function getAllEjsFiles(path) {
  const files = await readdir(path, {
    recursive: true,
    withFileTypes: true
  });
  return files.filter((f) => f.name.includes(".ejs"));
}
