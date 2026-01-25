import { Project, StructureKind, SyntaxKind } from "ts-morph";
import { prettify } from "./format.js";
function checkDublicateImport(sourceFile, moduleSpecifier, namedImports) {
  return sourceFile
    .getImportDeclarations()
    .find(
      (i) =>
        (i.getModuleSpecifier =
          moduleSpecifier && i.getNamedImports == namedImports),
    );
}

export async function updateIndex(indexFilePath, importPath) {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
  });

  const sourceFile = project.getSourceFileOrThrow(indexFilePath);
  sourceFile.addExportDeclaration({
    moduleSpecifier: importPath,
  });
  await sourceFile.save();
}

export async function updateDataSourceDomain(providerPath, className) {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
  });

  const sourceFile = project.getSourceFileOrThrow(providerPath);
  sourceFile.addImportDeclaration({
    moduleSpecifier: "../repositories",
    namedImports: `I${className}Repository`,
  });

  const datasourceClass = sourceFile.getClassOrThrow("IDatasource");

  datasourceClass.addProperty({
    name: `${className.toLowerCase()}Repo`,
    type: `I${className}Repository`,
    hasExclamationToken: false,
  });

  await sourceFile.save();
  prettify(providerPath);
}

export async function updateModulesProviders(
  path,
  className,
  moduleSpecifier,
  providerName,
  isImport,
) {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
  });

  const sourceFile = project.getSourceFileOrThrow(path);
  sourceFile.addImportDeclaration({
    moduleSpecifier,
    namedImports: providerName,
  });
  const moduleClass = sourceFile.getClassOrThrow(className);
  const moduleDecorator = moduleClass.getDecorator("Module");
  const moduleOptions = moduleDecorator.getArguments()[0];
  const providersArray = moduleOptions
    .asKindOrThrow(SyntaxKind.ObjectLiteralExpression)
    .getProperty(isImport ? "imports" : "providers");
  if (providersArray) {
    const providers = providersArray.getInitializer();
    if (providers) {
      providers.addElement(providerName);
    }
  } else {
    moduleOptions.addPropertyAssignment({
      name: isImport ? "imports" : "providers",
      initializer: `[${providerName}]`,
    });
  }
  await sourceFile.save();
  prettify(path);
}

export async function updateDBDataSource(providerPath, className, dbName) {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
  });

  const sourceFile = project.getSourceFileOrThrow(providerPath);
  sourceFile.addImportDeclaration({
    moduleSpecifier: "../../../domain/repositories",
    namedImports: `I${className}Repository`,
  });
  sourceFile.addImportDeclaration({
    moduleSpecifier: "../../../domain/entities",
    namedImports: `${className}Entity`,
  });
  sourceFile.addImportDeclaration({
    moduleSpecifier: "./entities",
    namedImports: `${className}${dbName.charAt(0).toUpperCase() + dbName.slice(1)}Entity`,
  });
  sourceFile.addImportDeclaration({
    moduleSpecifier: "./repositories",
    namedImports: `${className}${dbName.charAt(0).toUpperCase() + dbName.slice(1)}RepositoryImp`,
  });
  const dublicate = checkDublicateImport(sourceFile, "typeorm", "Repository");
  if (!dublicate)
    sourceFile.addImportDeclaration({
      moduleSpecifier: "typeorm",
      namedImports: "Repository",
    });

  const datasourceClass = sourceFile.getClassOrThrow(
    `${dbName.charAt(0).toUpperCase() + dbName.slice(1)}DataSource`,
  );

  datasourceClass.addProperty({
    name: `public ${className.toLowerCase()}Repo`,
    type: `I${className}Repository`,
    hasExclamationToken: false,
  });
  const [constructor] = datasourceClass.getConstructors();
  constructor.addParameter({
    name: `private _${className.toLowerCase()}Repo`,
    type: `Repository<${className}${dbName.charAt(0).toUpperCase() + dbName.slice(1)}Entity>`,
    decorators: [
      {
        name: "Inject",
        arguments: [`${className}Entity.InjectableString`],
      },
    ],
  });
  constructor.addStatements([
    `this.${className.toLowerCase()}Repo = new ${className}${dbName.charAt(0).toUpperCase() + dbName.slice(1)}RepositoryImp(
      this._${className.toLowerCase()}Repo,
      this._datasource
    )`,
  ]);

  await sourceFile.save();
  prettify(providerPath);
}

export async function addDatabaseProvider(
  providerPath,
  providerVariable,
  className,
  dbName,
) {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
  });

  const sourceFile = project.getSourceFileOrThrow(providerPath);

  sourceFile.addImportDeclaration({
    moduleSpecifier: "../../../../domain/entities",
    namedImports: `${className}Entity`,
  });

  sourceFile.addImportDeclaration({
    moduleSpecifier: "../entities",
    namedImports: `${className}${dbName.charAt(0).toUpperCase() + dbName.slice(1)}Entity`,
  });

  const declaration =
    sourceFile.getVariableDeclarationOrThrow(providerVariable);

  const providers = declaration.getInitializerIfKindOrThrow(
    SyntaxKind.ArrayLiteralExpression,
  );

  providers.addElement((writer) => {
    writer
      .write("{")
      .indent(() => {
        writer.writeLine(`token: ${className}Entity.InjectableString,`);
        writer.writeLine(`scope: Scope.SINGLETON,`);
        writer.writeLine(`useFactory(datasource: DataSource) {`);
        writer.indent(() => {
          writer.writeLine(
            `return datasource?.getRepository(${className}${dbName.charAt(0).toUpperCase() + dbName.slice(1)}Entity);`,
          );
        });
        writer.writeLine("},");
        writer.writeLine(`inject: [DATA_SOURCE_${dbName.toUpperCase()}],`);
      })
      .write("}");
  });

  await sourceFile.save();
  prettify(providerPath);
}
