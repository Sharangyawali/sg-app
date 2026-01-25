import { Module } from "@sharangyawali/sg-app";
import { ServerModule } from "./server/server.module";
import { DataSourceModule } from "./datasource/datasource.module";
import { ControllerModule } from "./controllers/controller.module";

@Module({
  imports: [ServerModule, DataSourceModule, ControllerModule],
})
export class InfraModule {}
