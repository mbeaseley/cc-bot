import { Command, CommandMessage, Description } from '@typeit/discord';
import { Message } from 'discord.js';
import { AdviceService } from 'Services/advice.service';
import { Logger } from 'Services/logger.service';
import Utility from 'Utils/utility';

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

      const user = Utility.getOptionFromCommand(command.content, 2)?.[0];
      const givenAdvice = await this.adviceService.getAdvice();

      if (!givenAdvice?.advice) {
        return command.channel
          .send('**No advice was given!**')
          .then((m) => m.delete({ timeout: 5000 }));
      }

      if (user) {
        return command.channel.send(`${user}, ${givenAdvice.advice}`);
      } else {
        return command.reply(givenAdvice.advice);
      }
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        `Command: 'advice' has error: ${(e as Error).message}.`
      );
      return command.channel
        .send(
          `The following error has occurred: ${
            (e as Error).message
          }. If this error keeps occurring, please contact support.`
        )
        .then((m) => m.delete({ timeout: 5000 }));
    }
  }
}
