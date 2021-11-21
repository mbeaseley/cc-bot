import 'reflect-metadata';
import path from 'path';
import { Guild, Intents, Interaction, Message } from 'discord.js';
import { Client, Discord } from 'discordx';
import * as dotenv from 'dotenv';
import Utility from './utils/utility';
import { Logger } from './services/logger.service';
import chalk from 'chalk';

dotenv.config();

@Discord()
export class Main {
  private static _client: Client;
  private static logger: Logger;

  constructor() {
    Main.logger = new Logger();
  }

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
      Main.logger.info('info check');
      Main.logger.warn('warning check');
      Main.logger.error('error check');

      await Main.Client.initApplicationCommands({
        guild: { log: true },
        global: { log: true },
      });

      // init permissions; enabled log to see changes
      await Main.Client.initApplicationPermissions(true);

      const guild = Utility.getGuild(Main.Client.guilds);
      this.prototype.preFetchAllMessages(guild);

      // Bot Actions
      //todo: check if botName needed
      Main.Client.user?.setActivity(`@${Main.Client.user.username} • /help`, {
        type: 'LISTENING',
      });

      Main.logger.info(chalk.bold('BOT READY'));
    });

    Main.Client.on('interactionCreate', (interaction: Interaction) => {
      Main.Client.executeInteraction(interaction);
    });

    Main.Client.on('messageCreate', (message: Message) => {
      Main.Client.executeCommand(message);
    });
  }

  /**
   * Fetch all messages and add to memory
   * @param guild
   * @returns void
   */
  private preFetchAllMessages(guild: Guild | undefined): void {
    return guild?.channels.cache.forEach(async (ch) => {
      if (ch.isText()) {
        await ch.messages.fetch();
      }

      return Promise.resolve();
    });
  }
}

Main.start();
