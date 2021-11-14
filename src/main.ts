import 'reflect-metadata';
import path from 'path';
import { Intents, Interaction, Message } from 'discord.js';
import { Client, Discord } from 'discordx';
import * as dotenv from 'dotenv';

dotenv.config();

@Discord()
export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static set Client(value: Client) {
    this._client = value;
  }

  /**
   * @name start
   * @description Starts up discord bot
   */
  static async start(): Promise<void> {
    Main.Client = new Client({
      simpleCommand: {
        prefix: '!',
      },
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
      ],
      classes: [
        path.join(__dirname, 'commands', '**/*.{ts,js}'),
        path.join(__dirname, 'events', '**/*.{ts,js}'),
      ],
      botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
      silent: true,
    });

    Main.Client.login(process.env.TOKEN ?? '');

    Main.Client.once('ready', async () => {
      await Main.Client.initApplicationCommands({
        guild: { log: true },
        global: { log: true },
      });

      // init permissions; enabled log to see changes
      await Main.Client.initApplicationPermissions(true);

      console.log('Bot started');
    });

    Main.Client.on('interactionCreate', (interaction: Interaction) => {
      Main.Client.executeInteraction(interaction);
    });

    Main.Client.on('messageCreate', (message: Message) => {
      Main.Client.executeCommand(message);
    });
  }
}

Main.start();
