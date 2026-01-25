import { readdir } from "fs/promises";

export async function getFolders(path) {
  const files = await readdir(path, {
    withFileTypes: true,
  });
  return files.filter((f) => f.isDirectory());
}
