import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";
config();

const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    __dirname +
      "/../../src/infra/datasource/postgres/entities/*.postgres.entity.{ts,js}",
  ],
  migrations: [__dirname + "/migrations/*.{ts,js}"],
  migrationsTableName: "migration",
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
