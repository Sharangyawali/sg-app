import { Module } from "@sharangyawali/sg-app";
import { DemoControllerModule } from "./demo/demo-controller.module";

@Module({
  imports: [DemoControllerModule],
})
export class ControllerModule {}
