import prettier from "prettier";
import fs from "fs";

export async function format(content, filePath) {
  const options = await prettier.resolveConfig(process.cwd());
  return prettier.format(content, {
    ...options,
    filepath: filePath,
  });
}

export async function prettify(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const config = await prettier.resolveConfig(filePath);
  const formatted = await prettier.format(source, {
    ...config,
    filepath: filePath,
  });
  fs.writeFileSync(filePath, formatted);
}
