import { updateIndex } from "../utils/update-files.js";
import path from "path";
import ejs from "ejs";
import { writeFile } from "../utils/write-file.js";

async function handleDomainEntity(fileName, className) {
  const root = path.join(
    process.cwd(),
    "src/domain/entities",
    `${fileName}.entity.ts`
  );
  const contents = await ejs.render(
    `
      import { BaseEntity } from "./base.entity";

  export class <%= className %>Entity extends BaseEntity{

  }
      `,
    {
      className: className,
    },
    {
      async: true,
    }
  );
  await writeFile(root, contents);
  await updateIndex(
    path.join(process.cwd(), "src/domain/entities", `index.ts`),
    `./${fileName}.entity`
  );
}

async function handleDatasourceEntity(fileName, className, dbName) {
  const root = path.join(
    process.cwd(),
    "src/infra/datasource",
    dbName,
    `entities/${fileName}.${dbName}.entity.ts`
  );
  const contents = await ejs.render(
    `
      import { Entity } from "typeorm";
  import { BaseEntity } from "./base.entity";
  import { <%= className %>Entity } from "../../../../domain/entities";

  @Entity('<%= entity %>')
  export class <%= className %><%= Database %>Entity extends BaseEntity implements <%= className %>Entity{

  }
      `,
    {
      className: className,
      entity: className.toLowerCase(),
      Database: dbName.charAt(0).toUpperCase() + dbName.slice(1),
    },
    {
      async: true,
    }
  );
  await writeFile(root, contents);
  await updateIndex(
    path.join(
      process.cwd(),
      "src/infra/datasource",
      `${dbName}/entities`,
      `index.ts`
    ),
    `./${fileName}.${dbName}.entity`
  );
}
export async function handleEntity(fileName, className, dbName) {
  await handleDomainEntity(fileName, className);
  await handleDatasourceEntity(fileName, className, dbName);
}
