import 'reflect-metadata';
import { logger } from 'Services/logger.service';
// import { youtubeService } from 'Services/youtube.service';
import { environment as env } from 'Utils/environment';
import Utility from 'Utils/utility';
import { importx } from '@discordx/importer';
import chalk from 'chalk';
import { Guild, Intents, Interaction, Message } from 'discord.js';
import { Client, Discord } from 'discordx';
import * as dotenv from 'dotenv';
import { twitchService } from 'Services/twitch.service';

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
    const { environment, serverId, token } = env;
    Main.Client = new Client({
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
        Intents.FLAGS.GUILD_VOICE_STATES
      ],
      botGuilds:
        environment === 'production'
          ? [(client) => client.guilds.cache.map((guild) => guild.id)]
          : [serverId],
      silent: environment === 'production' ? undefined : false
    });

    await importx(`${__dirname}/commands/**/*.{ts,js}`);
    await importx(`${__dirname}/events/**/*.{ts,js}`);
    await Main.Client.login(token ?? '');

    Main.Client.once('ready', async () => {
      logger.info('info check');
      logger.warn('warning check');
      logger.error('error check');

      Main.Client.clearApplicationCommands();

      await Main.Client.initApplicationCommands({
        guild: { log: true },
        global: { log: true }
      });

      // init permissions; enabled log to see changes
      await Main.Client.initApplicationPermissions(true);

      const guild = Utility.getGuild(Main.Client.guilds);
      this.prototype.preFetchAllMessages(guild);

      // Bot Actions
      Main.Client.user?.setActivity(`@${Main.Client.user.username} • /help`, {
        type: 'LISTENING'
      });

      if (guild) {
        await twitchService.check(Main.Client, guild);
      }

      logger.info(chalk.bold('BOT READY'));
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
