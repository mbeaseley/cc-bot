import { ArgsOf, Discord, On, Rule, Rules } from '@typeit/discord';
import { MemberAdd } from 'Commands/misc/memberAdd';
import { MemberRemove } from 'Commands/misc/memberRemove';
import { ReactionRoles } from 'Commands/misc/reactionRoles';
import { Main } from 'Root/main';
import { Logger } from 'Services/logger.service';
import { environment } from 'Utils/environment';
import Utility from 'Utils/utility';
import chalk from 'chalk';
import { Guild } from 'discord.js';
import * as Path from 'path';

@Discord('<', {
  import: [
    Path.join(__dirname, 'commands/**', '*.ts'),
    Path.join(__dirname, 'commands/**', '*.js'),
  ],
})
@Rules(Rule().fromString(`${environment.botId}> ` || `${environment.botId}>`))
export class DiscordBot {
  logger: Logger;
  reactionRoles: ReactionRoles;
  memberAdd: MemberAdd;
  memberRemove: MemberRemove;

  constructor() {
    this.logger = new Logger();
    this.reactionRoles = new ReactionRoles();
    this.memberAdd = new MemberAdd();
    this.memberRemove = new MemberRemove();
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

    this.memberAdd.init(Main.Client);
    this.memberRemove.init(Main.Client);
    this.reactionRoles.init(Main.Client);

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
