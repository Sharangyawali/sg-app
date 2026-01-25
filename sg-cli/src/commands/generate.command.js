import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import { getFolders } from "../utils/get-folders.js";
import path from "path";
import { hasDirectory } from "../utils/has-directory.js";
import { select } from "@inquirer/prompts";
import { handleModule } from "../new-module-handler/module.handlers.js";

export function generate(program) {
  program
    .command("generate")
    .description("GENERATES NEW MODULE")
    .action(async () => {
      const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
      const rainbowTitle = chalkAnimation.rainbow(
        "Wants to generate new module?  \n"
      );
      await sleep();
      rainbowTitle.stop();
      const { fileName, className } = await inquirer.prompt([
        {
          message: "Enter file name to generate",
          type: "input",
          name: "fileName",
        },
        {
          message: "Enter class name to generate",
          type: "input",
          name: "className",
        },
      ]);
      let dbName;
      const datasourcePath = path.join(process.cwd(), "src/infra/datasource");
      const isDirectoryPresent = hasDirectory(datasourcePath);
      if (isDirectoryPresent) {
        const files = await getFolders(datasourcePath);
        if (files.length == 1) dbName = files[0].name;
        else {
          const choices = files.map((f) => {
            return { name: f.name, value: f.name };
          });
          const selectedFolder = await select({
            message:
              "Detected multiple folders inside datasource!! \n Please select one",
            choices: choices,
            default: choices[0].value,
          });
          dbName = selectedFolder;
        }
      }
      const processingMessage = chalkAnimation.rainbow(
        "Generating your module .... \n"
      );
      await handleModule(className, fileName, dbName);
      processingMessage.stop();
    });
}
