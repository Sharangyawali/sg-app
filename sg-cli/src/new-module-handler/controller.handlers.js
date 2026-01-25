import { updateModulesProviders } from "../utils/update-files.js";
import path from "path";
import ejs from "ejs";
import { writeFile } from "../utils/write-file.js";

async function handleControllerFile(className, fileName) {
  const root = path.join(
    process.cwd(),
    "src/infra/controllers",
    fileName,
    `${fileName}.controller.ts`,
  );
  const contents = await ejs.render(
    `
import { RestController } from "@sharangyawali/sg-app";

@RestController("<%= controller %>")
export class <%= className %>Controller {
}
              `,
    {
      className: className,
      controller: className.toLowerCase(),
    },
    {
      async: true,
    },
  );
  await writeFile(root, contents);
}

async function handleControllerModule(className, fileName) {
  const root = path.join(
    process.cwd(),
    "src/infra/controllers",
    fileName,
    `${fileName}-controller.module.ts`,
  );
  const contents = await ejs.render(
    `
    import { Module } from "@sharangyawali/sg-app";
import { <%= className %>Controller } from "./<%= fileName %>.controller";

@Module({
  controllers: [<%= className %>Controller],
})
export class <%= className %>ControllerModule {}
              `,
    {
      className: className,
      fileName,
    },
    {
      async: true,
    },
  );
  await writeFile(root, contents);
  await updateModulesProviders(
    path.join(process.cwd(), "src/infra/controllers", `controller.module.ts`),
    "ControllerModule",
    `./${fileName}/${fileName}-controller.module`,
    `${className}ControllerModule`,
    true,
  );
}

export async function handleController(className, fileName) {
  await handleControllerFile(className, fileName);
  await handleControllerModule(className, fileName);
}
