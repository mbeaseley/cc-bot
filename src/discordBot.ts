import * as Path from 'path';
import { ArgsOf, Discord, On, Rule, Rules } from '@typeit/discord';
import 'dotenv/config';
import * as chalk from 'chalk';
import { Main } from './main';
import { Logger } from './services/logger.service';
import { environment } from './utils/environment';

@Discord('<', {
  import: [
    Path.join(__dirname, 'commands', '*.ts'),
    Path.join(__dirname, 'commands', '*.js'),
  ],
})
@Rules(Rule().fromString(`${environment.botId}> ` || `${environment.botId}>`))
export class DiscordBot {
  logger = Logger.prototype.getInstance();

  /**
   * @name initialize
   * @description When bot has logged in output bot is ready.
   */
  @On('ready')
  initialize(): void {
    this.logger.info('info check');
    this.logger.warn('warning check');
    this.logger.error('error check');

    Main.Client.user?.setActivity(`@${environment.botName} | help`, {
      type: 'LISTENING',
    });

    this.logger.info(chalk.bold('BOT READY'));
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
