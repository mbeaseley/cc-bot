import { Command, CommandMessage, Description } from '@typeit/discord';
import { AdviceService } from 'Services/advice.service';
import { Logger } from 'Services/logger.service';
import Translate from 'Utils/translate';
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
        Translate.find('adviceFetch')
      );

      const user = Utility.getOptionFromCommand(command.content, 2)?.[0];
      const givenAdvice = await this.adviceService.getAdvice();
      await msg.delete();

      if (!givenAdvice?.advice) {
        return Utility.sendMessage(
          command,
          Translate.find('noAdvice'),
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
        Translate.find('errorLog', 'advice', (e as Error).message)
      );
      return Utility.sendMessage(
        command,
        Translate.find('errorDefault', (e as Error).message),
        'reply',
        5000
      );
    }
  }
}
