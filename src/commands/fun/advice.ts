import { Command, CommandMessage, Description } from '@typeit/discord';
import { AdviceService } from 'Services/advice.service';
import { Logger } from 'Services/logger.service';
import Utility from 'Utils/utility';
import { Message } from 'discord.js';

export class Advice {
  private logger: Logger;
  private adviceService: AdviceService;

  constructor() {
    this.logger = new Logger();
    this.adviceService = new AdviceService();
  }

  /**
   * Display friendly advice
   * @param command
   */
  @Command('advice')
  @Description('Send some friendly advice to yourself or a friend')
  async init(command: CommandMessage): Promise<Message> {
    try {
      if (command.deletable) await command.delete();

      const msg = await Utility.sendMessage(
        command,
        '**:hourglass: Fetching Advice...**'
      );

      const user = Utility.getOptionFromCommand(command.content, 2)?.[0];
      const givenAdvice = await this.adviceService.getAdvice();
      await msg.delete();

      if (!givenAdvice?.advice) {
        return Utility.sendMessage(
          command,
          '**No advice was given!**',
          'channel',
          5000
        );
      }

      return user
        ? Utility.sendMessage(command, `${user}, ${givenAdvice.advice}`)
        : Utility.sendMessage(command, givenAdvice.advice, 'reply');
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        `Command: 'advice' has error: ${(e as Error).message}.`
      );
      return Utility.sendMessage(
        command,
        `The following error has occurred: ${
          (e as Error).message
        }. If this error keeps occurring, please contact support.`,
        'reply',
        5000
      );
    }
  }
}
