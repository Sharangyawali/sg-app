import { Component, Inject } from "@sharangyawali/sg-app";
import { IDatasource } from "../../../domain/datasource";
import { DataSource } from "typeorm";
import { DATA_SOURCE_POSTGRES } from "./providers";

@Component()
export class PostgresDataSource implements IDatasource {
  public datasource: DataSource;
  constructor(
    @Inject(DATA_SOURCE_POSTGRES)
    private _datasource: DataSource,
  ) {
    this.datasource = this._datasource;
  }
}
