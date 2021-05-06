import * as Path from 'path';
import { ArgsOf, Discord, On, Rule, Rules } from '@typeit/discord';
import * as chalk from 'chalk';
import { Guild } from 'discord.js';
import { ReactionRoles } from './commands/reactionRoles';
import { Main } from './main';
import { Logger } from './services/logger.service';
import { environment } from './utils/environment';
import Utility from './utils/utility';

@Discord('<', {
  import: [
    Path.join(__dirname, 'commands', '*.ts'),
    Path.join(__dirname, 'commands', '*.js'),
  ],
})
@Rules(Rule().fromString(`${environment.botId}> ` || `${environment.botId}>`))
export class DiscordBot {
  reactionRoles: ReactionRoles;
  logger: Logger;

  constructor() {
    this.reactionRoles = new ReactionRoles();
    this.logger = new Logger();
  }

  /**
   * @name initialize
   * @description When bot has logged in output bot is ready.
   */
  @On('ready')
  initialize(): void {
    this.logger.info('info check');
    this.logger.warn('warning check');
    this.logger.error('error check');

    // Bot Actions
    Main.Client.user?.setActivity(`@${environment.botName} | help`, {
      type: 'LISTENING',
    });

    const guild = Utility.getGuild(Main.Client.guilds);
    this.preFetchAllMessages(guild);

    Main.Client.on('messageReactionAdd', (reaction, user) =>
      this.reactionRoles
        .init('add', reaction, user)
        .catch(() => reaction?.message?.reply(environment.error))
    );

    Main.Client.on('messageReactionRemove', (reaction, user) =>
      this.reactionRoles
        .init('remove', reaction, user)
        .catch(() => reaction?.message?.reply(environment.error))
    );

    this.logger.info(chalk.bold('BOT READY'));
  }

  /**
   * Fetch all messages and add to memory
   * @param guild
   * @returns void
   */
  preFetchAllMessages(guild: Guild | undefined): void {
    return guild?.channels.cache.forEach(async (ch) => {
      if (ch.isText()) {
        await ch.messages.fetch();
      }

      return Promise.resolve();
    });
  }

  /**
   * @name error
   * @param error
   * @description When client has a discord error log it here.
   */
  @On('error')
  error([error]: ArgsOf<'error'>): void {
    this.logger.error(`${chalk.bold('BOT ERROR')}: ${error}`);
  }
}
