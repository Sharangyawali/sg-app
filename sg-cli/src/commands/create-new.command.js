import chalkAnimation from "chalk-animation";
import { confirm, select } from "@inquirer/prompts";
import { generateApp } from "../new-app-generator/app.generator.js";

export function create(program) {
  program
    .command("create-new <appName>")
    .description("GENERATES SG-APP IN CLEAN ARCHITECTURE")
    .action(async (appName) => {
      const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
      const rainbowTitle = chalkAnimation.rainbow(
        "Wants to generate files in clean architecture?  \n"
      );
      await sleep();
      rainbowTitle.stop();
      const needTypeOrm = await confirm({
        message: "Do you want to initialize typeorm?",
        default: true,
      });
      let dbName;
      if (needTypeOrm) {
        const database = await select({
          message: "Choose one of the database",
          choices: [
            {
              name: "Postgres",
              value: "postgres",
            },
            {
              name: "MySql",
              value: "mysql",
            },
            {
              name: "Sqlite",
              value: "sqlite",
            },
            {
              name: "MongoDb",
              value: "mongodb",
            },
          ],
          default: "postgres",
        });
        dbName = database;
      }
      const processingMessage = chalkAnimation.rainbow(
        "Generating your application .... \n"
      );
      await generateApp(appName, dbName);
      processingMessage.stop();
    });
}
