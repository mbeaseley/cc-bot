import {
  ArgsOf,
  Client,
  Command,
  CommandMessage,
  CommandNotFound,
  Description,
  Discord,
  Guard,
  On,
  Rule,
  Rules,
} from '@typeit/discord';
import 'dotenv/config';
import * as chalk from 'chalk';
import { Message, MessageReaction, User } from 'discord.js';
import { ChoosePlayer } from './commands/choosePlayer';
import { Compliment } from './commands/compliment';
import { DadJoke } from './commands/dadJoke';
import { Dbd } from './commands/dbd';
import { Help } from './commands/help';
import { Insult } from './commands/insults';
import { Purge } from './commands/purge';
import { SayIt } from './commands/sayIt';
import { isAdmin } from './guards/isAdmin';
import { Main } from './main';
import { Logger } from './services/logger.service';
import * as environment from './utils/environment';
import { env } from 'node:process';

@Discord('<')
@Rules(
  Rule().fromString(
    `${environment.default.botId}> ` || `${environment.default.botId}>`
  )
)
export class DiscordBot {
  choosePlayer: ChoosePlayer;
  dadJoke: DadJoke;
  insults: Insult;
  help: Help;
  compliment: Compliment;
  sayIt: SayIt;
  purge: Purge;
  dbd: Dbd;
  logger = Logger.prototype.getInstance();

  private errorMessage = 'I have failed you!';
  private commandNotFoundMessage = `TRY AGAIN! YOU DIDN'T DO IT RIGHT!`;

  constructor() {
    this.choosePlayer = new ChoosePlayer();
    this.dadJoke = new DadJoke();
    this.insults = new Insult();
    this.help = new Help();
    this.compliment = new Compliment();
    this.sayIt = new SayIt();
    this.purge = new Purge();
    this.dbd = new Dbd();
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

    Main.Client.user?.setActivity(`@${environment.default.botName} | help`, {
      type: 'LISTENING',
    });

    this.logger.info(chalk.bold('BOT READY'));

    Main.Client.on('messageReactionAdd', (reaction, user) => {
      console.log(reaction.emoji, user);
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

  /**
   * @name playerInit
   * @param command
   * @description Command to choose player from voice channel
   * @returns
   */
  @Command('playerchoice')
  @Description('Chooses Player')
  playerInit(command: CommandMessage): Promise<void> {
    return this.choosePlayer.init(command).catch(() => {
      command.reply(this.errorMessage);
    });
  }

  /**
   * @name jokeInit
   * @param command
   * @description Display joke
   * @returns
   */
  @Command('joke')
  @Description('Joke')
  jokeInit(command: CommandMessage): Promise<void> {
    return this.dadJoke.init(command).catch(() => {
      command.reply(this.errorMessage);
    });
  }

  /**
   * @name insultInit
   * @param command
   * @description Display insult to author or tagged user
   * @returns
   */
  @Command('insult')
  @Description('Insult')
  insultInit(command: CommandMessage): Promise<void> {
    return this.insults.init(command).catch(() => {
      command.reply(this.errorMessage);
    });
  }

  /**
   * @name complimentInit
   * @param command
   * @description Display compliment to author or tagged user
   * @returns
   */
  @Command('compliment')
  @Description('Compliment')
  complimentInit(command: CommandMessage): Promise<void> {
    return this.compliment.init(command).catch(() => {
      command.reply(this.errorMessage);
    });
  }

  /**
   * @name sayItInit
   * @param command
   * @description Display either compliment or insult to author or tagged user
   * @returns
   */
  @Command('sayIt')
  @Description('Say It')
  sayItInit(command: CommandMessage): Promise<void> {
    return this.sayIt.init(command).catch(() => {
      command.reply(this.errorMessage);
    });
  }

  /**
   * @name purgeInit
   * @param command
   * @description Delete messages in bulk (Admins only)
   * @returns
   */
  @Command('purge')
  @Description('Purge a maximum of 100 messages')
  @Guard(isAdmin)
  purgeInit(command: CommandMessage): Promise<void> {
    return this.purge.init(command).catch(() => {
      command.reply(this.errorMessage);
    });
  }

  /**
   * @name dbdInit
   * @param command
   * @description Custom dbd commands
   * @returns
   */
  @Command('dbd')
  @Description('Dbd (dbd help for all possible commands)')
  dbdInit(command: CommandMessage): Promise<Message | void> {
    return this.dbd.init(command).catch(() => {
      command.reply(this.errorMessage);
    });
  }

  /**
   * @name helpInit
   * @param command
   * @description Display possible commands
   * @returns
   */
  @Command('help')
  helpInit(command: CommandMessage): Promise<void> {
    const allCommands = Client.getCommands();

    return this.help.init(command, allCommands).catch(() => {
      command.reply(this.errorMessage);
    });
  }

  /**
   * @name commandNotFound
   * @param command
   * @description When an unrecognized is used
   * @returns
   */
  @CommandNotFound()
  commandNotFound(command: CommandMessage): Promise<Message | void> {
    if (command.content.indexOf(environment.default.botId) > -1) {
      command.delete();
      return command.reply(this.commandNotFoundMessage);
    }

    return Promise.resolve();
  }
}
