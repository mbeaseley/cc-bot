import * as config from '../bot.json';

export interface BotConfig {
  token: string;
}

export class AppUtils {
  static getConfig(): BotConfig {
    return config as BotConfig;
  }
}
