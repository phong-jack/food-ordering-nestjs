import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvironmentConfigService {
  get(key: string): string | undefined {
    return process.env[key];
  }
}
