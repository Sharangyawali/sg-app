import { Get, RestController } from "@sharangyawali/sg-app";

@RestController("demo")
export class DemoController {
  @Get("hello")
  hello(): string {
    return "Hello World!!";
  }
}
