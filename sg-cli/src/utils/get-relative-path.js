export function getRelativePath(path) {
  const paths = path.split("templates");
  path = paths[paths.length - 1];
  return path.includes("/app/")
    ? path.replace("/app/", "")
    : path.replace("\\app\\", "");
}
