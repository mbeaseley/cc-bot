import { Client, Discord, Rule, Rules } from '@typeit/discord';
import 'dotenv/config';
import { DiscordBot } from './discordBot';
import * as environment from './utils/environment';

@Discord('<')
@Rules(
  Rule().fromString(
    `${environment.default.botId}> ` || `${environment.default.botId}>`
  )
)
export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  /**
   * @name start
   * @description Starts up discord bot
   */
  static async start(): Promise<void> {
    const token = environment.default.token;
    Main._client = new Client({
      classes: [DiscordBot],
      silent: true,
      variablesChar: '',
    });

    Main._client.login(token);
  }
}

Main.start();
