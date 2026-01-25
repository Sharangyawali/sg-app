import { addColors, createLogger, format, Logger, transports } from "winston";

export class AppLogger {
  private readonly logger: Logger;
  constructor() {
    const colorizer = format.colorize();
    addColors({
      info: "bold green",
      log: "bold white",
      warn: "bold yellow"
    });
    const myFormat = format.printf(({ message }) => {
      const coloredTime = colorizer.colorize(
        "log",
        new Date().toLocaleString()
      );
      const coloredServer = colorizer.colorize("info", "[NODE] SGAPP");
      return `${coloredServer}- ${coloredTime}  ${message}`;
    });
    this.logger = createLogger({
      level: "info",
      format: format.combine(format.colorize({ all: true }), myFormat),
      transports: [
        new transports.Console(),
      ],
      exitOnError: false
    });
  }
  log(message: string) {
    this.logger.log("info", message);
  }

  debug(message: string): void {
    this.logger.debug(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  logWithContext(context: string, message: string) {
    this.logger.info(`[${context}] ${message}`);
  }
}
