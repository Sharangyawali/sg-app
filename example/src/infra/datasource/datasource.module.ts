import { Module } from "@sharangyawali/sg-app";
import { PostgresModule } from "./postgres/postgres.module";

@Module({
  imports: [PostgresModule],
})
export class DataSourceModule {}
