import { config } from 'dotenv';
config();
export class ConfigService {
  get(propertyPath: string): string {
    return process.env[propertyPath];
  }
}
