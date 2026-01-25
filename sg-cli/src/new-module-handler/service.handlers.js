import { updateIndex, updateModulesProviders } from "../utils/update-files.js";
import path from "path";
import ejs from "ejs";
import { writeFile } from "../utils/write-file.js";

async function handleServiceDomain(className, fileName) {
  const root = path.join(
    process.cwd(),
    "src/domain/services",
    `${fileName}.service.ts`,
  );
  const contents = await ejs.render(
    `
      export interface I<%= className %>Service{
    
      }
          `,
    {
      className: className,
    },
    {
      async: true,
    },
  );
  await writeFile(root, contents);
  await updateIndex(
    path.join(process.cwd(), "src/domain/services", `index.ts`),
    `./${fileName}.service`,
  );
}

async function handleApplicationService(className, fileName, dbName) {
  const root = path.join(
    process.cwd(),
    "src/application/services",
    `${fileName}.service.ts`,
  );
  let contents;
  if (dbName) {
    contents = await ejs.render(
      `
        import { Component, Inject } from "@sharangyawali/sg-app";
  import {I<%= className %>Service} from "../../domain/services";
  import { I<%= className %>Repository } from "../../domain/repositories";
  import { IDatasource } from "../../domain/datasource";

  @Component()
  export class <%= className %>ServiceImp implements I<%= className %>Service{
      private readonly repo: I<%= className %>Repository;
      constructor(
          @Inject(IDatasource)
          private _datasource:IDatasource
      ) {
          this.repo=_datasource.${className.toLowerCase()}Repo
      }
  }
        `,
      {
        className,
      },
      {
        async: true,
      },
    );
  } else {
    contents = await ejs.render(
      `
        import { Inject } from "@sharangyawali/sg-app";
  import {I<%= className %>Service} from "../../domain/services";

  export class <%= className %>ServiceImp implements I<%= className %>Service{}
        `,
      {
        className,
      },
      {
        async: true,
      },
    );
  }
  await writeFile(root, contents);
  await updateIndex(
    path.join(process.cwd(), "src/application/services", `index.ts`),
    `./${fileName}.service`,
  );
  await updateModulesProviders(
    path.join(process.cwd(), "src/application/services", `service.module.ts`),
    "ServiceModule",
    `./${fileName}.service`,
    `${className}ServiceImp`,
  );
}

export async function serviceHandler(className, fileName, dbName) {
  await handleServiceDomain(className, fileName);
  await handleApplicationService(className, fileName, dbName);
}
