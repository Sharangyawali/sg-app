import { PostgresDataSource } from "./postgres.datasource";
import { Module, Scope } from "@sharangyawali/sg-app";
import { IDatasource } from "../../../domain/datasource";
import { postgresProviders } from "./providers";

@Module({
  providers: [
    ...postgresProviders,
    {
      token: IDatasource,
      scope: Scope.SINGLETON,
      useClass: PostgresDataSource,
    },
  ],
})
export class PostgresModule {}
