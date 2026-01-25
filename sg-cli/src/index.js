import { Command } from "commander";
import { create } from "./commands/create-new.command.js";
import { generate } from "./commands/generate.command.js";
const program = new Command();

program
  .name("SG-CLI")
  .description("SG-APP - Express App In CLEAN ARCHITECTURE")
  .version("0.0.1");

create(program);
generate(program);

program.parse(process.argv);
