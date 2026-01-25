import { updateIndex } from "../utils/update-files.js";
import path from "path";
import ejs from "ejs";
import { writeFile } from "../utils/write-file.js";

async function handleDomainRepository(fileName, className) {
  const root = path.join(
    process.cwd(),
    "src/domain/repositories",
    `${fileName}.repository.ts`
  );
  const contents = await ejs.render(
    `
import { <%= className %>Entity } from "../entities";
import { GenericRepository } from "./generic.repository";

export interface I<%= className %>Repository extends GenericRepository<<%= className %>Entity> {

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
    path.join(process.cwd(), "src/domain/repositories", `index.ts`),
    `./${fileName}.repository`
  );
}

async function handleDatasourceRepository(fileName, className, dbName) {
  const root = path.join(
    process.cwd(),
    "src/infra/datasource",
    dbName,
    `repositories/${fileName}.${dbName}.repository.ts`
  );
  const contents = await ejs.render(
    `
import { DataSource, Repository } from "typeorm";
import { <%= className %>Entity } from "../../../../domain/entities";
import { I<%= className %>Repository } from "../../../../domain/repositories";
import { <%= Database %>GenericRepository } from "./<%= database %>-generic.repository";
import { <%= className %><%= Database %>Entity } from "../entities";
import { Inject } from "@sharangyawali/sg-app";
import { DATA_SOURCE_<%= DATABASE %> } from "../providers";

export class <%= className %><%= Database %>RepositoryImp extends <%= Database %>GenericRepository<<%= className %>Entity> implements I<%= className %>Repository {
    constructor(
        protected readonly repo: Repository<<%= className %><%= Database %>Entity>,
        @Inject(DATA_SOURCE_<%= DATABASE %>)
        protected readonly dataSource: DataSource,
    ) {
        super(repo, dataSource, '<%= entity %>');
    }
}
      `,
    {
      className: className,
      entity: className.toLowerCase(),
      database: dbName,
      DATABASE: dbName.toUpperCase(),
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
      `${dbName}/repositories`,
      `index.ts`
    ),
    `./${fileName}.${dbName}.repository`
  );
}
export async function handleRepository(fileName, className, dbName) {
  await handleDomainRepository(fileName, className);
  await handleDatasourceRepository(fileName, className, dbName);
}
