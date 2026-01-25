import { updateIndex, updateModulesProviders } from "../utils/update-files.js";
import path from "path";
import ejs from "ejs";
import { writeFile } from "../utils/write-file.js";

async function handleNewUseCaseModule(className, fileName) {
  const root = path.join(
    process.cwd(),
    "src/application/usecases",
    fileName,
    `${fileName}.usecase.module.ts`,
  );
  const contents = await ejs.render(
    `
import { Module } from "@sharangyawali/sg-app";

@Module({
    providers: []
})
export class <%= className %>UseCaseModule { }
              `,
    {
      className: className,
    },
    {
      async: true,
    },
  );
  await writeFile(root, contents);
}

async function handleNewImport(className, fileName) {
  const root = path.join(
    process.cwd(),
    "src/application/usecases",
    fileName,
    `index.ts`,
  );
  const contents = await ejs.render(
    `
export * from './<%= fileName %>.usecase.module';
              `,
    {
      fileName,
    },
    {
      async: true,
    },
  );
  await writeFile(root, contents);
  await updateIndex(
    path.join(process.cwd(), "src/application/usecases", `index.ts`),
    `./${fileName}`,
  );
  await updateModulesProviders(
    path.join(process.cwd(), "src/application/usecases", `usecase.module.ts`),
    "UseCaseModule",
    `./${fileName}`,
    `${className}UseCaseModule`,
    true,
  );
}

export async function handleUseCase(className, fileName) {
  await handleNewUseCaseModule(className, fileName);
  await handleNewImport(className, fileName);
}
