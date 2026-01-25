import fs from "fs";

export function hasDirectory(directoryPath) {
  try {
    const stats = fs.statSync(directoryPath);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
}
