import { Module } from "@sharangyawali/sg-app";
import { ServiceModule } from "./services";
import { UseCaseModule } from "./usecases";

@Module({
  imports: [ServiceModule, UseCaseModule],
})
export class ApplicationModule {}
