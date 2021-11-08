import * as path from 'path';
import { Client } from 'discordx';
import 'dotenv/config';
import { environment } from 'Utils/environment';
import { Intents } from 'discord.js';

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static set Client(value: Client) {
    this._client = value;
  }

  static async start(): Promise<void> {
    const defaultPrefix = '!';
    Main._client = new Client({
      simpleCommand: {
        prefix: defaultPrefix,
      },
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
      ],
      classes: [
        path.join(__dirname, './discordBot.{ts,js}'),
        path.join(__dirname, 'commands/**', '*.{ts,js}'),
      ],
      botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
      silent: true,
    });

    Main.Client.login(environment.token);
  }
}

Main.start();
