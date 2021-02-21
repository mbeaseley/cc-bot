import * as config from '../environment/bot.json';

export interface BotConfig {
  token: string;
}

export abstract class AppUtils {
  /**
   * Get bot configs
   */
  static getConfig(): BotConfig {
    return config as BotConfig;
  }
}
