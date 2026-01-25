import { DataSource, DataSourceOptions } from "typeorm";
import {
  AppLogger,
  ConfigService,
  ModuleProvider,
  Scope,
} from "@sharangyawali/sg-app";
export const DATA_SOURCE_POSTGRES = "DATA_SOURCE_POSTGRES";
export const postgresProviders: ModuleProvider[] = [
  {
    token: DATA_SOURCE_POSTGRES,
    scope: Scope.SINGLETON,
    inject: [ConfigService, AppLogger],
    useFactory: async (config: ConfigService, logger: AppLogger) => {
      const configs: DataSourceOptions = {
        type: "postgres",
        host: config.get("POSTGRES_HOST"),
        port: Number(config.get("POSTGRES_PORT")),
        username: config.get("POSTGRES_USER"),
        password: config.get("POSTGRES_PASSWORD"),
        database: config.get("POSTGRES_DB"),
        synchronize: false,
        logging: false,
        entities: [__dirname + "/../../**/**/*.postgres.entity{.ts,.js}"],
      };
      const dataSource = new DataSource(configs);
      await dataSource.initialize();
      logger.log("Database successfully connected ");
      return dataSource;
    },
  },
];
