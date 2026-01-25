import { spawn } from "child_process";
import path from "path";

export async function installPackages(appName, pkg) {
  return new Promise((resolve, reject) => {
    const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
    const directory = path.join(process.cwd(), appName);
    const child = spawn(npmCmd, ["i", ...pkg], {
      cwd: directory,
      shell: true,
      stdio: ["ignore", "pipe", "pipe"]
    });

    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`npm install exited with code ${code}\n${stderr}`));
    });
  });
}
